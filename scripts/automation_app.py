import os
import random
import json
import datetime
from openai import OpenAI
import praw
import re

# --- CONFIGURACIÓN DE PILARES Y FREEBIES ---

# La lista completa de 48+ categorías/carreras
PILAR_LIST = [
    "Desarrollo Web", "Software", "Bases de datos", "Animación y 3D", 
    "Blockchain", "Infoarquitectura 3D", "Diseño Gráfico", "Desarrollo APP",
    "Video y Postproducción", "Fotografía", "Videojuegos", "Big Data", 
    "Hardware", "Inteligencia artificial", "Ecommerce", "Ilustración", 
    "Desarrollo empresarial", "Finanzas y Trading", "Emprender", "Marketing",
    "Ventas", "Coaching", "Habilidades Emocionales", "Social Media", 
    "SEO y SEM", "Promoción y distribución", "Escritores", "Desarrollo Personal",
    "Deportes", "Salud", "Relax y Bienestar", "Vida saludable", 
    "Manualidades", "Hobbies", "Estilismo", "PNL", "Yoga y Pilates", 
    "Economía familiar", "Puericultura", "Familia y Amigos", "Ocio", 
    "Viajes", "Mercadotecnia", "Sociología", "Economía", "Derecho", 
    "Historia", "Teología", "Matemáticas", "Física", "Biología", 
    "Quimica", "Medio Ambiente", "Agricultura", "Naturaleza", "Ganadería", 
    "Informática", "Medicina", "Ingenierías", "Ofimatica", 
    "Software de gestión", "WordPress y CMS", "Música", "Educacion", 
    "Arte", "Literatura", "Baile", "Cine", "Otros", "Canto", 
    "Inglés", "Español", "Italiano", "Japonés", "Alemán", 
    "Portugués", "Árabe", "Francés", "Chino", "Lengua de signos", 
    "Ruso", "Recetas", "Servicio en sala", "Bebidas y"
]

# Mapeo de Freebies: ASOCIA los pilares a los freebies que ya tienes creados.
# Usa un freebie 'default' si un pilar no está en la lista.
FREEBIE_MAP = {
    # --- EJEMPLOS INICIALES (DEBES COMPLETAR ESTO) ---
    "Inteligencia artificial": {
        "nombre": "Checklist: 10 Herramientas Esenciales de IA",
        "url": "https://estudiayausa.github.io/website/opt-in/?freebie=ai"
    },
    "Marketing": {
        "nombre": "Plantilla: Calendario de Contenidos 2026",
        "url": "https://estudiayausa.github.io/website/opt-in/?freebie=marketing"
    },
    "Desarrollo Web": {
        "nombre": "Guía: 5 Pasos para un Portfolio Web Perfecto",
        "url": "https://estudiayausa.github.io/website/opt-in/?freebie=webdev"
    },
    "Habilidades Emocionales": {
        "nombre": "Recursos: 3 Ejercicios para Mejorar tu Concentración",
        "url": "https://estudiayausa.github.io/website/opt-in/?freebie=emociones"
    },
    # --- MÁS MENTORÍA: MAPEA PILARES SIMILARES AL MISMO FREEBIE ---
    "Software": FREEBIE_MAP.get("Inteligencia artificial"), # Mapear 'Software' a 'IA'
    "Ecommerce": FREEBIE_MAP.get("Marketing"),              # Mapear 'Ecommerce' a 'Marketing'
    "Coaching": FREEBIE_MAP.get("Habilidades Emocionales"), # Mapear 'Coaching' a 'Emocionales'
}
# ---------------------------------------------

def choose_pilar():
    """Elige un pilar de contenido al azar."""
    return random.choice(PILAR_LIST)

def generate_content(pilar):
    """Llama a la API de OpenAI y obtiene el JSON."""
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    
    # PROMPT DE OPENAI COMPLETO Y MEJORADO (Asegurando la estructura JSON)
    prompt = f"""Actúa como un estratega de contenido para un blog de educación llamado "EstudiaYa".
    El pilar de contenido para el artículo de hoy es: **{pilar}**.

    Tu tarea es:
    1. Basado en ese pilar, genera una idea de tema específico y atractivo para un artículo de blog.
    2. Escribe el artículo completo para ese tema.
    3. Crea un gancho ultra-atractivo para promocionar este artículo en Reddit.

    El resultado final debe ser un único objeto JSON, sin texto introductorio, solo el JSON, con la siguiente estructura:
    {{
      "titulo": "El título del artículo que generaste",
      "contenido_markdown": "El contenido completo del artículo en formato Markdown. Debe ser informativo, fácil de leer y tener al menos 300 palabras. Usa encabezados, listas y negritas para estructurar el texto.",
      "extracto": "Un resumen corto y atractivo del artículo de no más de 160 caracteres.",
      "gancho_reddit": "Un título corto y provocativo (máx. 100 caracteres) y un cuerpo de teaser de no más de 400 caracteres, optimizados para Reddit. El cuerpo debe terminar con '¡Link en los comentarios!'"
    }}
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo", # Modelo económico y rápido
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    # Retorna el contenido del mensaje como un diccionario Python
    return json.loads(response.choices[0].message.content)

def build_markdown_file(pilar, json_data):
    """Ensambla el Front Matter, el contenido y el CTA."""
    
    # 1. Obtener datos y freebie. Usa el freebie default si el pilar no está mapeado.
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    freebie_default = {"nombre": "Guía General de Aprendizaje", "url": "https://estudiayausa.github.io/website/opt-in/?freebie=default"}
    freebie_info = FREEBIE_MAP.get(pilar, freebie_default)
    
    # 2. Construir el Front Matter y Contenido
    markdown_content = f"""---
layout: layouts/post.njk
title: "{json_data['titulo']}"
date: {today}
author: "EstudiaYa Bot"
category: "{pilar}"
image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
excerpt: "{json_data['extracto']}"
---

{json_data['contenido_markdown']}

---

## 🚀 Da el Siguiente Paso

¿Te gustó este contenido sobre **{pilar}**?

Convierte la teoría en acción. Descarga nuestra **{freebie_info['nombre']}** completamente GRATIS para aplicar estos conocimientos hoy.

[**👉 HAZ CLIC AQUÍ PARA DESCARGAR TU FREEBIE AHORA**]({freebie_info['url']})
"""
    return markdown_content

def create_slug(title):
    """Genera un slug limpio y URL-friendly a partir del título."""
    # Quitar caracteres especiales, convertir a minúsculas y reemplazar espacios por guiones
    title = re.sub(r'[^\w\s-]', '', title).strip().lower()
    slug = re.sub(r'[-\s]+', '-', title)
    return slug

def publish_reddit_post(json_data):
    """Publica el gancho en Reddit y añade el enlace en el comentario."""
    reddit = praw.Reddit(
        client_id=os.environ.get("REDDIT_CLIENT_ID"),
        client_secret=os.environ.get("REDDIT_CLIENT_SECRET"),
        username=os.environ.get("REDDIT_USERNAME"),
        password=os.environ.get("REDDIT_PASSWORD"),
        user_agent="EstudiaYa Content Bot v1.0"
    )
    
    # 1. Preparar el título y cuerpo del post
    # Intentar separar el gancho del cuerpo para el post de texto
    gancho_full = json_data.get('gancho_reddit', json_data['titulo']) # Usar título si no existe el gancho
    
    # Esto es una suposición basada en el prompt, puede requerir ajuste fino
    if '¡Link en los comentarios!' in gancho_full:
        title, body_suffix = gancho_full.split('¡Link en los comentarios!', 1)
        body = body_suffix.strip()
    else:
        title = gancho_full
        body = json_data['extracto'] + " ¡Link en los comentarios!" # Asegurar que el CTA final esté

    # 2. Publicar el Post
    subreddit = reddit.subreddit("Estudia-Ya")
    new_post = subreddit.submit(title.strip(), selftext=body.strip())
    
    # 3. Publicar el enlace en el primer comentario
    file_slug = create_slug(json_data['titulo'])
    # NOTA: La URL final es la ruta que usará Netlify después del build
    article_url = f"https://estudiayausa.github.io/website/posts/{file_slug}/" 

    new_post.reply(f"Aquí tienes el artículo completo para que no tengas que buscarlo: {article_url}")


# --- FUNCIÓN PRINCIPAL DE LA APP ---
if __name__ == "__main__":
    # La carpeta 'posts' debe existir en la raíz del repositorio
    if not os.path.exists("posts"):
        os.makedirs("posts")

    try:
        # 1. Elegir Pilar
        pilar = choose_pilar()
        print(f"Pilar seleccionado: {pilar}")

        # 2. Generar Contenido (OpenAI)
        content_json = generate_content(pilar)
        print("Contenido generado por IA.")

        # 3. Construir Archivo
        markdown_text = build_markdown_file(pilar, content_json)
        
        # 4. Guardar Archivo (para que el git commit lo recoja)
        file_slug = create_slug(content_json['titulo'])
        filename = f"posts/{file_slug}.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(markdown_text)
        print(f"Archivo guardado como: {filename}")

        # 5. Publicar en Reddit
        publish_reddit_post(content_json)
        print("Publicación en Reddit completada.")

    except Exception as e:
        print(f"Error fatal en la automatización: {e}")
        # En el entorno de GH Actions, esto fallará el job, notificándote el error.
        
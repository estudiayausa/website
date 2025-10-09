import os
import random
import json
import datetime
import google.generativeai as genai
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

# Paso 1: Definir los 6 Freebies principales con sus claves únicas.
CORE_FREEBIES = {
    "tech": {
        "nombre": "Checklist: Herramientas Esenciales de IA y Desarrollo",
        "url": "https://estudiayausa.github.io/website/opt-in/?freebie=tech_essentials" 
    },
    "mkt": {
        "nombre": "Plantilla: Plan de Marketing y Ventas de 30 Días",
        "url": "https://estudiayausa.github.io/website/opt-in/?freebie=mkt_plan"
    },
    "pers": {
        "nombre": "Guía: 5 Pasos para Dominar Nuevas Habilidades y Concentración",
        "url": "https://estudiayausa.github.io/website/opt-in/?freebie=soft_skills"
    },
    "fin": {
        "nombre": "Ebook: Introducción a Inversiones Inteligentes y Economía Personal",
        "url": "https://estudiayausa.github.io/website/opt-in/?freebie=fin_trading"
    },
    "art": {
        "nombre": "Kit de Recursos: Guía Rápida de Diseño y Postproducción",
        "url": "https://estudiayausa.github.io/website/opt-in/?freebie=creative_kit"
    },
    "sci": {
        "nombre": "Recursos: Checklist de Bienestar y Hábitos Saludables",
        "url": "https://estudiayausa.github.io/website/opt-in/?freebie=salud_vida"
    }
}

# Paso 2: Crear el diccionario final FREEBIE_MAP usando las claves de CORE_FREEBIES.
FREEBIE_MAP = {}

# Función de ayuda para el mapeo
def map_pillars(pillars, key):
    for pilar in pillars:
        FREEBIE_MAP[pilar] = CORE_FREEBIES[key]

# --- MAPEANDO POR GRUPOS TEMÁTICOS ---
# Esto ahora usa CORE_FREEBIES[] para mapear los pilares al valor del freebie.

# GRUPO 1: TECNOLOGÍA Y DESARROLLO
tech_pillars = ["Desarrollo Web", "Software", "Bases de datos", "Blockchain", "Desarrollo APP", "Videojuegos", "Big Data", "Hardware", "Inteligencia artificial", "Informática", "Ofimatica", "Software de gestión", "WordPress y CMS", "Inglés"]
map_pillars(tech_pillars, "tech")

# GRUPO 2: NEGOCIOS Y MARKETING
mkt_pillars = ["Ecommerce", "Emprender", "Marketing", "Ventas", "Social Media", "SEO y SEM", "Promoción y distribución", "Mercadotecnia", "Desarrollo empresarial"]
map_pillars(mkt_pillars, "mkt")

# GRUPO 3: HABILIDADES BLANDAS Y PERSONALES
pers_pillars = ["Coaching", "Habilidades Emocionales", "Desarrollo Personal", "PNL", "Escritores", "Lengua de signos", "Otros", "Educacion"]
map_pillars(pers_pillars, "pers")

# GRUPO 4: FINANZAS Y ECONOMÍA
fin_pillars = ["Finanzas y Trading", "Economía familiar", "Economía", "Sociología", "Derecho", "Historia", "Teología", "Matemáticas"]
map_pillars(fin_pillars, "fin")

# GRUPO 5: ARTE, DISEÑO Y CREACIÓN
art_pillars = ["Animación y 3D", "Infoarquitectura 3D", "Diseño Gráfico", "Video y Postproducción", "Fotografía", "Ilustración", "Manualidades", "Hobbies", "Estilismo", "Música", "Arte", "Literatura", "Baile", "Cine", "Canto", "Italiano", "Japonés", "Alemán", "Portugués", "Árabe", "Francés", "Chino", "Ruso", "Español"]
map_pillars(art_pillars, "art")

# GRUPO 6: CIENCIAS, SALUD Y ESTILOS DE VIDA
sci_pillars = ["Deportes", "Salud", "Relax y Bienestar", "Vida saludable", "Yoga y Pilates", "Puericultura", "Familia y Amigos", "Ocio", "Viajes", "Medio Ambiente", "Agricultura", "Naturaleza", "Ganadería", "Medicina", "Ingenierías", "Física", "Biología", "Quimica", "Recetas", "Servicio en sala", "Bebidas y"]
map_pillars(sci_pillars, "sci")
# ---------------------------------------------

def choose_pilar():
    """Elige un pilar de contenido al azar."""
    return random.choice(PILAR_LIST)

def generate_content(pilar):
    """Llama a la API de OpenAI y obtiene el JSON."""
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("❌ ERROR CRÍTICO: La variable de entorno GOOGLE_API_KEY no fue encontrada.")
        raise ValueError("No se encontró la clave de API de Google.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')

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
    
    response = model.generate_content(prompt)
    # Gemini puede devolver el JSON envuelto en ```json ... ```, lo limpiamos.
    cleaned_text = response.text.strip().replace('```json', '').replace('```', '')
    return json.loads(cleaned_text)

def build_markdown_file(pilar, json_data):
    """Ensambla el Front Matter, el contenido y el CTA."""
    
    # 1. Obtener datos y freebie.
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    freebie_default = {"nombre": "Guía General de Aprendizaje", "url": "https://estudiayausa.github.io/website/opt-in/?freebie=default"}
    
    # Usa el diccionario FREEBIE_MAP corregido
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
    gancho_full = json_data.get('gancho_reddit', json_data['titulo'])
    
    if '¡Link en los comentarios!' in gancho_full:
        title, body_suffix = gancho_full.split('¡Link en los comentarios!', 1)
        body = body_suffix.strip()
    else:
        title = gancho_full
        body = json_data['extracto'] + " ¡Link en los comentarios!"

    # 2. Publicar el Post
    subreddit_name = "EstudiaYa" 
    subreddit = reddit.subreddit(subreddit_name)
    new_post = subreddit.submit(title.strip(), selftext=body.strip())
    
    # 3. Publicar el enlace en el primer comentario
    file_slug = create_slug(json_data['titulo'])
    article_url = f"https://estudia-ya.com/posts/{file_slug}/" 

    new_post.reply(f"Aquí tienes el artículo completo para que no tengas que buscarlo: {article_url}")


# --- FUNCIÓN PRINCIPAL DE LA APP ---
if __name__ == "__main__":
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
        raise # Re-lanza la excepción para que GitHub Actions marque el job como fallido
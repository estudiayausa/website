const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');

// --- CONFIGURACIÓN ---
const AI_API_KEY = process.env.AI_API_KEY || "TU_API_KEY_AQUI"; // Usaremos secretos de GitHub para esto
const POSTS_DIRECTORY = path.join(__dirname, 'posts');

// Lista de temas para que el bot elija uno cada día
const TOPICS = [
    { topic: "Productividad para Estudiantes", category: "Productividad" },
    { topic: "Cómo Iniciar en el Desarrollo Web", category: "Tecnología" },
    { topic: "Finanzas Personales para Principiantes", category: "Finanzas" },
    { topic: "El Arte de Hablar en Público", category: "Desarrollo Personal" },
    { topic: "Fundamentos del Diseño Gráfico", category: "Cultura" },
    { topic: "Estrategias de Marketing en Redes Sociales", category: "Marketing" },
];

/**
 * Genera un "slug" (URL amigable) a partir de un título.
 * Ejemplo: "Guía Definitiva de JavaScript" -> "guia-definitiva-de-javascript"
 * @param {string} title
 * @returns {string}
 */
function slugify(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Elimina caracteres no alfanuméricos
        .replace(/[\s_-]+/g, '-') // Reemplaza espacios y guiones por uno solo
        .replace(/^-+|-+$/g, ''); // Elimina guiones al inicio o final
}

/**
 * Simula una llamada a una API de IA.
 * En el futuro, esta función contendrá la lógica real para hablar con OpenAI/Gemini.
 * @param {string} prompt - El comando maestro para la IA.
 * @returns {Promise<string>} - El contenido del artículo en formato Markdown.
 */
async function callAiApi(prompt) {
    console.log("🤖 Simulando llamada a la API de IA...");
    // En el futuro, aquí conectarás a una API real (OpenAI, Gemini, etc.)
    // Por ahora, devolvemos un texto de ejemplo basado en el prompt.
    const topic = prompt.split('sobre ')[1]; // Extrae el tema del prompt
    return `
Este es un artículo generado automáticamente sobre **${topic}**. 

### Punto Clave 1
Aquí desarrollamos el primer punto importante sobre ${topic}. Es fundamental entender este aspecto para tener una base sólida.

### Punto Clave 2
El segundo punto clave profundiza en las aplicaciones prácticas. Verás cómo ${topic} impacta en el día a día.

> "Una cita inspiradora relacionada con el aprendizaje y ${topic}."

Este sistema demuestra cómo la automatización puede generar borradores de contenido valioso de forma consistente.`;
}

/**
 * Crea el archivo .md final en la carpeta /posts.
 * @param {string} title - El título del artículo.
 * @param {string} content - El contenido en Markdown.
 * @param {string} category - La categoría del artículo.
 */
async function createArticleFile(title, content, category) {
    const today = new Date();
    const date = today.toISOString().slice(0, 10); // Formato YYYY-MM-DD
    const slug = slugify(title);
    const filename = `${date}-${slug}.md`;
    const filepath = path.join(POSTS_DIRECTORY, filename);

    const frontmatter = `---
title: "${title}"
date: "${date}"
category: "${category}"
author: "EstudiaYa Bot"
author_avatar: "https://picsum.photos/seed/bot/50/50"
image: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop"
image_alt: "Estrategia de marketing digital"
excerpt: "Descubre los pilares del marketing digital, desde SEO hasta redes sociales, para impulsar tu negocio."
layout: "layouts/post.njk"
---`;

    const fullContent = `${frontmatter}\n\n${content}`;

    try {
        await fs.writeFile(filepath, fullContent);
        console.log(`✅ ¡Artículo creado con éxito en: ${filepath}`);
    } catch (error) {
        console.error(`❌ Error al crear el artículo: ${error.message}`);
    }
}

/**
 * Función principal que orquesta todo el proceso.
 */
async function main() {
    console.log("🚀 Iniciando sistema de creación de artículos...");
    
    // 1. Elige un tema aleatorio de la lista
    const chosenTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const title = `Guía Esencial de ${chosenTopic.topic}`;

    // 2. Llama a la IA para obtener el borrador
    const articleContent = await callAiApi(`Escribe un artículo sobre ${chosenTopic.topic}`);

    // 3. Crea el archivo .md final
    if (articleContent) {
        await createArticleFile(title, articleContent, chosenTopic.category);
    }

    console.log("✨ Proceso finalizado.");
}

// Ejecuta la función principal
main();

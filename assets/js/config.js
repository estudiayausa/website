// Configuración con tus credenciales de API
const CONFIG = {
    USE_MOCK_DATA: true, // Cambia a 'false' cuando tengas un token de API válido
    API_BASE_URL: 'https://affiliate.tutellus.com/api/v1',
    AFFILIATE_API_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJSS0VTQkp0Z01lIiwiYXVkIjoiYWZmaWxpYXRlIiwiYWZmX3Rva2VuIjoiNjlmZDNmMDY1ZWY0NGNlZjg2NmYzYTJkMmY3NTZiMzMiLCJpYXQiOjE3NTYwOTE5ODN9._XMNH-LYlriN9N46BV4mDNUYE1vF5UlZ6pqo1V8RnHY', // ¡IMPORTANTE! El token anterior ha expirado. Reemplázalo por uno nuevo.
    AFFILIATE_ID: '69fd3f065ef44cef866f3a2d2f756b33',
    STORAGE_KEYS: {
        USER: 'user_data'
    },
    ENDPOINTS: {
        COURSES: '/courses',
        CATEGORIES: '/categories',
        INSTRUCTORS: '/instructors',
        LOGIN: '/login',
        REGISTER: '/register',
        PROFILE: '/profile'
    },
    // Mapeo para las categorías principales que se mostrarán en la home.
    CATEGORIES_MAPPING: {
        'tecnologia': {
            type: 'category_code',
            code: 'tecnologia'
        },
        'negocios': {
            type: 'subcategory_code', // Apuntamos a Desarrollo Empresarial
            code: 'desarrollo-empresarial'
        },
        'ia': {
            type: 'subcategory_code', // Apuntamos a "Inteligencia Artificial"
            code: 'inteligencia-artificial'
        },
        'finanzas': {
            type: 'subcategory_code', // Apuntamos a "Economía Familiar" para asegurar resultados
            code: 'economia-familiar'
        },
        'cultura': {
            type: 'category_code',
            code: 'cultura'
        },
        'idiomas': {
            type: 'category_code',
            code: 'idiomas'
        }
    }
};

export default CONFIG;
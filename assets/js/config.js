// Configuración con tus credenciales de API
const CONFIG = {
    USE_MOCK_DATA: false, // Cambia a 'false' cuando tengas un token de API válido
    API_BASE_URL: 'https://affiliate.tutellus.com/api/v1',
    AFFILIATE_API_TOKEN: 'TU_NUEVO_TOKEN_DE_API_VA_AQUI', // ¡IMPORTANTE! El token anterior ha expirado. Reemplázalo por uno nuevo.
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
        'desarrollo-personal': {
            type: 'subcategory_code', // Apuntamos a "Ocio y Vida" para asegurar resultados
            code: 'ocio-vida'
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
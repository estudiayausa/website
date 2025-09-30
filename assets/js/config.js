// Configuración con tus credenciales de API
const CONFIG = {
    USE_MOCK_DATA: false, // Cambia a 'false' cuando tengas un token de API válido
    API_BASE_URL: 'https://affiliate.tutellus.com/api/v1',
    AFFILIATE_API_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJadDJIZHA4UHAiLCJhdWQiOiJhZmZpbGlhdGUiLCJhZmZfdG9rZW4iOiI2OWZkM2YwNjVlZjQ0Y2VmODY2ZjNhMmQyZjc1NmIzMyIsImlhdCI6MTc1ODMyMDA1N30.7dDOrpcDCnsnTJ2yPCwW9cvdTCsoQS_QNJhW_9gKV_U',
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
    // Mapea los data-category del HTML a los slugs/IDs que espera la API de Tutellus.
    // Estos son ejemplos, ajústalos si la API requiere otros valores.
    CATEGORIES_MAPPING: {
        'tecnologia': 'tecnologia',         // Correcto
        'negocios': 'business',             // API usa 'business'
        'blockchain-y-ia': 'blockchain',    // Correcto
        'emprendimiento': 'emprendimiento', // Correcto
        'cultura': 'cultura-y-humanidades', // API usa 'cultura-y-humanidades'
        'idiomas': 'idiomas'                // Correcto
    }
};

export default CONFIG;
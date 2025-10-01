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
    // Mapeo para las categorías principales que se mostrarán en la home.
    CATEGORIES_MAPPING: {
        'tecnologia': 'tecnologia',
        'negocios': 'negocios',
        'desarrollo-personal': 'desarrollo-personal',
        'finanzas': 'finanzas',
        'cultura': 'cultura',
        'idiomas': 'idiomas'
    }
};

export default CONFIG;
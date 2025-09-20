<<<<<<< HEAD
// Configuración con tus credenciales de API
const CONFIG = {
    USE_MOCK_DATA: false, // Cambia a 'false' cuando tengas un token de API válido
    API_BASE_URL: 'https://affiliate.tutellus.com/api/v1',
    AFFILIATE_API_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJadDJIZHA4UHAiLCJhdWQiOiJhZmZpbGlhdGUiLCJhZmZfdG9rZW4iOiI2OWZkM2YwNjVlZjQ0Y2VmODY2ZjNhMmQyZjc1NmIzMyIsImlhdCI6MTc1ODMyMDA1N30.7dDOrpcDCnsnTJ2yPCwW9cvdTCsoQS_QNJhW_9gKV_U',
    AFFILIATE_ID: '69fd3f065ef44cef866f3a2d2f756b33',
    STORAGE_KEYS: {
        USER: 'user_data'
    },
=======
const CONFIG = {
    API_BASE_URL: 'https://api.tutellus.com/v1',
    API_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJSS0VTQkp0Z01lIiwiYXVkIjoiYWZmaWxpYXRlIiwiYWZmX3Rva2VuIjoiNjlmZDNmMDY1ZWY0NGNlZjg2NmYzYTJkMmY3NTZiMzMiLCJpYXQiOjE3NTYwOTE5ODN9._XMNH-LYlriN9N46BV4mDNUYE1vF5UlZ6pqo1V8RnHY',
    AFFILIATE_ID: '69fd3f065ef44cef866f3a2d2f756b33',
    
    APP_NAME: 'EstudiaYa',
    APP_VERSION: '1.0.0',
    
    ITEMS_PER_PAGE: 12,
    
>>>>>>> b4359dff7252253c3fdf6c708d36a6931f903f34
    ENDPOINTS: {
        COURSES: '/courses',
        CATEGORIES: '/categories',
        INSTRUCTORS: '/instructors',
<<<<<<< HEAD
        LOGIN: '/login',
        REGISTER: '/register',
        PROFILE: '/profile'
    },
    // Mapea los data-category del HTML a los slugs/IDs que espera la API de Tutellus.
    // Estos son ejemplos, ajústalos si la API requiere otros valores.
    CATEGORIES_MAPPING: {
        'desarrollo-web': 'desarrollo-web',
        'marketing': 'marketing-digital',
        'salud': 'salud-bienestar',
        'finanzas': 'finanzas-inversion',
        'creatividad': 'hobbies-creatividad'
    }
};

export default CONFIG;
=======
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/user/profile'
    },
    
    CATEGORIES_MAPPING: {
        'desarrollo-web': 'desarrollo-web',
        'marketing': 'marketing',
        'salud': 'salud',
        'finanzas': 'finanzas',
        'creatividad': 'creatividad'
    },
    
    STORAGE_KEYS: {
        USER: 'estudiaya_user',
        TOKEN: 'estudiaya_token',
        CART: 'estudiaya_cart',
        WISHLIST: 'estudiaya_wishlist'
    }
};
>>>>>>> b4359dff7252253c3fdf6c708d36a6931f903f34

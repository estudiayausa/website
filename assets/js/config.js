const CONFIG = {
    API_BASE_URL: 'https://api.tutellus.com/v1',
    API_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJSS0VTQkp0Z01lIiwiYXVkIjoiYWZmaWxpYXRlIiwiYWZmX3Rva2VuIjoiNjlmZDNmMDY1ZWY0NGNlZjg2NmYzYTJkMmY3NTZiMzMiLCJpYXQiOjE3NTYwOTE5ODN9._XMNH-LYlriN9N46BV4mDNUYE1vF5UlZ6pqo1V8RnHY',
    AFFILIATE_ID: '69fd3f065ef44cef866f3a2d2f756b33',
    
    APP_NAME: 'EstudiaYa',
    APP_VERSION: '1.0.0',
    
    ITEMS_PER_PAGE: 12,
    
    ENDPOINTS: {
        COURSES: '/courses',
        CATEGORIES: '/categories',
        INSTRUCTORS: '/instructors',
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
export const mockCourses = [
    {
        id: 1,
        title: 'Curso Completo de Desarrollo Web con React y Node.js',
        thumbnail: 'https://picsum.photos/seed/webdev/300/180',
        user: {
            name: 'Carlos Rodríguez',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        rating_avg: 4.7,
        students_count: 2589,
        price: { amount: 49.99 }
    },
    {
        id: 2,
        title: 'Marketing Digital: De Cero a Experto en Redes Sociales',
        thumbnail: 'https://picsum.photos/seed/marketing/300/180',
        user: {
            name: 'Marta Gómez',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        rating_avg: 4.9,
        students_count: 3120,
        price: { amount: 79.99 }
    },
    {
        id: 3,
        title: 'Introducción a las Finanzas Personales e Inversión',
        thumbnail: 'https://picsum.photos/seed/finance/300/180',
        user: {
            name: 'Javier López',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
        },
        rating_avg: 4.5,
        students_count: 1850,
        price: { amount: 0 }
    },
    {
        id: 4,
        title: 'Fotografía Creativa con tu Smartphone',
        thumbnail: 'https://picsum.photos/seed/photo/300/180',
        user: {
            name: 'Ana Pérez',
            avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
        },
        rating_avg: 4.8,
        students_count: 4200,
        price: { amount: 29.99 }
    },
    {
        id: 5,
        title: 'Mindfulness y Bienestar: Reduce el Estrés',
        thumbnail: 'https://picsum.photos/seed/mindful/300/180',
        user: {
            name: 'Lucía Fernández',
            avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
        },
        rating_avg: 4.6,
        students_count: 980,
        price: { amount: 19.99 }
    },
    {
        id: 6,
        title: 'Aprende a Programar en Python desde Cero',
        thumbnail: 'https://picsum.photos/seed/python/300/180',
        user: {
            name: 'David García',
            avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
        },
        rating_avg: 4.9,
        students_count: 5300,
        price: { amount: 99.99 }
    }
];

export const mockCategoryCounts = {
    'desarrollo-web': 152,
    'marketing': 89,
    'salud': 45,
    'finanzas': 67,
    'creatividad': 112
};

export const mockApiCategories = [
    {
        code: 'desarrollo-web',
        name: 'Desarrollo Web y Programación',
        courses: 152,
        subcategories: [
            { code: 'frontend', name: 'Frontend', courses: 70 },
            { code: 'backend', name: 'Backend', courses: 50 },
            { code: 'mobile', name: 'Desarrollo Móvil', courses: 32 }
        ]
    },
    {
        code: 'marketing-digital',
        name: 'Marketing Digital y Negocios Online',
        courses: 89,
        subcategories: [
            { code: 'seo', name: 'SEO', courses: 25 },
            { code: 'social-media', name: 'Redes Sociales', courses: 40 },
            { code: 'email-marketing', name: 'Email Marketing', courses: 24 }
        ]
    },
    {
        code: 'finanzas-inversion',
        name: 'Finanzas Personales e Inversión',
        courses: 67,
        subcategories: [
            { code: 'inversion', name: 'Inversión y Trading', courses: 30 },
            { code: 'contabilidad', name: 'Contabilidad', courses: 20 },
            { code: 'crypto', name: 'Criptomonedas', courses: 17 }
        ]
    }
];

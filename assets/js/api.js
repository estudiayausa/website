class API {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.token = CONFIG.API_TOKEN;
        this.affiliateId = CONFIG.AFFILIATE_ID;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Affiliate-ID': this.affiliateId,
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getCourses(params = {}) {
        const searchParams = new URLSearchParams({
            affiliate_id: this.affiliateId,
            ...params
        });

        return this.request(`${CONFIG.ENDPOINTS.COURSES}?${searchParams}`);
    }

    async getCourseById(id) {
        return this.request(`${CONFIG.ENDPOINTS.COURSES}/${id}?affiliate_id=${this.affiliateId}`);
    }

    async getCoursesByCategory(category) {
        const mappedCategory = CONFIG.CATEGORIES_MAPPING[category];
        if (!mappedCategory) {
            throw new Error('Invalid category');
        }

        return this.getCourses({ category: mappedCategory });
    }

    async getCategories() {
        return this.request(CONFIG.ENDPOINTS.CATEGORIES);
    }

    async getInstructors() {
        return this.request(CONFIG.ENDPOINTS.INSTRUCTORS);
    }

    async getInstructorById(id) {
        return this.request(`${CONFIG.ENDPOINTS.INSTRUCTORS}/${id}`);
    }

    async login(email, password) {
        return this.request(CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(userData) {
        return this.request(CONFIG.ENDPOINTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async getProfile() {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        if (!token) {
            throw new Error('No authentication token found');
        }

        return this.request(CONFIG.ENDPOINTS.PROFILE, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    async search(query, filters = {}) {
        return this.getCourses({
            search: query,
            ...filters
        });
    }
}
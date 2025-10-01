import CONFIG from './config.js';

export class API {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.token = CONFIG.AFFILIATE_API_TOKEN;
        this.affiliateId = CONFIG.AFFILIATE_ID;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'x-access-token': this.token,
            'Content-Type': 'application/json',
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                // Try to get more details from the response body for better error messages
                let errorDetails = '';
                try {
                    const errorData = await response.json();
                    errorDetails = ` - Body: ${JSON.stringify(errorData)}`;
                } catch (e) {
                    // The body is not JSON or is empty, that's fine.
                }
                throw new Error(`API request failed: ${response.status} ${response.statusText}${errorDetails}`);
            }

            // Handle cases where the response is OK but has no content to avoid JSON parsing errors
            const responseText = await response.text();
            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error(`API Error on request to ${url}:`, error);
            throw error;
        }
    }

    async getCourses(params = {}) {
        const searchParams = new URLSearchParams({
            ...params
        });

        return this.request(`${CONFIG.ENDPOINTS.COURSES}?${searchParams}`);
    }

    async getCourseById(id) {
        return this.request(`${CONFIG.ENDPOINTS.COURSES}/${id}`);
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
            q: query,
            ...filters
        });
    }
}
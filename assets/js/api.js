<<<<<<< HEAD
import CONFIG from './config.js';

export class API {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.token = CONFIG.AFFILIATE_API_TOKEN;
=======
class API {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.token = CONFIG.API_TOKEN;
>>>>>>> b4359dff7252253c3fdf6c708d36a6931f903f34
        this.affiliateId = CONFIG.AFFILIATE_ID;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
<<<<<<< HEAD
            'x-access-token': this.token,
            'Content-Type': 'application/json',
=======
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Affiliate-ID': this.affiliateId,
>>>>>>> b4359dff7252253c3fdf6c708d36a6931f903f34
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
<<<<<<< HEAD
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
=======
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
>>>>>>> b4359dff7252253c3fdf6c708d36a6931f903f34
            throw error;
        }
    }

    async getCourses(params = {}) {
        const searchParams = new URLSearchParams({
<<<<<<< HEAD
=======
            affiliate_id: this.affiliateId,
>>>>>>> b4359dff7252253c3fdf6c708d36a6931f903f34
            ...params
        });

        return this.request(`${CONFIG.ENDPOINTS.COURSES}?${searchParams}`);
    }

<<<<<<< HEAD
    async getCoursesByCategory(category) {
        const mappedCategory = CONFIG.CATEGORIES_MAPPING[category];
        if (!mappedCategory) {
            // Return a resolved promise with an empty array for invalid categories
            console.warn(`Invalid category requested: ${category}`);
=======
    async getCourseById(id) {
        return this.request(`${CONFIG.ENDPOINTS.COURSES}/${id}?affiliate_id=${this.affiliateId}`);
    }

    async getCoursesByCategory(category) {
        const mappedCategory = CONFIG.CATEGORIES_MAPPING[category];
        if (!mappedCategory) {
>>>>>>> b4359dff7252253c3fdf6c708d36a6931f903f34
            throw new Error('Invalid category');
        }

        return this.getCourses({ category: mappedCategory });
    }

<<<<<<< HEAD
    async getCourseById(id) {
        return this.request(`${CONFIG.ENDPOINTS.COURSES}/${id}`);
    }

=======
>>>>>>> b4359dff7252253c3fdf6c708d36a6931f903f34
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
<<<<<<< HEAD
            q: query,
=======
            search: query,
>>>>>>> b4359dff7252253c3fdf6c708d36a6931f903f34
            ...filters
        });
    }
}
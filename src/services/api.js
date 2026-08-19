const DEBUG = false
const API_BASE = DEBUG === true ? "http://localhost:5004" : (import.meta.env.VITE_API_BASE || 'https://bys-exchange-backend.onrender.com');
const EXCHANGE_PATH = import.meta.env.VITE_EXCHANGE_PATH || '/api/1.0/custom-apps/exchange-public';
const PROPIETARIO = import.meta.env.VITE_PROPIETARIO || '';

/**
 * Common configuration for API calls.
 * You can add more headers here.
 */
const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'X-Propietario': PROPIETARIO,
    };

    // Example of adding a token if it exists in localStorage
    const storedUser = localStorage.getItem('app_user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user.token) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }
        } catch (e) {
            console.error('Error parsing stored user for token', e);
        }
    }

    return headers;
};

/**
 * Generic fetch wrapper
 */
const request = async (endpoint, options = {}) => {
    const { url, ...fetchOptions } = options;

    // Default to API_BASE + EXCHANGE_PATH if the endpoint doesn't start with /api
    let fullUrl = endpoint.startsWith('http')
        ? endpoint
        : endpoint.startsWith('/api')
            ? `${API_BASE}${endpoint}`
            : `${API_BASE}${EXCHANGE_PATH}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    // Add query params if present in options
    if (options.params) {
        const queryParams = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });
        const queryString = queryParams.toString();
        if (queryString) {
            fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
        }
    }

    const headers = {
        ...getHeaders(),
        ...fetchOptions.headers,
    };

    try {
        const response = await fetch(fullUrl, {
            ...fetchOptions,
            headers,
        });

        // Basic response handling
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.errorMessage) {
            throw new Error(data.errorMessage || `Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};

export const api = {
    get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),

    // Raw fetch for special cases (like S3 uploads where we don't want common headers)
    raw: (url, options) => fetch(url, options),
};

export default api;

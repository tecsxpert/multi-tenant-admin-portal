import axios from 'axios';

// ─────────────────────────────────────────────
// Axios Instance — All requests flow through this
// ─────────────────────────────────────────────
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

// Attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// ─────────────────────────────────────────────
// AUTH SERVICES
// ─────────────────────────────────────────────

/**
 * POST /login
 * @param {string} username
 * @param {string} password
 * @returns {{ token: string, username: string, role: string }}
 */
export const loginRequest = (username, password) =>
    api.post('/login', { username, password });

/**
 * POST /register
 * Register a new administrative account.
 */
export const registerRequest = (userData) =>
    api.post('/register', userData);


// ─────────────────────────────────────────────
// DASHBOARD SERVICES
// ─────────────────────────────────────────────

/**
 * GET /tenants/stats
 * @returns {{
 *   totalTenants: number,
 *   activeTenants: number,
 *   suspendedTenants: number,
 *   deletedTenants: number,
 *   statusDistribution: { ACTIVE: number, SUSPENDED: number, INACTIVE: number }
 * }}
 */
export const getStats = () => api.get('/tenants/stats');

/**
 * GET /audit-logs?page=0&size=10
 * Fetch recent system activity logs.
 */
export const getAuditLogs = (page = 0, size = 10) => api.get(`/audit-logs?page=${page}&size=${size}`);

/**
 * GET /tenants/analytics
 * Fetch analytics data for charts (growth trends, onboarding rates, etc.).
 * @returns {Array<{ month: string, tenants: number, active: number, revenue: number }>}
 */
export const getAnalytics = () => api.get('/tenants/analytics');

// ─────────────────────────────────────────────
// TENANT CRUD SERVICES
// ─────────────────────────────────────────────

/**
 * GET /tenants?page=0&size=5
 * Fetches a paginated list of tenants.
 * @param {number} page - Zero-indexed page number
 * @param {number} size - Number of records per page
 * @returns {{
 *   content: Array<{ id: number, name: string, description: string, status: string, createdAt: string, updatedAt: string }>,
 *   totalPages: number,
 *   totalElements: number,
 *   number: number
 * }}
 */
export const getTenants = (page = 0, size = 5) =>
    api.get(`/tenants?page=${page}&size=${size}`);

/**
 * GET /tenants/search?q=query&page=0&size=5
 * Search tenants by name or description.
 * @param {string} query - Search keyword
 * @param {number} page
 * @param {number} size
 * @returns Same paginated response as getTenants
 */
export const searchTenants = (query, page = 0, size = 5) =>
    api.get(`/tenants/search?q=${query}&page=${page}&size=${size}`);

/**
 * GET /tenants/:id
 * Fetch a single tenant by ID.
 * @param {number|string} id
 * @returns {{ id: number, name: string, description: string, status: string, createdAt: string, updatedAt: string }}
 */
export const getTenant = (id) => api.get(`/tenants/${id}`);

/**
 * POST /tenants
 * Create a new tenant.
 * @param {{ name: string, description: string, status: string }} data
 * @returns {{ id: number, name: string, description: string, status: string, createdAt: string, updatedAt: string }}
 */
export const createTenant = (data) => api.post('/tenants', data);

/**
 * PUT /tenants/:id
 * Update an existing tenant.
 * @param {number|string} id
 * @param {{ name: string, description: string, status: string }} data
 * @returns {{ id: number, name: string, description: string, status: string, createdAt: string, updatedAt: string }}
 */
export const updateTenant = (id, data) => api.put(`/tenants/${id}`, data);

/**
 * DELETE /tenants/:id
 * Soft-delete a tenant (sets status to DELETED).
 * @param {number|string} id
 * @returns {void} — 204 No Content on success
 */
export const deleteTenant = (id) => api.delete(`/tenants/${id}`);

/**
 * GET /tenants/export
 * Export all tenants as a CSV file.
 * @returns {Blob} — CSV file content
 */
export const exportTenants = () =>
    api.get('/tenants/export', { responseType: 'blob' });


// ─────────────────────────────────────────────
// AI INTELLIGENCE SERVICES (Flask — port 5000)
// Proxied through Spring Boot at /api/ai/*
// ─────────────────────────────────────────────

/**
 * POST /ai/describe
 * Generate an AI-powered description for a tenant record.
 * @param {number|string} recordId
 * @returns {{ description: string }}
 */
export const aiDescribe = (recordId) =>
    api.post('/ai/describe', { recordId });

/**
 * POST /ai/recommend
 * Generate 3 AI-powered recommendations.
 * @param {string} context - e.g. "node_optimization"
 * @returns {string[]} — Array of 3 recommendation strings
 */
export const aiRecommend = (context = 'node_optimization') =>
    api.post('/ai/recommend', { context });

/**
 * POST /ai/generate-report
 * Generate a structured AI report for a tenant.
 * @param {number|string} recordId
 * @returns {{
 *   title: string,
 *   summary: string,
 *   sections: Array<{ heading: string, content: string }>,
 *   generatedAt: string
 * }}
 */
export const aiGenerateReport = (recordId) =>
    api.post('/ai/generate-report', { recordId });

/**
 * GET /ai/health
 * Check if the AI Flask service is online.
 * @returns {{ status: string }} — e.g. { status: "healthy" }
 */
export const aiHealthCheck = () => api.get('/ai/health');


export default api;

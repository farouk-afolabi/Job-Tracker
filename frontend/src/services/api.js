<<<<<<< HEAD
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
=======
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Central function for all HTTP requests.
// Automatically attaches the JWT from localStorage to every request.
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

>>>>>>> Fix broken features, security hardening, and UI consistency
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

<<<<<<< HEAD
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Authentication API calls
export const login = async (email, password) => {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (name, email, password) => {
  return apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
};

export const verifyToken = async (token) => {
  return apiCall('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};

// Job search API calls
export const fetchJobs = async (filters = {}) => {
=======
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    // The backend always sends { error: "..." }, so we read that field.
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed (${response.status})`);
  }

  return response.json();
};

// Auth
export const login = (email, password) =>
  apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (name, email, password) =>
  apiCall('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

// Verify reads the token from the Authorization header (set automatically by apiCall).
export const verifyToken = () => apiCall('/auth/verify');

// Job search
export const fetchJobs = (filters = {}) => {
>>>>>>> Fix broken features, security hardening, and UI consistency
  const queryParams = new URLSearchParams(filters).toString();
  return apiCall(`/jobs/search?${queryParams}`);
};

<<<<<<< HEAD
export const trackJob = async (jobData) => {
  return apiCall('/jobs/track', {
    method: 'POST',
    body: JSON.stringify(jobData),
  });
};

export const getTrackedJobs = async () => {
  return apiCall('/jobs/tracked');
};

export const updateTrackedJob = async (jobId, updates) => {
  return apiCall(`/jobs/tracked/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteTrackedJob = async (jobId) => {
  return apiCall(`/jobs/tracked/${jobId}`, {
    method: 'DELETE',
  });
}; 
=======
// Job tracking
export const trackJob = (jobData) =>
  apiCall('/jobs/track', { method: 'POST', body: JSON.stringify(jobData) });

export const getTrackedJobs = () => apiCall('/jobs/tracked');

export const updateTrackedJob = (jobId, updates) =>
  apiCall(`/jobs/tracked/${jobId}`, { method: 'PUT', body: JSON.stringify(updates) });

export const deleteTrackedJob = (jobId) =>
  apiCall(`/jobs/tracked/${jobId}`, { method: 'DELETE' });
>>>>>>> Fix broken features, security hardening, and UI consistency

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Central function for all HTTP requests.
// Automatically attaches the JWT from localStorage to every request.
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

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
  const queryParams = new URLSearchParams(filters).toString();
  return apiCall(`/jobs/search?${queryParams}`);
};

// Profile
export const getProfile = () => apiCall('/profile');
export const saveProfile = (profile) =>
  apiCall('/profile', { method: 'PUT', body: JSON.stringify(profile) });

// AI match scoring
export const matchJob = (jobTitle, jobCompany, jobDescription) =>
  apiCall('/jobs/match', {
    method: 'POST',
    body: JSON.stringify({ jobTitle, jobCompany, jobDescription }),
  });

// Job tracking
export const trackJob = (jobData) =>
  apiCall('/jobs/track', { method: 'POST', body: JSON.stringify(jobData) });

export const getTrackedJobs = () => apiCall('/jobs/tracked');

export const updateTrackedJob = (jobId, updates) =>
  apiCall(`/jobs/tracked/${jobId}`, { method: 'PUT', body: JSON.stringify(updates) });

export const deleteTrackedJob = (jobId) =>
  apiCall(`/jobs/tracked/${jobId}`, { method: 'DELETE' });

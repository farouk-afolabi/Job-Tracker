const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
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
  const queryParams = new URLSearchParams(filters).toString();
  return apiCall(`/jobs/search?${queryParams}`);
};

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
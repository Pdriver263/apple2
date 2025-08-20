// src/services/api.js
import axios from 'axios';

// সঠিক বেস URL সেট করুন
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// রিকোয়েস্ট ইন্টারসেপ্টর - অথেন্টিকেশন টোকেন যোগ করা
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// রেসপন্স ইন্টারসেপ্টর - এরর হ্যান্ডলিং
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    // 401 Unauthorized এরর হ্যান্ডলিং
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login?session_expired=true';
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API সার্ভিস হেল্পার ফাংশন
 */

// লিস্টিং সম্পর্কিত API কল
export const listingService = {
  // ফিচার্ড লিস্টিং পাওয়া
  getFeaturedListings: async (params = {}) => {
    try {
      const response = await api.get('/api/listings/featured', { params });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
        total: response.data.total || 0,
        page: response.data.page || 1,
        pages: response.data.pages || 1
      };
    } catch (error) {
      console.error('Error fetching featured listings:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch featured listings',
        data: []
      };
    }
  },

  // লিস্টিং সার্চ করা
  searchListings: async (params = {}) => {
    try {
      const response = await api.get('/listings', { params });
      return {
        success: true,
        data: response.data.data || response.data || [],
        count: response.data.count || response.data.length || 0,
        total: response.data.total || response.data.length || 0
      };
    } catch (error) {
      console.error('Error searching listings:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search listings',
        data: []
      };
    }
  },

  // সিঙ্গেল লিস্টিং ডিটেইল পাওয়া
  getListingDetails: async (id) => {
    try {
      const response = await api.get(`/listings/${id}`);
      return {
        success: true,
        data: response.data.data || null
      };
    } catch (error) {
      console.error('Error fetching listing details:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Listing not found',
        data: null
      };
    }
  },

  // নতুন লিস্টিং তৈরি করা (হোস্ট এর জন্য)
  createListing: async (listingData) => {
    try {
      const response = await api.post('/listings', listingData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Listing created successfully'
      };
    } catch (error) {
      console.error('Error creating listing:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create listing',
        errors: error.response?.data?.errors
      };
    }
  },

  // লিস্টিং আপডেট করা (হোস্ট এর জন্য)
  updateListing: async (id, updates) => {
    try {
      const response = await api.put(`/listings/${id}`, updates);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Listing updated successfully'
      };
    } catch (error) {
      console.error('Error updating listing:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update listing',
        errors: error.response?.data?.errors
      };
    }
  },

  // লিস্টিং ডিলিট করা (হোস্ট এর জন্য)
  deleteListing: async (id) => {
    try {
      const response = await api.delete(`/listings/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Listing deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting listing:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete listing'
      };
    }
  }
};

// অথেন্টিকেশন সম্পর্কিত API কল
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return {
        success: true,
        data: response.data.data,
        token: response.data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

 register: async (userData) => {
    try {
      // ✅ সঠিক endpoint: /api/auth/register (not /api/api/auth/register)
      const response = await api.post('/api/auth/register', userData);
      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Registration API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  },

  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user data'
      };
    }
  }
};

// ইউজার সম্পর্কিত API কল
export const userService = {
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/me', userData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
        errors: error.response?.data?.errors
      };
    }
  }
};

// ডিফল্ট এক্সপোর্ট
export default api;
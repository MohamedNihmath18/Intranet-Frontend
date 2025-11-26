// import { User, Announcement, DocumentItem, LinkItem, BannerItem, AuditLog } from '../types';

// const API_URL = 'http://localhost:5000/api';

// const getHeaders = () => {
//   const userStr = localStorage.getItem('mahsa_current_user');
//   const token = userStr ? JSON.parse(userStr).token : null;
//   return {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
// };

// const handleResponse = async (response: Response) => {
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
//     throw new Error(error.message || `HTTP Error ${response.status}`);
//   }
//   return response.json();
// };

// export const ApiService = {
//   // --- AUTH ---
//   login: async (username: string, password: string) => {
//     const res = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, password }),
//     });
//     return handleResponse(res);
//   },

//   updateProfile: async (updates: Partial<User>) => {
//     const res = await fetch(`${API_URL}/auth/profile`, {
//       method: 'PUT',
//       headers: getHeaders(),
//       body: JSON.stringify(updates),
//     });
//     return handleResponse(res);
//   },

//   changePassword: async (oldPassword: string, newPassword: string) => {
//     const res = await fetch(`${API_URL}/auth/password`, {
//       method: 'PUT',
//       headers: getHeaders(),
//       body: JSON.stringify({ oldPassword, newPassword }),
//     });
//     return handleResponse(res);
//   },

//   // --- USERS & DIRECTORY ---
//   getUsers: async (): Promise<User[]> => {
//     const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
//     return handleResponse(res);
//   },

//   createUser: async (userData: any) => {
//     const res = await fetch(`${API_URL}/users`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify(userData),
//     });
//     return handleResponse(res);
//   },

//   deleteUser: async (id: string) => {
//     const res = await fetch(`${API_URL}/users/${id}`, {
//       method: 'DELETE',
//       headers: getHeaders(),
//     });
//     return handleResponse(res);
//   },

//   resetPassword: async (id: string, newPassword: string) => {
//     const res = await fetch(`${API_URL}/users/${id}/reset-password`, {
//       method: 'PUT',
//       headers: getHeaders(),
//       body: JSON.stringify({ newPassword }),
//     });
//     return handleResponse(res);
//   },

//   getAuditLogs: async (): Promise<AuditLog[]> => {
//     const res = await fetch(`${API_URL}/users/logs`, { headers: getHeaders() });
//     return handleResponse(res);
//   },

//   // --- ANNOUNCEMENTS ---
//   getAnnouncements: async (): Promise<Announcement[]> => {
//     const res = await fetch(`${API_URL}/content/announcements`, { headers: getHeaders() });
//     return handleResponse(res);
//   },

//   createAnnouncement: async (data: any) => {
//     const res = await fetch(`${API_URL}/content/announcements`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify(data),
//     });
//     return handleResponse(res);
//   },

//   updateAnnouncement: async (id: string, data: any) => {
//     const res = await fetch(`${API_URL}/content/announcements/${id}`, {
//       method: 'PUT',
//       headers: getHeaders(),
//       body: JSON.stringify(data),
//     });
//     return handleResponse(res);
//   },

//   deleteAnnouncement: async (id: string) => {
//     const res = await fetch(`${API_URL}/content/announcements/${id}`, {
//       method: 'DELETE',
//       headers: getHeaders(),
//     });
//     return handleResponse(res);
//   },

//   // --- DOCUMENTS ---
//   getDocuments: async (): Promise<DocumentItem[]> => {
//     const res = await fetch(`${API_URL}/content/documents`, { headers: getHeaders() });
//     return handleResponse(res);
//   },

//   createDocument: async (data: any) => {
//     const res = await fetch(`${API_URL}/content/documents`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify(data),
//     });
//     return handleResponse(res);
//   },

//   deleteDocument: async (id: string) => {
//     const res = await fetch(`${API_URL}/content/documents/${id}`, {
//       method: 'DELETE',
//       headers: getHeaders(),
//     });
//     return handleResponse(res);
//   },

//   // --- LINKS ---
//   getLinks: async (): Promise<LinkItem[]> => {
//     const res = await fetch(`${API_URL}/content/links`, { headers: getHeaders() });
//     return handleResponse(res);
//   },

//   createLink: async (data: any) => {
//     const res = await fetch(`${API_URL}/content/links`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify(data),
//     });
//     return handleResponse(res);
//   },

//   deleteLink: async (id: string) => {
//     const res = await fetch(`${API_URL}/content/links/${id}`, {
//       method: 'DELETE',
//       headers: getHeaders(),
//     });
//     return handleResponse(res);
//   },

//   // --- BANNERS ---
//   getBanners: async (): Promise<BannerItem[]> => {
//     const res = await fetch(`${API_URL}/content/banners`, { headers: getHeaders() });
//     return handleResponse(res);
//   },

//   createBanner: async (data: any) => {
//     const res = await fetch(`${API_URL}/content/banners`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify(data),
//     });
//     return handleResponse(res);
//   },

//   updateBanner: async (id: string, data: any) => {
//     const res = await fetch(`${API_URL}/content/banners/${id}`, {
//       method: 'PUT',
//       headers: getHeaders(),
//       body: JSON.stringify(data),
//     });
//     return handleResponse(res);
//   },

//   deleteBanner: async (id: string) => {
//     const res = await fetch(`${API_URL}/content/banners/${id}`, {
//       method: 'DELETE',
//       headers: getHeaders(),
//     });
//     return handleResponse(res);
//   }
// };



import { User, Announcement, DocumentItem, LinkItem, BannerItem, AuditLog, OnCallRoster, Department } from '../types';

const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const userStr = localStorage.getItem('mahsa_current_user');
  const token = userStr ? JSON.parse(userStr).token : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.message || `HTTP Error ${response.status}`);
  }
  return response.json();
};

// Helper to handle network errors gracefully
const fetchWrapper = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error: any) {
    console.error(`API Error (${url}):`, error);
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Is the backend running on port 5000?');
    }
    throw error;
  }
};

export const ApiService = {
  // --- AUTH ---
  login: async (username: string, password: string) => {
    return fetchWrapper(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  },

  updateProfile: async (updates: Partial<User>) => {
    return fetchWrapper(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    return fetchWrapper(`${API_URL}/auth/password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },

  // --- USERS & DIRECTORY ---
  getUsers: async (): Promise<User[]> => {
    return fetchWrapper(`${API_URL}/users`, { headers: getHeaders() });
  },

  createUser: async (userData: any) => {
    return fetchWrapper(`${API_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id: string) => {
    return fetchWrapper(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  resetPassword: async (id: string, newPassword: string) => {
    return fetchWrapper(`${API_URL}/users/${id}/reset-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ newPassword }),
    });
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    return fetchWrapper(`${API_URL}/users/logs`, { headers: getHeaders() });
  },

  // --- ANNOUNCEMENTS ---
  getAnnouncements: async (): Promise<Announcement[]> => {
    return fetchWrapper(`${API_URL}/content/announcements`);
  },

  createAnnouncement: async (data: any) => {
    return fetchWrapper(`${API_URL}/content/announcements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  updateAnnouncement: async (id: string, data: any) => {
    return fetchWrapper(`${API_URL}/content/announcements/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteAnnouncement: async (id: string) => {
    return fetchWrapper(`${API_URL}/content/announcements/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // --- DOCUMENTS ---
  getDocuments: async (): Promise<DocumentItem[]> => {
    return fetchWrapper(`${API_URL}/content/documents`);
  },

  createDocument: async (data: any) => {
    return fetchWrapper(`${API_URL}/content/documents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteDocument: async (id: string) => {
    return fetchWrapper(`${API_URL}/content/documents/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // --- LINKS ---
  getLinks: async (): Promise<LinkItem[]> => {
    return fetchWrapper(`${API_URL}/content/links`);
  },

  createLink: async (data: any) => {
    return fetchWrapper(`${API_URL}/content/links`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteLink: async (id: string) => {
    return fetchWrapper(`${API_URL}/content/links/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // --- BANNERS ---
  getBanners: async (): Promise<BannerItem[]> => {
    return fetchWrapper(`${API_URL}/content/banners`);
  },

  createBanner: async (data: any) => {
    return fetchWrapper(`${API_URL}/content/banners`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  updateBanner: async (id: string, data: any) => {
    return fetchWrapper(`${API_URL}/content/banners/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteBanner: async (id: string) => {
    return fetchWrapper(`${API_URL}/content/banners/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // --- DOCTORS ON CALL (NEW) ---
  getOnCalls: async (): Promise<OnCallRoster[]> => {
    return fetchWrapper(`${API_URL}/content/oncall`);
  },

  createOnCall: async (data: any) => {
    return fetchWrapper(`${API_URL}/content/oncall`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteOnCall: async (id: string) => {
    return fetchWrapper(`${API_URL}/content/oncall/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // --- DEPARTMENTS (NEW) ---
  getDepartments: async (): Promise<Department[]> => {
    return fetchWrapper(`${API_URL}/departments`);
  },
  
  getDepartmentById: async (id: string): Promise<Department> => {
    return fetchWrapper(`${API_URL}/departments/${id}`);
  },
  
  createDepartment: async (data: any) => {
    return fetchWrapper(`${API_URL}/departments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },
  
  addDepartmentResource: async (deptId: string, data: any) => {
    return fetchWrapper(`${API_URL}/departments/${deptId}/resources`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },
  
  deleteDepartmentResource: async (deptId: string, resourceId: string) => {
    return fetchWrapper(`${API_URL}/departments/${deptId}/resources/${resourceId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  }
};
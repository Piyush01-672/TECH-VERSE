// API Base URL - uses environment variable or defaults to relative path for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// ==================== Get Requests ====================

export const getLeaders = async () => {
  const response = await fetch(`${API_BASE_URL}/api/leaders`);
  if (!response.ok) throw new Error('Failed to fetch leaders');
  return response.json();
};

export const getAboutUs = async () => {
  const response = await fetch(`${API_BASE_URL}/api/aboutus`);
  if (!response.ok) throw new Error('Failed to fetch about us');
  return response.json();
};

export const getMentors = async () => {
  const response = await fetch(`${API_BASE_URL}/api/mentors`);
  if (!response.ok) throw new Error('Failed to fetch mentors');
  return response.json();
};

export const getGallery = async (category?: string) => {
  const url = category 
    ? `${API_BASE_URL}/api/gallery?category=${category}`
    : `${API_BASE_URL}/api/gallery`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch gallery');
  return response.json();
};

// ==================== Post Requests ====================

export const submitContact = async (contactData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactData),
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    const error: any = new Error(data.message || 'Failed to submit contact form');
    error.response = { data };
    throw error;
  }

  return data;
};

export const submitEnquiry = async (enquiryData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/enquiry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enquiryData),
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    const error: any = new Error(data.message || 'Enquiry submission failed. Please try again.');
    error.response = { data };
    throw error;
  }

  return data;
};

export const registerTeam = async (submissionData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submissionData),
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    const error: any = new Error(data.message || 'Registration failed. Please try again.');
    error.response = { data };
    throw error;
  }

  return data;
};

export const registerCodeCrafterTeam = async (submissionData: FormData | any) => {
  const isFormData = submissionData instanceof FormData;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  
  const response = await fetch(`${API_BASE_URL}/api/codecrafter-register`, {
    method: 'POST',
    headers,
    body: isFormData ? submissionData : JSON.stringify(submissionData),
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    const error: any = new Error(data.message || 'Registration failed. Please try again.');
    error.response = { data };
    throw error;
  }

  return data;
};

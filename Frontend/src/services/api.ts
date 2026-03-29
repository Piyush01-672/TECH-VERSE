// API Base URL - uses environment variable or defaults to relative path for local development
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

// URL logs removed for prod safety

// ==================== Get Requests ====================

export const getLeaders = async () => {
  const url = `${API_BASE_URL}/api/leaders`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching leaders:', error);
    throw error;
  }
};

export const getAboutUs = async () => {
  const url = `${API_BASE_URL}/api/aboutus`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching about us:', error);
    throw error;
  }
};

export const getMentors = async () => {
  const url = `${API_BASE_URL}/api/mentors`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching mentors:', error);
    throw error;
  }
};

export const getGallery = async (category?: string) => {
  const url = category 
    ? `${API_BASE_URL}/api/gallery?category=${category}`
    : `${API_BASE_URL}/api/gallery`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
};

// ==================== Post Requests ====================

export const submitContact = async (contactData: any) => {
  const url = `${API_BASE_URL}/api/contact`;
  try {
    const response = await fetch(url, {
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
  } catch (error) {
    console.error('Error submitting contact:', error);
    throw error;
  }
};

export const submitEnquiry = async (enquiryData: any) => {
  const url = `${API_BASE_URL}/api/enquiry`;
  try {
    const response = await fetch(url, {
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
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    throw error;
  }
};

export const registerTeam = async (submissionData: any) => {
  const url = `${API_BASE_URL}/api/register`;
  try {
    const response = await fetch(url, {
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
  } catch (error) {
    console.error('Error registering team:', error);
    throw error;
  }
};

export const registerCodeCrafterTeam = async (submissionData: FormData | any) => {
  const isFormData = submissionData instanceof FormData;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const url = `${API_BASE_URL}/api/codecrafter-register`;
  
  try {
    const response = await fetch(url, {
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
  } catch (error) {
    console.error('Error registering CodeCrafter team:', error);
    throw error;
  }
};

export const registerRoboMechTeam = async (submissionData: FormData | any) => {
  const isFormData = submissionData instanceof FormData;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const url = `${API_BASE_URL}/api/robomech-register`;
  
  try {
    const response = await fetch(url, {
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
  } catch (error) {
    console.error('Error registering RoboMech team:', error);
    throw error;
  }
};

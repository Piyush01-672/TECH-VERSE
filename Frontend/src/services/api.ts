const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const registerTeam = async (submissionData: any) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
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

export const registerCodeCrafterTeam = async (submissionData: any) => {
  const response = await fetch(`${API_BASE_URL}/codecrafter-register`, {
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

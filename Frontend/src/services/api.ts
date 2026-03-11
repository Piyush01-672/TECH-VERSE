
export const registerTeam = async (submissionData: any) => {
  const response = await fetch(`/api/register`, {
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
  
  const response = await fetch(`/api/codecrafter-register`, {
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

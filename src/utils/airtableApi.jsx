import axios from 'axios';

export const fetchBases = async (token) => {
  try {
    const response = await axios.get(`/airtable/bases`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching bases: ' + error.message);
  }
};

export const fetchFields = async (token, baseId, tableId) => {
  try {
    const response = await axios.get(`/airtable/fields/${baseId}/${tableId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching fields: ' + error.message);
  }
};

export const submitResponse = async (token, formId, responseData) => {
  try {
    const response = await axios.post(`/forms/${formId}/responses`, responseData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error submitting response: ' + error.message);
  }
};
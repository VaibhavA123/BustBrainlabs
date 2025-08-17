import axios from 'axios';
import Form from '../models/Form.js';
import Response from '../models/Response.js';
import User from '../models/User.js';

// Get all Airtable bases for the authenticated user
export const getBases = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const response = await axios.get('https://api.airtable.com/v0/meta/bases', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bases', error: error.message });
  }
};

// Get all fields for a specific base and table
export const getFields = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { baseId, tableId } = req.params;
    const response = await axios.get(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}`,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    res.json(response.data.fields);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fields', error: error.message });
  }
};

// Save a form response and send it to Airtable
export const saveResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;
    const response = new Response({ form: formId, answers, user: req.user.id });
    await response.save();

    // Find the form to get baseId and tableId
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const user = await User.findById(req.user.id);

    // Prepare Airtable fields object
    const airtableFields = {};
    form.fields.forEach(field => {
      if (answers[field.id] !== undefined) {
        airtableFields[field.name] = answers[field.id];
      }
    });

    // Send to Airtable
    await axios.post(
      `https://api.airtable.com/v0/${form.baseId}/${form.tableId}`,
      { fields: airtableFields },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error saving response', error: error.message });
  }
};

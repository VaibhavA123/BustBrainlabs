import Form from '../models/Form.js';
import Response from '../models/Response.js';
import User from '../models/User.js';
import axios from 'axios';

// Create a new form
export const createForm = async (req, res) => {
  try {
    const { name, baseId, tableId, fields, logic } = req.body;
    const form = await Form.create({
      name,
      baseId,
      tableId,
      fields,
      logic,
      owner: req.user._id,
    });
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all forms for the logged-in user
export const getForms = async (req, res) => {
  try {
    const forms = await Form.find({ owner: req.user._id });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit a form response and send to Airtable
export const submitResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ error: 'Form not found' });

    // Save response in MongoDB
    const response = await Response.create({
      form: formId,
      user: req.user._id,
      answers,
    });

    // Get user's Airtable token
    const user = await User.findById(req.user._id);
    if (!user || !user.token) return res.status(401).json({ error: 'Airtable token missing' });

    // Prepare Airtable record fields
    const airtableFields = {};
    form.fields.forEach((field) => {
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

    res.status(201).json({ message: 'Response saved and sent to Airtable' });
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};
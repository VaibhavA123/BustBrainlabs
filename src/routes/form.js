import { Router } from 'express';
import auth from '../middleware/auth.js';
import Form from '../models/Form.js';
import { ensureFreshToken, airtableClient } from '../utils/airtable.js';

const router = Router();

// Create form
router.post('/', auth, async (req, res) => {
  const { title, airtable, questions, conditionalLogic } = req.body;
  const form = await Form.create({
    owner: req.user._id,
    title,
    airtable,
    questions,
    conditionalLogic
  });
  res.status(201).json(form);
});

// List forms
router.get('/', auth, async (req, res) => {
  const forms = await Form.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(forms);
});

// Get single form (public)
router.get('/:id', async (req, res) => {
  const form = await Form.findById(req.params.id);
  if (!form || !form.isPublic) return res.status(404).json({ message: 'Form not found' });
  res.json(form);
});

// Submit form
router.post('/:id/submit', async (req, res) => {
  const form = await Form.findById(req.params.id);
  if (!form || !form.isPublic) return res.status(404).json({ message: 'Form not found' });

  const owner = await (await form.populate('owner')).owner;

  try {
    const token = await ensureFreshToken(owner);
    const at = airtableClient(token);

    const fields = {};
    form.questions.forEach((q, idx) => {
      const ans = req.body?.[idx];
      if (ans === undefined) return;
      switch (q.airtableFieldType) {
        case 'singleLineText':
        case 'multilineText':
          fields[q.airtableFieldName] = String(ans);
          break;
        case 'singleSelect':
          fields[q.airtableFieldName] = { name: String(ans) };
          break;
        case 'multipleSelects':
          fields[q.airtableFieldName] = (Array.isArray(ans) ? ans : [ans]).map(v => ({ name: String(v) }));
          break;
        case 'multipleAttachments':
          fields[q.airtableFieldName] = (Array.isArray(ans) ? ans : [ans]).map(u =>
            typeof u === 'string' ? { url: u } : u
          );
          break;
        default:
          break;
      }
    });

    const { data } = await at.post(`/${form.airtable.baseId}/${form.airtable.tableId}`, {
      fields
    });

    res.status(201).json({ ok: true, recordId: data.id });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(500).json({ message: 'Airtable write failed' });
  }
});

export default router;

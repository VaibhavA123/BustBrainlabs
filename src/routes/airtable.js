import { Router } from 'express';
import auth from '../middleware/auth.js';
import { ensureFreshToken, airtableClient, isSupportedField } from '../utils/airtable.js';

const router = Router();

// List bases
router.get('/bases', auth, async (req, res) => {
  const token = await ensureFreshToken(req.user);
  const at = airtableClient(token);
  const { data } = await at.get('/meta/bases');
  res.json(data.bases);
});

// List tables for a base
router.get('/bases/:baseId/tables', auth, async (req, res) => {
  const token = await ensureFreshToken(req.user);
  const at = airtableClient(token);
  const { data } = await at.get(`/meta/bases/${req.params.baseId}/tables`);
  res.json(data.tables);
});

// List supported fields for a table
router.get('/bases/:baseId/tables/:tableId/fields', auth, async (req, res) => {
  const token = await ensureFreshToken(req.user);
  const at = airtableClient(token);
  const { data } = await at.get(`/meta/bases/${req.params.baseId}/tables`);
  const table = data.tables.find(t => t.id === req.params.tableId);
  if (!table) return res.status(404).json({ message: 'Table not found' });

  const fields = table.fields
    .filter(f => isSupportedField(f.type))
    .map(f => ({
      id: f.id,
      name: f.name,
      type: f.type,
      options: f.options ?? null
    }));

  res.json(fields);
});

export default router;

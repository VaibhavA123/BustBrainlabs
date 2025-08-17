import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';

function evalLogic(answers, logicBlocks) {
  // returns a Set of indices that should be visible
  const visible = new Set();
  // default: everything visible unless targeted by a block?
  // We interpret: if a block exists for target, show only if rules all true; otherwise visible.
  const targeted = new Set(logicBlocks.map(b => b.targetQuestionIndex));

  const matches = (op, a, b) => {
    if (op === 'eq') return a == b;
    if (op === 'neq') return a != b;
    if (op === 'contains') {
      if (Array.isArray(a)) return a.includes(b);
      return String(a ?? '').includes(String(b));
    }
    const arr = String(b).split(',').map(s => s.trim()).filter(Boolean);
    if (op === 'in') return arr.includes(String(a));
    if (op === 'nin') return !arr.includes(String(a));
    return false;
  };

  const satisfiedTargets = new Set();
  for (const block of logicBlocks) {
    const ok = (block.rules || []).every((r) => {
      const val = answers[r.questionIndex];
      return matches(r.operator, val, r.value);
    });
    if (ok) satisfiedTargets.add(block.targetQuestionIndex);
  }

  return {
    isVisible: (idx) => {
      if (!targeted.has(idx)) return true;
      return satisfiedTargets.has(idx);
    }
  };
}

export default function ViewForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/forms/${id}`)
      .then(r => setForm(r.data))
      .catch(() => setForm(null));
  }, [id]);

  const { isVisible } = useMemo(
    () => form ? evalLogic(answers, form.conditionalLogic || []) : { isVisible: () => true },
    [answers, form]
  );

  if (!form) return <div style={{ padding: 24 }}>Loading...</div>;

  const onChange = (i, v) => setAnswers(a => ({ ...a, [i]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    // simple required validation
    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!isVisible(i)) continue;
      if (q.required && (answers[i] === undefined || answers[i] === '')) {
        alert(`Please fill: ${q.label}`);
        return;
      }
    }
    setSubmitting(true);
    try {
      await api.post(`/forms/${form._id}/submit`, answers);
      alert('Submitted to Airtable 🎉');
      setAnswers({});
    } catch (e) {
      alert('Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h2>{form.title}</h2>
      <form onSubmit={onSubmit}>
        {form.questions.map((q, i) => {
          if (!isVisible(i)) return null;

          if (q.airtableFieldType === 'singleLineText' || q.airtableFieldType === 'multilineText') {
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <label>{q.label}{q.required ? ' *' : ''}</label><br />
                {q.airtableFieldType === 'singleLineText' ? (
                  <input
                    value={answers[i] ?? ''}
                    onChange={e => onChange(i, e.target.value)}
                  />
                ) : (
                  <textarea
                    rows={4}
                    value={answers[i] ?? ''}
                    onChange={e => onChange(i, e.target.value)}
                  />
                )}
              </div>
            );
          }

          if (q.airtableFieldType === 'singleSelect') {
            const opts = q.options?.choices || [];
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <label>{q.label}{q.required ? ' *' : ''}</label><br />
                <select
                  value={answers[i] ?? ''}
                  onChange={e => onChange(i, e.target.value)}
                >
                  <option value="">Select...</option>
                  {opts.map((o) => (
                    <option key={o.id || o.name} value={o.name}>{o.name}</option>
                  ))}
                </select>
              </div>
            );
          }

          if (q.airtableFieldType === 'multipleSelects') {
            const opts = q.options?.choices || [];
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <label>{q.label}{q.required ? ' *' : ''}</label><br />
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {opts.map((o) => (
                    <label key={o.id || o.name}>
                      <input
                        type="checkbox"
                        checked={Array.isArray(answers[i]) && answers[i].includes(o.name)}
                        onChange={(e) => {
                          const cur = Array.isArray(answers[i]) ? answers[i] : [];
                          onChange(
                            i,
                            e.target.checked
                              ? [...cur, o.name]
                              : cur.filter((x) => x !== o.name)
                          );
                        }}
                      />
                      &nbsp;{o.name}
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          if (q.airtableFieldType === 'multipleAttachments') {
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <label>{q.label}{q.required ? ' *' : ''}</label><br />
                <input
                  placeholder="Paste file URL"
                  value={answers[i] ?? ''}
                  onChange={e => onChange(i, e.target.value)}
                />
                <div style={{ fontSize: 12, color: '#666' }}>
                  For demo, provide a public file URL. (Airtable attachment expects URLs.)
                </div>
              </div>
            );
          }

          return null;
        })}
        <button disabled={submitting} type="submit">
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

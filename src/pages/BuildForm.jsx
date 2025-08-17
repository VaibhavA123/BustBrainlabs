import React, { useEffect, useState } from 'react';
import { api } from '../api';
import ConditionalEditor from '../components/ConditionalEditor.jsx';

const typeMap = {
  singleLineText: 'singleLineText',
  multilineText: 'multilineText',
  singleSelect: 'singleSelect',
  multipleSelects: 'multipleSelects',
  multipleAttachments: 'multipleAttachments'
};

export default function BuildForm() {
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);
  const [baseId, setBaseId] = useState('');
  const [tableId, setTableId] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [logic, setLogic] = useState([]);

  useEffect(() => {
    api.get('/airtable/bases').then(r => setBases(r.data));
  }, []);

  useEffect(() => {
    if (!baseId) return;
    api.get(`/airtable/bases/${baseId}/tables`).then(r => setTables(r.data));
  }, [baseId]);

  useEffect(() => {
    if (!baseId || !tableId) return;
    api.get(`/airtable/bases/${baseId}/tables/${tableId}/fields`).then(r => setFields(r.data));
  }, [baseId, tableId]);

  const addQuestion = (f) => {
    setQuestions(q => [
      ...q,
      {
        airtableFieldId: f.id,
        airtableFieldName: f.name,
        airtableFieldType: typeMap[f.type],
        label: f.name,
        required: false
      }
    ]);
  };

  const save = async () => {
    const payload = {
      title,
      airtable: { baseId, tableId },
      questions,
      conditionalLogic: logic
    };
    const { data } = await api.post('/forms', payload);
    alert(`Form saved. Viewer: /form/${data._id}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Create Form</h2>
      <div>
        <label>Title: </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="My Form"
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Base: </label>
        <select
          value={baseId}
          onChange={e => {
            setBaseId(e.target.value);
            setTableId('');
            setFields([]);
          }}
        >
          <option value="">Select base</option>
          {bases.map(b => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {baseId && (
        <div style={{ marginTop: 12 }}>
          <label>Table: </label>
          <select
            value={tableId}
            onChange={e => setTableId(e.target.value)}
          >
            <option value="">Select table</option>
            {tables.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {fields.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>Pick Questions (supported types only)</h3>
          <ul>
            {fields.map((f) => (
              <li key={f.id}>
                <button type="button" onClick={() => addQuestion(f)}>
                  Add
                </button>
                &nbsp;{f.name} <small>({f.type})</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {questions.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>Questions</h3>
          {questions.map((q, i) => (
            <div
              key={i}
              style={{ border: '1px solid #eee', padding: 8, marginBottom: 8 }}
            >
              <div>
                #{i} <b>{q.airtableFieldName}</b> → {q.airtableFieldType}
              </div>
              <label>Label: </label>
              <input
                value={q.label}
                onChange={e => {
                  const next = [...questions];
                  next[i].label = e.target.value;
                  setQuestions(next);
                }}
              />
              &nbsp;&nbsp;
              <label>Required: </label>
              <input
                type="checkbox"
                checked={q.required}
                onChange={e => {
                  const next = [...questions];
                  next[i].required = e.target.checked;
                  setQuestions(next);
                }}
              />
            </div>
          ))}
          <ConditionalEditor
            questions={questions}
            logic={logic}
            setLogic={setLogic}
          />
        </div>
      )}

      <button
        style={{ marginTop: 16 }}
        onClick={save}
        disabled={!title || !baseId || !tableId || !questions.length}
      >
        Save Form
      </button>
    </div>
  );
}

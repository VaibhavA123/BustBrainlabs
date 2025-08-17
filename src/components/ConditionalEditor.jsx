import React from 'react'

export default function ConditionalEditor({ questions, logic, setLogic }){
  const addBlock = () => setLogic([...logic, { targetQuestionIndex: 0, rules: [] }])
  const addRule = (i) => {
    const next = JSON.parse(JSON.stringify(logic))
    next[i].rules.push({ questionIndex: 0, operator: 'eq', value: '' })
    setLogic(next)
  }

  return (
    <div style={{ border:'1px solid #eee', padding:12, marginTop:12 }}>
      <h4>Conditional Logic</h4>
      <button type="button" onClick={addBlock}>Add Logic Block</button>
      {logic.map((b, bi) => (
        <div key={bi} style={{ marginTop:12, padding:8, background:'#fafafa' }}>
          <div>
            Show question:
            <select value={b.targetQuestionIndex} onChange={(e)=>{
              const next = JSON.parse(JSON.stringify(logic)); next[bi].targetQuestionIndex = Number(e.target.value); setLogic(next)
            }}>
              {questions.map((q, idx) => (<option key={idx} value={idx}>{idx} - {q.label}</option>))}
            </select>
            when ALL rules match:
          </div>

          {(b.rules || []).map((r, ri) => (
            <div key={ri} style={{ display:'flex', gap:8, marginTop:6, alignItems:'center' }}>
              <span>If</span>
              <select value={r.questionIndex} onChange={(e)=>{
                const next = JSON.parse(JSON.stringify(logic)); next[bi].rules[ri].questionIndex = Number(e.target.value); setLogic(next)
              }}>
                {questions.map((q, idx) => (<option key={idx} value={idx}>{idx} - {q.label}</option>))}
              </select>

              <select value={r.operator} onChange={(e)=>{
                const next = JSON.parse(JSON.stringify(logic)); next[bi].rules[ri].operator = e.target.value; setLogic(next)
              }}>
                <option value="eq">equals</option>
                <option value="neq">not equals</option>
                <option value="in">in (comma separated)</option>
                <option value="nin">not in</option>
                <option value="contains">contains</option>
              </select>

              <input value={r.value} onChange={(e)=>{
                const next = JSON.parse(JSON.stringify(logic)); next[bi].rules[ri].value = e.target.value; setLogic(next)
              }} placeholder="Value" />
            </div>
          ))}

          <div style={{ marginTop:8 }}>
            <button type="button" onClick={()=>addRule(bi)}>Add Rule</button>
          </div>
        </div>
      ))}
    </div>
  )
}
// script.js â€” File System Access API version with fallback downloads/uploads
'use strict';

// Helper: generic table renderer
function renderTableInto(containerId, columns, rows, onEdit, onDelete) {
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  columns.forEach(c=>{ const th = document.createElement('th'); th.textContent = c; trh.appendChild(th); });
  trh.appendChild(document.createElement('th')); // actions
  thead.appendChild(trh);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  rows.forEach((r,i)=>{
    const tr = document.createElement('tr');
    columns.forEach(col=>{
      const td = document.createElement('td');
      td.textContent = r[col]===undefined ? '' : r[col];
      tr.appendChild(td);
    });
    const act = document.createElement('td');
    const editBtn = document.createElement('button'); editBtn.textContent='Edit'; editBtn.onclick=()=>onEdit(i);
    const delBtn = document.createElement('button'); delBtn.textContent='Delete'; delBtn.onclick=()=>onDelete(i);
    act.appendChild(editBtn); act.appendChild(delBtn);
    tr.appendChild(act);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

// File System helpers (Chromium) with fallback
async function saveJsonToFile(defaultName, dataObj){
  const json = JSON.stringify(dataObj, null, 2);
  // File System Access API
  if(window.showSaveFilePicker){
    try{
      const handle = await window.showSaveFilePicker({
        suggestedName: defaultName,
        types: [{description: 'JSON', accept: {'application/json':['.json']}}]
      });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
      alert('Saved to ' + handle.name);
      return;
    }catch(e){
      console.error('Save cancelled or error', e);
      return;
    }
  }
  // Fallback: download
  const blob = new Blob([json], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = defaultName;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

async function loadJsonFromFile(){
  // File System Access API
  if(window.showOpenFilePicker){
    try{
      const [handle] = await window.showOpenFilePicker({types:[{description:'JSON',accept:{'application/json':['.json']}}]});
      const file = await handle.getFile();
      const text = await file.text();
      return JSON.parse(text);
    }catch(e){
      console.error('Open cancelled or error', e);
      return null;
    }
  }
  // Fallback: file input
  return await new Promise((resolve)=>{
    const inp = document.createElement('input');
    inp.type='file'; inp.accept='.json,application/json';
    inp.onchange = ev=>{
      const f = ev.target.files[0];
      if(!f){ resolve(null); return; }
      const reader = new FileReader();
      reader.onload = ()=>{ try{ resolve(JSON.parse(reader.result)); }catch(e){ alert('Invalid JSON file'); resolve(null); } };
      reader.readAsText(f);
    };
    inp.click();
  });
}

// Each page maintains in-memory arrays. Use keys to name the objects.
const DEFAULTS = {
  employees: { columns:['NAME','DESIGNATION','DEPARTMENT','SALARY'], rows:[] },
  departments: { columns:['NAME','HEAD'], rows:[] },
  salary: { columns:['EMPLOYEE','AMOUNT','DATE'], rows:[] },
  leaves: { columns:['EMPLOYEE','FROM','TO','REASON'], rows:[] }
};

// ------- Page-specific logic -------
document.addEventListener('DOMContentLoaded', ()=>{

  // -- Employees page --
  if(document.getElementById('employeesTableArea')){
    let mem = JSON.parse(localStorage.getItem('fs_employees') || JSON.stringify(DEFAULTS.employees));
    const columns = mem.columns;
    const render = ()=> renderTableInto('employeesTableArea', columns, mem.rows,
      async (i)=>{ // edit
        const r = mem.rows[i];
        const name = prompt('Name', r.NAME||'');
        if(name===null) return;
        const designation = prompt('Designation', r.DESIGNATION||'');
        if(designation===null) return;
        const dept = prompt('Department', r.DEPARTMENT||'');
        if(dept===null) return;
        const salary = prompt('Salary', r.SALARY||'');
        if(salary===null) return;
        mem.rows[i] = { NAME:name, DESIGNATION:designation, DEPARTMENT:dept, SALARY:salary };
        localStorage.setItem('fs_employees', JSON.stringify(mem));
        render();
      },
      (i)=>{ if(confirm('Delete row?')){ mem.rows.splice(i,1); localStorage.setItem('fs_employees', JSON.stringify(mem)); render(); } }
    );
    render();
    // form actions
    const form = document.getElementById('employeeForm');
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('empName').value.trim();
      const desig = document.getElementById('empDesig').value.trim();
      const dept = document.getElementById('empDept').value.trim();
      const sal = document.getElementById('empSalary').value.trim();
      mem.rows.push({ NAME:name, DESIGNATION:desig, DEPARTMENT:dept, SALARY:sal });
      localStorage.setItem('fs_employees', JSON.stringify(mem));
      form.reset();
      render();
    });
    // Save / Load buttons
    document.getElementById('empSaveBtn').addEventListener('click', async ()=>{
      await saveJsonToFile('employees.json', mem);
    });
    document.getElementById('empLoadBtn').addEventListener('click', async ()=>{
      const parsed = await loadJsonFromFile();
      if(parsed){ mem = parsed; localStorage.setItem('fs_employees', JSON.stringify(mem)); render(); alert('Loaded'); }
    });
    document.getElementById('empClearBtn').addEventListener('click', ()=>{
      if(confirm('Reset in-memory employees to empty?')){ mem.rows = []; localStorage.setItem('fs_employees', JSON.stringify(mem)); render(); }
    });
  }

  // -- Departments page --
  if(document.getElementById('departmentsTableArea')){
    let mem = JSON.parse(localStorage.getItem('fs_departments') || JSON.stringify(DEFAULTS.departments));
    const columns = mem.columns;
    const render = ()=> renderTableInto('departmentsTableArea', columns, mem.rows,
      async (i)=>{
        const r = mem.rows[i];
        const name = prompt('Name', r.NAME||'');
        if(name===null) return;
        const head = prompt('Head', r.HEAD||'');
        if(head===null) return;
        mem.rows[i] = { NAME:name, HEAD:head };
        localStorage.setItem('fs_departments', JSON.stringify(mem)); render();
      },
      (i)=>{ if(confirm('Delete row?')){ mem.rows.splice(i,1); localStorage.setItem('fs_departments', JSON.stringify(mem)); render(); } }
    );
    render();
    const form = document.getElementById('departmentForm');
    form.addEventListener('submit', e=>{ e.preventDefault(); mem.rows.push({ NAME:deptName.value.trim(), HEAD:deptHead.value.trim() }); localStorage.setItem('fs_departments', JSON.stringify(mem)); form.reset(); render(); });
    document.getElementById('deptSaveBtn').addEventListener('click', async ()=>{ await saveJsonToFile('departments.json', mem); });
    document.getElementById('deptLoadBtn').addEventListener('click', async ()=>{ const parsed = await loadJsonFromFile(); if(parsed){ mem = parsed; localStorage.setItem('fs_departments', JSON.stringify(mem)); render(); alert('Loaded'); } });
    document.getElementById('deptClearBtn').addEventListener('click', ()=>{ if(confirm('Reset in-memory departments to empty?')){ mem.rows = []; localStorage.setItem('fs_departments', JSON.stringify(mem)); render(); } });
  }

  // -- Salaries page --
  if(document.getElementById('salaryTableArea')){
    let mem = JSON.parse(localStorage.getItem('fs_salary') || JSON.stringify(DEFAULTS.salary));
    const columns = mem.columns;
    const render = ()=> renderTableInto('salaryTableArea', columns, mem.rows,
      async (i)=>{
        const r = mem.rows[i];
        const emp = prompt('Employee', r.EMPLOYEE||'');
        if(emp===null) return;
        const amt = prompt('Amount', r.AMOUNT||'');
        if(amt===null) return;
        const date = prompt('Date', r.DATE||'');
        if(date===null) return;
        mem.rows[i] = { EMPLOYEE:emp, AMOUNT:amt, DATE:date };
        localStorage.setItem('fs_salary', JSON.stringify(mem)); render();
      },
      (i)=>{ if(confirm('Delete row?')){ mem.rows.splice(i,1); localStorage.setItem('fs_salary', JSON.stringify(mem)); render(); } }
    );
    render();
    const form = document.getElementById('salaryForm');
    form.addEventListener('submit', e=>{ e.preventDefault(); mem.rows.push({ EMPLOYEE:salEmp.value.trim(), AMOUNT:salAmount.value.trim(), DATE:salDate.value }); localStorage.setItem('fs_salary', JSON.stringify(mem)); form.reset(); render(); });
    document.getElementById('salSaveBtn').addEventListener('click', async ()=>{ await saveJsonToFile('salaries.json', mem); });
    document.getElementById('salLoadBtn').addEventListener('click', async ()=>{ const parsed = await loadJsonFromFile(); if(parsed){ mem = parsed; localStorage.setItem('fs_salary', JSON.stringify(mem)); render(); alert('Loaded'); } });
    document.getElementById('salClearBtn').addEventListener('click', ()=>{ if(confirm('Reset in-memory salaries to empty?')){ mem.rows = []; localStorage.setItem('fs_salary', JSON.stringify(mem)); render(); } });
  }

  // -- Leaves page --
  if(document.getElementById('leaveTableArea')){
    let mem = JSON.parse(localStorage.getItem('fs_leaves') || JSON.stringify(DEFAULTS.leaves));
    const columns = mem.columns;
    const render = ()=> renderTableInto('leaveTableArea', columns, mem.rows,
      async (i)=>{
        const r = mem.rows[i];
        const emp = prompt('Employee', r.EMPLOYEE||'');
        if(emp===null) return;
        const from = prompt('From', r.FROM||'');
        if(from===null) return;
        const to = prompt('To', r.TO||'');
        if(to===null) return;
        const reason = prompt('Reason', r.REASON||'');
        if(reason===null) return;
        mem.rows[i] = { EMPLOYEE:emp, FROM:from, TO:to, REASON:reason };
        localStorage.setItem('fs_leaves', JSON.stringify(mem)); render();
      },
      (i)=>{ if(confirm('Delete row?')){ mem.rows.splice(i,1); localStorage.setItem('fs_leaves', JSON.stringify(mem)); render(); } }
    );
    render();
    const form = document.getElementById('leaveForm');
    form.addEventListener('submit', e=>{ e.preventDefault(); mem.rows.push({ EMPLOYEE:leaveEmp.value.trim(), FROM:leaveFrom.value, TO:leaveTo.value, REASON:leaveReason.value.trim() }); localStorage.setItem('fs_leaves', JSON.stringify(mem)); form.reset(); render(); });
    document.getElementById('leaveSaveBtn').addEventListener('click', async ()=>{ await saveJsonToFile('leaves.json', mem); });
    document.getElementById('leaveLoadBtn').addEventListener('click', async ()=>{ const parsed = await loadJsonFromFile(); if(parsed){ mem = parsed; localStorage.setItem('fs_leaves', JSON.stringify(mem)); render(); alert('Loaded'); } });
    document.getElementById('leaveClearBtn').addEventListener('click', ()=>{ if(confirm('Reset in-memory leaves to empty?')){ mem.rows = []; localStorage.setItem('fs_leaves', JSON.stringify(mem)); render(); } });
  }

}); // DOMContentLoaded
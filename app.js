const form = document.getElementById('data-form');
const preview = document.querySelector('#data-preview tbody');
const rowsContainer = document.getElementById('form-rows');
const downloadButton = document.getElementById('download-pdf');
const resetButton = document.getElementById('reset-data');
const columns = ['RP', 'PI', 'PD', 'MI', 'MD', 'DIAGNOSTICO', 'PP', 'I', 'T', 'M', 'F', 'SC', 'TRATAMIENTO', 'RODEO'];
let data = JSON.parse(localStorage.getItem('formData')) || [];
renderRows();
renderPreview();

form.addEventListener('submit', e => {
  e.preventDefault();
  const inputs = rowsContainer.querySelectorAll('input');
  const row = {};
  columns.forEach((col, i) => row[col] = inputs[i].value || '');
  data.push(row);
  localStorage.setItem('formData', JSON.stringify(data));
  if (data.length >= 30) generatePDF();
  else {
    renderRows();
    renderPreview();
  }
});

downloadButton.addEventListener('click', generatePDF);

resetButton.addEventListener('click', () => {
  if (confirm('¿Seguro que querés borrar todo?')) {
    localStorage.removeItem('formData');
    data = [];
    renderRows();
    renderPreview();
  }
});

function renderRows() {
  rowsContainer.innerHTML = '';
  const newRow = document.createElement('div');
  newRow.className = 'row';
  columns.forEach(col => {
    const input = document.createElement('input');
    input.placeholder = col;
    newRow.appendChild(input);
  });
  rowsContainer.appendChild(newRow);
}

function renderPreview() {
  preview.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      td.textContent = row[col];
      tr.appendChild(td);
    });
    preview.appendChild(tr);
  });
}

function generatePDF() {
  const element = document.createElement('div');
  const table = document.createElement('table');
  table.innerHTML = '<thead><tr>' + columns.map(c => `<th>${c}</th>`).join('') + '</tr></thead>';
  const tbody = document.createElement('tbody');
  data.forEach(row => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      td.textContent = row[col];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  element.appendChild(table);
  html2pdf().set({ filename: 'planilla_medica.pdf' }).from(element).save();
  data = [];
  localStorage.removeItem('formData');
  renderRows();
  renderPreview();
}
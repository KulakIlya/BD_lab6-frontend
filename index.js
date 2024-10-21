let currentSort = '';
let currentFilter = '';
let selectedTable = 'Owners'; // Таблиця за замовчуванням

// Завантаження даних з вибраної таблиці
function loadTableData() {
  selectedTable = document.getElementById('tableSelect').value;
  // if (selectedTable === 'Owners') currentSort = 'OwnerId';
  // if (selectedTable === 'Properties') currentSort = 'PropertyId';
  // if (selectedTable === 'Transactions') currentSort = 'TransactionId';
  const url = new URL('http://localhost:3000/data');
  url.searchParams.append('table', selectedTable);

  if (currentSort) {
    url.searchParams.append('sort', currentSort);
  }
  if (
    selectedTable === 'Owners' ||
    (selectedTable === 'Transactions' && currentFilter)
  ) {
    url.searchParams.append('email', currentFilter);
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderTableHeader();
      const tableBody = document.querySelector('#dataTable tbody');
      tableBody.innerHTML = ''; // Очищуємо таблицю

      data.forEach((row) => {
        let rowHTML = '<tr>';
        for (let key in row) {
          rowHTML += `<td>${row[key]}</td>`;
        }
        rowHTML += '</tr>';
        tableBody.innerHTML += rowHTML;
      });
    })
    .catch((err) => console.error('Error fetching data:', err));
}

// Створення заголовків таблиці в залежності від вибраної таблиці
function renderTableHeader() {
  const headers = {
    Owners: ['OwnerID', 'Full Name', 'Phone Number', 'Email'],
    Properties: ['PropertyID', 'Address', 'Type', 'Size', 'Price'],
    Transactions: [
      'TransactionID',
      'PropertyID',
      'OwnerID',
      'Date Of Sale',
      'Sale Price',
    ],
  };

  const tableHeader = document.querySelector('#tableHeader tr');
  tableHeader.innerHTML = '';

  headers[selectedTable].forEach((column) => {
    tableHeader.innerHTML += `<th onclick="sortTable('${column.replace(
      / /g,
      ''
    )}')">${column}</th>`;
  });
}

// Сортування даних
function sortTable(column) {
  currentSort = column;
  loadTableData();
}

// Фільтрація за Email (працює тільки для таблиці Owners)
function filterByEmail() {
  const emailInput = document.getElementById('emailFilter').value;
  currentFilter = emailInput;
  loadTableData();
}

function filterByRange() {
  const table = document.getElementById('rangeTableSelect').value;
  const field = document.getElementById('rangeField').value;
  const min = document.getElementById('minValue').value;
  const max = document.getElementById('maxValue').value;

  const url = new URL('http://localhost:3000/range');
  url.searchParams.append('table', table);
  url.searchParams.append('field', field);
  url.searchParams.append('min', min);
  url.searchParams.append('max', max);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector('#dataTable tbody');
      tableBody.innerHTML = '';
      data.forEach((row) => {
        let rowHTML = '<tr>';
        for (let key in row) {
          rowHTML += `<td>${row[key]}</td>`;
        }
        rowHTML += '</tr>';
        tableBody.innerHTML += rowHTML;
      });
    })
    .catch((err) => console.error('Error fetching data:', err));
}

function loadJoinData() {
  fetch('http://localhost:3000/join')
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector('#dataTable tbody');
      tableBody.innerHTML = '';
      data.forEach((row) => {
        let rowHTML = '<tr>';
        for (let key in row) {
          rowHTML += `<td>${row[key]}</td>`;
        }
        rowHTML += '</tr>';
        tableBody.innerHTML += rowHTML;
      });
    })
    .catch((err) => console.error('Error fetching data:', err));
}

function getStatistics() {
  const table = document.getElementById('statsTableSelect').value;
  const field = document.getElementById('statsField').value;

  const url = new URL('http://localhost:3000/stats');
  url.searchParams.append('table', table);
  url.searchParams.append('field', field);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      alert(
        `Average: ${data.AverageValue}, Max: ${data.MaxValue}, Min: ${data.MinValue}`
      );
    })
    .catch((err) => console.error('Error fetching stats:', err));
}

function groupBy() {
  const table = document.getElementById('groupTableSelect').value;
  const groupBy = document.getElementById('groupField').value;

  const url = new URL('http://localhost:3000/group');
  url.searchParams.append('table', table);
  url.searchParams.append('field', 'PropertyID'); // Вказати поле для групування
  url.searchParams.append('groupBy', groupBy);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector('#dataTable tbody');
      tableBody.innerHTML = ''; // Очищуємо таблицю

      data.forEach((row) => {
        const rowHTML = `
                  <tr>
                      <td>${row[groupBy]}</td>
                      <td>${row.Count}</td>
                  </tr>`;
        tableBody.innerHTML += rowHTML;
      });
    })
    .catch((err) => console.error('Error fetching grouped data:', err));
}
// Завантаження даних при першому відкритті
loadTableData();

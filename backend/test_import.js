
const XLSX = require('xlsx');

// 1. Create a multi-row Excel file
const headers = ['Title', 'Description', 'DueDate (YYYY-MM-DD)', 'Days Before Due'];
const data = [
    ['Test Reminder 1', 'Desc 1', '2025-02-01', 1],
    ['Test Reminder 2', 'Desc 2', '2025-02-02', 2],
    ['Test Reminder 3', 'Desc 3', '2025-02-03', 3],
    ['Test Reminder 4', 'Desc 4', '2025-02-04', 4],
    ['Test Reminder 5', 'Desc 5', '2025-02-05', 5]
];

const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Template');
XLSX.writeFile(wb, 'test_multi.xlsx');

console.log('Created test_multi.xlsx with 5 rows.');

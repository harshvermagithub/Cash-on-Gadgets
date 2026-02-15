const xlsx = require('xlsx');

const file = './imgs/Smartphone Buyback Prices.xlsx';
const wb = xlsx.readFile(file);
console.log('Sheets:', wb.SheetNames);

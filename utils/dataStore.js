const fs = require("fs");
const path = require("path");
// Data to be stored
const dataToStore = [
    { date: '2024-04-06', value: 10 },
    { date: '2024-04-07', value: 15 },
    { date: '2024-04-08', value: 20 },
    // Add more data for the past week
];

// Directory and file path
const directory = './data';
const filePath = path.join(directory, 'weeklyData.js');

// Ensure the data directory exists
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}

// Filter data for the past week
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
const filteredData = dataToStore.filter(entry => new Date(entry.date) >= oneWeekAgo);

// Convert data to JavaScript code
const jsCode = `const weeklyData = ${JSON.stringify(filteredData, null, 4)};`;

// Write the data to the .js file
fs.writeFile(filePath, jsCode, err => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Data has been stored in', filePath);
    }
});
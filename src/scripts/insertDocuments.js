const fs = require('fs');
const { Client } = require('pg');

async function insertDocuments(filePath) {
    try {
        // Read the CSV file
        const fileData = fs.readFileSync(filePath, 'utf-8');

        // Parse the CSV data
        const rows = fileData.split('\n');
        const headers = rows[0].split(',');
        const values = rows.slice(1).map(row => row.split(','));

        // Connect to the database
        const client = new Client({
            user: 'your_username',
            host: 'your_host',
            database: 'your_database',
            password: 'your_password',
            port: 5432, // or your database port
        });
        await client.connect();

        // Insert the data into the database
        const insertQuery = `INSERT INTO your_table (${headers.join(', ')}) VALUES ${values.map(row => `(${row.map(value => `'${value}'`).join(', ')})`).join(', ')};`;
        await client.query(insertQuery);

        // Disconnect from the database
        await client.end();

        console.log('Data inserted successfully!');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

// Usage example
insertDocuments('/path/to/your/csv/file.csv');

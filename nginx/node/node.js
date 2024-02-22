const express = require('express')
const ejs = require('ejs');
const mysql = require('mysql')
const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};

app.use(express.urlencoded({ extended: true })); // Middleware para analisar dados de formulário HTML
app.use(express.json()); 

const connection = mysql.createConnection(config)



app.get('/', (req, res) => {
    const sqlQuery = 'SELECT name FROM people';
    connection.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Error in consult people:', error);
            return res.status(500).send('Error in consult people.');
        }        
        
        ejs.renderFile(__dirname + '/names.ejs', { names: results.map(row => row.name) }, (err, html) => {
            if (err) {
                console.error('Error to render page:', err);
                return res.status(500).send('Error to render page.');
            }
            res.send(html);
        });
    });
});

app.post('/insert-name', (req, res) => {
    console.log('start post')
    const name = req.body.name;
    const sqlQuery = `INSERT INTO people(name) values(?)`;
    connection.query(sqlQuery, [name], (error, results) => {
        if (error) {
            console.error('Server: Error to insert name', error);
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});



app.listen(port, ()=> {
    console.log('Running in ' + port)
})
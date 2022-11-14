const {Router} = require('express');
const express = require('express');
const taskRouter = express.Router();

// DB CONNECTION
const pg = require('pg');
const Pool = pg.Pool;
let pool;
if (process.env.DATABASE_URL) {
    pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}
else {
    pool = new pg.Pool({
        host: 'localhost',
        port: 5432,
        database: 'weekend-to-do-app',
        max: 10,
        idleTimeoutMillis: 30000
    });
}

// const pool = new Pool({
//     database: 'weekend-to-do-app', // name of database
//     host: 'localhost', // database server
//     port: 5432, // Postgres default
//     max: 10, // max queries at once
//     idleTimeoutMillis: 30000 // 30 seconds to try to connect before cancelling query
// });

// not required, but useful for debugging:
pool.on('connect', () => {
    console.log('postgresql is connected!');
});

pool.on('error', (error) => {
    console.log('error in postgres pool.', error);
})

// GET
taskRouter.get('/', (req, res) => {
  let queryText = `SELECT * FROM tasks ORDER BY "priority" DESC`;

    pool.query(queryText)
        .then( (response) => {
        console.log('query GET successful');
        res.send(response);
        })
        .catch( (error) => {
        console.log('error in query GET:', error);
        })
})

// POST
taskRouter.post('/',  (req, res) => {
    let newTask = req.body;
    console.log(`Adding task`, newTask);

    let queryText = `INSERT INTO "tasks" ("name", "date", "priority") VALUES ($1, $2, $3)`;
    pool.query(queryText, [newTask.name, newTask.date, newTask.priority])
        .then(result => {
            res.sendStatus(201);
        })
        .catch(error => {
            console.log(`Error adding new task`, error);
            res.sendStatus(500);
        });
});

// PUT to change priority
taskRouter.put('/priority/:id', (req, res) => {
    let taskId = req.params.id;

    let isPriority = req.body.priority
    let param = (isPriority == 'true' ? 'false' : 'true')
    console.log('isPriority is:', isPriority);
    console.log('setting task to', param);

    let queryText = `
    UPDATE "tasks" 
    SET "priority" = $1 
    WHERE "id" = $2;
    `;

    pool.query(queryText, [param, taskId]).then (() => {
        res.sendStatus(200);
    }).catch(error => {
        alert('error updating status to ready to move', error);
        res.sendStatus(500);
    });
});

// PUT to change completeness status
taskRouter.put('/complete/:id', (req, res) => {
    let taskId = req.params.id;

    let isComplete = req.body.complete
    let param = (isComplete == 'true' ? 'false' : 'true')
    console.log('isComplete is:', isComplete);
    console.log('setting task to', param);

    let queryText = `
    UPDATE "tasks" 
    SET "complete" = $1 
    WHERE "id" = $2;
    `;

    pool.query(queryText, [param, taskId]).then (() => {
        res.sendStatus(200);
    }).catch((error) => {
        alert('error updating status to ready to move', error);
        res.sendStatus(500)
    });
});

// DELETE
taskRouter.delete('/remove/:id', (req, res) => {
    let taskId = req.params.id;
    let queryText = `DELETE FROM "tasks" WHERE "id"=$1;`;

    pool.query(queryText, [taskId]).then(() =>{
        res.sendStatus(200);
    }).catch((error) =>{
        alert('error deleting task', error);
        res.sendStatus(500)
    });
});


// FILTER by Name or Notes
taskRouter.get('/:filter', (req, res) => {
    let search = req.params.filter;
    let queryText = `SELECT * FROM "tasks" WHERE "name" iLIKE $1 ORDER BY name;`;
    
    pool.query(queryText, [`%${search}%`]).then((results) =>{
        res.send(results.rows);
    }).catch((error) => {
        alert('error filter by input field', error);
        res.sendStatus(500);
    });
});

module.exports = taskRouter;
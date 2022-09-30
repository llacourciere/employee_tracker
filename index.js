const { prompt } = require('inquirer');
const mysql = require('mysql2');
const db = require('./connection');
const cTable = require('console.table');

const init = () => {
    prompt([
        {
            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
        }
    ]).then(({task})=> {
        if(task == "view all departments"){
            db
                .promise().query(`SELECT * FROM departments`)
                .then(data => console.table(data[0]))
                .then(init);
        };

        if (task == "view all roles"){
            db
                .promise().query(`SELECT * FROM roles`)
                .then(data => console.table(data[0]))
                .then(init);    
        };
        if (task == "view all employees") {
            db
                .promise().query(`SELECT * FROM employees`)
                .then(data => console.table(data[0]))
                .then(init);
        };

        if (task == "add a department") {
            prompt([
                {
                    type:'input',
                    name: 'name',
                    message: 'What is the name of the new department?'
                }
            ]).then(newDept => {
                db
                    .promise().query('INSERT INTO departments SET ?',newDept)
                    .then(init)
                })
        };
        
    })
};

init();
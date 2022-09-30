const { prompt, default: inquirer } = require('inquirer');
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
    ]).then(({ task }) => {
        if (task == "view all departments") {
            db
                .promise().query(`SELECT * FROM departments`)
                .then(data => console.table(data[0]))
                .then(init);
        };

        if (task == "view all roles") {
            db
                .promise().query(`SELECT title, salary, departments.name AS department 
                                    FROM roles 
                                    LEFT JOIN departments 
                                    ON roles.department_id = departments.id`)
                .then(data => console.table(data[0]))
                .then(init);
        };
        if (task == "view all employees") {
            db
                .promise().query(`SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, 
                                    CONCAT(manager.first_name, " " , manager.last_name) AS manager
                                    FROM employees 
                                    LEFT JOIN roles ON employees.role_id = roles.id
                                    LEFT JOIN departments ON roles.department_id = departments.id
                                    LEFT JOIN employees AS manager ON employees.id = manager.manager_id;
                                    `)
                .then(data => console.table(data[0]))
                .then(init);
        };

        if (task == "add a department") {
            prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the new department?'
                }
            ]).then(newDept => {
                db
                    .promise().query('INSERT INTO departments SET ?', newDept)
                    .then(init)
            })
        };

        if (task == "add a role") {
            addNewRole();
            init();
        }
    })
};

init();

const addNewRole = () => {
    const departments = [];
    db.query(`SELECT * FROM departments`, (err, res) => {
        if (err) throw err;

        res.forEach(dep => {
            let qObj = {
                name: dep.name,
                value: dep.id
            }
            departments.push(qObj);
        })
    });
    let questions = [
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of this new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this new role?'
        },
        {
            type: 'list',
            name: 'department',
            choices: departments,
            message: 'Which department is this role in?'
        }
    ];
    prompt(questions)
        .then(response => {
            const query = `INSERT INTO roles (title, salary, department_id) VALUES (?)`;
            db.query(query, [[response.title, response.salary, response.department_id]], (err, res) => {
                if (err) throw err;
                console.log('Successfully inserted ${response.title}');
            });
        })
        .catch(err => {
            console.log(err);
        })
}
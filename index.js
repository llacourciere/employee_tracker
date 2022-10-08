const { prompt, default: inquirer } = require('inquirer');
const mysql = require('mysql2');
const db = require('./connection');
const cTable = require('console.table');

// this function starts the command line prompts and asks the user what they would like to o
const init = () => {
    prompt([
        {
            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
        }
        //once the user selects an option they will then enter that portion of the if statement below
    ]).then(({ task }) => {
        if (task == "view all departments") {
            db
                .promise().query(`SELECT * FROM departments`)
                .then(data => console.table(data[0]))
                .then(init);
        };

        if (task == "view all roles") {
            db
            //in this query we are joining the roles and departments so that we can see which department name is associated with the role
                .promise().query(`SELECT title, salary, departments.name AS department 
                                    FROM roles 
                                    LEFT JOIN departments 
                                    ON roles.department_id = departments.id`)
                .then(data => console.table(data[0]))
                .then(init);
        };
        if (task == "view all employees") {
            db
            //here we are joining all three tables to show the employee, their role name the department they work in and their manager
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
        //ask the user what the new department name is
        if (task == "add a department") {
            prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the new department?'
                }
            ]).then(newDept => {
                db
                //insert the data from the above question into the department table
                    .promise().query('INSERT INTO departments SET ?', newDept)
                    .then(init)
            })
        };

        if (task == "add a role") {
           //if this task is selected it will start the add new role function
            addNewRole();
        };

        if (task == "add an employee") {
            //if this task is selected it will start the add employee function
            addEmployee();
        };
        if (task == "update an employee role") {
            //if this task is selected it will start the update employee role function
            updateEmployeeRole();
        }

    })
};
//calling the init funtion to start
init();

const addNewRole = () => {
    const departments = [];
    //get all departments and put the data in an object and then push it to the departments array
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
    //user questions to gather the data needed
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
            //use the departments array we made above to create the choices
            choices: departments,
            message: 'Which department is this role in?'
        }
    ];
    //once the questions are answered insert the role information into the role table
    prompt(questions)
        .then(response => {
            const query = `INSERT INTO roles SET (?)`;
            db.query(query, { title: response.title, salary: response.salary, department: response.department }, (err, res) => {
                if (err) throw err;
                console.log('Successfully inserted' + " " + `${response.title}`);
                init();
            });
        })
        .catch(err => {
            console.log(err);
        })
}

const addEmployee = () => {
    //get all employers and make turn their manager id into a manager array
    db.query(`SELECT * FROM employees`, (err, emplRes) => {
        if (err) throw err;
        const managers = [
            {
                name: 'none',
                value: 0
            }
        ];
        emplRes.forEach(({ first_name, last_name, id }) => {
            managers.push({
                name: first_name + " " + last_name,
                value: id
            });
        });
        //same as above get all roles and insert them into an array to create the question choices
        const roles = [];
        db.query(`SELECT * FROM roles`, (err, res) => {
            if (err) throw err;

            res.forEach(role => {
                let qObj = {
                    name: role.title,
                    value: role.id
                }
                roles.push(qObj);
            });

            let questions = [
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first name?"
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last name?"
                },
                {
                    type: 'list',
                    name: 'role_id',
                    choices: roles,
                    message: "What role does this employee have?"
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    choices: managers,
                    message: "Who is the employees manager?"
                },
            ];
            prompt(questions)
                .then(response => {
                    const query = `INSERT INTO employees SET ?`;
                    db.query(query, { first_name: response.first_name, last_name: response.last_name, role_id: response.role_id, manager_id: response.manager_id }, (err, res) => {
                        if (err) throw err;
                        console.log('Successfully inserted:' + `${response.first_name}` + " " + `${response.last_name}`);
                        init();
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        });
    });
}

const updateEmployeeRole = () => {
    const employees = [];
    db.query(`SELECT * FROM employees`, (err, emplRes) => {
        if (err) throw err;

        emplRes.forEach(emplRes => {
            let eObj = {
                name: emplRes.first_name + " " + emplRes.last_name,
                value: emplRes.id
            }
            employees.push(eObj);
        })

        const roles = [];
        db.query(`SELECT * FROM roles`, (err, res) => {
            if (err) throw err;

            res.forEach(role => {
                let qObj = {
                    name: role.title,
                    value: role.id
                }
                roles.push(qObj);
            });
            let questions = [
                {
                    type: 'list',
                    name: 'id',
                    choices: employees,
                    message: "Which emmployee do you want to update?"
                },
                {
                    type: 'list',
                    name: 'role_id',
                    choices: roles,
                    message: "What new role does this employee have?"
                }
            ];
            prompt(questions)
                .then(response => {
                    //insert the two objects into the query so that they attach to each ? 
                    const query = `UPDATE employees SET ? WHERE ?`;
                    db.query(query, [{ role_id: response.role_id},{id: response.id}], (err, res) => {
                        if (err) throw err;
                        console.log('Successfully updated role');
                        init();
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        });
    });
}
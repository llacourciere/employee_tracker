INSERT INTO departments (name)
VALUES
    ('IT'),
    ('Marketing'),
    ('Finance'),
    ('HR'),
    ('Service'),
    ('Facilities'),
    ('Sales'),
    ('Design'),
    ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Lead', 50000, 7),
    ('Graphic Designer', 65000, 2),
    ('Accountant', 80000, 3),
    ('HR Manager', 90000, 4),
    ('Lawyer', 100000, 9),
    ('Payroll', 50000, 4),
    ('Sales Person', 40000, 7),
    ('Janitor', 50000, 6),
    ('Customer Service', 50000, 5),
    ('Customer Service', 50000, 5);

INSERT INTO employees (first_name, last_name, manager)
VALUES
    ('Jane', 'Doe', 'Bobby Bill'),
    ('Bill', 'Doe', 'Steve Store'),
    ('Fred', 'Doe', 'Leslie Loony'),
    ('George', 'Doe', 'Bobby Bill'),
    ('Same', 'Doe', null),
    ('Julie', 'Doe', 'Leslie Loony'),
    ('Jessica', 'Doe', 'Jessica Jane'),
    ('Lauren', 'Doe', 'Leslie Loony');

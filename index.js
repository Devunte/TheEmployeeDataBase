const { Pool } = require('pg');
const inquirer = require('inquirer');

const pool = new Pool({
  user: 'postgres',
  password: 'Dd174134',
  host: 'localhost',
  database: 'employee_db',
  port: 5432 // default PostgreSQL port
});


async function queryDatabase(query, values = []) {
  try {
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

async function viewAllDepartments() {
  const departments = await queryDatabase('SELECT * FROM department');
  console.table(departments);
}


async function viewAllRoles() {
  const roles = await queryDatabase('SELECT * FROM role');
  console.table(roles);
}

async function viewAllEmployees() {
  const employees = await queryDatabase('SELECT * FROM employee');
  console.table(employees);
}

async function addDepartment() {
  const departmentData = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter department name:'
    }
  ]);

  await queryDatabase('INSERT INTO department (name) VALUES ($1)', [departmentData.name]);
  console.log('Department added successfully');
}


async function addRole() {
  const roleData = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter role title:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter role salary:'
    },
   
  ]);

  await queryDatabase('INSERT INTO role (title, salary) VALUES ($1, $2)', [roleData.title, roleData.salary]);
  console.log('Role added successfully');
}


async function addEmployee() {
  const employeeData = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter employee first name:'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter employee last name:'
    },
   
  ]);

  await queryDatabase('INSERT INTO employee (first_name, last_name) VALUES ($2, $3)', [employeeData.first_name, employeeData.last_name]);

  console.log('Employee added successfully');
}

async function updateEmployeeRole() {

}

async function mainMenu() {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]);

  switch (choice) {
    case 'View all departments':
      await viewAllDepartments();
      break;
    case 'View all roles':
      await viewAllRoles();
      break;
    case 'View all employees':
      await viewAllEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    case 'Exit':
      console.log('Exiting...');
      pool.end(); // Close database connection
      return;
    default:
      console.log('Invalid choice');
  }

  mainMenu();
}

mainMenu();



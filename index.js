//import inquierer
const inquirer = require("inquirer");
//import mysql
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Monday23%",
  database: "employee_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//create the prompts
var mainQuestion = [
  {
    type: "list",
    message: "What would you like to do ?",
    name: "firstPrompt",
    choices: [
      "View Employees",
      "View Departments",
      "View Roles",
      "Add Employee",
      "Add Role",
      "Add Department",
      "Update Employee Role",
      "Quit",
    ],
  },
];

function initializePrompt() {
  inquirer.prompt(mainQuestion).then((result) => {
    switch (result.firstPrompt) {
      case "View Employees":
        db.query("SELECT * FROM employee", function (err, result) {
          console.table(result);
          initializePrompt();
        });
        break;
      case "View Departments":
        db.query("SELECT * FROM department", function (err, result) {
          console.table(result);
          initializePrompt();
        });
        break;
      case "View Roles":
        db.query("SELECT * FROM role", function (err, result) {
          console.table(result);
          initializePrompt();
        });
        break;
      case "Add Employee":
        inquirer
          .prompt([
            {
              type: "input",
              message: "What is their first name?",
              name: "empFirstName",
            },
            {
              type: "input",
              message: "What is their last name?",
              name: "empLastName",
            },
          ])
          .then((results) => {
            //save the results in an array from first two questions
            const params = [results.empFirstName, results.empLastName];
            //then call the roles table
            db.query("SELECT id, title FROM role", function (err, data) {
              const role = data.map(({ id, title }) => ({
                value: id,
                name: title,
              }));

              //then write an inquirer prompt to then pass the roles
              inquirer
                .prompt([
                  {
                    type: "list",
                    message: "What is their role?",
                    name: "empRole",
                    choices: role,
                  },
                ])
                .then((result) => {
                  const employeeRole = result.empRole;
                  params.push(employeeRole);

                  //now call the list of employees with null in them meaning they are managers
                  db.query(
                    "Select id, first_name, last_name from employee where manager_id is null",
                    params,
                    (error, data) => {
                      const managerList = data.map(
                        ({ id, first_name, last_name }) => ({
                          value: id,
                          name: first_name,
                          last: last_name,
                        })
                      );
                      //call the question
                      inquirer
                        .prompt([
                          {
                            type: "list",
                            message: "Who is their manager?",
                            name: "empManager",
                            choices: managerList,
                          },
                        ])
                        .then((result) => {
                          const manager = result.empManager;
                          params.push(manager);
                          console.log(params);
                          //insert the params into the employee table
                          db.query(
                            `INSERT INTO employee( first_name, last_name,role_id, manager_id) VALUES (?, ?, ?, ?)`,
                            params,
                            function (error, result) {
                              console.log("Success!");
                            }
                          );
                          db.query(
                            "Select * from employee",
                            function (error, result) {
                              console.table(result);
                              initializePrompt();
                            }
                          );
                        });
                    }
                  );
                });
            });
          });
        break;
      case "Add Role":
        inquirer
          .prompt([
            {
              type: "input",
              message: "What is the name of the role?",
              name: "roleTitle",
            },
            {
              type: "input",
              message: "What is the salary ?",
              name: "roleSalary",
            },
          ])
          .then((result) => {
            const params = [result.roleTitle, result.roleSalary];
            // console.log(result);
            db.query("SELECT id, name FROM department", function (err, data) {
              const dept = data.map(({ id, name }) => ({
                value: id,
                name: name,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    message: "What department is this role in?",
                    name: "roleDepartment",
                    choices: dept,
                  },
                ])
                .then((deptChoice) => {
                  const dept = deptChoice.roleDepartment;
                  params.push(dept);
                  //   console.log(params);
                  //insert the params into an insert statement
                  db.query(
                    `INSERT INTO role ( title, salary, department_id) VALUES (?, ?, ?)`,
                    params,
                    function (error, result) {
                      console.log("Success!");
                    }
                  );
                  db.query("Select * from role", function (error, result) {
                    console.table(result);
                    initializePrompt();
                  });
                });
            });
          });

        break;

      case "Quit":
        db.end();
        break;

      default:
        console.log("Invalid option. Please choose a valid option.");
        initializePrompt();
        break;
    }
  });
}
initializePrompt();

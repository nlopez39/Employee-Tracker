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
                    `INSERT INTO role ( title, salary, department_id) VALUES (${params[0]}, ${params[1]}, ${params[2]});`,
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

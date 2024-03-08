//import inquierer
const inquirer = require("inquirer");
//import mysql
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Monday23%",
  database: "employee_db",
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
//if user chose employees then out put employeees
// //function to select employees table
// function viewEmployees() {
//   db.query("SELECT * FROM Employees", function (err, result) {
//     console.log(results);
//   });
//}
inquirer.prompt(mainQuestion).then((result) => {
  if (result.firstPrompt == "View Employees") {
    db.query("SELECT * FROM employee", function (err, result) {
      console.log(result);
    });
  } else {
    console.log("Failed");
  }
});

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

var otherQuestions = {
  "Add Employee": [
    {
      type: "input",
      message: "What is the first name of the employee?",
      name: "employeeFirstName",
    },
    {
      type: "input",
      message: "What is the last name of the employee?",
      name: "employeeLastName",
    },
    {
      type: "list",
      message: "What is their role?",
      name: "employeeRole",
      choices: selectRole,
    },
    {
      type: "input",
      message: "Who is their manager?",
      name: "employeeManager",
    },
  ],
  "Add Role": [
    {
      type: "input",
      message: "What is the name of the role?",
      name: "roleTitle",
    },
    {
      type: "input",
      message: "What is the salary for that role?",
      name: "salary",
    },
    {
      type: "input",
      message: "Which department does it belong to ?",
      name: "roleDepartment",
    },
  ],
  "Add Department": [
    {
      type: "input",
      message: "What is the name of the department?",
      name: "departmentName",
    },
  ],
  "Update Employee Role": [
    {
      type: "input",
      message: "What is the first name of the employee?",
      name: "employeeFirstName",
    },
    {
      type: "input",
      message: "What role do you want to assign to this employee?",
      name: "employeeLastName",
    },
  ],
};
//function to view roles for the ADD employee question
function selectRole() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM role", function (err, res) {
      if (err) reject(err);
      const roleArr = res.map((role) => role.title);
      resolve(roleArr);
    });
  });
}

//nested inquirier prompts will be used for this to work
inquirer.prompt(mainQuestion).then((data) => {
  //decontruct data
  const { firstPrompt } = data;
  const otherQuestion = otherQuestions[firstPrompt];

  if (otherQuestion) {
    inquirer.prompt(otherQuestion).then((data) => {
      console.log(data);
    });
  } else {
    console.log("this didn't work");
  }
});

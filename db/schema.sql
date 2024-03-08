drop database if exists employee_db;
create database employee_db; 

use employee_db; 

create table department(
    id INT not null AUTO_INCREMENT, 
    name varchar(30),
    primary key(id)

);

create table role(
    id INT not null AUTO_INCREMENT, 
    title varchar(30),
    salary decimal, 
    department_id INT,
    primary key(id)

);

create table employee(
    id INT not null AUTO_INCREMENT,
    first_name varchar(30),
    last_name varchar(30), 
    role_id INT,
    manager_id INT,
    primary key(id)

);
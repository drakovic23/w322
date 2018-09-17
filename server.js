/************************************************************************************************
 *  WEB322 – Assignment4                                                                      *
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.   *
 *  No part of this assignment has been copied manually or electronically from any other source *
 *  (including web sites) or distributed to other students.                                     *
 *  Name: Deni Rakovic Student ID: 131650152 Date: 11/28/2017                                 *
 *  Online (Heroku) URL: https://morning-wildwood-56460.herokuapp.com/                             *
 ************************************************************************************************/

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const dataService = require("./data-service.js");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: 'layout',
    helpers: {
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue !== rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }


        }
    }
}));
app.set("view engine", ".hbs");



function onHttpStart()
{
    console.log("Express http server listening on " + HTTP_PORT);

}

// setup route to listen on default url path
app.get('/', function(req, res)
{
    res.render("home")

});

app.get('/about', function(req, res)
{
    res.render("about");
});

app.get('/employee/:empNum', function(req,res)
{
    let empNumber = parseInt(req.params.empNum);
    //console.log('finding employee ' + empNumber);
    if(typeof empNumber !== 'undefined')
    {
        dataService.getEmployeeByNum(empNumber).then((data) =>
        {
            console.log();
            res.render("employee", {data: data});
        }).catch((reject) => {
            res.status(404).send("Employee Not Found");
        });
    }

});

app.get('/employees', function(req,res)
{
    let status = req.query.status;
    let department = req.query.department;
    let manager = req.query.manager;

    if(typeof status !== 'undefined')
    {
        //console.log('Status:' + status);

        dataService.getAllEmployees()
            .then(function ()
        {
            dataService.getEmployeesByStatus(status).then((data) =>
            {
                //res.json(data);
                console.log('Line: 101 getting employeesbystatus');
                res.render("employeeList", {data: data, title:"Employees"});
            }).catch((reject) =>
            {
                console.log('error 1line 105');
                res.render("employeeList", { data: {}, title: "Employees" });
            });

        });
    }
    else if(typeof department !== 'undefined')
    {
        dataService.getAllEmployees()
            .then(function ()
            {
                //must parse to int or no results

                dataService.getEmployeesByDepartment(parseInt(department)).then((data) =>
                {
                    res.render("employeeList", { data: data, title: "Departments"});
                }).catch((reject) =>
                {
                    res.render("employeeList", { data: {}, title: "Departments"})
                });

            });

    }
    else if(typeof manager !== 'undefined')
    {
        dataService.getAllEmployees()
            .then(function ()
            {
                dataService.getEmployeesByManager(parseInt(manager)).then((data) =>
                {
                    res.render("employeeList", { data: data, title:"Employees (Managers)"});
                }).catch((reject) =>
                {
                    res.render("employeeList", { data: {}, title: "Employees (Managers)"});
                });

            });

    }
    else
    {
        dataService.getAllEmployees()
            .then((data) =>
            {
                res.render("employeeList", {data: data, title: "Employees"});
            });
    }


});

app.get('/managers', function(req, res)
{
    dataService.getManagers().then((data) =>
    {
        //return json formatted string
        res.render("employeeList", { data: data, title: "Employees(Managers)"})
    }).catch((reject) =>
    {
        res.render("employeeList", { data: { }, title: "Employees(Managers)"})
    });
});


app.get('/departments', function(req,res)
{
    dataService.getDepartments().then((data) =>
    {
       res.render("departmentList", { data: data, title: "Departments"});
    }).catch((reject) =>
    {
        res.render("departmentList", { data: { }, title: "Departments"});
    });
});

app.get('/employees/add', (req, res) => {

    res.render("addEmployee");
});

app.post("/employees/add", (req, res) => {
    console.log(req.body);
    dataService.addEmployee(req.body).then(() =>
    {

       res.redirect('/employees');
    }).catch((reject) =>
    {
        console.log(reject)
        res.render("employeeList", { data: { }, Title: "Employees"});
    });
});

app.post("/employee/update", (req, res) => {
    console.log(req.body);
    dataService.updateEmployee(req.body).then(() =>
    {
        res.redirect("/employees");
    });
});


app.get('*', function(req, res){
    res.send('Page not found', 404);
    res.status(404);
});


//listen on HTTP_PORT and call httpStart
dataService.initialize().then(app.listen(HTTP_PORT, onHttpStart())).catch(() =>
{
    console.log('Error initializing, abort listening on port: ' + HTTP_PORT);
});


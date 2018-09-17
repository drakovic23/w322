const fs = require('fs');
let employees = [ ];
let departments = [ ];
let empCount = 0;

module.exports.initialize = () =>
{
    return new Promise((resolve,reject) => {
        "use strict";

        try {
            let tempEmps = fs.readFileSync('./data/employees.json');
            employees = JSON.parse(tempEmps);
        } catch (err) {
            reject(err);
        }

        try {
            let tempDep = fs.readFileSync('./data/departments.json');
            departments = JSON.parse(tempDep);

        }
        catch (err) {
            reject(err);
        }
        empCount = employees.length;
        resolve(employees);
    });

};

module.exports.updateEmployee = (employeeData) =>
{
    let found = 0;
    return new Promise((resolve, reject) =>
    {

        for (let x = 0; x < employees.length; x++)
        {
            if (employees[x].employeeNum == employeeData.employeeNum)
            {
                console.log('FOUND EMPLOYEE :  + employees[x]');
                employees[x] = employeeData;
                found = 1;
                resolve();
            }
        }
        if(found !== 1)
        {
            reject('Error updating employee');
        }
    });
};
module.exports.addEmployee = (employeeData) =>
{

    return new Promise((resolve, reject) =>
    {
        if(employeeData !== 'undefined')
        {
            empCount++;
            employeeData.employeeNum = empCount;
            console.log(employeeData);
            employees.push(employeeData);
            resolve();
        }
        else
        {
            reject('Error adding employee in module.exports.addEmployee');
        }
    });
};

module.exports.getAllEmployees = function()
{
    return new Promise((resolve, reject) => {

        if (employees.length <= 0)
        {
            reject('No Employees found');
        }
        else
        {
            resolve(employees);
        }
    });

};

module.exports.getEmployeesByStatus = (status) =>
{

    let resObj = [ ];
    let count = 0;

    return new Promise((resolve,reject) =>
    {
        if (employees.length > 0)
        {
            for (let x = 0; x < employees.length; x++)
            {
                if (employees[x].status === status)
                {
                    resObj[count] = employees[x];
                    count++;
                }
            }
            if(count > 1)
            {
                resolve(resObj);
            }
            else
            {
                reject('No results found');
            }
        }
        else if(employees.length < 1)
        {
            reject('No employees in employees array');
        }
        else
        {
            reject('Critical error in getEmployeesByStatus()');
        }



    });



};

module.exports.getEmployeesByDepartment = function(department)
{
    let tempEmps = [ ];
    let count = 0;

    return new Promise((resolve,reject) =>
    {

        if(employees.length > 1)
        {
            for (let x = 0; x < employees.length; x++)
            {
                if (employees[x].department === department)
                {
                    tempEmps[count] = employees[x];
                    count++;
                }

            }
            if(count > 1)
            {
                resolve(tempEmps);
            }
            else
            {
                reject('No results found')
            }
        }
        else if(employees.length < 1)
        {
            reject('No employees in employees array');
        }
        else
        {
            reject('Critical error in getEmployeesByDepartment()');
        }
    });

};

module.exports.getEmployeesByManager = function(manager)
{
    let tempEmps = [ ];
    let count = 0;

    return new Promise((resolve,reject) =>
    {

        if(employees.length > 1)
        {
            for(let x = 0; x < employees.length;x++)
            {
                if(employees[x].employeeManagerNum === manager)
                {
                    tempEmps[count] = employees[x];
                    count++
                }
            }
            if(count > 0)
            {
                resolve(tempEmps);
            }
            else
            {
                reject('No results found');
            }
        }
        else if(employees.length < 1)
        {
            reject('No employees in employees array');
        }
        else
        {
            reject('Critical error in getEmployeesByManager()');
        }
    })


};

module.exports.getEmployeeByNum = function(num)
{
    let tempEmps;
    let count = 0;

    return new Promise((resolve,reject) =>
    {
        if(employees.length > 1)
        {
            for(let x = 0; x < employees.length;x++)
            {
                if(employees[x].employeeNum === num)
                {
                    tempEmps = employees[x];
                    count++
                }
            }
            if(count > 0)
            {
                resolve(tempEmps);
            }
            else
            {
                reject('No results found');
            }
        }
        else if(employees.length < 1)
        {
            reject('No employees in employees array');
        }
        else
        {
            reject('Critical error in getEmployeesByManager()');
        }

    });

};

module.exports.getManagers = function()
{
    let tempEmps = [ ];
    let count = 0;

    return new Promise((resolve,reject) =>
    {
        if(employees.length > 1)
        {
            for(let x = 0; x < employees.length;x++)
            {
                if(employees[x].isManager === true)
                {
                    tempEmps[count] = employees[x];
                    count++
                }
            }
            if(count > 0)
            {
                resolve(tempEmps);
            }
            else
            {
                reject('No results found');
            }
        }
        else if(employees.length < 1)
        {
            reject('No employees in employees array');
        }
        else
        {
            reject('Critical error in getEmployeesByManager()');
        }

    });

};

module.exports.getDepartments = function ()
{
    //let tempDepts = [ ];
    return new Promise((resolve,reject) =>
    {
        if (departments.length > 1)
        {
            resolve(departments);
        }
        else if(departments.length < 0)
        {
            reject('No departments found');

        }
        else
        {
            reject('Critical error in getDepartments');
        }
    });
};


//var x = x.then(exports.initialize());
//x.then(exports.getAllEmployees());
/*module.exports.initialize(function(){
    return module.exports.initialize();
}).then(function(){
    return module.exports.getAllEmployees();
});*/
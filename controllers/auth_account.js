const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');
const encryption = require('bcrypt');
dotenv.config({path: './.env'});
const jwt = require('jsonwebtoken');
const e = require('express');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
});

exports.addUser = function(req, res){
    const {user_name, user_email, user_password, confirm_password} = req.body;
    console.log(user_name);
    db.query("SELECT user_name FROM user WHERE user_name = ?", user_name,
        async function(err,result){
            if(err){
                console.log(err);
            }else{
                if(result.length > 0){
                    return res.render('register', {message: "there can only be one"});
                }else if(user_password != confirm_password){
                    return res.render('register', {message: "password must match"});
                }else{
                    let hashpass = await encryption.hash(user_password, 8);
                    db.query("INSERT INTO user SET ?", 
                        {user_name: user_name, user_password: hashpass, user_email: user_email},
                        function(err2, result){
                            if(err2){
                                return console.log(err2);
                            }else{
                                return res.render("index");
                            }
                        }
                    );
                }
            }
        }
    );
}

exports.loginUser = async function(req, res){
    try{
        const {user_name, user_password} = req.body;
        if(!user_name || !user_password){
            return res.render('index', {message: "Fields should not be empty"});
        }else{
            db.query("SELECT * FROM user WHERE user_name = ?", user_name,
                async function(err, result){
                    if(err){
                        return res.render('index', {message: "Username not found"});
                    }else{
                        if(!(await encryption.compare(user_password, result[0].user_password))){
                            return res.render('index', {message: "Password Incorrect"})
                        }else{
                            const id = result[0].user_id;
                            const token = jwt.sign(id, process.env.JWT_SECRET);
                            const cookieOption = {expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 1000, httpOnly: true};
                            res.cookie("cookie_access_token", token, cookieOption);
                            db.query("SELECT * FROM students s INNER JOIN courses c ON s.course_id = c.course_id",
                                function(err, result2){
                                    if(!result2){
                                        return res.render("studentList", {title: "List of Students",message: "No List"});
                                    }else{
                                        res.render('studentList', {title: "List of Students", data: result2});
                                    }
                                }
                            );
                        }
                    }
                }
            )
            
        }
    }catch(err){
        console.log(err);
    }
}

exports.addStudent = function(req, res){
    const {first_name, last_name, email, course_id}  = req.body;
    // db.query("SELECT * FROM student WHERE email =", email,
    //     function(err, result1){
    //         if(result1.length >0){
    //             return res.render("register", {message: "Email Already Registered"});
    //         }else{

    //         }
    //     }   
    // );
    db.query("INSERT INTO students SET ?", 
        {first_name: first_name, last_name: last_name, email: email, course_id: course_id},
        function(err){
            if(err){ 
                console.log("eroor here");
                return console.log(err);
            }else{
                db.query("SELECT * FROM students s INNER JOIN courses c ON s.course_id = c.course_id",
                    function(err2, result2){
                        if(err2){
                            console.log("eroor here2");
                            return console.log(err2);
                        }else{
                            res.render('studentList', {title: "List of Students", data: result2});
                        }
                   }
                );
            }
        }
    ); 
}

exports.updateStudentForm = function(req, res){
    const email = req.params.email;
    db.query("SELECT * FROM students WHERE email = ?", email,
        function(err, result){
            if(err){
                console.log("Error: "+ err);
            }else{
                //console.log(result)
                res.render("updateStudent", {title: "Update User Account", data: result[0]})
            }
        }
        
    )
}

exports.updateStudent = function(req, res){
    const {first_name, last_name, email, course_id} = req.body;
    db.query("UPDATE students SET first_name=?, last_name=?, email = ?, course_id=? WHERE email =?",
        [first_name, last_name, email, course_id, email],
        function(err, result){
            if(err){
                console.log("ERROR: "+ err);
            }else{
                db.query("SELECT * FROM students s INNER JOIN courses c ON s.course_id = c.course_id",
                function(err, result){
                    if(!result){
                        return res.render("studentList", {message: "No result Found"});
                    }else{
                        res.render('studentList', {title: 'list of user', data: result});
                    }
                }
                )
            }
        }
    )
}

exports.deleteStudent = function(req, res){
    const email = req.params.email;
    db.query("DELETE FROM students WHERE email = ?", email,
        function(err){
            if(err){
                console.log("Error"+err);
            }else{
                db.query("SELECT * FROM students s INNER JOIN courses c ON s.course_id = c.course_id",
                function(err, result){
                    if(!result){
                        return res.render("studentList", {message: "No result Found"});
                    }else{
                        res.render('studentList', {title: 'list of user', data: result});
                    }
                }
                )
            }
        }
    );
}

exports.logoutAccount = function(req, res){
    res.clearCookie("cookie_access_token");
    res.render('index');
}
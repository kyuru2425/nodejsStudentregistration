const express = require('express');
const router = express.Router();

router.get("/", function(req, res){
    res.render("index");
});

router.get("/register", function(req, res){
    res.render("register");
});

router.get("/addStudent", function(req, res){
    res.render("addStudent");
});

// router.get("/studentList", function(req, res){
//     res.render("studentList");
// });



module.exports = router;
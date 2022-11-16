const express = require('express');
const app = express();
const port = 4500;
const cookieParser = require('cookie-parser');

// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "voxwagen24",
//     database: "enrolkodego",
//     port: 3306
// });



app.set('view engine', "hbs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/", require("./routes/regis_routes"));

app.use("/auth", require("./routes/auth"));

app.use(cookieParser());

app.listen(port, ()=>{
    console.log("Server Started! Port is at " + port);
    //to check if the database got connected
    // db.connect((err)=>{
    //     if(err){
    //         console.log("ERROR!"+ err);
    //     }else{
    //         console.log(`db connected`);
    //     }
    // })
})
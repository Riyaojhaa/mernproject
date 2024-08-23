require('dotenv').config()
const express = require("express")
const app = express()
const conn = require("./conn/conn")
const path = require("path")
const Register = require("./db/registers")
const hbs = require("hbs")
const bcrypt = require("bcryptjs")
const port = process.env.PORT || 3000



const static_path = path.join(__dirname , "../public")
const template_path = path.join(__dirname , "../templates/views")
const partialPath = path.join(__dirname , "../templates/partials")
//console.log(template_path)
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path))
app.set("view engine" , "hbs")
app.set("views" , template_path)
hbs.registerPartials(partialPath)


app.get("/" , (req , res) => {
    res.render("home")
})
app.get("/register" , (req , res) => {
    res.render("index")
})
app.get("/login" , (req , res) => {
    res.render("login")
})

//CREATE A NEW USERS IN OUR DATABASE

app.post("/register" , async (req , res) => {
    try{
        const password = req.body.password
        const cpassword = req.body.confirmpassword

        if(password === cpassword){
           const registerEmployee = new Register({
              firstname: req.body.firstname ,
              lastname: req.body.lastname ,
              email: req.body.email,
              gender: req.body.gender ,
              phonenumber: req.body.phonenumber ,
              age: req.body.age ,
              password:req.body.password ,
              confirmpassword: req.body.confirmpassword
           })

           console.log("success part: " + registerEmployee)

           const token = await registerEmployee.generateAuthToken();
           console.log("token part " + token)

           const registered = await registerEmployee.save()
           res.status(201).render("home")
        }else{
            // alert("password is not same")
            res.send("password is not saame")
        }
    }catch(err){
        res.send(err)
    }
})

// //login check
// app.post("/login" , async (req , res) => {
//     try{
//         const email = req.body.email
//         const password1 = req.body.password

//         const useremail = await Register.findOne({email:email});
//         // console.log(email)
//         // console.log(password)
//         console.log(useremail)

//         if(useremail.password === password1){
//             // res.status(201).render("home")
//             res.send("successfull")
//         }else {
//             res.send("username wrong")
//         }
//     }catch(err){
//         res.send("username not registered")
//     }
// })
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password1 = req.body.password;

        const useremail = await Register.findOne({ email: email });
        const isMatch = await bcrypt.compare(password1 , useremail.password)

        const token = await useremail.generateAuthToken();
        console.log("login token :" + token)

        if (useremail) {
            // Check if the password matches
            if (isMatch) {
                res.status(201).render("home")
            } else {
                res.send("username wrong");
            }
        } else {
            res.send("username not registered");
        }
    } catch (err) {
        res.send("Error occurred: " + err.message);
    }
});


app.listen(port , () => {
    console.log(`server is running at ${port}`);
})
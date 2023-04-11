//-----signup operations-------
//here we use POST method / to create something new we use POST method
//it takes user information and save it and send register successfully message
//{ name: "praveen",lastName:"chandra",email:"praveenchandra269@gmail.com",password:"123456",}

//----Login-------
// here we use POST /data coming is a post url 

const express = require('express')

const app = express()
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const saltround = 10;
app.use(express.json())


const userData = [];

 app.post("/signup",async(req, res)=> {
    console.log(req.url, req.method)
    
 
    const userInfo = req.body;

    if (userInfo.name == null ||
        userInfo.email == null ||
        userInfo.password == null)
    {
        res.status(403).send("please eneter all the details required to signup ..")
        return;
    }
     const hashpassword = await bcrypt.hash(userInfo.password, saltround)
    //  userInfo.password = hashpassword;
     console.log("hashPassword :", hashpassword);
         console.log(userInfo);
        userData.push(userInfo);


     res.status(201).send({ msg: "register successfully :", userInfo, hashpassword });
   
       
    
    console.log("signup working");
})


function login(req, res) {
    let loginInfo = req.body;
    // let userFound = false;

    userData.forEach(async (loginData) =>
    {
        if (loginInfo.email === loginData.email) {
            // Compare the hashed password with the provided password
            const validate = await bcrypt.compare(loginInfo.password,loginData.password);
            console.log(loginData.password, loginInfo.password)
            // If the passwords don't match, return an error message
            if (loginData.password !==loginInfo.password) {
                return res.status(401).send({ message: "Incorrect Password, Try Again" });
                
            }
        
             
                try {
                    const token = jwt.sign({ userId: loginData.email }, "secretKey");
                    // Return success status code, message, and token
                    res.status(200).send({
                        message: "User has logged in successfully",
                        token,
                    });
                }
                catch (error) {
                    res.status(500).send({
                        message: "Login failed, please try again",
                    });
                }
            

            // Create a JWT token
         
        }
    });
};
   
//     if (userFound)
//     {
//         res.send("login successfull");
//         }
//         else {
//             res.send("wrong details entered");
//         }
    
// }


// app.post("/signup", signup)

app.post("/login",login)

app.listen(8080)

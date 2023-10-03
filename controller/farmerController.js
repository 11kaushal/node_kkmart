const { kkfarmers, kkproducts } = require("../model")   //import models
const bcrypt = require("bcryptjs")          //for hashing and salting
const jwt = require("jsonwebtoken")         //for JWT

//Get Request to Farmer Registration
exports.renderFarmerRegister = (req,res)=>{
    res.render("./farmers/farmer_register")
}

//Post Request from Farmer Registration
exports.FarmerRegister = async(req,res)=>{
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password 

    //If the information filed in empty
    if(!email || !username || !password){
        return res.send("Please fill all information")
    }

    //insert the information in kkcorp db, users table
    await kkfarmers.create({
        email : email,
        username: username,
        password: bcrypt.hashSync(password,12)          //password hashing with salt value 12-encrypt
    })
    res.redirect("/farmer/login")
}

//Get Request to Farmer Login
exports.renderFarmerLogin = (req,res)=>{
    res.render("./farmers/farmer_login")
}

//Post Request From Farmer Login
exports.FarmerLogin = async(req,res)=>{
    const email = req.body.email
    const password = req.body.password

    const emailExists = await kkfarmers.findOne({
        where:{
            email:email
        } 
    })
    //verify the information exist in database//
    if(emailExists){
        //if email exists. check forpassword//
        const isfarmerPassword = bcrypt.compareSync(password,emailExists.password)      //password hashing decrypt and compare
        if(isfarmerPassword){ //users.password is the vlaue from the users post request,,emailExists.password is the value available in database table
            //if password also matches 
            //GENERATE TOKEN//
            const token = jwt.sign({id:emailExists.id},process.env.FARMER_TOKEN,{expiresIn: "30d"})
            //SEND TOKEN TO CLIENT BROWSER'S COOKIES AS RESPONSE
            res.cookie('token',token)
            //////////////////////////

            res.redirect("/farmer/dashboard")
        }
        else{
            res.send("Invalid Password!!")
        }

    }
    else{
        res.send("Invalid Email!!")
    }
}

//Get Request to Farmer Dashboard
exports.renderFarmerDashboard = async(req,res)=>{ 
    const farmer = req.farmer                          //value provided by isfarmer middleware     
    const allproducts = await kkproducts.findAll({
        where:{
            farmerId : farmer.id
        }
    })       
    res.render("./farmers/farmer_dashboard",{dbproducts:allproducts,farmer:farmer})
}

exports.FarmerLogout = (req,res)=>{
    res.clearCookie('token')                //Clear client cookie token value
    res.redirect("/farmer/login")
}

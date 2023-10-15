const { kkfarmers, kkproducts } = require("../model")   //import models
const bcrypt = require("bcryptjs")          //for hashing and salting
const jwt = require("jsonwebtoken")         //for JWT
const sendEmail = require("../services/sendEmail")

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
    const invalidemail = req.flash("invalidemail")     //store invalidemail key value to invalidemail constant
    const invalidpassword =req.flash("invalidpassword")
    res.render("./farmers/farmer_login",{invalidemail,invalidpassword,}) 
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
            req.flash("loggedin","Successfully LoggedIn !!")
            res.redirect("/farmer/dashboard")
        }
        else{
            req.flash("invalidpassword","Invalid Password")         //store message in flash invalidpassword key
            res.redirect('/farmer/login')
        }

    }
    else{
        req.flash("invalidemail","Invalid Email")
        res.redirect('/farmer/login')
    }
}

//Get Request to Farmer Dashboard
exports.renderFarmerDashboard = async(req,res)=>{ 
    const farmer = req.farmer 
    const loggedin = req.flash("loggedin")                         //value provided by isfarmer middleware     
    const allproducts = await kkproducts.findAll({
        where:{
            farmerId : farmer.id
        }
    })       
    res.render("./farmers/farmer_dashboard",{dbproducts:allproducts,farmer:farmer,loggedin})
}

exports.FarmerLogout = (req,res)=>{
    res.clearCookie('token')                //Clear client cookie token value
    res.redirect("/farmer/login")
}

//Get Request to /verify to rent emailaddress input for user
exports.renderverify=(req,res)=>{
    const unverifiedemail = req.flash('unverifiedemail')
    res.render('./farmers/forgotpassword',{unverifiedemail})
}

//Post Request to /verify to send otp via nodemailer
exports.sendotp=async(req,res)=>{
    const verifyemail=req.body.email                     //fetching email from body part of request

    if(!verifyemail){ 
        //IF VERIFICATION EMAIL IS NOT PROVIDED                            
        res.send('Please provide verification email')
    }

    const emailExists = await kkfarmers.findOne({     //FIND EMAIL IN DATABASE
        where:{
            email: verifyemail
        }
    })
    if(emailExists){
        //IF EMAIL EXISTS
        const generatedOTP = Math.round(Math.random()*8999+1000)
        //SEND OTP
        await sendEmail({
            email : verifyemail,
            subject : "Verify Email",
            otp : generatedOTP
        })
        
        res.redirect("/farmer/otp")
        
    }
    else{
        //IF EMAIL DOESNOT EXISTS
        req.flash('unverifiedemail','Invalid Verification email')
        res.redirect('/farmer/verify')
    }
}

//Get request to /otp to render otp input for user
exports.getotp=(req,res)=>{
    res.render('./farmers/getotp')
}

//Post request to /otp to veirfy the otp with database and redirect to reset password page
exports.verifyotp=(req,res)=>{
    res.redirect('/farmer/reset')
}

//Get request to /reset to render new password input for user
exports.renderReset=(req,res)=>{
    res.render('./farmers/resetPassword')
}

//Post request to /reset to update new password on database and redirect to Login Page
exports.reset=(req,res)=>{
    res.redirect('/farmer/login')
}
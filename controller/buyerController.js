const { kkcustomers, kkproducts } = require("../model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../services/sendEmail")

//Get Request to Buyer Registration
exports.renderBuyerRegister = (req,res)=>{      //buyer_registration_form
    res.render("./buyers/buyer_register")
}

//Post Request from Buyer Registration
exports.BuyerRegister = async(req,res)=>{    //buyer_registration form submitted
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    //If the information filed in empty
    if(!email || !username || !password){           //for server validation only
        return res.send("Please fill all information")
    }

    //insert the information in kkcorp db, users table
    await kkcustomers.create({
        email : email,
        username: username,
        password: bcrypt.hashSync(password,12)              //password hashing with salt value 12
    })
    res.redirect("/buyer/login")
}

//Get Request to Buyer Login
exports.renderBuyerLogin = (req,res)=>{                 //buyer_login_form
    const invalidemail = req.flash("invalidemail")     //store invalidemail key value to invalidemail constant
    const invalidpassword =req.flash("invalidpassword")
    res.render("./buyers/buyer_login",{invalidemail,invalidpassword,})      //send the invalidemail value to ./buyers/buyer_login.ejs to display
}

//Post Request from Buyer Login
exports.BuyerLogin = async(req,res)=>{           //buyer_login form submitted
    const email = req.body.email
    const password = req.body.password

    const emailExists = await kkcustomers.findOne({
        where:{
            email:email
        } 
    })
    //verify the information exist in database//
    if(emailExists){
        //if email exists. check forpassword//
        const isbuyerPassword = bcrypt.compareSync(password,emailExists.password)       //password hashing decrypt and compare
        if(isbuyerPassword){ //users.password is the vlaue from the users post request,,emailExists.password is the value available in database table
            //if password also matches 
            //GENERATE TOKEN//
            const token = jwt.sign({id:emailExists.id},process.env.BUYER_TOKEN,{expiresIn: "30d"})
            //SEND TOKEN TO CLIENT BROWSER'S COOKIES AS RESPONSE
            res.cookie('token',token)
            //////////////////////////
            req.flash("loggedin","Successfully LoggedIn !!")
            res.redirect("/buyer/dashboard")
        }
        else{
            req.flash("invalidpassword","Invalid Password")         //store message in flash invalidpassword key
            res.redirect('/buyer/login')
        }

    }
    else{
        req.flash("invalidemail","Invalid Email")
        res.redirect('/buyer/login')
    }
}

//Get Request to Buyer Dashboard
exports.renderBuyerDashboard = async(req,res)=>{ 
    const buyer = req.buyer   
    const allproducts = await kkproducts.findAll()         //variable should br different i.e viewproducts
    const loggedin = req.flash("loggedin")
    res.render("./buyers/buyer_dashboard",{dbproducts:allproducts,buyer:buyer,loggedin})
}
///////Read/Get or fetch the database information in / directory/////////////////////
// app.get ('/buyers/dashboard',async (req,res)=>{           
//     const allproducts = await kkproducts.findAll()         //variable should br different i.e viewproducts
//     res.render("./buyers/buyer_dashboard",{dbproducts:allproducts})        //render the fetched information from database

    //------------json formatted data to be called by frontend like react------------
    // res.json({
    //     status : 200,
    //     dbproducts : allproducts

    // })
    // ---------------------------------------------------------
// })
/////////////////////////////////////////////////////////////////////////


//Get Request to buyer Buy Page
exports.renderBuyerSorry = (req,res)=>{
    res.render("./buyers/buyer_sorry")
}

//Get Request to Logout
exports.BuyerLogout =(req,res)=>{
    res.clearCookie('token')                //Clear client cookie token value
    res.redirect("/buyer/login")
}

//Get Request to /verify to rent emailaddress input for user
exports.renderverify=(req,res)=>{
    const unverifiedemail = req.flash('unverifiedemail')
    res.render('./buyers/forgotpassword',{unverifiedemail})
}

//Post Request to /verify email to send otp via nodemailer
exports.sendotp=async (req,res)=>{
    const verifyemail=req.body.email                     //fetching email from body part of request

    if(!verifyemail){ 
        //IF VERIFICATION EMAIL IS NOT PROVIDED                            
        res.send('Please provide verification email')
    }

    const emailExists = await kkcustomers.findOne({     //FIND EMAIL IN DATABASE
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
        
        res.redirect("/buyer/otp")
        
    }
    else{
        //IF EMAIL DOESNOT EXISTS
        req.flash('unverifiedemail','Invalid Verification email')
        res.redirect('/buyer/verify')
    }
}


    

//Get request to /otp to render otp input for user
exports.getotp=(req,res)=>{
    res.render('./buyers/getotp')
}

//Post request to /otp to veirfy the otp with database and redirect to reset password page
exports.verifyotp=(req,res)=>{
    res.redirect('/buyer/reset')
}

//Get request to /reset to render new password input for user
exports.renderReset=(req,res)=>{
    res.render('./buyers/resetPassword')
}

//Post request to /reset to update new password on database and redirect to Login Page
exports.reset=(req,res)=>{
    res.redirect('/buyer/login')
}
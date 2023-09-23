const { kkfarmers, kkproducts } = require("../model")
const bcrypt = require("bcryptjs")

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
    const allproducts = await kkproducts.findAll()         //variable should br different i.e viewproducts
    res.render("./farmers/farmer_dashboard",{dbproducts:allproducts})
}


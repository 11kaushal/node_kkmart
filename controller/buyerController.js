const { kkcustomers, kkproducts } = require("../model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
    if(!email || !username || !password){
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
    res.render("./buyers/buyer_login")
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
            const token = jwt.sign({id:emailExists.id},"Admin@123#",{expiresIn: "30d"})
            //SEND TOKEN TO CLIENT BROWSER'S COOKIES AS RESPONSE
            res.cookie('token',token)
            //////////////////////////
            res.redirect("/buyer/dashboard")
        }
        else{
            res.send("Invalid Password!!")
        }

    }
    else{
        res.send("Invalid Email!!")
    }
}

//Get Request to Buyer Dashboard
exports.renderBuyerDashboard = async(req,res)=>{ 
    const buyer = req.buyer   
    const allproducts = await kkproducts.findAll()         //variable should br different i.e viewproducts
    res.render("./buyers/buyer_dashboard",{dbproducts:allproducts,buyer:buyer})
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

exports.BuyerLogout =(req,res)=>{
    res.clearCookie('token')                //Clear client cookie token value
    res.redirect("/buyer/login")
}
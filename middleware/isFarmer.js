const jwt = require("jsonwebtoken")
const { kkfarmers } = require("../model")
const { promisify } = require("util")
const { error } = require("console")


exports.isFarmer = async (req,res,next)=>{     //middleware request->middleware->response
    const token = req.cookies.token                 //Get token from client browser cookie while adding new product because only authenticated farmers can add product                        
    // console.log(token)
    if(!token){
        //IF TOKEN NOT AVAILABLE IN COOKIE, REDIRECT TO LOGIN PAGE
        return res.redirect("/farmer/login")
    }

    //IF TOKEN AVAILABLE, DECODE TOKEN
    const DecodedFarmer = await promisify(jwt.verify)(token,process.env.FARMER_TOKEN)

    //VERIFY USER EXISTANCE FROM FRAMER TABLE
    const isFarmer = await kkfarmers.findOne({
        where : {
            id : DecodedFarmer.id
        }
    })

    if(isFarmer.length == 0){
        //IF FARMER NOT EXISTS IN TABLE, THEN REDIRECT TO REGISTER
        res.redirect("farmer/register")
    }
    else{
            //IF FARMER EXISTS
            req.farmer = isFarmer       //store farmer information in middleware and request to server with next function
            next()
        }
}

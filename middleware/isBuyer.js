const jwt = require("jsonwebtoken")
const { promisify } = require("util")
const { kkcustomers } = require("../model")
exports.isBuyer = async (req,res,next)=>{     //middleware request->middleware->response
    const token = req.cookies.token                 //Get token from client browser cookie while adding new product because only authenticated farmers can add product
    // console.log(token)
    if(!token){
        //IF TOKEN NOT AVAILABLE IN COOKIE, REDIRECT TO LOGIN PAGE
        return res.redirect("/buyer/login")
    }

    //IF TOKEN AVAILABLE, DECODE TOKEN
    const DecodedBuyer = await promisify(jwt.verify)(token,process.env.BUYER_TOKEN)

    //VERIFY USER EXISTANCE FROM FRAMER TABLE
    const isBuyer = await kkcustomers.findOne({
        where : {
            id : DecodedBuyer.id
        }
    })

    if(isBuyer.length == 0){
        //IF BUYER NOT EXISTS IN TABLE, THEN REDIRECT TO REGISTER
        res.redirect("buyer/register")
    }
    else{
        //IF BUYER EXISTS
        req.buyer=isBuyer           //store buyer information in middleware and request to server with next function
        next()
    }


}

require("dotenv").config()              //to add .env file
const express = require("express")      //rewuiring express package
const app = express()               //storing express calue it in app
const farmerRoute = require("./routes/farmerRoute")
const buyerRoute = require("./routes/buyerRoute")
const cookieParser = require("cookie-parser")       //to parse client browser cookier value
const flash = require('connect-flash')
const session = require("express-session")


app.set("view engine","ejs")        // Set up EJS as the view engine
require("./model/index")            //import database connection and table creation model

//Middleware//
app.use(cookieParser())     //To parse the clent browser cookies
app.use(express.static("./public/products/"))  // to serve static files like images,css,js etc from public folder
////////////////////////

// --------------Parse data from form in json format-----
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//----------------------------------------------
//express-session and flas///
app.use(session({
    secret : "kkmart",
    resave : false,
    saveUninitialized : false
}))
app.use(flash())
//.................//

app.get("/",(req,res)=>{
    res.render("home")
})

/////////////FARMER//////////////////
app.use("/farmer",farmerRoute)              //use Farmer route for api call

//////////////////BUYER//////////   
app.use("/buyer",buyerRoute)                //use Buyer route for api call

//////////////LISTENING PORT////////////////////

const PORT = process.env.NODE_DOCKER_PORT || 3001;
app.listen(PORT,function(params) {
    console.log("Hello world, from node js on ",PORT)
})




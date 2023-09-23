
require("dotenv").config()
const express = require("express")      //rewuiring express package
const app = express()               //storing express calue it in app
const farmerRoute = require("./routes/farmerRoute")
const buyerRoute = require("./routes/buyerRoute")

app.set("view engine","ejs")        // Set up EJS as the view engine
require("./model/index")            //import database connection and table creation model

// --------------Parse data from form in json format-----
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//----------------------------------------------

app.get("/",(req,res)=>{
    res.render("home")
})

/////////////FARMER//////////////////
app.use("/farmer",farmerRoute)              //use Farmer route for api call

//////////////////BUYER//////////   
app.use("/buyer",buyerRoute)                //use Buyer route for api call

////////////////////////////////////////////////////////////

const PORT = process.env.NODE_DOCKER_PORT || 3080;
app.listen(PORT,function(params) {
    console.log("Hello world, from node js on ",PORT)
})



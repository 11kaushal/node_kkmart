
const {kkproducts } = require("../model")

exports.isProductAuthorized = async(req,res,next)=>{     //middleware request->middleware->response
    const farmer =req.farmer
    const productid = req.params.id
    // //VERIFY PRODUCT IS OWNED BY FARMER OR NOT
    const MyProducts = await kkproducts.findAll({
        where : {
            farmerId : farmer.id,
            id : productid
        }
    })
    if(MyProducts.length == 0){
        //IF FARMER DOES NOT OWN PRODUCT, THEN REDIRECT TO HIS DASHBOARD
        res.send("Unathorized Access Prohibited")
    }
    else{
        //IF FARMER OWNS THE PRODUCT ,THEN ONLY ALLOWED TO VIEW/EDIT/DELETE PRODUCT
        // console.log("Product Found")
        req.id=productid
        next()   
    }
}
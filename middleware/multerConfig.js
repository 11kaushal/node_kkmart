const multer = require("multer")

//SET STORAGE TO STORE FILE
var storage = multer.diskStorage({
    // This defines the destination directory for storing files
    destination: function(req,file,callback) {
        //File Type Verification
        // console.log(file.mimetype)               //TO get the uploaded file mimetype
        const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg']  
        if(!allowedFileTypes.includes(file.mimetype)){              //includes determines if the file.mimetype matches the allowedFilyTypes array element or not
            callback(new Error("Unsupported File Type Detected !!"))        //if error display error message
            return
        }
    
        // The callback function is a callback that takes two parameters: an error and a path
        // The null argument means there is no error
    callback(null, "./public/products/")      // The "public/products" argument means the files will be stored in this directory
    },
    // This defines the file name for storing files
    filename: function (req,file,callback) {
        const farmerid=req.farmer.id            //Get farmer id to add preffix in filename
        const productid = req.params.id
        console.log(productid)
        // The cb function is a callback that takes two parameters: an error and a name
        // The null argument means there is no error
        callback(null, "FID_0"+farmerid+"-PID_0"+productid+"-"+Date.now()+ "-" +file.originalname)       // The file.originalname argument means the files will be stored with their original names
    }
})

module.exports = {
    multer,
    storage,
}
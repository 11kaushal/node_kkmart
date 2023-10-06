const { kkproducts, kkfarmers } = require("../model")
const fs = require("fs")

//////Get Request to View Product By farmer//////
exports.renderViewProduct = async(req,res)=>{                //get product id
    const id = req.id
    const getproduct = await kkproducts.findAll({          //Find all information of product with product id
        where : {id:id}

    })
    res.render("./farmers/farmer_viewproduct",{getproduct:getproduct})
}
//////////////VIEW PRODUCT USING POSTMAN///////////////
// app.get('/farmer/viewproduct/:id',async(req,res)=>{                //get product id
//     const id = req.params.id
//     const getproduct = await kkproducts.findAll({          //Find all information of product with product id
//         where : {id:id}
//     })
//     res.render("./farmers/farmer_viewproduct",{getproduct:getproduct})
    
//     //------------json formatted data to be called by frontend like react------------
//     // res.json({
//     //     status : 200,
//     //     getproduct : getproduct
//     // })
// })

//Get Request to View Product by Buyer
exports.renderViewProductByBuyer = async(req,res)=>{                //get product id
    const id = req.params.id
    const getproduct = await kkproducts.findOne({          //Find all information of product with product id
        where : {
            id:id
        },
        include : {
            model: kkfarmers                    //SQLJoin farmers table with products table reference to farmerId, kkfarmers from index.js.::Purpose::To display farmer detail in viewproduct by buyer 
        }
    })
    res.render("./buyers/buyer_viewproduct",{getproduct:getproduct})
}
////////////////////////////////////////
//Get  Request to Add Product
exports.renderAddProduct = (req,res)=>{
    res.render("./farmers/farmer_addproduct")
}

//Post Request from Add Product
exports.AddProduct = async (req,res)=>{                   //create '/addproduct' rest backend api       
    // const {productname, price, description} =req.body
            //OR second approach
    // console.log(req.file)

    const productimg = req.file                    //get filename from the multerConfig middleware
    const productname = req.body.productname                //store post responsed data to varaible
    const price = req.body.price
    const description  = req.body.description
    const farmerId = req.farmer.id                   //get farmerid vlaue from the middleware to be stored in the product table
    //For server side validation
    if(!productimg.filename || !productname || !price || !description){
        return res.send("Please fill all the information")
    }

//-------async and await for database operations to insert value in table--------
    await kkproducts.create({                           //kkproducts is the variable declared in model/index.js as db.kkproducts
        image : process.env.BACKEND_URL + productimg.filename,        //filename + Backend_baseURL = fileURL                              
        productname : productname,
        price : price,
        description : description,
        farmerId : farmerId              //add farmer id as a foreign key in product table to know, who added the products
    })

    res.redirect("/farmer/dashboard")                   //redirect to home after successful operation
}

//Get Request to Edit Product
exports.renderEditProduct = async (req,res)=>{
    const id = req.params.id
    const getproduct = await kkproducts.findAll({          //Find all information of product with product id
        where : {id:id}
    })
    res.render("./farmers/farmer_editproduct",{getproduct:getproduct})
}

//Post Request from Edit Product
exports.EditProduct = async(req,res)=>{
    const products = req.products       //product information from is authorized middleware
    const id = req.params.id            //url pasrameter
    const productname = req.body.productname    //from farmer edit product form body   
    const price = req.body.price                //from farmer edit product form body  
    const description  = req.body.description      //from farmer edit product form body  
    let imagefile;                                   //imagefile as changeable value 
    const oldimagefile = products[0].image.slice(process.env.BACKEND_URL.length)    //By slicing the baseurl from the imagefileurl in database we get Old image filename

    if(req.file){               
        imagefile = req.file.filename                           //New updated image filename, if uploaded     
        
        fs.unlink("public/products/"+oldimagefile,(err)=>{       //delete the old image file from the public/products folder 
            if(err){
                res.send("Error While deleting",err)
            }
            else{
                res.redirect("/farmer/viewproduct/" +id)
            }
        })

    }else{
        imagefile = oldimagefile
    }

    

    await kkproducts.update({          //Update all information of product with product id
        image: process.env.BACKEND_URL+ imagefile,      //update the fileurl = Baseurl+suffixed_filename
        productname: productname,
        price: price,
        description: description
        },{
            where : {id:id}
        }
    )
    
}


//Get Request to Delete Product
exports.DeleteProduct = async(req,res)=>{                //get product id
    const id = req.params.id
    const products = req.products
    // const imageurl = products[0].image
    // console.log(imageurl)
    // console.log(process.env.BACKEND_URL)
    await kkproducts.destroy({          //Find all information of product with product id
        where : {id:id}
    })

    fs.unlink("public/products/"+products[0].image.slice(process.env.BACKEND_URL.length),(err)=>{       //delete the file from the public/products folder by slicing the baseurl from the imageurl in database
        if(!err){
            res.redirect("/farmer/dashboard")
        }
        else{
            res.send("Error While deleting",err)
        }
    })
}
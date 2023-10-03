const { kkproducts, kkfarmers } = require("../model")

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
    const productname = req.body.productname                //store post responsed data to varaible
    const price = req.body.price
    const description  = req.body.description
    const farmerId = req.farmer.id                   //get farmerid vlaue from the middleware to be stored in the product table

//-------async and await for database operations to insert value in table--------
    await kkproducts.create({                                           //kkproducts is the variable declared in model/index.js as db.kkproducts
        productname : productname,
        price : price,
        description : description,
        farmerId : farmerId              //add farmer id as a foreign key in product table to know, who added the products
    })

    res.redirect("/farmer/dashboard")                   //redirect to home after successful operation

    //------------json formatted data to be called by frontend like react------------
    // res.json({
    //     status : 200,
    //     message : "Product successfully created"

    // })
    // ---------------------------------------------------------
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
    const id = req.params.id
    const productname = req.body.productname        
    const price = req.body.price
    const description  = req.body.description
    await kkproducts.update({          //Update all information of product with product id
        productname: productname,
        price: price,
        description: description
    },{

        where : {id:id}
    })
    res.redirect("/farmer/viewproduct/" +id)
}

//Get Request to Delete Product
exports.renderDeleteProduct = async(req,res)=>{                //get product id
    const id = req.params.id
    await kkproducts.destroy({          //Find all information of product with product id
        where : {id:id}
    })
    res.redirect("/farmer/dashboard")

    //------------json formatted data to be called by frontend like react------------
    // res.json({
    //     status : 200,
    //     message : "Product successfully deleted"

    // })
    // ---------------------------------------------------------
}
const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const mongoose = require("mongoose")
const validator = require('../middleware/validation')


const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
 


//------------------------------------------------------validations ends here------------------------------------------------------//

const createCart=async function(req,res){
    try{
    let userId=req.params.userId 
    let data=req.body 

    //Destucturing
    let {productId,cartId}=data 
    // let userToken=req.userId
    

    //check userId is Valid ObjectId
    if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "user id is not valid" })
    }

    //Find User in DB
    const validUser=await userModel.findById(userId);
    if(!validUser){
        return res.status(404).send({status:false,message:"User not present"})
    }

    // //Authorisation
    // if (userToken !== userId) {
    //     return res.status(403).send({ status: false, message: "Unauthorized user" })
    // }

     //validating empty req body.
    if (Object.keys(data).length===0) {
        res.status(400).send({ status: false, message: "invalid request parameters.plzz provide user details" })
        return
    }

    //find cart is available for user or not
    let findCart=await cartModel.findOne({userId:userId})
   
    
    if(findCart){

    if(!validator.isValid(cartId)){
        return res.status(400).send({status:false,message:"Please enter cartId"})
    }

    //check cartId is Valid ObjectId
    if (!isValidObjectId(cartId)) {
        return res.status(400).send({ status: false, message: "cart id is not valid" })
    }
    }
    
    if(!validator.isValid(productId)){
        return res.status(400).send({status:false,message:"Please enter productId"})
    }
    
  //check productId is Valid ObjectId
    if (!isValidObjectId(productId)) {
        return res.status(400).send({ status: false, message: "product id is not valid" })
    }


    //cheak product is available in Product collection which is not deleted

    const validProduct=await productModel.findOne({_id:productId,isDeleted:false})

    if(!validProduct){
        return res.status(404).send({status:false,message:"Product not present"})
    }

    if(!data.quantity){
        data.quantity=1
    }
    else{  
        
    if(!isValid(data.quantity)){
        return res.status(400).send({status:false,message:"Please enter quantity"})
    }

    if(!validInstallment(data.quantity)){
        return res.status(400).send({status:false,message:"Quantity must be a postive no"})
    }
}

let {quantity}=data
    

//if cart is not available for user creat New cart and add product detail from user

    if(!findCart){
        cart={userId:userId,
            items:[{productId:productId,quantity:quantity}],
            totalPrice:quantity*(validProduct.price) ,
            totalItems:1

        }
        
        const newCart=await cartModel.create(cart)
        return res.status(201).send({status:true,message:"Success",data:newCart})
    }
    
    //if cart is available for user add product details from user

    if(findCart){

        if(cartId!=findCart._id){
            return res.status(400).send({status:false,message:`This cart is not present for this user ${userId}`})
        }

        let price = findCart.totalPrice + (quantity * validProduct.price)
        let itemsArr = findCart.items
           
        for (let i=0;i<itemsArr.length;i++) {

            if (itemsArr[i].productId.toString() === productId) {
                
                    itemsArr[i].quantity += quantity

                    let itemAddedInCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }

                    let newData = await cartModel.findOneAndUpdate({ _id: findCart._id }, itemAddedInCart, { new: true })

                    return res.status(201).send({ status: true, message: `Success`, data: newData })
            }
         }
         
        itemsArr.push({ productId: productId, quantity: quantity }) 
        

        let itemAddedInCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }
        let newData = await cartModel.findOneAndUpdate({ _id: findCart._id }, itemAddedInCart, { new: true })

        return res.status(201).send({ status: true, message: `Success`, data: newData })
     } 

    }
    catch(err)
    {
        return res.status(500).send({status:false,message:err.message})
    }

    }

//========================================================get cart======================***
const getCart=async function(req,res){
    try{
        let userId=req.params.userId 
        let userToken=req.userId
    

    //check productId is Valid ObjectId
      if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "user id is not valid" })
    }

    //search userID in User Collection
    const validUser=await userModel.findById(userId);

   if(!validUser){
    return res.status(404).send({status:false,message:"User not present"})
}
    //Authorisation
    if (userToken !== userId) {
    return res.status(403).send({ status: false, message: "Unauthorized user" })
     }

    //search userID in cart Collection
    let findCart=await cartModel.findOne({userId:userId}).populate("items.productId")

    if(!findCart){
    return res.status(404).send({status:false,message:"Cart is not present with this particular user id"})
}


return res.status(200).send({status:true,message:"Success",data:findCart})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
        
    }
}





//=======================  update cart =========================================================

const cartUpdate = async function (req, res) {
    try {
        let requestBody = req.body
        let user_id = req.params.userId
        let filterQuery = {}

        if (!isValidObjectId(user_id)) {
            return res.status(400).send({ status: false, msg: ` this ${user_id} is invalid userid` })
        }
        
        let userExist = await cartModel.findOne({ userId: user_id })

        if (!userExist) {
            return res.status(404).send({ status: false, msg: "user not exist" })
        }

        if (Object.keys(requestBody).length === 0) {
            return res.status(400).send({ Status: false, message: " Sorry Body can't be empty" })
        }


        const { cartId, productId, removeProduct } = requestBody
        console.log(requestBody)

        if (!validator.isValid(cartId)) {
            return res.status(400).send({ status: false, msg: 'cartId must be present' })
        }
        if (!isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, msg: ` this ${cartId} is invalid cartId` })
        }

        let cartExist = await cartModel.findOne({ _id: cartId })
        if (!cartExist) {
            return res.status(404).send({ status: false, msg: "cart not exist" })
        }


        if (!validator.isValid(productId)) {
            return res.status(400).send({ status: false, msg: 'productId must be present' })
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: ` this ${productId} is invalid productId` })
        }
        let productExist = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productExist) {
            return res.status(404).send({ status: false, msg: "product not exist" })
        }

        //--------------------------remove produc-------------------------------------//t
        if (!validator.isValid(removeProduct)) {
            return res.status(400).send({ status: false, message: "give removeProduct value in the request body " })
        }

        if (isNaN(removeProduct)) {
            return res.status(400).send({ status: false, message: "Not a number" })
        }

        if (removeProduct < 0 || removeProduct > 1) {
            return res.status(400).send({ status: false, message: "give Valid value of the remove roduct" })
        }

        
        //---------------------need to find index at which this product lies---------------------


        for (let i = 0; i < cartExist.items.length; i++) {
            if (productId == cartExist.items[i].productId) {
                var index = i;
                if (removeProduct == 1) {
                    if (cartExist.items[index].quantity == 1) {
                        let itemsleft = cartExist.totalItems - 1
                        let priceRemain = cartExist.totalPrice - productExist.price
                        cartExist.items.splice(index, 1)
                        filterQuery = {
                            totalItems: itemsleft,
                            totalPrice: priceRemain,
                            items: cartExist.items

                        }
                    }
                    else if (cartExist.items[index].quantity > 1) {
                        let itemsleft = cartExist.totalItems
                        let priceRemain = cartExist.totalPrice - productExist.price
                        cartExist.items[index].quantity--


                        filterQuery = {

                            totalItems: itemsleft,
                            totalPrice: priceRemain,
                            items: cartExist.items

                        }


                    }

                }

                if (removeProduct == 0) {
                    let itemsleft = cartExist.totalItems - 1
                    let priceRemain = cartExist.totalPrice - (cartExist.items[index].quantity * productExist.price)
                    cartExist.items.splice(index, 1)
                    filterQuery = {
                        totalItems: itemsleft,
                        totalPrice: priceRemain,
                        items: cartExist.items

                    }

                }
            }
        }


        let cartupdate = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: filterQuery }, { new: true })
        res.status(200).send({ status: true, message: "Success", data: cartupdate })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


//=======================================================delete Cart API=========================================//
const deleteCart=async function(req,res){
  try{
        let userId=req.params.userId 
        let userToken=req.userId

    //check productId is Valid ObjectId
      if (!ObjectId.isValid(userId)) {
      return res.status(400).send({ status: false, message: "user id is not valid" })
    }

    //search userID in user Collection
    const validUser=await userModel.findById(userId);

   if(!validUser){
    return res.status(404).send({status:false,message:"User not present"})
    }
    //Authorisation
    if (userToken !== userId) {
    return res.status(403).send({ status: false, message: "Unauthorized user" })
     }

    //search userID in cart Collection
    let findCart=await cartModel.findOne({userId:userId})

    if(!findCart){
    return res.status(404).send({status:false,message:"Cart is not present with this particular user id"})
    }

    if(findCart.totalPrice==0 && findCart.totalItems==0 && findCart.items.length==0){
    return res.status(400).send({status:false,message:"Cart is empty"})
}

//only empty the cart details 
let cart={
    items:[],
    totalPrice:0,
    totalItems:0
}

await cartModel.findByIdAndUpdate(findCart._id,cart)
return res.status(204).send({status:true,message:"Success"})

    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})

    }
}



module.exports = { createCart, getCart, deleteCart, cartUpdate }
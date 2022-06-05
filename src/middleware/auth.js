//====================================================================================
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const mongoose = require("mongoose")

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const authentication = function ( req, res, next) {
    try{
        let token = req.headers['authorization']; 
        if(!token){
            return res.status(400).send({status:false, message: "Token is required..!"});
        }
         let Token = token.split(" ")
        //  console.log(token)
         let tokenValue = Token[1]
        //  console.log(tokenValue)
  
       
     jwt.verify(tokenValue,'FunctionUp Group21', function(err, decoded) {
            if (err)
            return res.status(400).send({ status: false, message: "invalid token "}); 
            console.log(decoded)

        let userLoggedIn = decoded.UserId; 
        req["userId"] = userLoggedIn; 
     
        next(); 
     })
     
    } 
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


const authorization = async function(req,res,next){
    try{
        let userId = req.params.userId;
        let id = req.userId;
        if(!isValidObjectId(userId)){
            return res.status(400).send({ status: false, message: "Please enter valid userId" })
         }
         let user = await userModel.findOne({_id:userId});
        if(!user){
            return res.status(404).send({ status: false, message: "No such user exist" }) 
        }
        if(id != user._id){
            return res.status(403).send({status: false , message : "Not authorized..!" });
        }
        next();
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



module.exports = {authentication,authorization}
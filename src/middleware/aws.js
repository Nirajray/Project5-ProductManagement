const aws = require("aws-sdk")



aws.config.update({

    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async(file) => {
    return new Promise(function(resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",//readable publically acess
            Bucket: "classroom-training-bucket", //HERE folder as a bucket
            Key: "project/" + file.originalname, //HERE  
            Body: file.buffer//
        }


        s3.upload(uploadParams, function(err, body) {
            if (err) {
                console.log(err)
                return reject({ "error": err })
            }
            console.log(body)
            console.log("file uploaded succesfully")
            return resolve(body.Location)
        })

    })
}



module.exports.uploadFile=uploadFile

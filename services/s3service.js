require('dotenv').config();
const AWS = require("aws-sdk");

exports.uploadToS3=  (data, filename) =>{
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read"
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3Response) => {
            if (err) {
                console.log(err)
                reject(err);
            }
            else {
                // console.log(s3Response);
                resolve(s3Response.Location);
            }
        })
    })

}
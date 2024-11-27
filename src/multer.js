const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
// const dotenv = require("dotenv")
// dotenv.config();

// console.log(process.env.AWS_REGION)
// Initialize the S3 client with correct region and credentials
const s3Client = new S3Client({
  region:"ap-south-1", // Ensure you're using the correct region
  credentials: {
    accessKeyId: "AKIAYEKP5I67IB2YZIX5",
    secretAccessKey:"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",
  },
});


// Configure multer to upload files to S3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket:"amaljosen", // Ensure your bucket name is correct
    acl: 'public-read',
    key: (req, file, cb) => {
      // Generate a unique filename for the uploaded file
      cb(null, `Dashboard/${Date.now()}_${file.originalname}`);
    },
  }),
});

module.exports = upload;

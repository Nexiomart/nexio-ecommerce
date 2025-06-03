const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const keys = require('../config/keys');

exports.s3Upload = async (image) => {
  try {
    let imageUrl = '';
    let imageKey = '';

    if (!keys.aws.accessKeyId || !keys.aws.secretAccessKey) {
      console.warn('Missing AWS access keys');
      return { imageUrl, imageKey };
    }

    if (image) {
      const s3 = new AWS.S3({
        accessKeyId: keys.aws.accessKeyId,
        secretAccessKey: keys.aws.secretAccessKey,
        region: keys.aws.region,
      });

      const uniqueKey = `${uuidv4()}-${image.originalname}`;

      const params = {
        Bucket: keys.aws.bucketName,
        Key: uniqueKey,
        Body: image.buffer,
        ContentType: image.mimetype,
        // ACL: 'public-read', // Optional: remove if you want private files
      };

      const s3Upload = await s3.upload(params).promise();

      imageUrl = s3Upload.Location;
      imageKey = s3Upload.Key;
    }

    return { imageUrl, imageKey };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return { imageUrl: '', imageKey: '' };
  }
};


// const AWS = require('aws-sdk');

// const keys = require('../config/keys');

// exports.s3Upload = async image => {
//   try {
//     let imageUrl = '';
//     let imageKey = '';

//     if (!keys.aws.accessKeyId) {
//       console.warn('Missing aws keys');
//     }

//     if (image) {
//       const s3bucket = new AWS.S3({
//         accessKeyId: keys.aws.accessKeyId,
//         secretAccessKey: keys.aws.secretAccessKey,
//         region: keys.aws.region
//       });

//       const params = {
//         Bucket: keys.aws.bucketName,
//         Key: image.originalname,
//         Body: image.buffer,
//         ContentType: image.mimetype
//       };

//       const s3Upload = await s3bucket.upload(params).promise();

//       imageUrl = s3Upload.Location;
//       imageKey = s3Upload.key;
//     }

//     return { imageUrl, imageKey };
//   } catch (error) {
//     return { imageUrl: '', imageKey: '' };
//   }
// };

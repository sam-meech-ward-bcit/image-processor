

## S3

Here's what the code looks like that manages to communication between app and the s3 bucket.

```js
// Load the AWS SDK for Node.js
import AWS from 'aws-sdk'

export default function s3Manager({bucketName, region}) {

  // Set the region 
  AWS.config.update({region})

  // Create S3 service object
  const s3 = new AWS.S3({apiVersion: '2006-03-01'})

  // List all of the objects in the current bucket
  async function listObjects() {
    const params = {Bucket: bucketName}
    return s3.listObjectsV2(params).promise()
  }

  // The file first gets uploaded to the server, then sent to s3 using this function
  function upload({file}) {
    return new Promise((resolve, reject) => {
      // call S3 to retrieve upload file to specified bucket
      let uploadParams = {Bucket: bucketName, Key: '', Body: ''}

      // Configure the file stream and obtain the upload parameters
      let fs = require('fs')
      let fileStream = fs.createReadStream(file)
      fileStream.on('error', function(err) {
        console.log('File Error', err)
      })
      uploadParams.Body = fileStream
      let path = require('path')
      uploadParams.Key = path.basename(file)

      // call S3 to retrieve upload file to specified bucket
      s3.upload (uploadParams, function (err, data) {
        if (err) {
          reject(err)
        } if (data) {
          resolve(data)
        }
      })
    })
  }

  // Get a read stream for a file.
  // This can then be sent to the user over HTTP using fileStream.pipe(res)
  function getStream({fileKey}) {
    let options = {
        Bucket: bucketName,
        Key: fileKey,
    }

    let fileStream = s3.getObject(options).createReadStream()
    return fileStream
  }
  
  return { getStream, upload, listBuckets, listObjects, getBucketAcl }
}
```

An example of how this is used to get a file:

```js
const bucketName = process.env.BUCKET_NAME || ""
const region = process.env.BUCKET_REGION || ""
const s3 = s3Manager({bucketName, region})

app.get('/images/:fileKey', (req, res, next) => {
  const { fileKey } = req.params
  const stream = s3.getStream({fileKey})
  stream.pipe(res)
})
```
const functions = require("firebase-functions");

const { Storage } = require("@google-cloud/storage");
const gcs = new Storage();

const sharp = require("sharp");
const fs = require("fs-extra");

const { tmpdir } = require("os");
const { join, dirname } = require("path");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.generateThumbnail = functions.storage
  .object()
  .onFinalize(async (object) => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split("/").pop();
    const bucketDir = dirname(filePath);

    const workingDir = join(tmpdir(), "thumbs");
    const tmpFilePath = join(workingDir, "source.png");

    //exit if file is not an image
    if (!object.contentType.includes("image")) {
      return functions.logger.log("File is not an image.");
    }
    // Exit if the image is already a thumbnail.
    if (fileName.startsWith("thumb_")) {
      return functions.logger.log("Already a Thumbnail.");
    }

    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    // 2. Download Source File
    await bucket.file(filePath).download({
      destination: tmpFilePath,
    });

    // 3. Resize the images and define an array of upload promises
    const thumbName = `thumb_${fileName}`;
    const thumbPath = join(workingDir, thumbName);
    let size = 1000;
    const metadata = await sharp(tmpFilePath).metadata();
    if (metadata.width < size) {
      size = metadata.width;
    }
    //resize image
    await sharp(tmpFilePath).resize({ width: size }).toFile(thumbPath);
    await bucket.upload(thumbPath, {
      destination: join(bucketDir, thumbName),
    });

    // 5. Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(workingDir);
  });

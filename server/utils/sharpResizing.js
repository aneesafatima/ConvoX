const sharp = require("sharp");
const sharpResizing = async (location,req) => {
    console.log(location);
    await sharp(req.file.buffer)
    .resize(600, 700)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/${location}/${req.file.filename}`);
}
module.exports = sharpResizing;
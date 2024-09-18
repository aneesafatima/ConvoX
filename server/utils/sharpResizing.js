const sharp = require("sharp");
const sharpResizing = async (location,req) => {
    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/${location}/${req.file.filename}`);
}
module.exports = sharpResizing;

// await sharp(req.file.buffer)
// .resize(600, 700)
// .toFormat("jpeg")
// .jpeg({ quality: 90 })
// .toFile(`public/img/chats/${req.file.filename}`);
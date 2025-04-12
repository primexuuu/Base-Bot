/* 

 • Credits : PRIME XUU
 • Contact : https://wa.me/6285705081577
 • Channel WhatsApp : https://whatsapp.com/channel/0029Vb5CxIfAjPXInV7XWz38
 
*/

const fs = require("fs");
const chalk = require("chalk")


global.pairingCode = "6282114101214"

global.owner = "6285705081577"
global.namaOwner = "PRIME XUU"

global.dana = "Tidak Ada Payment Dana"
global.ovo = "Tidak Ada Payment Ovo"
global.gopay = "Tidak Ada Payment Gopay"
global.qris = "https://files.catbox.moe/oq0gtb.jpg"

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.cyan("Update > "),
        chalk.black.bgBlue.bold(`${__filename}`));
    delete require.cache[file];
    require(file);
});
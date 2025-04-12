/* 

 • Credits : PRIME XUU
 • Contact : https://wa.me/6285705081577
 • Channel WhatsApp : https://whatsapp.com/channel/0029Vb5CxIfAjPXInV7XWz38
 
*/


const fs = require("fs");
const chalk = require("chalk");
const util = require("util");
const fetch = require("node-fetch");
const Func = require("./Baileys/func");
const { exec, execSync } = require("child_process");

module.exports = async (Xuu, m) => {
    try {
const prefix = ".";
const mime = (m.quoted || m.msg). mimetype
const args = m.body.trim().split(/ +/).slice(1)
const text = q = args.join(" ")
const qmsg = (m.quoted || m)
const isCmd = m.body.startsWith(prefix);
const command = isCmd ? m.body.slice(prefix.length).trim().split(" ").shift().toLowerCase() : "";
const isDev = m.sender.split("@")[0] === global.owner ? true : m.sender == m.botNumber

//╾────────────────────╼//

const qtxt = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `${namaOwner} - Marketplace`}}}


if (isCmd) {
console.log("\n" + chalk.white.bold("Sender:"), chalk.blue.bold(m.sender), "\n" + chalk.white.bold("isGroup:"), chalk.blue.bold(m.isGroup), "\n" + chalk.white.bold("Message:"), chalk.blue.bold(m.body) + "\n");
}

//╾────────────────────╼//

switch (command) {
case "menu": {
const teks = `
*🛒 STORE MENU*
 • .puskontak
 • .puskontak2
 • .jpm
 • .idgc
 • .listgc
 • .payment

*🚀 OTHER MENU*
 • .sticker
 • .tourl
 • .getsc
`;
await Xuu.sendMessage(m.chat, { text: teks }, { quoted: m });
}
break

//╾────────────────────╼//

case "tess": {
let t = await fetch("https://wa.me/6283823097759")
return m.reply(JSON.stringify(t, null, 2))
}
break

//╾────────────────────╼//

case "tourl": {
if (!/image|video/i.test(mime)) return m.reply(`Ketik *.${command}* dengan kirim foto/video`)
if (mime.includes("video") && qmsg.seconds > 30) return m.reply("Durasi video tidak boleh melebihi 30 detik")
const FormData = require('form-data');
const { fromBuffer } = require('file-type');
let buff = m.quoted ? await m.quoted.download() : await m.download()
let { ext } = await fromBuffer(buff);
let bodyForm = new FormData();
bodyForm.append("fileToUpload", buff, "file." + ext);
  bodyForm.append("reqtype", "fileupload");
let res = await fetch("https://catbox.moe/user/api.php", {
method: "POST",
body: bodyForm,
});
let data = await res.text();
return Xuu.sendMessage(m.chat, {text: data}, {quoted: m})
}
break

//╾────────────────────╼//

case "idgc": {
if (!m.isGroup) return m.reply(`Fitur ini hanya untuk dalam grup!`)
return m.reply(m.chat)
}
break

//╾────────────────────╼//

case "listgc": {
if (!isDev) return m.reply(`Fitur ini hanya untuk *developer* bot!`)
const grups = await Xuu.groupFetchAllParticipating()
const id = await Object.keys(grups)
let teks = ""
for (let i of id) {
teks += `\n* *ID :* ${i}\n* *Nama Grup :* ${grups[i].subject}\n* *Total Member :* ${grups[i].participants.length}\n`
}
return m.reply(teks)
}
break

//╾────────────────────╼//

case "pushkontak": case "pushctc": case "puskontak": {
if (!isDev) return m.reply(`Fitur ini hanya untuk *developer* bot!`)
if (!m.isGroup) return m.reply(`Fitur ini hanya untuk dalam grup!`)
if (!q) return m.reply(`*Format Salah!*\n\nContoh *.${command}* teksnya`)
const teks = text
const jids = m.chat
const data = await m.metadata
const member = await data.participants.filter(e => e.id !== m.sender).map(i => i.id)
await m.reply(`Memproses pengiriman pesan ke ${member.length} member`)
for (let i of member) {
await Xuu.sendMessage(i, {text: teks, contextInfo: {isForwarded: true}}, {quoted: m})
await Func.sleep(4000)
}
return Xuu.sendMessage(jids, {text: `*Pushkontak Berhasil ✅*

Berhasil mengirim pesan ke ${member.length} member.`}, {quoted: m})
}
break

//╾────────────────────╼//

case "pushkontak2": case "pushctc2": case "puskontak2": {
if (!isDev) return m.reply(`Fitur ini hanya untuk *developer* bot!`)
if (!q || !q.includes("|")) return m.reply(`*Format Salah!*\n\nContoh *.${command}* idgrup|teksnya`)
const groupId = text.split("|")[0].trim()
const teks = text.split("|")[1]
const jids = m.chat
try {
const data = await Xuu.groupMetadata(groupId)
const member = await data.participants.filter(e => e.id !== m.sender).map(i => i.id)
await m.reply(`Memproses pengiriman pesan ke ${member.length} member grup ${data.subject}`)
for (let i of member) {
await Xuu.sendMessage(i, {text: teks, contextInfo: {isForwarded: true}}, {quoted: m})
await Func.sleep(4000)
}
return Xuu.sendMessage(jids, {text: `*Pushkontak Berhasil ✅*

Berhasil mengirim pesan ke ${member.length} member grup ${data.subject}`}, {quoted: m})
} catch (err) {
return m.reply(err.toString())
}
}
break

//╾────────────────────╼//

case "sticker": case "s": {
if (!/image|video/i.test(mime)) return m.reply(`Ketik *.${command}* dengan kirim foto/video`)
if (mime.includes("video") && qmsg.seconds > 30) return m.reply("Durasi video tidak boleh melebihi 30 detik")
const media = m.quoted ? await m.quoted.download() : await m.download()
return Xuu.sendSticker(m.chat, media, m, {packname: "WhatsApp Bot"}, mime.includes("video"))
}
break

//╾────────────────────╼//

case "getsc": case "bck": case "backup": {
if (!isDev) return
let dir = await fs.readdirSync("./Baileys/tmp")
if (dir.length >= 2) {
let res = await dir.filter(e => e !== "A")
for (let i of res) {
await fs.unlinkSync(`./Baileys/tmp/${i}`)
}}
const name = `Script-Store-Skyzopedia`
const ls = (await execSync("ls"))
.toString()
.split("\n")
.filter(
(pe) =>
pe != "node_modules" &&
pe != "auth" &&
pe != "package-lock.json" &&
pe != "yarn.lock" &&
pe != ""
)
const anu = await execSync(`zip -r ${name}.zip ${ls.join(" ")}`)
await Xuu.sendMessage(m.sender, {document: await fs.readFileSync(`./${name}.zip`), fileName: `${name}.zip`, mimetype: "application/zip"}, {quoted: m})
await execSync(`rm -rf ${name}.zip`)
if (m.chat !== m.sender) return m.reply("Script bot berhasil dikirim ke private chat")
}
break

//╾────────────────────╼//

case "jpm": { 
if (!isDev) return m.reply(`Fitur ini hanya untuk *developer* bot!`)
if (!text) return m.reply("Ketik *.jpm* teksnya bisa dengan foto juga")

let mediaPath;
if (/image/.test(mime)) {
    mediaPath = await Xuu.downloadAndSaveMediaMessage(qmsg);
}

const allGroups = await Xuu.groupFetchAllParticipating();
const groupIds = Object.keys(allGroups);
let count = 0;

const messageContent = mediaPath 
    ? { image: await fs.readFile(mediaPath), caption: text }
    : { text };

const jid = m.chat;

await m.reply(`Memproses ${mediaPath ? "jpm teks & foto" : "jpm teks"} ke ${groupIds.length} grup chat`);

for (const id of groupIds) {
    
    try {
        await Xuu.sendMessage(id, messageContent, { quoted: qtxt });
        count++;
    } catch (err) {
        console.error(`Gagal mengirim ke ${id}:`, err.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 4000));
}

if (mediaPath) await fs.unlink(mediaPath);

await Xuu.sendMessage(jid, { text: `Jpm ${mediaPath ? "teks & foto" : "teks"} berhasil dikirim ke ${count} grup` }, { quoted: m });
}
break

//╾────────────────────╼//

case "pay": case "payment": {
if (!isDev) return 
let teks = `
*DANA :* ${global.dana}
*OVO :* ${global.ovo}
*GOPAY :* ${global.gopay}
`
return Xuu.sendMessage(m.chat, {image: {url: global.qris}, caption: teks}, {quoted: qtxt})
}
break

//╾────────────────────╼//

default:
if (m.text.startsWith("$") && isDev) {
exec(text, (err, stdout) => {
Xuu.sendMessage(m.chat, {
text: err ? err.toString() : util.format(stdout),
quoted: m,
});
});
}

if (m.text.startsWith("=>") && isDev) {
try {
const evaling = await eval(`(async () => { ${text} })();`);
Xuu.sendMessage(m.chat, { text: util.format(evaling), quoted: m });
} catch (e) {
Xuu.sendMessage(m.chat, { text: util.format(e), quoted: m });
}
}

if (m.text.startsWith(">") && isDev) {
try {
let evaled = await eval(text);
if (typeof evaled !== "string") evaled = util.inspect(evaled);
Xuu.sendMessage(m.chat, { text: util.format(evaled), quoted: m });
} catch (e) {
Xuu.sendMessage(m.chat, { text: util.format(e), quoted: m });
}
}
}
} catch (error) {
console.error(error);
}
};

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.cyan("Update > "),
        chalk.black.bgBlue.bold(`${__filename}`));
    delete require.cache[file];
    require(file);
});
/* 

 • Credits : PRIME XUU
 • Contact : https://wa.me/6285705081577
 • Channel WhatsApp : https://whatsapp.com/channel/0029Vb5CxIfAjPXInV7XWz38
 
*/


const {
    default: makeWASocket,
    getContentType,
    proto,
    areJidsSameUser,
    jidDecode
} = require("baileys");

const axios = require("axios");
const FileType = require("file-type");
const fs = require('fs');
const chalk = require('chalk');

module.exports = (primexuu, m) => {
    m = proto.WebMessageInfo.fromObject(m);

    if (m.key) {
        m.id = m.key.id;
        m.isBaileys = /^3EB0|B1E|BAE|3F8/.test(m.id);
        m.chat = primexuu.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '');
        m.now = m.messageTimestamp;
        m.isGroup = m.chat.endsWith('@g.us');
                m.sender = primexuu.decodeJid(m.key.fromMe ? primexuu.user.id : (m.participant || m.key.participant || m.chat));
        m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, primexuu.user.id);
        m.botNumber = primexuu.decodeJid(primexuu.user.id)
        if (m.isGroup) {
        try {
        m.metadata = m.isGroup ? primexuu.groupMetadata(m.chat).catch(_ => {}) : {};
        const participants = m.metadata?.participants || [];
        m.isAdmin = Boolean(participants.find(e => e.admin !== null && e.id === m.sender));
        m.isBotAdmin = Boolean(participants.find(e => e.admin !== null && e.id === m.botNumber));
       } catch (error) {
        m.metadata = {};
        m.isAdmin = false;
        m.isBotAdmin = false;
}
        }
    }   
    

    if (m.message) {
        const messageTypes = Object.keys(m.message);
        m.mtype = messageTypes.find(t => !['senderKeyDistributionMessage', 'messageContextInfo'].includes(t)) || messageTypes.pop();
        m.type = getContentType(m.message);
        m.msg = (m.mtype === 'viewOnceMessage') ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.type] || null;

        if (m.mtype === 'protocolMessage' && m.msg?.key) {
            if (m.msg.key.remoteJid === 'status@broadcast') m.msg.key.remoteJid = m.chat;
            m.msg.key.participant ??= m.sender;
            m.msg.key.fromMe = primexuu.decodeJid(m.msg.key.participant) === primexuu.decodeJid(primexuu.user.id);
            if (!m.msg.key.fromMe && m.msg.key.remoteJid === primexuu.decodeJid(primexuu.user.id)) {
                m.msg.key.remoteJid = m.sender;
            }
        }

        m.body = 
    (m.mtype === 'conversation' && m.message.conversation) ? m.message.conversation :
    (m.mtype === 'imageMessage' && m.message.imageMessage.caption) ? m.message.imageMessage.caption :
    (m.mtype === 'documentMessage' && m.message.documentMessage.caption) ? m.message.documentMessage.caption :
    (m.mtype === 'videoMessage' && m.message.videoMessage.caption) ? m.message.videoMessage.caption :
    (m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ? m.message.extendedTextMessage.text :
    (m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ? m.message.buttonsResponseMessage.selectedButtonId :
    (m.mtype === 'interactiveResponseMessage' && m.message.interactiveResponseMessage.nativeFlowResponseMessage) ? 
        JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
    (m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId) ? m.message.templateButtonReplyMessage.selectedId :
    "";
        m.text = m.body || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || '';
  
        if (m.msg?.contextInfo?.quotedMessage) {
            let quoted = m.quoted = m.msg.contextInfo.quotedMessage;
            let type = Object.keys(quoted)[0];
            m.quoted = { ...quoted[type], mtype: type };
            m.quoted.id = m.msg.contextInfo.stanzaId;
            m.quoted.chat = primexuu.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender);
            m.quoted.isBaileys = /^3EB0|B1E|BAE|3F8/.test(m.quoted.id);
            m.quoted.sender = primexuu.decodeJid(m.msg.contextInfo.participant);
            m.quoted.fromMe = m.quoted.sender === primexuu.user.id;
            m.quoted.text = m.quoted.caption || m.quoted.conversation || '';
            m.quoted.mentionedJid = m.quoted.contextInfo?.mentionedJid || [];
            
            
            if (m.quoted.url || m.quoted.directPath) m.quoted.download = (saveToFile = false) => primexuu.downloadMedia2(m.quoted, m.quoted.mtype.replace(/message/i, ''), saveToFile);
        }

        m.download = async (saveToFile = false) => primexuu.downloadMedia2(m.msg, m.mtype.replace(/message/i, ''), saveToFile);
    }

    m.reply = async (text, options = {}) => {
        const chatId = options?.chat || m.chat;
        const quoted = options?.quoted || m;
        const mentions = [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net');

        if (/^https?:\/\//.test(text)) {
            try {
                const { data, headers } = await axios.get(text, { responseType: 'arraybuffer' });
                const mime = headers['content-type'] || (await FileType.fromBuffer(data)).mime;
                if (/gif|image|video|audio|pdf/i.test(mime)) {
                    return primexuu.sendFileUrl(chatId, text, options.caption || '', quoted, options);
                }
            } catch { }
        }

        return primexuu.sendMessage(chatId, { text, mentions, ...options }, { quoted });
    };

    return m;
};


let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.cyan("Update > "),
        chalk.black.bgBlue.bold(`${__filename}`));
    delete require.cache[file];
    require(file);
});
const fs = require("fs");
const login = require("fb-chat-api");

const sessionData = JSON.parse(fs.readFileSync("./bebui/session.json", "utf-8"));
const fbApiOptions = { listenEvents: true };

login({ appState: sessionData }, (err, api) => {
if (err) {
console.error("login error", err);
return;
}

api.setOptions(fbApiOptions);

api.listenMqtt(async (err, event) => {
try {
if (err) {
console.log("mqtt", err);
return;
}

await api.markAsRead(event.threadID);
await api.sendTypingIndicator(event.threadID);

if (event.type === "message") {
const body = event.body.toLowerCase();
const keywords = ["bobo", "yawa", "haha", "putangina", "gago" , "hayop"];
const matchedKeywords = [];

for (const keyword of keywords) {
if (body.includes(keyword)) {
matchedKeywords.push(keyword);
}
}

if (matchedKeywords.length > 0) {
await api.setMessageReaction(":laughing:", event.messageID);
} else if (
body.includes("ayie") ||
body.includes("love") ||
body.includes("good") ||
body.includes("thankyou") ||
body.includes("happy")
) {
await api.setMessageReaction(":love:", event.messageID);
}

require("./handler.js")(api, event);
}

if (event.isGroup) {
// handle group messages
}
} catch (err) {
console.error(err);
}
});
});
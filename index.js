const fs = require("fs");
const login = require("fb-chat-api");

const loginCred = {
  appState: JSON.parse(fs.readFileSync("session.json", "utf-8")),
};

login(loginCred, (err, api) => {
  if (err) {
    console.error("login error",err);
  }

  api.setOptions({ listenEvents: true });

  api.listenMqtt((err, event) => {
    if (err) {
      console.log("mqtt", err);
    }

    api.markAsRead(event.threadID, (err) => {
      if (err) return console.err(err);
    });
    api.sendTypingIndicator(event.threadID, (err) => {
      if (err) return console.log("typing indicicator error",err);
    });

    if (event.type == "message") {
      if (
        event.body.includes("haha") ||
        event.body.includes("yawa") ||
        event.body.includes("HAHA") ||
        event.body.includes("gay")
      ) {
        api.setMessageReaction(":laughing:", event.messageID, (err) => {
          if (err) return console.log(err);
        });
      } else if (event.body.includes("ayie")) {
        api.setMessageReaction(":love:", event.messageID, (err) => {
          if (err) return console.log(err);
        });
      }

      require("./handler.js")(api, event);
    }

    if (event.isGroup == true) {
    }
  });
});

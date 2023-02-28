const fs = require("fs");
const login = require("fb-chat-api");
const { exit } = require("process");

let stopFunction = null;

const loginCred = {
  appState: JSON.parse(fs.readFileSync("session.json", "utf-8")),
};

login(loginCred, (err, api) => {
  if (err) {
    console.error(err);
    return;
  }

  stopFunction = api.listen((err, event) => {
    if (err) {
      console.log(err);
      return;
    }

    // start trigger
    if (event.body === "/start") {
      const randMes = [
        "Sakin ka lang ah😍",
        "Master Wakanda Poreber😌",
        "Sino kaba?👿",
        "Essay nanaman ba yan ayoko pilitin moko?😌",
        "Bakit Master?😉",
      ];
      const randomIndex = Math.floor(Math.random() * randMes.length);
      const randomMessage = randMes[randomIndex];
      const sendMess = api.sendMessage(randomMessage, event.threadID);
      sendMess;

      // start mqtt
      api.listenMqtt((err, event) => {
        if (err) {
          console.log("listenMqtt error", err);
          return;
        }

        api.markAsRead(event.threadID, (err) => {
          if (err) {
            console.err(err);
            return;
          }
        });

        api.sendTypingIndicator(event.threadID, (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });

if (event.type == "message") {
          if (
            event.body.includes("haha") ||
            event.body.includes("yawa") ||
            event.body.includes("HAHA") ||
            event.body.includes("gay")
          ) {
            api.setMessageReaction(":laughing:", event.messageID, (err) => {
              if (err) {
                console.log(err);
                return;
              }
            });
          } else if (event.body.includes("ayie")) {
            api.setMessageReaction(":love:", event.messageID, (err) => {
              if (err) {
                console.log(err);
                return;
              }
            });
          }

          require("./handler")(api, event);
        }
      });
      // end of listenMqtt
    } else if (event.body == "/stop") {
      try {
        if (event.body === "/stop") {
          api.sendMessage(`Okay 😢`, event.threadID);
          let count = 3;
          const countdown = setInterval(() => {
            api.sendMessage(`Stopping in ${count} seconds...`, event.threadID);
            count--;
            if (count === 0) {
              clearInterval(countdown);
              stopFunction();
            }
          }, 1000);
        }
      } catch (error) {
        console.error("error occurred");
      }
    }
    // end of /start trigger
  });
});

module.exports = { stopFunction };


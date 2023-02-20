const { Configuration, OpenAIApi } = require("openai");

const fs = require("fs");
const apikey = JSON.parse(fs.readFileSync("./bebui/api_key.json", "utf8"));
const configuration = new Configuration({
  apiKey: apikey.openai,
  username: apikey.username,
});
const openai = new OpenAIApi(configuration);

module.exports = index = async (api, event) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: event.body,
    temperature: 0.2,
    max_tokens: 4000,
  });
  api.getThreadInfo(event.threadID, (err, info) => {
    const sender = info.userInfo.find((p) => p.id === event.senderID);
    const senderFull = sender.name;
    const senderName = sender.firstName;
    const senderBday = sender.isBirthday;

    if (senderBday == true) {
      api.sendMessage(
        {
          body: `Happy Birthday @${senderName}`,
          mentions: [
            {
              tag: `@${senderName}`,
              id: event.senderID,
            },
          ],
        },
        event.threadID
      );
    } else {
      api.sendMessage(
        {
          body: `"Hi!, @${senderName} "
             ${response.data.choices[0].text} `,
          mentions: [
            {
              tag: `@${senderName}`,
              id: event.senderID,
            },
          ],
        },
        event.threadID
      );
    }
  });
};

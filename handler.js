try {
  const { Configuration, OpenAIApi } = require("openai");

  const fs = require("fs");
  const apikey = JSON.parse(fs.readFileSync("./api_key.json", "utf8"));
  const configuration = new Configuration({
    apiKey: apikey.openai,
    username: apikey.username,
  });
  const openai = new OpenAIApi(configuration);

  module.exports = index = async (api, event) => {
    const response = await openai.createCompletion({
       model: "text-davinci-003", 
       prompt: event.body,
       temperature: 0.7, 
       max_tokens: 256,
       top_p: 0.9, 
       frequency_penalty: 0,
       presence_penalty: 0,
    });
    api.getThreadInfo(event.threadID, (err, info) => {
      console.log(err);
      const sender = info.userInfo.find((p) => p.id === event.senderID);
      const participants = info.participantIDs;
      const senderFull = sender.name;
      const senderName = sender.firstName;
      const senderBday = sender.isBirthday;

      if (senderBday == true) {
        api.sendMessage(
          {
            body: `Happy Birthday  @${senderName}`,
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
            body: `"Hi! @${senderName}, Im Gobot Your Personal ASSistant "
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
} catch (err) {
  api.sendMessage(`Invalid API key`);
}

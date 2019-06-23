var login = require("facebook-chat-api");
const AssistantV1 = require('ibm-watson/assistant/v1');
require('dotenv').config();

const service = new AssistantV1({
//   username: process.env.IBMusername,
//   password: process.env.IBMpassword,
  iam_apikey: process.env.APIKey,
  version: '2019-02-28',
  url: process.env.URL
});


var answeredThreads = {};
 

// Create simple echo bot
login({email: process.env.username, password: process.env.password}, { pageID: "569946783533540" }, function callback (err, api) {
    if(err) return console.error(err);
 
    api.listen(function callback(err, message) {
        if(err) return console.error(err);
        if(message.senderID != "569946783533540"){
            // console.log(message);
            var mess = message.body;
            service.message({
                workspace_id: process.env.Workspace_ID,
                input: {
                'text': mess
                }
                })
                .then(async res => {
                var data = await JSON.parse(JSON.stringify(res, null, 2));
                var reMess = "";
                for(var i = 0; i < data.output.text.length; i++)
                    reMess += data.output.text[i] + '\n';
                api.sendMessage(reMess, message.threadID);
                })
                .catch(err => {
                console.log(err);
                });
        }
    });
});

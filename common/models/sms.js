'use strict';

module.exports = function(Sms) {
  const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "b996ceac",
  apiSecret: "kp3frlyJqXuiGmCz"
})
    var app = require("../../server/server.js");
    var ObjectID = require("mongodb").ObjectID;
    Sms.SmsParent = function (userId, message, cb) {
             

        var client = app.models.Client;
        client.find({where: {id: {inq:userId}}}, function(err, userObjs) {
          userObjs.forEach((items)=>{

            if(items.mobile==null || items.mobile=='') return
            Sms.sendMessage(items.mobile,null,(err,res)=>{
            })

          })
          cb(null,{status:200})
         })

    }




    Sms.sendMessage = function (receiverId, message, cb) {
      const from = 'Reading Readiness';
      const to = "923333215323";
      const text = 'Attendance testign sms'
      vonage.message.sendSms(from, to, text, (err, responseData) => {
        console.log(responseData);
        if (err) {
          cb(err, {status:400});
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
                cb(null, {status:200});
              } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                cb(null, {status:400,error:responseData.messages[0]['error-text']});
            }
        }
    })

      };



    Sms.remoteMethod('SmsParent', {
        accepts: [{arg: 'userId', type: 'array'}, {arg: 'message', type: 'string'}],
        returns: {arg: 'result', type: 'string'}
      });
};

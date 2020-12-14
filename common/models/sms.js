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
             
        var smsObject=[];
        var parentIds=[];
        var students = app.models.student;
        var clients = app.models.Client;
        students.find({where: {id: {inq:userId}}}, function(err, userObjs) {
          userObjs.forEach((items)=>{
              
              parentIds.push(items.parentId);
              smsObject.push({mobile:'',message:`${items.firstName}${items.lastName} is ${message}`});
          

          })
          clients.find({where: {id: {inq:parentIds}}}, function(err, userObjs) {
                   userObjs.forEach((x,i)=>{
             smsObject[i].mobile=x.mobile;
            })
            for(var i=0;i<smsObject.length;i++){
               Sms.sendMessage(smsObject[i].mobile,smsObject[i].message,(err,res)=>{
                    console.log('sms',res);
                  })
            
            }
               
          });


          // smsObject.forEach((x)=>{

          //   // Sms.sendMessage(x.mobile,x.message,(err,res)=>{
          //   //   console.log('sms',res);
          //   // })
          // })
           

          cb(null,{status:200})
         })

    }




    Sms.sendMessage = function (receiverId, messageSend, cb) {
      const from = 'Reading Readiness';
      const to = "923333215323";
      const text = messageSend
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

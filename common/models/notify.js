'use strict';

const { notify } = require("../../server/server");

module.exports = function(Notify) {
  var app = require("../../server/server.js");
  var request = require('request');

  var fcmConstants = {
    fcmToken: "AAAASaDQt6Q:APA91bF_aMySfyF0JF7f0y1vdCsZ8xYC2aOIVD4UmQgPEH-qnCl_UtO_ext4_uF31-SeJ8bkySCfJLo31ZscfjxyNTgQZOiS6GNqOjLZM25Tn16qBfHHdg2cIqydbZ-oznAZ2fyzNYpx",
    senderId: "316230645668",
    url: "https://fcm.googleapis.com/fcm/send",
  };
  let notifyIds=[];



    Notify.NotifyParent = function (userIds,  message, cb) {
      console.log(userIds)
         
      var client = app.models.Client;
        client.find({where: {id: {inq:userIds}}}, function(err, userObjs) {
          userObjs.forEach((items) => {

            Notify.create({
              userId: items.id,
              message:"temporary",
              type: "temporary",

            },(err,data)=>{

            });
            if(items.fcmToken==null ||items.fcmToken=='') return
            notifyIds.push(items.fcmToken);
            
          });

          notify(notifyIds);
          if (err) {
            cb(err);
            return;
          }    
           cb(null, {status:200});
          
          })
       
    }
    

    
var notify = (notificationUsers) => {
  var headers = {
    Authorization: "key=" + fcmConstants.fcmToken,
    "Content-Type": "application/json",
    Sender: "id=" + fcmConstants.senderId,
  };
  var requestData = {
    registration_ids: ["eHUkXz2U_IY:APA91bH8EwW_ir4iZhP4frYT7-x3wux0q8I-LcW9w7f1ZQ_-dSuynQp_xI3jchfE5uN-ZLyjTmozEzyVHPF3I-okoqtlcCz4J-MR2OSIMfVq9GYNALtn3cWHaEEipglfxezdY9iL0vBQ"],
    priority: "high",
    content_available: true,
    notification: {
      title: "Attendance Alert",
      body: `Attendance alert !!!!`,
    },
 
  };
  request.post(
    {
      headers: headers,
      url: fcmConstants.url,
      body: JSON.stringify(requestData),
      method: "POST",
    },
    function (error, httpResponse, body) {
      console.log(body);
    }
  );
};
  Notify.remoteMethod('NotifyParent', {
    accepts: [{arg: 'userId', type: 'array'}, {arg: 'message', type: 'string'}],
    returns: {arg: 'result', type: 'string'}
  });
};

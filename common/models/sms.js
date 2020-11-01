'use strict';

module.exports = function(Sms) {
    var app = require("../../server/server.js");
    var ObjectID = require("mongodb").ObjectID;

    Sms.SmsParent = function (userIds, fromUserId, message, cb) {
        var client = app.models.Client;
            client.find({email:userIds}).then((res)=>{
                console.log(res);
            })

      
    }
    Sms.remoteMethod('SmsParent', {
        accepts: [{arg: 'userId', type: 'string'}, {arg: 'message', type: 'string'}],
        returns: {arg: 'result', type: 'string'}
      });
};

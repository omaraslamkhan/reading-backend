'use strict';

module.exports = function(Notify) {


    Notify.NotifyInbox = function (userIds, fromUserId, message, cb) {
        
       
      
    }
    
  Notify.remoteMethod('NotifyParent', {
    accepts: [{arg: 'userId', type: 'string'}, {arg: 'message', type: 'string'}],
    returns: {arg: 'result', type: 'string'}
  });
};

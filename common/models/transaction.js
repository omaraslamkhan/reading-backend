'use strict';

module.exports = function(Transaction) {



    
    Transaction.UpdateTransactionStatus = function (referenceNumber,cb){
        Transaction.update({transactionCode:referenceNumber}, {isVerified: true}, function(err, updateRes) {
      if (err) {
          cb(err, null);
          return;
      }
  
      cb(null, {success: 1});
    });
  }


  Transaction.remoteMethod("UpdateTransactionStatus", {
    accepts: [{ arg: "referenceNumber", type: "number"}],
    returns: { arg: "result", type: "string" },
  });

};

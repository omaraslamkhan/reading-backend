'use strict';

module.exports = function(Client) {
  const app = require("../../server/server");
  var emailService = require("./email");
  Client.SendEmail = function (email, message, cb) {
    emailService.sendEmail(email, message);
    cb(null,'200');
  };

  Client.observe('after save', function(ctx, next) {
    if (ctx.instance) {

      if(ctx.instance.role=='PARENT'){
  
        Client.upsertWithWhere({_id:ctx.instance.id},{parentId :ctx.instance.id},(err,obj)=>{
          if(err) return
          return obj;
        });
      }
      if(ctx.instance.role=='TEACHER'){
        
        Client.upsertWithWhere({_id:ctx.instance.id},{teacherId :ctx.instance.id},(err,obj)=>{
          if(err) return
          return obj;
        });
      }
      if(ctx.instance.role==='ADMIN'){
        
        app.models.Location.findOne({where: {_id:ctx.instance.locationId}},(err,elem)=>{
          var adminIdsArray = [];

          if(!!elem.adminIds){ 
            console.log('key exist');
            if(elem.adminIds.length>0){
              adminIdsArray=elem.adminIds;
              adminIdsArray.push(ctx.instance.id);
            }
            else{
              adminIdsArray.push(ctx.instance.id);
  
            }  
          }else{
            adminIdsArray.push(ctx.instance.id);

          }
        
         
            
          app.models.Location.upsertWithWhere({_id:ctx.instance.locationId},{adminIds:adminIdsArray},(err,res)=>{
          console.log('res',res);
          })
        })
      }
  
    }
    next();
  });






  Client.remoteMethod("SendEmail", {
    accepts: [
      {arg: "email", type: "string"},
      {arg: "message", type: "string"},
    ],
    returns: {arg: "result", type: "string"},
  });




  
};

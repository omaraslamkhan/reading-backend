'use strict';

module.exports = function(Client) {

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

    }
    next();
  });
};

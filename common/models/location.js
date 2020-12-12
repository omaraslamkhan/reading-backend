'use strict';

module.exports = function(Location) {


    Location.UpdateLocation = function (location,id, cb) {
        // Location.find({id}, function(er, data) {
        //     console.log(data)
        //     if (er) {
        //         cb(er, null);
        //         return;
        //     }
            Location.update({id:id}, {locationTitle:location }, function(err, updateRes) {
                if (err) {
                    cb(err, null);
                    return;
                }
                cb(null, {success: 1});
            })
        
      };

      Location.DeleteLocation = function (isActive,id, cb) {
        console.log('id,',id);
            Location.update({id:id}, {isActive:isActive }, function(err, updateRes) {
                if (err) {
                    cb(err, null);
                    return;
                }
                cb(null, {success: 1});
            })
        
      };

      Location.FindAdminLocation = function (cb) {
            Location.find({adminIds:{$exists: true}, $where:'this.adminIds.length>1'}, function(err, updateRes) {
                if (err) {
                    cb(err, null);
                    return;
                }
               var newObj= updateRes.filter(x=>{
                  if(x.adminIds && x.adminIds.length>0){
                    return x
                  }

                })
                cb(null, newObj);
            })
        
      };



    Location.remoteMethod("UpdateLocation", {
    accepts: [{ arg: "location", type: "string" },{ arg: "id", type: "string" }],
    returns: { arg: "result", type: "string" },
    http: {verb: "get"}
  });


  Location.remoteMethod("FindAdminLocation", {
   
    returns: { arg: "result", type: "string" },
    http: {verb: "get"}
  });

  Location.remoteMethod("DeleteLocation", {
    accepts: [{ arg: "isActive", type: "string" },{ arg: "id", type: "string" }],
    returns: { arg: "result", type: "string" },
    http: {verb: "get"}
  });
};

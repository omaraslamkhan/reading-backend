'use strict';

module.exports = function(Location) {
  var app = require("../../server/server.js");


  Location.locationWiseStudents = function (locId, cb) {
    var client = app.models.Client;
    var student = app.models.Student;
    var adminIds=[];
    client.find({where:{locationId:locId,role:'ADMIN'}},(err,result)=>{

      result.forEach(element => {
      adminIds.push(element.id);
      });
      student.find({ include:'parent', where: { and:[{adminId: { inq: adminIds}},{isActive:true}] }}).then((std)=>{
               cb(null,std)
      })

    })

    // app.models.Student.getDataSource().connector.connect(function(err, db) {
    //   var collection = db.collection('student');
    //      collection.aggregate([


          
    //        {
    //          $match: {isActive:true} , 
      
    //        }
        
        
        
    //     ]).toArray(function(err,servicesData){
    //            if(err){
 
    //             }else{
    //           cb(null,servicesData);
    //         }
 
    //       });
    //  });
 
  };

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
    
        // Location.find({adminIds:{$exists: true}}, function(err, updateRes) {
            Location.find({where:  {isActive:true},$and:{adminIds:{$exists: true}}}, function(err, updateRes) {
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


      
    Location.remoteMethod("locationWiseStudents", {
      accepts: [{ arg: "locationId", type: "string" }],
      returns: { arg: "result", type: "string" },
      http: {verb: "get"}
    });

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

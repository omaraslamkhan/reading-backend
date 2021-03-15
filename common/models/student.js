'use strict';
var ObjectID = require("mongodb").ObjectID;

module.exports = function(Student) {
    var app = require("../../server/server.js");
  
  
    Student.findParentByStudent = function (studentIds, cb) {
        console.log(studentIds)
        var parentIds=[];
        var parent = app.models.Client;
        Student.find(
          { where: { id: { inq: studentIds } } },
          function (err, res) {

            res.forEach(element => {
           parentIds.push(element.parentId)
            });
console.log(parentIds)
            parent.find(
          { where: { id: { inq: parentIds } } },
          function (err, ress) {


            if (err) {
                cb(err, null);
                return;
              }
              cb(null, { response: ress});
          });
            
      
          
          }
        );
      };

      Student.remoteMethod("findParentByStudent", {
    accepts: [{ arg: "studentIds", type: "array" }],
    returns: { arg: "result", type: "string" },
  });

};

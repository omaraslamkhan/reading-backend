"use strict";

const e = require("cors");
const _ = require("lodash");
var ObjectID = require("mongodb").ObjectID;

module.exports = function (Attendance) {
  var app = require("../../server/server.js");
  Attendance.absentees = function (classRoomId, startDate, endDate, cb) {
    
    var _where;
    var today = new Date();
    var absentIds = [];
    var Students = app.models.Student;
    // _where = { where: { classRoomId: classRoomId } };

    if ((startDate && endDate)!='null') {

      _where = {
        where: {
          classRoomId: classRoomId,
          date: { between: [new Date(startDate), new Date(endDate)] },
        },
      };
    } else {
      _where = { where: { classRoomId: classRoomId } };
    }
 
    Attendance.find(_where, (err, res) => {
      for (var i = 0; i < res.length; i++) {
        for (var j = 0; j < res[i].studentIds.length; j++) {
          if (res[i].studentIds[j].isPresent == false) {
            absentIds.push(ObjectID(res[i].studentIds[j].studentId));

          }
        }
      }


      var uniqSortedIds = _.sortedUniq(absentIds);
    

      Students.find(
        { where: { _id: { inq: uniqSortedIds } } },

        function (err, res) {
          if (err) {
            cb(err, null);
            return;
          }
          cb(null, res);
        }
      );

      //   res.forEach((element,index) => {
      //    var ind=index;

      //  console.log(element.studentIds[ind])
      //     ind--;
      //   });
    });
  };
  Attendance.findStudents = function (classRoomId, startDate, endDate, cb) {
    var obj = [];
    var filter = [];
    var temp = [];
    var _where;

    console.log(classRoomId);
    if (startDate && endDate != null) {
      _where = {
        where: {
          classRoomId: classRoomId,
          date: { between: [new Date(startDate), new Date(endDate)] },
        },
      };
    } else {
      _where = { where: { classRoomId: classRoomId } };
    }
    Attendance.find(_where, (err, res) => {
      console.log("res", res);
      for (var i = 0; i < res.length; i++) {
        for (var k = 0; k < res[i].studentIds.length; k++) {
          if (!temp.includes(res[i].studentIds[k].studentId)) {
            temp.push(res[i].studentIds[k].studentId);
          }
          obj.push({
            studentId: res[i].studentIds[k].studentId,
            present: res[i].studentIds[k].isPresent,
          });
        }
      }

      for (var i = 0; i < temp.length; i++) {
        var absent = 0;
        var present = 0;
        for (var k = 0; k < obj.length; k++) {
          if (temp[i] == obj[k].studentId) {
            if (obj[k].present) {
              present++;
            } else {
              absent++;
            }
            obj[i].present = present;
            obj[i].absent = absent;
          }
        }

        filter.push(obj[i]);
      }

      var student = app.models.Student;

      student
        .find({ where: { id: { inq: temp } } })
        .then((std) => {
          for (let index = 0; index < std.length; index++) {
            filter[index].stud = std[index];
          }
          return filter;
        })
        .then((data) => {
          //   console.log("data", data);
          cb(null, data);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  Attendance.remoteMethod("absentees", {
    accepts: [
      { arg: "classRoomId", type: "string" },
      { arg: "startDate", type: "string" },
      { arg: "endDate", type: "string" },
    ],
    returns: { arg: "result", type: "array" },
  });

  Attendance.remoteMethod("findStudents", {
    accepts: [
      { arg: "classRoomId", type: "string" },
      { arg: "startDate", type: "string" },
      { arg: "endDate", type: "string" },
    ],
    returns: { arg: "result", type: "string" },
  });
};

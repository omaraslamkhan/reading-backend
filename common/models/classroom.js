"use strict";

module.exports = function (Classroom) {
  Classroom.findTeacherStudent = function (teacherId, cb) {
    Classroom.getDataSource().connector.connect(function (err, db) {
      var collection = db.collection("classroom");
      var ObjectID = Classroom.getDataSource().ObjectID;

      collection
        .aggregate([
          { $match: { teacherId: ObjectID(teacherId),isActive:true } },
          {
            $lookup: {
              from: "student",
              localField: "studentIds",
              foreignField: "_id",
              as: "Student",
            },
          },
          
          {
            $unwind: "$Student",
          },
          
          {
            $lookup: {
              from: "Client",
              localField: "Student.parentId",
              foreignField: "_id",
              as: "Parent",
            },
          },
          {
            $unwind: "$Parent",
          },
           {
            $group: { _id:{Student:'$Student',Parent:'$Parent'} }
          },
          { $project : { Student : '$Student' , Parent : '$Parent' } } ,
     
       
        ])
        .toArray(function (err, servicesData) {
          if (err) {
            console.log(servicesData);
          } else {
            cb(null, servicesData);
          }
        });
    });
  };

  Classroom.findClassData = function (studentIds, cb) {
    Classroom.find(
      { where: { studentIds: { inq: studentIds } } },
      function (err, res) {
        if (err) {
          cb(err, null);
          return;
        }
        cb(null, { response: res, count: res.length });
      }
    );
  };

  Classroom.updateTeacherId = function (teacherId, Classid, cb) {
    // Location.find({id}, function(er, data) {
    //     console.log(data)
    //     if (er) {
    //         cb(er, null);
    //         return;
    //     }
    Classroom.update(
      { id: Classid },
      { teacherId: teacherId },
      function (err, updateRes) {
        if (err) {
          cb(err, null);
          return;
        }
        cb(null, { success: 1 });
      }
    );
  };

  Classroom.updateClass = function (stdIds, id, cb) {
    var findstdIds = [];
    var filterStd = [];

    // stdIds.forEach(element=>{
    //     filterStd.push(element);
    // })
    Classroom.find({ where: { id: id } }, function (err, userObjs) {
      userObjs.forEach((x) => {
        if (!x.studentIds.includes(stdIds)) {
          filterStd.push(x.studentIds);
        }
        filterStd = stdIds.map((element) => {
          return element;
        });
        // if(!userObjs[0].studentIds.includes(stdIds)){
        // }
      });

      console.log("filterStd", filterStd);
      Classroom.update(
        { id: id },
        { studentIds: filterStd },
        function (err, updateRes) {
          if (err) {
            console.log(err);
            // cb(err, null);
            // return;
          }
          console.log(updateRes);
          // cb(null, {success: 1});
        }
      );

      //    filterStd=stdIds.filter((x)=>{
      //         return !userObjs[0].studentIds.includes(x.id);
      //       })

      // for(var i=0;i<userObjs[0].studentIds.length;i++){

      //     findstdIds.push(userObjs[0].studentIds[i])
      // }

      // userObjs.forEach(element => {
      //     findstdIds.push(element.studentIds);

      // });
      //    console.log(findstdIds[0][0]);
    });
    cb(null);
    // Location.find({id}, function(er, data) {
    //     console.log(data)
    //     if (er) {
    //         cb(er, null);
    //         return;
    //     }
    // Location.update({id:id}, {locationTitle:location }, function(err, updateRes) {
    //     if (err) {
    //         cb(err, null);
    //         return;
    //     }
    //     cb(null, {success: 1});
    // })
  };

  Classroom.remoteMethod("findTeacherStudent", {
    accepts: [{ arg: "teacherId", type: "string" }],
    returns: { arg: "result", type: "string" },
  });

  Classroom.remoteMethod("findClassData", {
    accepts: [{ arg: "studentIds", type: "array" }],
    returns: { arg: "result", type: "string" },
  });

  Classroom.remoteMethod("updateClass", {
    accepts: [
      { arg: "studentIds", type: "array" },
      { arg: "id", type: "string" },
    ],
    returns: { arg: "result", type: "string" },
  });

  Classroom.remoteMethod("updateTeacherId", {
    accepts: [
      { arg: "teacherId", type: "string" },
      { arg: "classId", type: "string" },
    ],
    returns: { arg: "result", type: "string" },
  });
};

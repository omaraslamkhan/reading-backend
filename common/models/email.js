const app = require("../../server/server");
const fs = require("fs");
const os = require("os");
const path = require("path");
let EmailService = {};



EmailService.sendEmail = function (email, message) {
    console.log(message);
    app.models.Email.send(
      {
        to: email,
        from: "app@readingreadiness.org",
        subject: "Reading Readiness Notification",
        text: message,
        html: null,
      },
      function (err, mail) {
        console.log(err);
        console.log("mail is ", JSON.stringify(mail));
        res.send(err);
      }
      
    );
    

  };

module.exports = EmailService;
'use strict';
module.exports = function (app) {

    var model = app.models;

    model.Client.findOrCreate(
        {"email": "admin@gmail.com"},
        {
       "realm": "false",
      "username": "Admin",
      "email": "admin@gmail.com",
      "emailVerified": true,
      "password": "abc123",
      "role": 'ADMIN',
        },
        function (err, data) {
            if (err) {
              console.log(err);
              return;
            }
            model.Role.upsertWithWhere(
              {
                name: 'ADMIN'
              },
              {
                name: 'ADMIN'
              }, function (err, role) {
                if (err) console.log(err);
      
              });
            }
              
    )
}
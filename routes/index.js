var express = require('express');
var router = express.Router();
var user = require('../routes/user');
/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});
router.get('/users', function(req, res) {
    var db = req.db;
    var collection = db.get('User');
    collection.find({},{},function(e,docs){
        res.render('users', {
            "userlist" : docs
        });
    });
});

router.get('/dash', function(req, res) {
    var db = req.db;
    var sess = req.session;
    var user = sess.userName;
    var collection = db.get('Category');
    collection.find({},{},function(e,docs){
        res.render('dash', {
            "categoryList" : docs,
            "user":user
        });
    });
});
router.get('/category/:id', function(req, res) {
    var db = req.db;
    var category = db.get('Category');
    var question = db.get('Question');
    var categInfo=[];
    category.find({cat_id:parseInt(req.params.id)},{},function(e,docs){
        categInfo=docs;
        res.render('category', {
            "category" : categInfo
        });
    });
});
    // register of the users in the app
router.post('/register',function(req, res){
  var name = req.body.name;
  var unalUser = req.body.unalUser;
  var psw = req.body.password;
  var psw2 = req.body.pasword2;
  var db = req.db;
  // verificar contraseñas iguales
  var collection = db.get("User");
  collection.insert({
    "name":name,
    "userName":unalUser,
    "psw":psw,
    "mail":unalUser+"@unal.edu.co"
  },function(err,doc){
      if (err) {
        res.send("an error has ocurred");
      }else{
          res.redirect("index.html");
      }
  });
});
//login manage
  router.post('/login',function(req, res){
    var userName = req.body.userName;
    var psw = req.body.password;
    var db = req.db;
    // session variable
    var sess = req.session;
    // verificar contraseñas iguales
    var collection = db.get("User");
    collection.find({"userName":userName},{"psw":1},function(err,doc){
        if (err) {
          res.send("an error has ocurred");
        }else{
          if (psw == doc[0].psw){
            sess.userName = userName;
            var category = db.get('Category');
            category.find({},{},function(e,docs){
                res.render('dash', {
                    "categoryList" : docs,
                    "user":userName
                });
            });
          }else{
            res.send("wrong password: try again");
          }

        }
    });

});


module.exports = router;

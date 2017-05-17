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
    if(user){
      var collection = db.get('Category');
      collection.find({},{},function(e,docs){
          res.render('dash', {
              "categoryList" : docs,
              "user":user
          });
      });
    }else{
      var err = new Error('Session expired - please login');
      err.status = 404;
      res.render('error',{"error":err});
    }

});
router.get('/category/:id', function(req, res) {
    var db = req.db;
    var category = db.get('Category');
    var question = db.get('Question');
    var sess = req.session;
    var userName = req.userName;
    var id = req.params.id;
    question.find({categ_id:parseInt(id)},{},function(e,docs){
        res.render('categ', {
            "QuestionList" : docs
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

  router.post("/question",function(req,res){
    var sess = req.session;
    var db = req.db;
    var userName = sess.userName;

    var question = req.body.question;
    var category = req.body.category;
    if(userName){
      // there are an active session
      var questionCollect = db.get("Question");
      var index=0;
      questionCollect.find({},{},function(err,docs){
        questionCollect.insert({
          "id":docs.length+1,
          "categ_id":parseInt(category),
          "user_id":userName,
          "description":question
        },function(err,doc){
          if(err){res.send("an error has ocurred");}
        });
        res.redirect("/category/"+category);
       });// strongly ineficcent


    }else{
      var err = new Error('Session expired - please login');
      err.status = 404;
      res.render('error',{"error":err});
    }

  });

  /*router.post("/categ",function(){
    var sess = req.session;
    var db = req.db;
    var userName = sess.userName;
    if(userName){
      var answerCollect = db.get("Answer");
      answerCollect.find({question:},{},function(err,docs){

      });
    }else{
      var err = new Error('Session expired - please login');
      err.status = 404;
      res.render('error',{"error":err});
    }
  });*/


module.exports = router;

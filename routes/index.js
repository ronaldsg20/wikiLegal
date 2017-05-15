var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/
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
    var collection = db.get('Category');
    collection.find({},{},function(e,docs){
      console.log(docs);
        res.render('dash', {
            "categoryList" : docs
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

    console.log(categInfo);

});


module.exports = router;

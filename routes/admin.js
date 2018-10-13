var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({'dest': './public/images/portfolio'});
var mysql = require('mysql');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'roshantak44',
    database: 'portfolio'
});

connection.connect();

router.get('/', function(req, res, next){
    res.render('admin/index')
});

router.get('/add', function(req, res, next){
    res.render('admin/add')
});



router.post('/add', upload.single('projectimage'), function(req, res, next){
    //Get form values
    var title = req.body.title;
    var service = req.body.service;
    var description = req.body.description;
    var url = req.body.url;
    var client = req.body.client;
    var projectdate = req.body.projectdate;
    

    //check image upload
    if(req.file){
        var projectImageName = req.file.projectimage;
    } else {
        var projectImageName = 'noimage.jpg';
    }

    //form field validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('service', 'Service field is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
    res.render('admin/add', {
        errors: errors,
        title: title,
        description: description,
        service: service,
        client: client,
        url: url
    });
    } else {
      var project = {
        title: title,
        description: description,
        service: service,
        client: client,
        date: projectdate,
        url: url, 
        image: projectImageName
       };
    }
 
    mysql.query = connection.query('INSERT INTO projects SET ?', project, function(err, result){
        console.log('Error: '+err);
        console.log('Success: '+result);
    });

    req.flash('success_msg', 'Project Added');

    res.redirect('/admin');

});



module.exports = router;
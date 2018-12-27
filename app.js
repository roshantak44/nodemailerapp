var express = require('express');
var nodemailer = require('express');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index',{title: 'Exambazaar'});
});

app.get('/about', function(req, res){
    res.render('about');
});

app.get('/contact', function(req, res){
    res.render('contact');
});

app.post('/contact/send', function(req, res){
    var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'testcomeb@gmail.com',
        pass: 'testcom231834'   //enter the password associated with user mail in signle inverted commas 
      }
    });

    var mailOptions = {
        from: 'testcom <testcomeb@gmail.com>',
        to: 'testcomeb@gmail.com',
        subject: 'Submission',
        text: 'you have a submission with the following details... Name: '+req.body.name+'Email: '+req.body.email+'Message: '+req.body.message,
        html: '<p>you have a submission with the following details</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.name+'</li><li>Message: '+req.body.message+'</li></ul>'
    };
   
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.redirect('/');
        }
        else{
            console.log('Message Sent: '+info.response);
            res.redirect('/');
        }
    });
});

app.listen(3000);
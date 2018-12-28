var express = require('express');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var path = require('path');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var port = process.env.PORT || 8000;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/nodem", { useNewUrlParser: true });
var mailSchema = new mongoose.Schema({
    tomail: {type: String},
    cc:[{type: String}],
    bcc:[{type: String}],
    tsubject: {type: String},
    date: { type: Date, default: Date.now },
    message: {type: String}
});

var maildata = mongoose.model("maildata", mailSchema);

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

    var myData = new maildata(req.body);
    myData.save()
    .then(item => {
    res.redirect('/');
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });

    var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'testcomeb@gmail.com',
        pass: 'testcom231834'   //enter the password associated with user mail in signle inverted commas 
      }
    });

    var toemail = req.body.tomail;
    var cc = req.body.cc;
    var bcc = req.body.bcc;

    var mailOptions = {
        from: 'testcom <testcomeb@gmail.com>',
        to: toemail+","+cc+","+bcc,
        subject: 'Submission',
        html: '<div>'+req.body.message+'</div>'
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


app.listen(port, function(){
    console.log("App is running on port "+port);
});
//dev dependencies
const dotenv = require('dotenv').config();
const express = require("express");
const helmet = require("helmet"); 
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const path = require('path');
const fs = require('fs');



//password reset dependencies
const nodemailer = require("nodemailer"); 
const async = require("async")//used to create an async waterfall function for P reset - array of functions 
const crypto = require("crypto"); // built into nodejs - no need to install

//file upload dependencies
const fileUpload = require('express-fileupload'); 
app.use(fileUpload());

const userUploadsFolder = path.join(__dirname, 'userUploads');

//authentication dependencies
const passport = require('passport');

require('./middleware/passport.js')(passport); // require passport file - passport logic is set up in this file and pulled in here
const auth = require('./middleware/auth.js'); // protect routes- gives accest to logged in and admin functions

const flash = require('connect-flash'); // flash messages
const session = require('express-session');  // session management
const cookieParser = require('cookie-parser'); // for session management
var localStorage = require('node-localstorage'); //to handle local storage
const bcrypt = require('bcryptjs'); //salting and hashing passwords

//=========================== MONGODB MODELS =======================================================//
const Story = require('./models/storyModel.js'); //imports the Story Model mongodb                                                                                  
const User = require('./models/userModel.js'); //imports the User Model           

//============================ CONFIGURATION  =======================================================//
app.use(helmet()); //sets security HTTP headers - high in stack to ensure is implemented early
app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(express.static("scripts"));
app.use(express.static("media"));
app.use(express.static("profileImages")); //user uploaded images are saved here - user model on mongo db refernces here for image
app.use(express.static("userUploads")); //User uploads for stories (media panel on editor page)
app.use(express.static("style"));
app.use(bodyParser.urlencoded({extended: true})); //reads data from body
app.use(bodyParser.json()); // parse application/json

app.use(session({ // express session
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize()); //passport middleware
app.use(passport.session());
app.use(flash()); //connect flash

app.use((req, res, next) => { //global vars
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//===============================================================================================//
//                                                                                                                                                                                              //
//                                                             SEARCH BARS                                                                                                               //     
//                                                                                                                                                                                              //
//===============================================================================================//
//==================================== SEARCH STORIES(ADMIN) ===================================================//
app.post('/admin/stories', auth.isLoggedIn, auth.isAdmin, async function (req, res) { //callback request and response - will come back with error or all stories

    var adminUser = req.user;
    userString = JSON.stringify(adminUser);
    var titleSearch = req.body.search;
    var regexTitle = new RegExp(titleSearch, 'i'); // turn search request into regex -i for ignore case - removes case sensitivity

    Story.find( {'title': { $regex: regexTitle } }, function ( err, stories ) {
        if ( err ) {
            return console.error(err);
        } else {

            if ( stories != null ) { // if found stories..
                var storiesJson = JSON.stringify(stories);
                res.render('adminStories', {stories,storiesJson, userString, adminUser}); //send story object and stringified version - object is used for embedding in html, string version for inside script file
            } else {
                res.send(null);
            }
        }
    } )
  }) 

  //==================================== SEARCH USERS(ADMIN) ========================================//
app.post('/admin/users', auth.isLoggedIn, auth.isAdmin, async function (req, res) { //callback request and response - will come back with error or all stories

    var adminUser = req.user;
    userString = JSON.stringify(adminUser);
    
    var search = req.body.search;
    var regex = new RegExp(search, 'i'); // turn search request into regex -'i' removes case sensitivity

    User.find( {'name': { $regex: regex } }, function ( err, users ) {
        if ( err ) {
            return console.error(err);
        } else {
            if ( users != null ) { //if found users
    
                var usersJson = JSON.stringify(users);
                res.render('adminUsers', {users, usersJson, userString, adminUser}); //send story object and stringified version
            } else { // no users found
                res.send(null);
            }
        }
    } )
  }) 

 //==================================== SEARCH STORIES - MAIN GALLERY ===================================================//
app.post('/searchStories', async function (req, res) { //callback request and response - will come back with error or all stories
    
    var topFour = await Story.find( function(error, topFour) { //get all the stories - mongoose function
        if (error) {
            throw err
         
        } else {
            console.log(topFour);
        }
   
    });

    var titleSearch = req.body.search;

    var regexTitle = new RegExp(titleSearch, 'i'); // turn search request into regex -i for ignore case - removes case sensitivity

        Story.find( {'title': { $regex: regexTitle } }, function ( err, stories ) {
            if ( err ) {
                return console.error(err);
                } else {

                    if ( stories != null ) { // if found stories..
    
                        var storiesJson = JSON.stringify(stories);
                        res.render('index', {stories,storiesJson, topFour}); //send story object and stringified version 

                    } else {

                        res.send(null);
                    }
                }
       
        })
  }) 

//===============================================================================================//
//                                                                                                                                                                                              //
//                                                             STORY ROUTES                                                                                                             //     
//                                                                                                                                                                                              //
//===============================================================================================//
//============================================== GET ALL STORIES  =================================================================//
app.get('/', async function (req, res) {

    var topFour; //declare topFour - this will be used for holding the top four stories in future(most likes!) - For now it is a spotlight area for the most recent stories published

    Story.find({"publish": true}).populate("user"). //mongoose function to find all stories but only when  publish set to true
    exec(
        function(err, stories) {

            if(err) {
                console.log("ERROR: ", error);
                res.status(404).json({
                    status: 'Failure :(',
                    error: err
                });

            } else {

                topFour = stories; 

               var storiesJson = JSON.stringify(stories);
               res.render('index', {stories, storiesJson, topFour}); //send story object and stringified version
  
            }
        }
    )
    
});

//===============================================================================================//
//                                                                                                                                                                                              //
//                                                            ADMIN ROUTES                                                                                                             //     
//                                                                                                                                                                                              //
//===============================================================================================//
//==================================== GET ADMIN - DASHBOARD ========================================//
app.get('/admin/dashboard', auth.isLoggedIn, auth.isAdmin, function(req, res) { 

    res.render('adminDashboard'); 
   
});

//==================================== GET ALL STORIES(ADMIN) ========================================//
app.get('/admin/stories', auth.isLoggedIn, auth.isAdmin, function (req, res) { //callback request and response - will come back with error or all stories

    //return users information with stories
     Story.find().populate("user").
     exec(
         function(err, stories) {
             if(err) {
                console.log("ERROR: ", error);
                res.status(404).json({
                    status: 'Failure :(',
                    error: err
                });
                
             } else {
                var storiesJson = JSON.stringify(stories);
                var adminUser = req.user;
                userString = JSON.stringify(adminUser);
                
                res.render('adminStories', {stories, storiesJson, adminUser, userString}); //send story object and stringified version
             }
         }
     )
}) 

//==================================== GET ALL USERS ========================================//
app.get('/admin/users', auth.isLoggedIn, auth.isAdmin, function (req, res) { //callback request and response - will come back with error or all stories

    User.find().populate("story")
    .exec( 
        function(error, users) { //get all the stories - mongoose function
        if (error) {
            console.log("ERROR: ", error);
            res.status(404).json({
                status: 'Failure :(',
                error: err
            });
        } else {
            console.log("Got the stories: ", users);
            var usersJson = JSON.stringify(users);

            var adminUser = req.user;
            userString = JSON.stringify(adminUser);

            res.render('adminUsers', {users, usersJson, adminUser, userString}); //send story object and stringified version
        }
   
    });

}) 
//==================================== DELETE USER BY ID ========================================//
app.get('/users/deleteuser/:id', auth.isLoggedIn, function(req, res) { 
   
    Story.deleteMany({user: req.params.id}, function(error) { //1. delete all stories belonging to user
        if (error) { //2. if err throw error and exit
            console.log("ERROR: ", error);
            res.status(404).json({
                status: 'Failure :(',
                message: "Sorry - Unable to delete User's stories"
            });
        } else { //3. if Stories have successfully been deleted.....then delete User
            User.findByIdAndDelete(req.params.id, function(error) {
                if (error) { //4. if can't delete user throw error and exit
                    console.log("ERROR: ", error);
                    res.status(404).json({
                        status: 'Failure :(',
                        message: "Sorry - Unable to delete User"
                    });
                } else { //5. if successfully deleted User.... then if admin redirect to admin users page OR if user redirect to home page as account has been deleted
                    if (req.user.admin == true) { 
                        res.redirect('/admin/users');
                    } else {
                        res.redirect('/');
                    }
                    
                }
            })

        }
    });

});
//=============================================== ADMIN - DELETE USERS STORY =======================================================================//

app.get('/admin/deletestory/:id', auth.isLoggedIn, function(req, res) { 
    Story.findByIdAndDelete(req.params.id, function(error) {
        if (error) {
            console.log("ERROR: ", error);
            res.status(404).json({
                status: 'Failure :(',
                message: "Sorry - Unable to delete story"
            });
        } else {
                res.redirect('/admin/stories');
        
        }
    })
});

//===============================================================================================//
//                                                                                                                                                                                              //
//                                                            USER'S STORY - ROUTES                                                                                                 //     
//                                                                                                                                                                                              //
//===============================================================================================//

//================================= GET USERS STORIES - DASHBOARD ==================================================//
app.get('/users/dashboard', auth.isLoggedIn, async function(req, res) { 

    var stories = await Story.find({'user': req.user._id}, (err, stories) => {
       
        if (err) {
          throw err
        } 
        var storiesJson = JSON.stringify(stories);
        res.render('dashboard', {user: req.user, stories, storiesJson});    //send users name - to display name on dashboard when logged in
    }); 
   
});

//================================= UPDATE  USERS PROFILE - FILE UPLOAD  ==================================================//
app.post('/editProfile/:id',  auth.isLoggedIn, async function async (req, res) { //callback request and response - will come back with error or all stories
    
    if (!req.files) // 1. if no file uploaded exit and send error
        {
            console.log(res.status(400).json('No files were uploaded.'));
            res.redirect('/users/dashboard');
            
        }

        let sampleFile = req.files.sampleFile; 
        filename = sampleFile.name; 
                
        sampleFile.mv('./profileImages/' + filename, function (err) {
            if (err) { // 3. if error sending file exit and send error
                console.log(res.json({status:status, message:"Sorry - Unable to update", error: errror}));
                res.redirect('/users/dashboard'); 

            } else { 

                user = req.user; //current logged in user
                userid = user.id;
            
                User.findOneAndUpdate({ "_id": userid }, { "$set": { "about": req.body.about, "image": filename}}).exec(function(err, updatedUser){ //mongoose funtion to update multiple field values by id
                    if(err) {
                console.log(res.json({status:status, message:"Sorry - Unable to update", error: errror}));
                    } else {
                        console.log(updatedUser);
                        res.redirect('/users/dashboard');      
                    }
                });
            }
        });

});

//================================= PUBLISH USER STORY - DASHBOARD ==================================================//
// post publish user's story by id
app.post('/users/publish/:id',  auth.isLoggedIn, async function async (req, res) { 

            // 1. finds story by id passed in url param, 2. sets publish value to equal true ... then function will either send an err or complete by redirecting
            Story.findOneAndUpdate({ "_id": req.params.id }, { "$set": { "publish": true}}).exec(function(err, updatedStory){ //mongoose funtion to update multiple field values by id
              
                if(err) {
                  res.send.json({
                      error: err,
                       status: status
                  })

                } else {
                    res.redirect('/users/dashboard');      
                }
             });
     
});
//================================= UN-PUBLISH USER STORY - DASHBOARD ==================================================//
//post to unpublish a story - hide from public gallery
app.post('/users/unpublish/:id',  auth.isLoggedIn, function async (req, res) { 
    //same as above fuction - except this time sets publish to false
    Story.findOneAndUpdate({ "_id": req.params.id }, { "$set": { "publish": false}}).exec(function(err, updatedStory){ //mongoose funtion to update multiple field values by id
        if(err) {
          res.send.json({
              error: err,
               status: status
          })
        } else {

            res.redirect('/users/dashboard');      
        }
     });

});

//================================= UPDATE  STORY IMAGE - EDITOR ==================================================//
app.post('/uploadStoryImage',  auth.isLoggedIn, async function async (req, res) { 
    
    if (!req.files) // 1. if no file uploaded exit and send error
        {
            //need to do popup message here
            console.log(res.status(400).json('No files were uploaded.'));
            res.redirect('/users/dashboard');
            
        }

    let sampleFile = req.files.myFile; 
    filename = sampleFile.name; 
            
    sampleFile.mv('./userUploads/' + filename, function (err) {
        if (err) { // 3. if error sending file exit and send error
            console.log(res.json({status:status, message:"Sorry - Unable to update", error: errror}));
            res.redirect('/users/dashboard'); 
        } else {
            res.send(sampleFile.name); 
        }
    });
});


//================================= GET USERS STORY BY ID ==================================================//
// OPEN USER'S STORY IN STORY EDITOR WINDOW
app.get('/users/stories/:id', auth.isLoggedIn, function (req, res) { //callback request and response - will come back with error or all stories

    Story.findById(req.params.id, function (error, story) {
        if (error) {
            res.status(404).json({ //404 not found - server not found anything matching url given
                status: 'Failure :(',
                message: "Error - no such id"
            });
        } 
        else {

            var user = req.user; //current logged in user
            userString = JSON.stringify(user); 
            processedStoryString = JSON.stringify(story);
            res.render('storyEditor', {processedStoryString, user, userString});

        }

    });    

}) 
//================================= XML HTTP REQUEST - GET MODAL STORY BY ID ==================================================//
// OPEN A STORY INSIDE MODAL WINDOW ON MAIN LANDING PAGE
app.post('/stories', function (req, res) { //callback request and response - will come back with error or all stories

    console.log(req.body.id);
    var id = req.body.id;

    Story.findById(id, function(err, story) {
        if(err) {
            res.status(404).json({ //404 not found - server not found anything matching url given
                status: 'Failure :(',
                message: "Error - no such id"
            });
        } else {
            res.send(story);
        }
    })

}) 

//================================= CREATE A NEW USER STORY  ========================================//
// post create a new story
app.post('/users/createnewstory', auth.isLoggedIn,  function (req, res) {

    var user = req.user;

    var newStory = new Story (
        {
            user : user._id,
            title: "Once Upon a Time...",
            synopsis: "Our story begins in a.....",
            chapters : [
                {
                    scenes : [
                        {
                            title: "New Scene",
                            image: "_placeholder.png",
                            description:  "Please enter a description....,",
                            prompt: "Please enter a prompt for the reader.....",
                            choices: [
                                {
                                    text : "Choice",
                                    targetChapter : 0,
                                    targetScene : 0
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    );

    newStory
    .save()
    .then(
        saveResult => {
            user.story.push(saveResult._id);
            user.save((error, story) => {
                if(error) {
                    throw error;
                }
            })
            console.log(user);
            console.log(saveResult);
            res.redirect('/users/stories/' + saveResult._id); //redirect to user/stories/:id
        }
    )
    .catch(
        err => {
            console.log(err)
        }
    );

});

//=================== PUT(REPLACE ENTIRE USER STORY =====================================================//
// WORKING XML HTTP REQUEST 
app.put('/saveJson', auth.isLoggedIn,  async function (req, res) { //save story with xmlhttp request
    Story.findByIdAndUpdate( req.body._id, req.body,{new: true, runValidators: true}, function (error, story) {
        if (error) {
            res.status(400).json({ 
                status: 'Failure :(',
                message: 'Invalid data sent'
            })
        } else {     
            console.log(story);
            res.status(200).json({ 
                status: 'Success :)',
                message: 'Story Saved Yippeee'
            })
        }
    })  
});

//=============================================== DELETE USER'S STORY =======================================================================//

app.get('/users/deletestory/:id', auth.isLoggedIn, function(req, res) { 
    Story.findByIdAndDelete(req.params.id, function(error) {
        if (error) {
            console.log("ERROR: ", error);
            res.status(404).json({
                status: 'Failure :(',
                message: "Sorry - Unable to delete story"
            });
        } else {
                res.redirect('/users/dashboard');
   
        }
    })
});

//===============================================================================================//
//                                                                                                                                                                                              //
//                                                             PASSWORD RESET                                                                                                         //
//                                                                                                                                                                                              //     
//                adapted from this tutorial: https://www.youtube.com/watch?v=UV9FvlTySGg                                                                       //
//===============================================================================================//
//get forgot page
app.get('/forgot', function(req, res) {
    res.render('forgot');
});
// post forgot form
app.post('/forgot', function(req, res, next) {

    async.waterfall([  //array of functions that get called one after another

        function (done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('Hex'); //token created is sent in url to users email address
                done(err, token);
            });            
        }, 
        //token is passed to next function
        function(token, done) {

            User.findOne({email: req.body.email}, function(err, user){ //mongoose func - finds user by their email address

                if(!user) { //if no email match found

                    req.flash('error', 'That email account is not registered with us'); //flash error message
                    return res.redirect("/forgot"); //ends function and reloads forgot page
                }
                    user.resetToken = token; // if there is a email match - set user resetToken field to var token(assigned above)
                    user.resetTokenExpire = Date.now() + 36000000; // expires in 1 hour (6 zerors is an in hour in ml secs)

                    user.save(function(err){ //save user with updated details
                    
                        done(err, token, user);

                    });
            });
        },
        //send email to user
        function(token, user, done) {

            console.log('makin tokens');

            //gmail transport
            var smtpTransport = nodemailer.createTransport({ //nodemailer function 

                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_ACOUNT,
                    pass: process.env.EMAIL_PASSWORD
                },

                tls: {
                    rejectUnauthorized: false
                }
            });

            var mailOptions = {

                to: user.email,
                from: process.env.EMAIL_ACOUNT,
                subject: 'Story Mountain Password Reset',
                text: 'You asked to reset your password.' + '\n\nhttp://' + req.headers.host + '/reset/' + token + '\n\n' + //req.headers - host address
                        'If you did not request this, please ignore this and your password will remain unchanged'
            };

            smtpTransport.sendMail(mailOptions, function(err) { //send the mail - pass in mailOptions var created above as paramS
                
                req.flash('success', 'An email has been sent to' + user.email + 'with further instructions');
                done(err, 'done');

            });
        }
    ],

    function(err) {

        if (err) return next(err);
        res.redirect('/forgot'); //if no err redirect to forgot and flash message appears

    }); 

});

// get reset page
app.get('/reset/:token', function(req, res) {
    User.findOne({resetToken: req.params.token, resetTokenExpire: {$gt: Date.now() } }, function(err, user) { //find user with match to reset token, check token expiration and ensure greater than date.now
        
        if(!user) { // if no user matching the conditions
            
            req.flash('error', 'password reset token is invalid or has expired.');
            return res.redirect("/forgot"); //exit from function and redirect back to forgot
        
        }
        
        res.render('reset', {token: req.params.token}); //if all okay - token sent as param and used in form action
    
    } );
});

//post reset form
app.post('/reset/:token', function(req, res) { //new password enter and confirm function 
    
    async.waterfall([
        
        function(done) {
            User.findOne({ resetToken: req.params.token, resetTokenExpire: {$gt: Date.now() } }, function(err, user) { //find user with match to reset token, check token expiration and ensure greater than date.now
                
                if (!user) { //if no match
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                } 
                
                if(req.body.password === req.body.confirm){
                    bcrypt.genSalt(10, function (err, salt) {  //salt passwords at 10(defalt val)
                        bcrypt.hash(req.body.password, salt, (err, hash) => { //then hash
                            if (err) 
                            throw err;
                            user.password = hash;
                            user.resetToken = undefined; // now need to get rid of the token and expiration  from user model as don't need them anymore
                            user.resetTokenExpire = undefined;
                            user.save() //then save
                                .then(user => {
                                    done(err, user);
                                }).catch(err => console.log(err));
                        });
                    });
                    
                } else {
                    req.flash("error", "Passwords do not match."); // if passwords don't match flash message
                    return res.redirect('back');
                }               
                
            } );
        },

        function(user, done) {

            var smtpTransport = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_ACOUNT,
                    pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            var mailOptions = {
                to: user.email,
                from: process.env.EMAIL_ACOUNT,
                subject: 'Story Mountain Your password has been changed',
                text: 'Hey '  + user.name + ', \n\n' + //req.headers - host address
                        'This is confirmation that your password for the account ' + user.email + ' has just been changed!'
            };

            smtpTransport.sendMail(mailOptions, function(err) { //send the mail - pass in mailOptions var created above as paramS
                console.log('Sent mail to confirm password change');
                req.flash('success', 'success your password has been changed :)');
                done(err, 'done');
            });
        }
    ], 
    
    function(err) {
    res.redirect('/users/login');
    });

});

//===============================================================================================//
//                                                                                                                                                                                              //
//                                                             REGISTER ROUTES                                                                                                         //     
//  Passport  set up with mongoose adapted from this tutorial : https://www.youtube.com/watch?v=6FOq4cUdH8k                                       //
//===============================================================================================//
// get register page
app.get('/users/register', (req, res) => res.render('register'));

// post register form
app.post('/users/register', (req, res) => {

    const errors = []; //any errors are pushed here and displayed top of form when user selects submit

    const { name, email, password, password2 } = req.body; //create new user object

    //using html5 validation but this will protect the database further
    if (!name || !email || !password || !password2) {  // if nothing entered

        errors.push({ msg: 'Please enter all fields' });
    }
    if (password != password2) { // if passwords don't match

        errors.push({ msg: 'Passwords do not match' });
    }
    if (password.length < 6) { // password must be 6 char min

        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (errors.length > 0) { // if no errors in errors array

        res.render('register', {errors,name,email,password,password2});

    } else {

        User.findOne({ email: email }).then(user => { //mongoose function - checks database for email entered
            if (user) {

                errors.push({ msg: 'Email already exists' }); // if email found in database push err message
                res.render('register', { errors, name, email, password, password2}); 

            } else {
                
                const newUser = new User({ name, email, password });
            
                bcrypt.genSalt(10, function (err, salt) {  //salt passwords at 10(defalt val)

                    bcrypt.hash(newUser.password, salt, (err, hash) => { //then hash
                        if (err) 
                        throw err;
                        newUser.password = hash; //new users password field is equal to the hashed version
                        newUser.save() //then save the new user
                            .then(user => {  
                                req.flash('success_msg', 'You are now registered - Please log in :)'); //flash message is stored in session
                            res.redirect('/users/login'); // new user is redirected to log in area
                         }).catch(err => console.log(err)); // else error
                    });
                });
            }
        });
    }
});
//===============================================================================================//
//                                                                                                                                                                                              //
//                                                             LOGIN ROUTES                                                                                                            //     
//                                                                                                                                                                                              //
//===============================================================================================//

// get login page
app.get('/users/login', function(req, res) {
    res.render('login');
});

// post login form
app.post('/users/login', passport.authenticate('local', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    function(req, res) {
        console.log("HELLO");
    
        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
          req.session.cookie.expires = false;
        }
    res.redirect('/');
    });


// get logout
app.get('/users/logout', function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out!');
    res.redirect('/');
});

//============================ SENDS USER UPLOADS TO  STORY EDITOR ===================================================//
//get user uploads for story
app.post('/getMedia', (req, res) => { 

    fs.readdir(userUploadsFolder, function (err, files) {

        if (err) {  //handling error
            return console.log('Cant get images!=================' + err);
        } 

        var fileNames = []; //declare array to hold filenames
        
        files.forEach(function (file) { //listing all files using forEach
            console.log(file);
            fileNames.push(file); // push files into filenames array
        });

        res.send(JSON.stringify(fileNames));

    });
});

//========================= MONGOOSE DATABASE CONNECTION SETUP =================================================//
const DB = process.env.DB;//pulls in the DB variable from .env file
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,  
}).then(() => console.log('DB CONNECTION SUCCESSFUL!'))
  .catch(err => console.error('DB CONNECTION ERROR!', err));
//========================= END MONGOOSE===================================================================//

//========================= START THE SERVER =================================================================//
const port = process.env.PORT;//pulls in the PORT variable from .env file
app.listen(port, () =>{
    console.log(`App running on port ${port}......`);
});
//========================= END SERVER =====================================================================//



























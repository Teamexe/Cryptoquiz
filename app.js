const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const crypto = require('crypto')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
              require('dotenv').config()
const csrf = require('csurf')
const mongoStore = require('connect-mongodb-session')(session)
const socketio = require('socket.io')
const hash = require('object-hash');
const axios = require('axios').default;

const csrfProtection = csrf({cookie:true});

const app = express();

//Models
const Player = require("./models/Player")(mongoose);

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_USER_PASSWORD}@cluster0.ezyqv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

const store = new mongoStore({
    uri: MONGO_URI,
    collection: process.env.SESSION_STORE
})

app.set('view engine','ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret:process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    store:store
}))
app.use(flash());
app.use(csrfProtection);

const mailer = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    pool:true,
    maxMessages: 10000,
    auth:{
        user: process.env.MAILER,
        pass:process.env.MAILER_PASS,
    }
})

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{console.log("DB connected")}).catch(err=>console.log(err));

//Get requests
app.get("/",(req,res)=>{
    res.render('index',{
        isAuthenticated: req.session.isLoggedIn, 
        name: req.session.player, 
        csrfToken: req.csrfToken()
    })
})

app.get("/login",(req,res)=>{
    res.render("login",{
        reg:req.flash('error'),
        success:req.flash('success'),
        loginFirst: req.flash('error3'),
        csrfToken: req.csrfToken()
    })
})

app.get("/register",(req,res)=>{
    res.render("register",{csrfToken: req.csrfToken(), error: req.flash('nithid')})
})

app.get("/quiz",(req,res)=>{
    //Set time accordingly
    if(Date.now()< new Date("2021-04-04T22:01:00")){
        res.render('notStarted');
    }
    else{
        if(req.session.isLoggedIn){
            res.render("quiz",{
                name:req.session.player.playerName,
                identity:req.session.player.email,
                csrfToken: req.csrfToken()
            });
        }
        else{
            req.flash('error3','Please login first');
            res.redirect('/login');
        }
    }
})

//Post   requests

app.post('/login', (req,res)=>{
   Player.findOne({email: req.body.email})
   .then((User)=>{
        if(User){
            if(User.verified){
                bcrypt.compare(req.body.password, User.password)
                .then((result)=>{
                    if(!result){
                        req.flash('error', 'Incorrect password')
                        res.redirect('/login')
                    }else{
                        req.session.isLoggedIn = true;
                        req.session.player = User;
                        res.redirect('/');
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
            }else{
                req.flash('error', 'Email not verified')
                res.redirect('/login')
            }
        }else{
            req.flash('error', 'No user with such email exists')
            res.redirect('/login')
        }
   })
   .catch((err)=>{
       console.log(err)
   })
})

app.post('/register', (req,res)=>{
    let arr = req.body.email.split('@')
    if(arr[1]=='nith.ac.in'){
        Player.findOne({email:req.body.email})
        .then((foundUser)=>{
            if(foundUser){
                 req.flash('error','You are already registered! Please Login')
                 res.redirect('/login')
            }
            else{
                bcrypt.hash(req.body.password,10)
                .then(hashedPassword=>{
                    crypto.randomBytes(32,(err,buffer)=>{
                        if(!err){
                            let token = buffer.toString('hex');
                            let newPlayer = new Player({
                                email: req.body.email,
                                password: hashedPassword,
                                playerName: req.body.playerName,
                                verified: false,
                                token: token,
                                tokenExpirationDate: Date.now() + 3600000,
                                points:0 
                            })
                            newPlayer.save()
                            .then(()=>{
                                req.flash('success','Please click the link in the your email inbox to verify your account');
                                res.redirect('/login')
                                axios.post(process.env.ENDPOINT, {
                                    email: req.body.email,
                                    message: `<p>Get ready for a mathematical roller coaster ride as Team .Exe brings to you Crytoquiz, 
                                    an online event to test both your speed and accuracy. There's something more, 
                                    the quiz is hosted on a decentralised website and only the quickest submission will
                                    make its place on the CryptoBoard. So tighten up your belts, and race your brain for the solution hunt!</p>

                                    <p>We are glad you're here </p>
                                    <p>To verify your account click here: 
                                    <p><a href = 'http://teamexe.cryptoquiz.tech:3000/verify/${token}'> Verify your account</a>
                                    `
                                })
                                    .then( response=> {
                                        console.log(response);
                                    })
                                    .catch( error=> {
                                        console.log(error);
                                    })
                            })
                            .catch((err)=>{
                                console.log(err)
                                res.redirect('/')
                            })
                        }
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }else{
        req.flash('nithid','Use your nith id');
        res.redirect('/register')
    }
})

app.post("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(!err){
            res.redirect('/');
        }
    })
})

//Email verification:
app.get('/verify/:token',(req,res)=>{
    let token = req.params.token;
    Player.findOne({token:token})
    .then((User)=>{
        if(User){
            User.verified = true;
            User.save()
            .then(()=>{
                res.render('verification');
            })
            .catch((err)=>{
                console.log(err);
            })
        }else{
            res.send("No account with this mail to be verified")
        }
    })
    .catch(err=>{
        console.log(err);
    })
})


const port = process.env.PORT || 3000

const server = app.listen(port,()=>{
    console.log(`App listening at ${port}`);
})

numbers = [0,1,2,3]; //Initially display first four questions. Later change to question Numbers which are currently live in the quiz

let roundNumber = 0;
let index = 0;

//Socket io logic
const io = socketio(server);
const Question = require('./models/Question')(mongoose)
const BlockModel = require('./models/blockModel')(mongoose)

io.on('connect',socket=>{
    console.log("Connection made");

    renderQuestions = (questionNumbers)=>{
        Question.find({quesNo:{$in:questionNumbers}})
        .then((data)=>{
            console.log(data)
            if(data.length==4){
                const myObj = {
                    ques1:{ques: data[0].ques, title: data[0].title},
                    ques2:{ques: data[1].ques, title: data[1].title},
                    ques3:{ques: data[2].ques, title: data[2].title},
                    ques4:{ques: data[3].ques, title: data[3].title},
                    roundNumber,
                }
                io.emit('question',myObj);
            }
            else{
                roundNumber = -1;
                numbers = null;
                const obj = {
                    ques1:{ques: null, title: null},
                    ques2:{ques: null, title: null},
                    ques3:{ques: null, title: null},
                    ques4:{ques: null, title: null},
                    roundNumber:-1
                }
                io.emit('question',obj);
                io.emit('finish', true);
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
    console.log(numbers);
    renderQuestions(numbers);
    //Listening for answers
    socket.on('answer',data=>{
        let answers = data.answer.split(' '); 
        //Check if the player sends an empty string or a string which doesnt have all four answers
        if(answers.length<4){
            socket.emit("Submission",false);
        }
        else{
            answers = answers.map(x=> x = parseInt(x))
            if(numbers!=null){
                Question.find({quesNo:{$in:numbers}}) //check to see if further questions dont exist
                .then((foundAnswers)=>{
                    if(foundAnswers.length>0){
                        let flag = true;
                        for(var i=0;i<foundAnswers.length;i++){
                            if(foundAnswers[i].ans!=answers[i]){
                                flag = false;
                            }
                        }
                        if(flag){
                            numbers = numbers.map(x=> x+=4)
                            roundNumber++;
                            index++;
                            console.log(numbers);
                            renderQuestions(numbers);
                            Player.findOne({email:data.identity})
                            .then((foundUser)=>{
                                if(foundUser){
                                    foundUser.points+=50;
                                    foundUser.save()
                                    .then(()=>{
                                        // prompt him saying correct answer and prompt others saying someone else submitted
                                        socket.emit('Submission',true);
                                        socket.broadcast.emit('elseSubmission');
                                        BlockModel.find({}).sort({ _id: -1 }).limit(1)
                                        .then((prevBlock)=>{
                                            let prevHash;
                                            if(prevBlock.length>0){
                                                prevHash = prevBlock[0].hash;
                                            }
                                            else{
                                                prevHash = null;
                                            }
                                            let newBlockObject = {
                                                index:index,
                                                name:foundUser.playerName,
                                                timeStamp:Date.now(),
                                                email:foundUser.email,
                                                points:foundUser.points, 
                                                prevHash: prevHash,
                                            }
                                            newBlockObject.hash = hash(newBlockObject);
                                            let newBlock = new BlockModel(newBlockObject);
                                            newBlock.save()
                                            .then(()=>{
                                                console.log('Blockchain saved');
                                            })
                                            .catch(err=>{
                                                console.log(err);
                                            })
                                        })
                                        .catch((err)=>{
                                            console.log(err)
                                        })
                                    })
                                    .catch(err=>{
                                        console.log(err)
                                    })
                                }
                                else{
                                    //User not found who gave the correct submission
                                }
                            })
                            .catch(err=> console.log(err))
                        }
                        else{
                            socket.emit('Submission',false);
                        }
                    }
                    else{
                        //We didn't find questions
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
            }
            else{
                console.log('Numbers is null');
                roundNumber = -1;
                io.emit('finish', true);
            }
        }
    })
})


app.get("/developers",(req,res)=>{
    res.render("developers",{
        name:req.session.player.playerName,
        identity:req.session.player.email,
        csrfToken: req.csrfToken()
    });
});
app.get("/cryptoboard",(req,res)=>{
    if(Date.now()< new Date("2021-04-04T22:01:00")){
        res.render('notStarted');
    }
    else{
        BlockModel.find({})
            .then((result)=>{
                res.render("leaderboard",{
                    name:req.session.player.playerName,
                    identity:req.session.player.email,
                    csrfToken: req.csrfToken(),
                    answer: result
                });
            })
            .catch(err=>{
                console.log(err)
            })
    }
});

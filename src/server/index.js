import express from 'express';
import session from 'express-session';
// import bodyParser from 'body-parser';
import apiRouter from './routers/apiRouter';

import crypto from 'crypto';
import base64url from 'base64-url';

import nodemailer from 'nodemailer';
import config from '../../config.json';

const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: config.mail.user,
        pass: config.mail.pass
    }
});

const app = express();

var loginTokens = [];

app.use(session({
    secret: config.session.secret,
    name : 'sessionId',
    resave: false,
    saveUninitialized: true
}))

app.set('port', process.env.PORT || 3000);
// app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', apiRouter);


app.get('/', (req, res) => {
    res.send(
        `
        <h1>hello</h1>
        <a href="/login">Login</a> 
        <a href="/api">Api</a>
        `
    );
})

function randBase64UrlString(size) {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(size, (err, buffer) => {
            if (err) reject(err);
            resolve(base64url.encode(buffer));
        });
    })
}

app.get('/login', (req, res, next) => {
    res.send('');
})

app.get('/logout', function(req, res){
    req.session.destroy(function(){
        res.redirect('/');
    });
});

function sendMail(to, opts = {}) {
    const {subject='', text='', html=''} = opts;

    const mailOptions = {
        from: '덕성 <stuzeakd@gmail.com>',
        to,
        subject,
        text,
        html,
    };

    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailOptions, (err, res) => {
            if (err) reject(err);
            smtpTransport.close();
            resolve(res);
        });     
    })

}

app.post('/email', (req, res) => {
    console.log('/email');
    var email = req.query.email;
    if (!email) next();

    randBase64UrlString(24)
    .then((token) => {
        loginTokens.push({email,token})
        console.log(loginTokens);
        const sendMailOpts = {
            subject: 'kaldi login',
            text: 'hey',
            html: `<p>
            <a href='http://localhost:3000/callback/email?token=${token}'>
                http://localhost:3000/callback/email?token=${token}
            </a>
            </p>`,
        }
        return sendMail(email, sendMailOpts)
    })
    .then((result) => {
        res.sendStatus(200);
    })
})

app.get('/callback/email', (req, res) => {
    console.log('/callback/email');
    var token = req.query['token']
    if (!token) res.redirect('/');
    var tokenIdx = loginTokens.findIndex(elem => {
        console.log(elem, token)
        return elem.token === token;
    });
    console.log(loginTokens, tokenIdx);

    if (tokenIdx < 0) {
        res.redirect('/');
    } else {
        loginTokens.splice(tokenIdx, 1)
        req.session.regenerate(() => {
            req.session.user = 'kk';
            res.redirect('/');
        })
    }
})

export default app;
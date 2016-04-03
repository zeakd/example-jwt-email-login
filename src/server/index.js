import express from 'express';
import session from 'express-session';
// import bodyParser from 'body-parser';
import apiRouter from './routers/apiRouter';

import crypto from 'crypto';
import base64url from 'base64-url';


const app = express();

var loginTokens = [];
 
app.use(session({
    secret: 'secret',
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
    randBase64UrlString(24)
        .then((token) => {
            loginTokens.push(token)
            res.send(
                `
                <a href="/callback/email?token=${token}">${token}</a>
                `
            )
        })
        .catch(next)
})

app.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/callback/email', (req, res) => {
    var token = req.query['token']
    if (!token) res.redirect('/');
    var tokenIdx = loginTokens.indexOf(token);
    if (tokenIdx < 0) {
        res.redirect('/login');
    } else {
        loginTokens.splice(tokenIdx, 1)
        req.session.regenerate(() => {
            req.session.user = 'kk';
            res.redirect('/');
        })
    }
})

export default app;
const authRouter = require("./auth/auth-router.js");
const usersRouter = require("./users/users-router.js");
const session = require('express-session');
const Store = require('connect-session-knex')(session)
const express = require('express')
const server = express();


server.use(express.json());


server.use(session({
    name: 'chocolatechip',
    secret: process.env.SESSION_SECRET || 'keep it secret',
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, 
      httpOnly: false 
    },
    resave: false, 
    saveUninitialized: false, 
    rolling: true, 
    store: new Store({
      knex: require('../data/db-config'),
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 60,
    })
}));


server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.use((err, req, res, next) => { // eslint-disable-line
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    });
  });

  module.exports = server;
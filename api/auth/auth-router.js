const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const Users = require('../users/users-model')
const{
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware')




router.post('/register',checkUsernameFree,checkPasswordLength,  async (req, res, next) => {
    try {
      const { username, password } = req.body
      const newUser = {
        username,
        password: bcrypt.hashSync(password, 10),
      }
      const created = await Users.add(newUser)
      res.status(201).json({username: created.username, user_id: created.user_id})
    } catch (err) {
      next(err)
    }
})


router.post('/login', checkUsernameExists, async (req, res, next) => {
    try {
      
      const { username, password } = req.body
      const [userFromDb] = await Users.findBy({ username })
      
      const verifies = bcrypt.compareSync(password, userFromDb.password)
      if (verifies === false) {
        return res.status(401).json({message: 'Invalid credentials'})
      }else
      req.session.user = userFromDb
      res.status(200).json({message: `Welcome ${username}`})
    } catch (err) {
      next(err)
    }
})


router.get('/logout', async (req, res, next) => {
    try {
      if (req.session.user) {
        req.session.destroy((err) => {
          if (err) {
            res.status(500).json('unknown error')
          } else {
            res.status(200).json({message:"logged out"})
          }
        })
      } else {
        res.status(200).json({message:"no session"})
      }
    } catch (err) {
      next(err)
    }
})

module.exports = router
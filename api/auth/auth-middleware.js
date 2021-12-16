const Users = require('../users/users-model')


function restricted(req, res, next) {
  
    if (req.session.user) {
      
      next()
    } else {
      next(res.status(401).json({message: "You shall not pass!"}))
    }
}


async function checkUsernameFree(req, res, next) {
    try{
        const users = await Users.findBy({username: req.body.username})
        if (!users.length){
        next()
        }else {
        next({ status: 422, message: 'Username taken'})
        }
    }catch (err){
        next(err)
  }
}


async function checkUsernameExists(req ,res, next) {
    try{ 
      const users = await Users.findBy({username: req.body.username})
    if (users.length){
      next()
    }else{
      next({ status: 401, message: 'Invalid credentials'})
    }
   }catch (err) {
    next(err)
 }
}


function checkPasswordLength(req, res, next) {

  const pass = req.body.password
  if (!pass || pass.length <= 3){
    next(res.status(422).json({ message : "Password must be longer than 3 chars"}))
  }else {
    next()
  }
}


module.exports = {
    checkUsernameFree,
    restricted,
    checkUsernameExists,
    checkPasswordLength
  }
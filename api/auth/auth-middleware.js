const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')

function restricted(req, res, next) {
  
    if (req.session.user) {
      
      next()
    } else {
      res.status(401).json({message: "You shall not pass!"})
    }
}


async function checkSubmission(req ,res, next) {
    try{ 
        let users = []
        let pass 
      if(req.body.password){
         pass = req.body.password
        if (pass.length <= 3){
          next({status:422, message:"Password must be longer than 3 chars"})
    
        }else if (!req.body.username){
          next({status:422, message:'You must have a username'})
        }else{
          users = await Users.findBy({username: req.body.username})
          if (!users.length){
            next()
          }else{
            next({status:403, message: 'That name is already taken'})
          }
        }
      }else{
        next({status:422, message:'You must have a password'})
      } 
      
   }catch (err) {
    next(err)
 }
}

async function checkLogin (req ,res, next){
  try{
      
      if(!req.body.username || !req.body.password){
        next({status:400, message:'invalid request - make sure all fields are there'})

      }else{
        const [userFromDb] = await Users.findBy({username: req.body.username})
        if(!userFromDb){
          next({status:404, message:'user not found'})
  
        }else if(bcrypt.compareSync(req.body.password, userFromDb.password)){
          req.session.user = userFromDb
          next()
        }else{
          next({status:400, message:'Invalid credentials'})
        }
      }
  }catch(err){
    next(err)
  }
}


module.exports = {
    restricted,
    checkLogin,
    checkSubmission
  }
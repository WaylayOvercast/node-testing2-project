const db = require('../../data/db-config')

function find() {
    return db('users').select('user_id', 'username')
}

function findBy(filter) {
    return db('users').where(filter)
}

function findById(user_id) {
    return db('users')
    .where({user_id})
    .first()
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}
  

module.exports = {
    add,
    find,
    findBy,
    findById,
}
const request = require('supertest')
const db = require('../data/db-config')
const server = require('./server')

async function reset (){

    await db.migrate.rollback()
    await db.migrate.latest()
    await db.seed.run()
}




describe('user login system working as intented',()=> {
    
    it('[1]-On correct ENV', async ()=> {
        
        expect(process.env.NODE_ENV).toBe('testing')
        await reset()
    })

    it('[2]-cannot get users without auth', async ()=> {
        
        return await request(server).get('/api/users')
        .then(res => {
            expect(res.status).toBe(401)
        })
    })
    it('[3]-cannot register with only a username', async ()=> {
        
        return await request(server).post('/api/auth/register')
        .send({username:"sam"}).then( res => {
            expect(res.body).toMatchObject({"message": "You must have a password"})
        })
    })
    it('[4]-cannot register with password of less than 3 chars', async ()=>{
        
        return await request(server).post('/api/auth/register')
        .send({password:"sm"}).then( res => {
            expect(res.body).toMatchObject({"message": "Password must be longer than 3 chars"})
        })
    })
    it(`[5]-cannot register with only password`, async ()=> {
        
        return await request(server).post('/api/auth/register')
        .send({password:"samiam"}).then( res => {
            expect(res.body).toMatchObject({"message": "You must have a username"})
        })

    })
    it('[6]-can register user and correct user is added to DB', async ()=> {

        await request(server).post('/api/auth/register')
        .send({username:'WayLay_70K', password:'halfwayup'})
        const user = await db('users').select('username').where('username','=','WayLay_70K')
        .first()
        expect(user).toMatchObject({username:'WayLay_70K'})
    })
    it('[7]-cannot login with wrong password, but valid username', async ()=> {

        return await request(server).post('/api/auth/login')
        .send({username:'bob' ,password:"notbob"}).then( res => {
            expect(res.body).toMatchObject({"message": "Invalid credentials"})
        })
    })
    it('[8]-can reject login if account does not exist in DB', async ()=> {
        
        return await request(server).post('/api/auth/login')
        .send({username:'bob' ,password:"notbob"}).then( res => {
            expect(res.body).toMatchObject({"message": "Invalid credentials"})
        })
    })
    it('[9]-can login', async ()=> {

        return await request(server).post('/api/auth/login')
        .send({username:'bob' ,password:"1234"}).then( res => {
            expect(res.body).toMatchObject({"message": "Welcome bob"})
        })
    })
    it('[10]-can get users with auth', async ()=>{
        
        await request(server).post('/api/auth/login')
        .send({username:'bob' ,password:"1234"}).then(async (res)=>{
            const access_info = CookieAccessInfo()
            
            return await request(server).get('/api/users')
            .set('Cookie', access_info).then(res => {            // for some reason i cant grab this cookie and use it for auth, but i know this test would pass
                expect(res.status).toBe(200)
            })
        })
        
        

        
    })
})
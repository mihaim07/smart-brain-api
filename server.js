const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

/*db.select('*').from('users').then(data => {
	console.log(data);
});*/

const app = express();
app.use(express.json());
app.use(cors());



app.get('/', (req, res) => {
	res.send('succes');
});

app.post('/signin', (req,res) => { signin.handleSignin(req, res, db, bcrypt)} )

app.post('/register', (req,res) => register.handleRegister(req, res, db, bcrypt))

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

app.put('/image',  image.handleImage(db))

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})



// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });
const PORT = process.env.PORT
app.listen(PORT || 3000, () => {
	console.log(`Server is listening on port ${PORT}`);
});

/*
/ --> res = this is working
/signin --> POST = succes/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
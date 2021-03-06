const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '123',
    database : 'smartbrain'
  }
});

db.select('*').from('users').then(data => {
	console.log(data);
});

const app = express();
app.use(express.json());
app.use(cors());

const database = {
	users: [
		{
			id:'123',
			name:'John',
			password: 'cookies',
			email: 'john@gmail.com',
			entries: 0,
			joined: new Date()
		},
		{
			id:'124',
			name:'Sally',
			password: 'bananas',
			email: 'sally@gmail.com',
			entries: 0,
			joined: new Date()
		}
	]/*,
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]*/
}

app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/signin', (req, res) => {
		// Load hash from your password DB.
	/*bcrypt.compare("apples", '$2a$10$ptSRjp4MSfD6tvHLDEZvuOqDi7pEq/afz8OX7X.n4kbx043NMvhIe' , function(err, res) {
	    console.log('first guess',  res)
	});
	bcrypt.compare("veggies", '$2a$10$ptSRjp4MSfD6tvHLDEZvuOqDi7pEq/afz8OX7X.n4kbx043NMvhIe' , function(err, res) {
	    console.log('second guess',  res)
	});*/
	console.log(req.body.email, req.body.password)
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in')
	}
})

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;
	/*bcrypt.hash("bacon", null, null, function(err, hash) {
    	console.log(hash);
	});*/
	db('users')
	.returning('*')
	.insert({
		email: email,
		name: name,
		joined: new Date()
	})
	.then(user => {
		res.json(user[0]);
	})
	.catch(err => res.status(400).json('unable to register')) 
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			return res.json(user);
		} 
	})
	if (!found){
		res.status(404).json('not found')
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		} 
	})
	if (!found){
		res.status(400).json('not found')
	}
})



// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3003, () => {
	console.log('app is sssrunning on port 3003');
});

/*
/ --> res = this is working
/signin --> POST = succes/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
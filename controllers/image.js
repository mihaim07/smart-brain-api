const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '44cdf8e519e24b83a33803ff7a0d8ce5'
});

const handleApiCall = (req, res) => {
	app.models
		.predict("d02b4508df58432fbb84e800597b8959", req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = ( db) => (req, res) => {
	const { id } = req.body;
	/*let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		} 
	})
	if (!found){
		res.status(400).json('not found')
	}*/
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
}
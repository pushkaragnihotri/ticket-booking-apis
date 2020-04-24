const mongoose = require('mongoose')
const { Schema } = mongoose

const MovieSchema = new Schema({
	name: {
		type: String,
		required: [true, ' movie name is required'],
		unique: true,
	},
	releaseDate: {
		type: String,
		required: [true, 'release date is required'],
	},
	genre: String,
	languages: String,
	synopsis: String,
	duration: String,
})

module.exports = mongoose.model('movies', MovieSchema)

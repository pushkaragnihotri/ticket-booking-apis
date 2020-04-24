const mongoose = require('mongoose')
const { Schema } = mongoose

const TheatreSchema = new Schema({
	name: {
		type: String,
		required: [true, ' theatre name is required'],
		unique: true,
	},
	address: {
		type: String,
		required: [true, 'address is required'],
	},
	city: {
		type: String,
		required: [true, 'city name is required'],
	},
	pincode: {
		type: Number,
		required: [true, 'pincode is required'],
	},
})

module.exports = mongoose.model('theatres', TheatreSchema)

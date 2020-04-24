const mongoose = require('mongoose')
const { Schema } = mongoose

const ScreenSchema = new Schema({
	name: String,
	noOfSeats: {
		type: Number,
		default: 50,
	},
	theatreId: String,
	// {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'theatres',
	// },
})

module.exports = mongoose.model('screens', ScreenSchema)

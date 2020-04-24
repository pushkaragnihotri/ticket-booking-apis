const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const MappingSchema = new Schema({
	theatreId: {
		type: ObjectId,
		ref: 'theatres',
	},
	movieId: {
		type: ObjectId,
		ref: 'movies',
	},
	screenId: {
		type: ObjectId,
		ref: 'screens',
	},
	slot: [
		{
			startTime: String,
			endTime: String,
			totalseat: {
				type: Number,
				default: 50,
			},
			bookedSeats: {
				type: Number,
				default: 0,
			},
		},
	],
})

module.exports = mongoose.model('mappings', MappingSchema)

const MovieModel = require('./../models/movie.model')
const TheatreModel = require('./../models/theatre.model')
const ScreenModel = require('./../models/screen.model')
const MappingModel = require('./../models/mapping.model')
const config = require('../../common/config/env.config')

// adding movies to movie model done by admin
exports.addMovie = async (req, res) => {
	try {
		const addedMovie = await MovieModel.create(req.body)
		return res.status(201).json({
			status: 'success',
			data: {
				message: 'new movie added successfully!',
				addedMovie,
			},
		})
	} catch (err) {
		return res.status(400).json({
			status: 'failed',
			message: err.message,
		})
	}
}

// adding Theatre to theatre model done by admin
// input-description : each theatre will be having multiple screens so adding screens in screen model here only.
// -> each screen is having fixed number of seats which is 50
exports.addTheatre = async (req, res) => {
	try {
		const newTheatre = req.body.theatre
		const newScreens = req.body.screen
		const createdTheatre = await TheatreModel.create(newTheatre)
		const createdScreens = await newScreens.map(async screen => {
			await ScreenModel.create({ ...screen, theatreId: createdTheatre._id })
		})
		res.status(201).json({
			status: 'success',
			data: {
				message: 'Theatre and screens got added successfully!',
				createdTheatre,
				// createdScreens,
			},
		})
	} catch (err) {
		res.status(400).json({
			status: 'failed',
			message: err.message,
		})
	}
}

// assignment of movies in theatre done by admin in Mapping model
// Input-description: -> To movie in a theatre theatreId, movieId, screenId and slots are needed.
// -> and assign all of them to Mapping model.
exports.assignMovies = async (req, res) => {
	try {
		const movieAssigned = await MappingModel.insertMany(req.body)
		res.status(201).json({
			status: 'success',
			data: {
				message: 'Movie assigned successfully in theatre.',
				movieAssigned,
			},
		})
	} catch (err) {
		res.status(400).json({
			status: 'failed',
			message: err.message,
		})
	}
}

exports.updateMoviesSlots = async (req, res) => {
	try {
		var { theatreId, movieId, screenId } = req.body
		const assignedMovies = await MappingModel.updateMany(
			{ theatreId: theatreId, screenId: screenId, movieId: movieId },
			{ slot: req.body.slot }
		)
		res.status(201).json({
			status: 'success',
			data: {
				message: 'movies slots got updated in theatre successfully!',
				assignedMovies,
			},
		})
	} catch (err) {
		res.status(400).json({
			status: 'failed',
			message: err.message,
		})
	}
}

exports.bookMovieTicket = async (req, res) => {
	try {
		var msg
		var { theatreId, movieId, screenId, slotId, noOfSeat } = req.body
		const mappingData = await MappingModel.find({ theatreId: theatreId, screenId: screenId, movieId: movieId })
		if (mappingData.length > 0) {
			var bookedseat = mappingData[0].slot[slotId].bookedSeats
			var totalseat = mappingData[0].slot[slotId].totalseat
			if (totalseat >= bookedseat + noOfSeat) {
				mappingData[0].slot[slotId].bookedSeats += noOfSeat
				const bookedTickets = await MappingModel.updateMany(
					{ theatreId: theatreId, screenId: screenId, movieId: movieId },
					{ slot: mappingData[0].slot }
				)
				msg = 'successfully booked tickets!'
			} else {
				throw new Error('enough seats are not available!')
			}
		} else {
			throw new Error('No data found to update!')
		}

		res.status(200).json({
			status: 'success',
			data: {
				message: msg,
			},
		})
	} catch (err) {
		res.status(400).json({
			status: 'failed',
			message: err.message,
		})
	}
}

exports.getBooketAndAvailableSeats = async (req, res) => {
	try {
		var { theatreId, movieId } = req.body
		const data = await MappingModel.find({ theatreId: theatreId, movieId: movieId })
		var bookedSeat = 0
		var availableSeat = 0
		if (data) {
			data.forEach(element => {
				element.slot.forEach(ele => {
					bookedSeat += ele.bookedSeats
					availableSeat += ele.totalseat - ele.bookedSeats
				})
			})
			var theatreDetail = await TheatreModel.findOne({ _id: theatreId })
			var movieDetail = await MovieModel.findOne({ _id: movieId })
		} else {
			throw new Error('No theatre and movie found!')
		}

		res.status(200).json({
			status: 'success',
			data: {
				theatreName: theatreDetail.name,
				movieName: movieDetail.name,
				availableSeat: availableSeat,
				bookedSeat: bookedSeat,
			},
		})
	} catch (err) {
		console.log(err, 'error')
		res.status(400).json({
			status: 'failed',
			message: err.message,
		})
	}
}

exports.searchMovie = async (req, res) => {
	try {
		let city = req.params.city
		const theatres = await TheatreModel.find({ city })
		if (theatres.length === 0) {
			throw new Error('There is no theatre in this city!')
		}
		// console.log('theatres', theatres)
		var moviePlayingInCity = []
		for (let theatre of theatres) {
			var mapping = await MappingModel.find({ theatreId: theatre._id })
			// console.log('mapping', mapping)
			for (let ele of mapping) {
				var movies = await MovieModel.find({ _id: ele.movieId })
				for (let movie of movies) {
					moviePlayingInCity.push(movie.name)
				}
			}
		}
		console.log('moviePlayingInCity', moviePlayingInCity)

		res.status(200).json({
			status: 'success',
			moviePlayingInCity,
		})
	} catch (err) {
		res.status(400).json({
			status: 'failed',
			message: err.message,
		})
	}
}

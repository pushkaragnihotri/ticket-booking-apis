const MovieController = require('./controller/movies.controller')
const checkAuthorization = require('../common/middlewares/auth.middleware')

module.exports = app => {
	// adding movies
	app.post('/movie', MovieController.addMovie)

	// adding Theatre
	app.post('/theatre', MovieController.addTheatre)

	// assignment of movie in theatre
	app.post('/assign', MovieController.assignMovies)

	// update slots of movie in theatre
	app.post('/updateslots', MovieController.updateMoviesSlots)

	// book ticket API
	app.post('/bookticket', checkAuthorization, MovieController.bookMovieTicket)

	// getting all booked seats and available seats for a movie in a theatre
	app.get('/bookedseatlist', MovieController.getBooketAndAvailableSeats)

	// getting all theatre searched by movie and vice versa
	app.get('/list/:city', MovieController.searchMovie)
}

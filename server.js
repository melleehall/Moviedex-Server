require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./moviedex.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

console.log('server running')

// function for validating bearer token
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || apiToken !== authToken.split(' ')[1]) {
      return res.status(401).json({ error: 'Hello! Unauthorized request' })
    }
    next()
})

function handleMovieSearch(req, res) {
    let response = MOVIEDEX
    const { genre, country, avg_vote} = req.query;

    if (genre) {
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        )
    }

    if (country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(country.toLowerCase())
        )
    }

    if (avg_vote) {
        response = response.filter(movie => 
            Number(movie.avg_vote) >= Number(avg_vote)
        )
    }

    res.json(response)
}

app.get('/movie', handleMovieSearch)

PORT = 7000;

app.listen(PORT, () => {
    console.log(`Express server is listening on port ${PORT}!`)
})




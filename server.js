require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./moviedex.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

// function for validating bearer token
app.use(function validateBearerToken(req, res, next) {
        const apiToken = process.env.API_TOKEN
        const authToken = req.get('Authorization')
        
        if (!authToken || authToken.split(' ')[1] !== apiToken) {
          return res.status(401).json({ error: 'Hello! Unauthorized request' })
        }
        // move to the next middleware
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

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 7000

app.listen(PORT, () => {
    console.log('Express server is listening')
})




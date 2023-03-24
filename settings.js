const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const {initDatabase} = require('./src/db/sequelize')


const app = express()
const PORT = 3000 




app
   .use(morgan('dev'))
   .use(bodyParser.json())
   // .use(express.json())


/** init the database here */
initDatabase()




/** endpoint here */
require('./src/controllers/endpoint')(app)
require('./src/controllers/user.controller')(app)



/** 404 url error */
app
   .use(({res}) => {
     return res.status(404).json({ message : 'Oupss URL is bad or try again...after few minutes' ,code: 404 ,timestamp: new Date()})
   })



app.listen(PORT, () => [
    console.log(`Application started in : localhost:${PORT}`)
])


/***  postre password */
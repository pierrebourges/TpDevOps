// Récupération des variables d'environnement
const PORT = process.env.PORT || 8080
const ENV = process.env.NODE_ENV || process.env.ENV || 'development'
const { MONGO_HOST, MONGO_DATABASE, MONGO_USER, MONGO_PASSWORD } = process.env
const MONGO_PORT = process.env.MONGO_PORT || 27017

if (!MONGO_HOST || !MONGO_DATABASE || !MONGO_USER || !MONGO_PASSWORD) {
  console.error('Can not find environment variable MONGO_HOST, MONGO_DATABASE, MONGO_USER or MONGO_PASSWORD')
  process.exit(1)
}

// Imports
const app = require('express')()
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

// Déclarations
const mongoUri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`

const mongooseMapState = {
  0: 'Disconnected',
  1: 'Connected',
  2: 'Connecting',
  3: 'Disconnecting',
}

let mongoError = null

// Serveur
app.get('/', (req, res) => {
  res.redirect('/mongo')
})

app.get('/mongo', (req, res) => {
  res.json({
    status: 200, data: {
      mongoUri,
      mongoError,
      mongoState: mongooseMapState[mongoose.connection.readyState],
      environment: ENV,
    }
  })
})

app.use((req, res) => {
  res.status(404)
  res.json({ status: 404, code: 'NotFound', message: 'Not found !' })
})

app.listen(PORT, () => {
  console.log(`Server launched on port ${PORT}, environment is ${ENV}`)
})

// Lancement de la connection
mongoose.connect(mongoUri, {
  user: MONGO_USER,
  pass: MONGO_PASSWORD,
  useMongoClient: true,
}).then(() => {
  mongoError = null
}).catch((err) => {
  mongoError = err
})
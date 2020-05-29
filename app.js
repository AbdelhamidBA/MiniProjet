const express = require('express')
const cors = require('cors')
const Joi = require('joi')
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const AdminRoutes = require('./routes/admin.routes')
const EnseignantRoutes = require('./routes/enseignant.routes')
const RFIDRoutes = require('./routes/rfid.routes')
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
const moment = require('moment')
const app = express()


app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(cors(corsOptions));


mongoose.connect('mongodb://localhost:27017/ISSATSO', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})

//Just For Sake of testing
app.get('/', (req, res) => {
    res.send('Hello Its me your app is working fine')
})

//routes
app.use('/api/admin',AdminRoutes);
app.use('/api/rfid', RFIDRoutes);

const db = mongoose.connection;

db.on('error', () => {
    console.log('Connection Error')
})

db.once('open', () => {
    console.log('Database Connected')
})

app.listen(process.env.PORT || 8080, () => {
    console.log('server is running')
})
/**
* Voici la configuration pour se connecter notre application a mongodb
*/
const mongoose = require('mongoose')
let db = mongoose.connect('mongodb://localhost:27017/restaurant',{ useNewUrlParser: true } , (err)=> {
    if (err) {
        console.log(err)
    } else {
        console.log('connected...')
    }
})

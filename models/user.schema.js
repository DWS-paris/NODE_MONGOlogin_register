/*
Import du composant Mongoose
*/
    const mongoose = require('mongoose');
//


/*
Définition du schema Mongoose
*/
    const UserSchema = mongoose.Schema({
        username: {
            type: String,
            index:true
        },
        password: {
            type: String
        },
        email: {
            type: String
        },
        name: {
            type: String
        }
    });
//


/*
Export du model
*/
    module.exports = mongoose.model('UserSchema', UserSchema);
//
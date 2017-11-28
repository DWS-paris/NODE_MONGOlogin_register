/*
Import des composants du service
*/
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    const bcrypt = require('bcryptjs');
//


/*
Création du schema Mongoose
*/
    const UserSchema = mongoose.Schema({
        username: { type: String, index:true },
        password: { type: String },
        email: { type: String },
        name: { type: String }
    });

    const User = module.exports = mongoose.model('User', UserSchema);
//


/*
Définition des méthodes
*/
    // Créer un utilisateur
    module.exports.createUser = function(newUser, callback){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                newUser.password = hash;
                newUser.save(callback);
            });
        });
    }

    // Retrouver un utilisateur : username
    module.exports.getUserByUsername = function(username, callback){
        var query = {username: username};
        User.findOne(query, callback);
    }

    // Retrouver un utilisateur : iserId
    module.exports.getUserById = function(id, callback){
        User.findById(id, callback);
    }

    // Comparer les mot de passe
    module.exports.comparePassword = function(candidatePassword, hash, callback){
        bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
            if(err) throw err;
            callback(null, isMatch);
        });
    }
//
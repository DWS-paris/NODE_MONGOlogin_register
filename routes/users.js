/*
Import des composants de la route
*/
	const express = require('express');
	const router = express.Router();
	const passport = require('passport');
	const LocalStrategy = require('passport-local').Strategy;
	const User = require('../services/passport.serv');
//



/*
Configuration de passport
*/
	// Configuration de la stratégie locale
	passport.use(new LocalStrategy((username, password, done) => {
		// Retrouver un utilisateur : username
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'Utilisateur inconnu'});
			}

			// Comparer les mot de passe
			User.comparePassword(password, user.password, (err, isMatch) => {
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					return done(null, false, {message: 'Mot de passe non-valide'});
				}
			});
		});
	}));

	// Sérialiser l'utilisateur
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Désérialiser l'utilisateur
	passport.deserializeUser(function(id, done) {
		User.getUserById(id, function(err, user) {
			done(err, user);
		});
	});
// 




/*
Définition des routes
*/
	// Page connexion : GET
	router.get('/login', (req, res) => {
		res.render('login');
	});

	// Page connexion : POST
	router.post('/login', passport.authenticate('local', {
		successRedirect:'/', 
		failureRedirect:'/users/login',
		failureFlash: true
	}),(req, res) => {
    res.redirect('/');
  });



	// Page inscription : GET
	router.get('/register', (req, res) => {
		res.render('register', { errors: '' });
	});

	// Page inscription : POST
	router.post('/register', (req, res) => {

		// Récupération des valeur de la requête
		let name = req.body.name;
		let email = req.body.email;
		let username = req.body.username;
		let password = req.body.password;
		let passwordVerif = req.body.passwordVerif;
		let errors = {
			score: 0,
			name: null,
			email: null,
			username: null,
			password: null,
			passwordVerif: null
		}

		// Validation des données
		if( name.length <= 0 ){
			errors.score++;
			errors.name= 'Le nom est obligatoire';
		}

		if( email.length <= 0 ){
			errors.score++;
			errors.email= 'L\'email nom est obligatoire';
		}

		if( username.length <= 0 ){
			errors.score++;
			errors.username= 'Le nom d\'utilisateur est obligatoire';
		}

		if( password.length <= 0 ){
			errors.score++;
			errors.password= 'Le mot de passe est obligatoire';

		} else if( password != passwordVerif){
			errors.score++;
			errors.passwordVerif= 'Les mots de passe ne correspondent pas';
		}

		// Vérification du formulaire
		if(errors.score > 0){ res.render('register',{ errors: errors }) } 
		else {
			// Création d'un nouvel objet User
			const newUser = new User ({
				name: name,
				email:email,
				username: username,
				password: password
			});

			// Enregistrement de l'utilisateur
			User.createUser(newUser, (err, user) => {
				if(err) throw err;
			});

			// Afficher un message dans le DOM
			req.flash('success_msg', 'Votre compte a bien été créé');

			// Redirection de l'utilisateur
			res.redirect('/users/login');
		}
	});


	
	// Page déconnexion : GET
	router.get('/logout', function(req, res){
		req.logout();

		req.flash('success_msg', 'Vous êtes deconnecté');

		res.redirect('/users/login');
	});
//


/*
Export du module de la route
*/
	module.exports = router;
//
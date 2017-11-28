/*
Import des composants de la route
*/
	const express = require('express');
	const router = express.Router();
//


/*
Fonction pour rediriger l'utilisateur si il est connecté ou pas
*/
const ensureAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()){ return next() }
	else {
		res.redirect('/users/login');
	}
}
//


/*
Définition des routes
*/
	// Page d'accueil
	router.get('/', ensureAuthenticated, (req, res) => {
		res.render('index');
	});
//


/*
Export du module de la route
*/
	module.exports = router;
//
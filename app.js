/*
Import des composants principaux
*/
  const express = require('express');
  const path = require('path');
  const bodyParser = require('body-parser');
  const engine = require('consolidate');
  const exphbs = require('express-handlebars');
  const expressValidator = require('express-validator');
  const flash = require('connect-flash');
//


/*
Import des composant pour l'authentification
*/
  const cookieParser = require('cookie-parser');
  const session = require('express-session');
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
//


/*
Import des composants MongoDB et configuration
*/
  const mongo = require('mongodb');
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://127.0.0.1:27027/loginapp', { useMongoClient: true });
  const db = mongoose.connection;
//



/*
Configuration du serveur
*/
  // Fichier des routes
  var routes = require('./routes/index');
  var users = require('./routes/users');

  // Initialiser le serveur
  var app = express();

  // Définition du dossier static
  app.set('views', __dirname + '/www');
  app.use(express.static(path.join(__dirname, 'www')))
  app.engine('html', engine.mustache);
  app.set('view engine', 'ejs');
//



/*
Configuration des middleware
*/
  // Configuration de BodyParser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  

  // Configuration de Express Session
  app.use(session({
      secret: 'secret',
      saveUninitialized: true,
      resave: true
  }));

  // Configuration de Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configuration de Express Validator
  app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.');
        let root    = namespace.shift();
        let formParam = root;

      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

  // Configuration de Flash
  app.use(flash());
//

// Global Vars
app.use( (req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
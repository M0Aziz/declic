var express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config()
const socketIo = require('socket.io');
const http = require('http');
var createError = require('http-errors');


// Générer une clé secrète aléatoire
const secretKey = crypto.randomBytes(32).toString('hex');
//console.log('Clé secrète générée :', secretKey);
const connectDB = require('./config/db');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
 
var profilesRouter = require('./routes/profilesRoutes');
var usersRouter = require('./routes/userRoutes');
var activitysRouter = require('./routes/activitysRoutes');
var messagesRouter = require('./routes/messagesRoutes');
var commentsRouter = require('./routes/commentsRoutes');
var notificationsRouter = require('./routes/notificationsRoutes');

var testsRouter = require('./routes/testRoutes');

var app = express();

connectDB();
const PORT = process.env.PORT || 5000; 
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
app.use(cors());
app.use((req, res, next) => {
  req.io = io; // Ajouter l'objet io à la requête
  next(); // Passer à la prochaine fonction middleware ou route
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/profiles', profilesRouter);
app.use('/users', usersRouter);
app.use('/activitys', activitysRouter);
app.use('/messages', messagesRouter);
app.use('/comments', commentsRouter);
app.use('/test', testsRouter);
app.use('/notifications', notificationsRouter);

app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur Declic !');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Middleware pour ajouter l'objet io à la requête


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.error(err.stack); // Afficher l'erreur dans la console

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Une erreur est survenue sur le serveur."
    }
  });
    res.render('error');
});


io.on('connection', (socket) => {
  console.log('Nouvelle connexion websocket établie:', socket.id);
  
  // Gérer les événements de connexion et de déconnexion du client
  socket.on('disconnect', () => {
    console.log('Connexion websocket fermée:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});







module.exports = app;

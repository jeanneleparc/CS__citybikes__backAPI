const express = require('express');
const routes = require('./src/routes/station_route'); // import the routes

const mongoose = require('mongoose');

const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/citibikes';

mongoose.connect(MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})
   .then(() => {
      app.use(express.json());
		app.use("/", routes) // new
      console.log('MongoDB connected!')
   })
   .catch(err => console.log(err));

const db = mongoose.connection;

app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
   next();
 });

app.get('/', (req, res) => {
   res.send('Hello World, database is connected');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
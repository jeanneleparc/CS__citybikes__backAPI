const express = require('express');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');

const app = express();

mongoose.connect(MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})
   .then(() => console.log('MongoDB connected!'))
   .catch(err => console.log(err));


app.get('/', (req, res) => {
   res.send('Hello World, database is connected');
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
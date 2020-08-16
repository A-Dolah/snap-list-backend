const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect db
connectDB();

const corsOptions = {
  origin: [
    'https://master.d2lqi2ajg5lzsh.amplifyapp.com',
    'https://localhost:3000',
  ],
  default: 'https://master.d2lqi2ajg5lzsh.amplifyapp.com',
  optionsSuccessStatus: 200,
  credentials: true,
};

app.all('*', (req, res, next) => {
  try {
    const origin = corsOptions.origin.indexOf(req.header('origin').toLowerCase()) > -1
      ? req.headers.origin
      : cors.default;
    res.header('Access-Control-Allow-Origin', origin);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
  } catch (error) {
    console.log(error);
    res.json({ msg: 'CORS policy does not allow you to access the API' });
  }
});

// Init middleware
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

// Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/ingredients', require('./routes/api/ingredients'));
app.use('/api/lists', require('./routes/api/lists'));

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

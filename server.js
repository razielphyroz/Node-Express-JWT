require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
  {
    username: 'Henrique',
    title: 'Post 1'
  },
  {
    username: 'Kyle',
    title: 'Post 2'
  }
];

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name));
});

// Middleware function to check the authentication
function authenticateToken(req, res, next) {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Token not found.

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403) // Token not valid.
    }
    req.user = user;
    next();
  });
}

app.listen(3000, () => console.log('Server started at port 3000.'));
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDuB5MlwLBSOgjxEy01p8VeewDDODUKWUY',
  authDomain: 'blog-4b077.firebaseapp.com',
  projectId: 'blog-4b077',
  storageBucket: 'blog-4b077.appspot.com',
  messagingSenderId: '1005872541111',
  appId: '1:1005872541111:web:6fba90552d6a8e6636cc32',
};

initializeApp(firebaseConfig);
const storage = getStorage();

app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://or63529:wLuePpf02OQrK4Qr@cluster0.vrmua9i.mongodb.net/');

// Multer setup for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      const errorMap = {
        TokenExpiredError: 'Token expired',
        JsonWebTokenError: 'Invalid token',
      };
      return res.status(401).json({ error: errorMap[err.name] || 'Unauthorized' });
    }
    req.userInfo = info; // Add user info to request
    next();
  });
};

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      }).json({ id: userDoc._id, username });
    });
  } else {
    res.status(400).json('Wrong credentials');
  }
});

app.get('/profile', verifyToken, (req, res) => {
  res.json(req.userInfo);
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  }).json('ok');
});

app.post('/post', upload.single('file'), verifyToken, async (req, res) => {
  const { title, summary, content } = req.body;
  const storageRef = ref(storage, `images/${Date.now()}_${req.file.originalname}`);
  await uploadBytes(storageRef, req.file.buffer);
  const imageUrl = await getDownloadURL(storageRef);

  const postDoc = await Post.create({
    title,
    summary,
    content,
    cover: imageUrl,
    author: req.userInfo.id,
  });

  res.json(postDoc);
});

app.put('/post', upload.single('file'), verifyToken, async (req, res) => {
  const { id, title, summary, content } = req.body;
  const postDoc = await Post.findById(id);
  if (postDoc.author.toString() !== req.userInfo.id) {
    return res.status(403).json('You are not the author');
  }

  let imageUrl = postDoc.cover;
  if (req.file) {
    const storageRef = ref(storage, `images/${Date.now()}_${req.file.originalname}`);
    await uploadBytes(storageRef, req.file.buffer);
    imageUrl = await getDownloadURL(storageRef);
  }

  await postDoc.updateOne({ title, summary, content, cover: imageUrl });
  res.json(postDoc);
});

app.get('/post', async (req, res) => {
  const posts = await Post.find()
    .populate('author', ['username'])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.get('/post/:id', async (req, res) => {
  const postDoc = await Post.findById(req.params.id).populate('author', ['username']);
  if (postDoc) {
    res.json(postDoc);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.delete('/post/:id', verifyToken, async (req, res) => {
  const postDoc = await Post.findById(req.params.id);
  if (!postDoc) return res.status(404).json({ error: 'Post not found' });
  if (postDoc.author.toString() !== req.userInfo.id) {
    return res.status(403).json({ error: 'You are not authorized to delete this post' });
  }

  await postDoc.deleteOne();
  res.json({ message: 'Post deleted successfully' });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
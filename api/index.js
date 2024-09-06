const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors')
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
app.use(cors({
  origin: 'https://guts-z422.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB connection
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://or63529:wLuePpf02OQrK4Qr@cluster0.vrmua9i.mongodb.net/');

// Multer setup for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
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
      // Secure cookies for production
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
}).json({ id: userDoc._id, username });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(400).json({ error: 'Token missing' });
  
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      const errorMap = {
        TokenExpiredError: 'Token expired',
        JsonWebTokenError: 'Invalid token',
      };
      return res.status(401).json({ error: errorMap[err.name] || 'Unauthorized' });
    }
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  // Secure cookies for production
res.cookie('token', '', {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
}).json('ok');
});

app.post('/post', upload.single('file'), async (req, res) => {
  try {
    const { token } = req.cookies;
    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, secret, {}, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });

    const { title, summary, content } = req.body;
    const storageRef = ref(storage, `images/${Date.now()}_${req.file.originalname}`);
    await uploadBytes(storageRef, req.file.buffer);
    const imageUrl = await getDownloadURL(storageRef);

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: imageUrl,
      author: info.id,
    });

    res.json(postDoc);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'An error occurred while creating the post' });
  }
});

app.put('/post', upload.single('file'), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    if (postDoc.author.toString() !== info.id) {
      return res.status(400).json('you are not the author');
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
  res.json(postDoc);
});

app.delete('/post/:id', async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    const postDoc = await Post.findById(req.params.id);
    if (!postDoc) return res.status(404).json({ error: 'Post not found' });
    if (postDoc.author.toString() !== info.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }

    await postDoc.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyDuB5MlwLBSOgjxEy01p8VeewDDODUKWUY",
  authDomain: "blog-4b077.firebaseapp.com",
  projectId: "blog-4b077",
  storageBucket: "blog-4b077.appspot.com",
  messagingSenderId: "1005872541111",
  appId: "1:1005872541111:web:6fba90552d6a8e6636cc32"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';
app.use(cors({credentials:true,origin:'https://guts-fx13.vercel.app'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));


mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://or63529:wLuePpf02OQrK4Qr@cluster0.vrmua9i.mongodb.net/');

const upload = multer({ storage: multer.memoryStorage() });

app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' }).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});


app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  console.log('Token in request:', token);
  console.log('All cookies:', req.cookies);

  if (!token) {
    console.warn('Token missing in request cookies');
    return res.status(400).json({ error: 'Token missing' });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log('Token verified successfully, user info:', info);
    res.json(info);
  });
});


app.post('/logout', (req,res) => {
  res.cookie('token', '', { httpOnly: true, secure: true, sameSite: 'None' }).json('ok');
});

app.post('/post', upload.single('file'), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { title, summary, content } = req.body;

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `images/${Date.now()}_${req.file.originalname}`);
    await uploadBytes(storageRef, req.file.buffer);
    const imageUrl = await getDownloadURL(storageRef);

    // Create the post with the Firebase Storage URL
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: imageUrl, // Store the URL of the image
      author: info.id,
    });

    res.json(postDoc);
  });
});

app.put('/post', upload.single('file'), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }

    let imageUrl = postDoc.cover;
    if (req.file) {
      // Upload new image to Firebase Storage if provided
      const storageRef = ref(storage, `images/${Date.now()}_${req.file.originalname}`);
      await uploadBytes(storageRef, req.file.buffer);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Update the post with the new details
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: imageUrl, // Update the URL if a new image was uploaded
    });

    res.json(postDoc);
  });
});

app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});
app.delete('/post/:id', async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const postDoc = await Post.findById(id);
      if (!postDoc) return res.status(404).json({ error: 'Post not found' });

      // Check if the user is the author of the post
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(403).json({ error: 'You are not authorized to delete this post' });
      }

      // Delete the post from the database
      await postDoc.deleteOne();

      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


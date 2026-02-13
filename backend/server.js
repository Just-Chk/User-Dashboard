const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const config = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', UserSchema);

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });
  
  try {
    jwt.verify(token, 'secret123');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    res.json({ msg: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route - Updated with bcrypt
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Check admin login (keep existing admin login)
  if (email === 'admin@example.com' && password === 'admin123') {
    const token = jwt.sign({ user: 'admin', email }, 'secret123', { expiresIn: '1h' });
    return res.json({ token });
  }
  
  // Check regular user login
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, email: user.email }, 'secret123', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add GET /api/users/:id for edit functionality
app.get('/api/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/users', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/users', auth, async (req, res) => {
  try {
    // Hash password before saving new user
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/api/users/:id', auth, async (req, res) => {
  try {
    // Don't update password through this route
    const updateData = { name: req.body.name, email: req.body.email };
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/api/users/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'signup.html')));

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
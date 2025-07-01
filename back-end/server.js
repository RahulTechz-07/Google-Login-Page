const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/Project1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Route to create a new user
app.post('/CreateAccount/CreateAccount1/Password', async (req, res) => {
  const { firstname, lastname, username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      firstname,
      lastname,
      email: username, // Using 'username' as email
      password: hash,
    });
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.json({ status: 'error', error: 'Duplicate email or DB error' });
  }
});

app.post('/', async (req,res) => {
  const{username}=req.body;
  const user = await User.findOne({ email : username });
  console.log(user.firstname);
  if (!user) return res.json({ status: 'error', error: 'User not found' });
  console.log(user)
  res.json({
      status: 'ok',
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      }
    });
})

app.post('/Password1',async (req,res) =>{
  const {username,password} = req.body;
   
      try {
    const user = await User.findOne({ email: username });

    // ✅ Step 1: check if user exists
    if (!user) {
      return res.json({ status: 'error', error: 'User not found' });
    }

    // ✅ Step 2: compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ status: 'error', error: 'Invalid password' });
    }
    // ✅ Step 3: success
    return res.json({
      status: 'ok',
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    return res.json({ status: 'error', error: 'Server error' });
  }

})

app.listen(5000, () => console.log('Server started on port 5000'));

const User = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


exports.createUser = async (req, res) => {
  try {
      const { name, email, number, password } = req.body;

      // Check if user with provided email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'User already exists. Please login.' });
      }

      // If user doesn't exist, hash the password and create the user
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({ name, email, number, password: hashedPassword });

      console.log(user);
      res.status(201).json({ user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

function generateAccessToken(id,name){
  const jwtToken = jwt.sign({userId : id, name : name},process.env.TOKEN_SECRET)
  return jwtToken
}

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
        console.log(email)
  try {
      // Check if the user exists in the database
      const users = await User.findOne({where: {email: email}});
      console.log(users)

      if (!users) {
          return res.status(404).json({ message: '404 User not found Please Sign up' });
      }

      //check if password matches after decryption
      const passwordMatch = await bcrypt.compare(password, users.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: '401 User not authorized' });
      }

      res.json({user:users,jwtToken: generateAccessToken(users.id,users.name)})

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

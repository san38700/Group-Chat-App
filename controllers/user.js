const User = require('../models/user')

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

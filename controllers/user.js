const User = require('../models/user')

const bcrypt = require('bcrypt')


exports.createUser = async (req, res) => {
    try {
      const { name, email, number, password } = req.body;
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      const user = await User.create({ name, email, number, password : hashedPassword });
      console.log(user)
      res.status(201).json({ users: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error or User already exists' });
    }
  };

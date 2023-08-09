const User = require('../models/user');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/index');

const index = (req, res, next) => {
  res.status(200).json({
    data: [
      {id: 1, name: 'a'},
      {id: 2, name: 'b'},
    ]
  })
}

exports.index = index;


exports.register = async (req, res, next) => {
  try {
    const {name, email, password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('ข้อมูลไม่ถูกต้อง');
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    let existEmail = await User.findOne({email: email});
    if (existEmail) {
      const error = new Error('อีเมล์ซ้ำ มีผู้ใช้งานแล้ว');
      error.statusCode = 400;
      throw error;
    }

    let user = new User();
    user.name = name;
    user.email = email;
    user.password = await user.encryptPassword(password);
    
    await user.save();
    res.status(201).json({
      message: "Registed"
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({email: email});
    if (!user) {
      const error = new Error('ไม่พบผู้ใช้งานในระบบ');
      error.statusCode = 404;
      throw error;
    }

    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error('รหัสผ่านไม่ถูกต้อง');
      error.statusCode = 401;
      throw error;
    }

    //gen token
    const token = await jwt.sign({
      id: user._id,
      role: user.role
    }, config.JWT_SECRET, { expiresIn: '5 days' });
    
    //decode expire date
    const expires_in = jwt.decode(token)

    res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: 'Bearer'
    })
  } catch (error) {
    next(error)
  }
}

exports.me = async (req, res, next) => {
  const {_id, name, email, role} = req.user;
  return res.status(200).json({
    user: {
      id: _id,
      name: name,
      email: email,
      role: role
    }
  })
}
var express = require('express');
const { body } = require('express-validator');
var router = express.Router();
const userController = require('../controllers/userController');
const passportJWT = require('../middleware/passportJWT');

/* GET users listing. */
router.get('/', userController.index);

router.post('/login', userController.login);

router.post('/register', [
    body('name').not().isEmpty().withMessage('กรุณากรอกชื่อด้วย'),
    body('email').not().isEmpty().withMessage('กรุณากรอก Email ด้วย').isEmail().withMessage('รูปแบบ Email ไม่ถูกต้อง'),
    body('password').not().isEmpty().withMessage('กรุณากรอกรกัสผ่านด้วย').isLength({min: 3}).withMessage('3 ตัว'),
] ,userController.register);

router.get('/me', [passportJWT.isLogin], userController.me)

module.exports = router;
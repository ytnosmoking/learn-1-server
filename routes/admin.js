var express = require('express');
var router = express.Router();
const AdminController = require('../controller/admin')

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.post('/login', AdminController.login)
router.post('/register', AdminController.register)
router.post('/infos', AdminController.checkAuth, AdminController.infos)
router.post('/update-infos', AdminController.checkAuth, AdminController.updateInfos)

module.exports = router;

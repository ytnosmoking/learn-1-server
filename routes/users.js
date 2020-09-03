var express = require('express');
var router = express.Router();
const AdminController = require('../controller/admin')


const ImgsModal = require('../controller/imgs')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/img', ImgsModal.getImgs);
router.post('/upload', AdminController.checkAuth, ImgsModal.uploadImg);
router.post('/delete-img', AdminController.checkAuth, ImgsModal.deleteImage);

module.exports = router;

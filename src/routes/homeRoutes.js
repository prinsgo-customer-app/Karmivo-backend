const express = require('express');
const { getHome, getBanners } = require('../controllers/homeController');

const router = express.Router();

router.get('/', getHome);
router.get('/banners', getBanners);

module.exports = router;

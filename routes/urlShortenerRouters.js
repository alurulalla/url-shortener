const express = require('express');

const {
  getURLShorteners,
  createURLShortener,
  getUrlById,
  deleteURL,
} = require('../controllers/urlShortener');

const router = express.Router();

router.route('/').get(getURLShorteners).post(createURLShortener);
router.route('/:id').get(getUrlById).delete(deleteURL);

module.exports = router;

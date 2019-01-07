const express = require('express');
const { cache } = require('../middleware/cache');
const githubController = require('../controllers/githubController');

const router = express.Router();

router.get('/:days', cache(300), (req, res) => githubController.fetchCommitData(req, res));

module.exports = router;

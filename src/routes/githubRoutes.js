const express = require('express');
const githubController = require('../controllers/githubController');

const router = express.Router();

router.get('/:days', (req, res) => githubController.fetchCommitData(req, res));

module.exports = router;

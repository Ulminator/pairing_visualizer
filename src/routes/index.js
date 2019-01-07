const { Router } = require('express');
const githubRoutes = require('./githubRoutes');

const router = Router();

router.use('/github', githubRoutes);

router.get('/health', (req, res) => {
  res.status(200).send({ status: 'UP' });
});

module.exports = router;

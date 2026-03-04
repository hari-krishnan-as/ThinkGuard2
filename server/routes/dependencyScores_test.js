const express = require('express');
const router = express.Router();

console.log('Dependency scores routes loaded - minimal');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Dependency routes working!' });
});

module.exports = router;

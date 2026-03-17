const express = require('express');
const router = express.Router();
const DependencyScore = require('../models/DependencyScore');
const auth = require('../middleware/AuthMiddleware');

console.log('Dependency scores routes loaded');

// Test route
router.get('/test', (req, res) => {
  console.log('GET /test - Dependency routes working!');
  res.json({ message: 'Dependency routes working!', timestamp: new Date().toISOString() });
});

// Save dependency score
router.post('/scores', auth, async (req, res) => {
  try {
    const {
      score,
      level,
      intervalNumber,
      keyClicks,
      thinkingTime,
      sessionId,
      complexityScore,
      complexityLevel
    } = req.body;

    console.log('Received dependency score data:', {
      score,
      level,
      intervalNumber,
      keyClicks,
      thinkingTime,
      sessionId,
      complexityScore,
      complexityLevel,
      userId: req.user?.id,
      user: req.user
    });

    console.log('User from request:', req.user);
    console.log('User ID:', req.user?.id);

    if (!req.user || !req.user.id) {
      console.error('No user or user ID in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Creating DependencyScore document with data:', {
      userId: req.user.id,
      score,
      level,
      intervalNumber,
      keyClicks,
      thinkingTime,
      sessionId,
      complexityScore,
      complexityLevel
    });

    const dependencyScore = new DependencyScore({
      userId: req.user.id,
      score,
      level,
      intervalNumber,
      keyClicks,
      thinkingTime,
      sessionId,
      complexityScore,
      complexityLevel
    });

    console.log('DependencyScore document before save:', dependencyScore.toObject());

    try {
      const savedScore = await dependencyScore.save();
      console.log('Saved dependency score:', savedScore.toObject());
      console.log('Document ID:', savedScore._id);
      res.status(201).json(savedScore);
    } catch (dbError) {
      console.error('Database save error:', dbError);
      console.error('Error details:', dbError.message);
      console.error('Error stack:', dbError.stack);
      console.error('Validation errors:', dbError.errors);
      res.status(500).json({
        message: 'Database error saving dependency score',
        error: dbError.message,
        validationErrors: dbError.errors
      });
    }
  } catch (error) {
    console.error('Error saving dependency score:', error);
    res.status(500).json({ message: 'Error saving dependency score' });
  }
});

// Get all dependency scores for a user
router.get('/scores', auth, async (req, res) => {
  try {
    console.log('GET /scores - User ID:', req.user?.id);
    console.log('GET /scores - Request received');

    const scores = await DependencyScore.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(50);

    console.log('GET /scores - Found scores:', scores.length);
    console.log('GET /scores - First score:', scores[0]);
    console.log('GET /scores - Sending response:', JSON.stringify(scores, null, 2));

    res.json(scores);
  } catch (error) {
    console.error('Error fetching dependency scores:', error);
    res.status(500).json({ message: 'Error fetching dependency scores' });
  }
});

// Get dependency score statistics
router.get('/scores/stats', auth, async (req, res) => {
  try {
    const stats = await DependencyScore.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          lowestScore: { $min: '$score' },
          totalIntervals: { $sum: 1 },
          highDependencyCount: {
            $sum: { $cond: [{ $eq: ['$level', 'high'] }, 1, 0] }
          },
          mediumDependencyCount: {
            $sum: { $cond: [{ $eq: ['$level', 'medium'] }, 1, 0] }
          },
          lowDependencyCount: {
            $sum: { $cond: [{ $eq: ['$level', 'low'] }, 1, 0] }
          }
        }
      }
    ]);

    const latestScores = await DependencyScore.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('score timestamp');

    res.json({
      stats: stats[0] || {
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        totalIntervals: 0,
        highDependencyCount: 0,
        mediumDependencyCount: 0,
        lowDependencyCount: 0
      },
      recentScores: latestScores
    });
  } catch (error) {
    console.error('Error fetching dependency statistics:', error);
    res.status(500).json({ message: 'Error fetching dependency statistics' });
  }
});

module.exports = router;

const nlp = require("compromise");

function analyzePrompt(prompt) {
  const doc = nlp(prompt);

  return {
    wordCount: doc.wordCount(),
    sentenceCount: doc.sentences().length,
    nouns: doc.nouns().length,
    verbs: doc.verbs().length,
    adjectives: doc.adjectives().length
  };
}

function calculateComplexity(features) {
  let score = 0;

  // basic structure contribution
  score += features.wordCount * 1.5;
  score += features.sentenceCount * 5;

  // linguistic richness
  score += features.nouns * 2;
  score += features.verbs * 2;
  score += features.adjectives * 1.5;

  // normalize to 100
  return Math.min(Math.round(score), 100);
}

function getComplexityLevel(score) {
  if (score < 30) return "Low";
  if (score < 70) return "Medium";
  return "High";
}

module.exports = { analyzePrompt, calculateComplexity, getComplexityLevel };

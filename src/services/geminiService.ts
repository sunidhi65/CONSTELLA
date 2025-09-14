// Local sentiment & vibe analysis without external APIs
import type { Sentiment } from '../types';

// Minimal lexicons (extend as needed)
const POSITIVE_WORDS = new Set([
  'love','loved','loving','like','liked','awesome','amazing','great','good','nice',
  'beautiful','cool','fantastic','wonderful','perfect','sweet','happy','fun','enjoy',
  'enjoyed','friendly','vibe','connect','connection','cute','wow','yay','yeah','yes'
]);

const NEGATIVE_WORDS = new Set([
  'hate','hated','angry','mad','sad','bad','terrible','awful','worse','worst','ugly',
  'boring','annoying','dislike','no','nope','meh','gross','cringe','toxic','problem',
  'issue','error','bug','lag','broken'
]);

// Simple emoji signals
const POSITIVE_EMOJI_RE = /[😀😃😄😁😊🙂😍🥰🤩🥳👍👌👏✨💖❤️🤝🤗🎉🎊]/u;
const NEGATIVE_EMOJI_RE = /[😞😟😠😡😢😭👎💔🙄😒🤬]/u;

// Amplifiers / negations
const AMPLIFIERS = new Set(['very','super','really','so','extremely','totally','absolutely']);
const NEGATIONS = new Set(['not',"don't","didn't","isn't","aren't","wasn't","weren't","no","never"]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function sentimentScore(text: string): number {
  let score = 0;

  // Emoji signal
  if (POSITIVE_EMOJI_RE.test(text)) score += 2;
  if (NEGATIVE_EMOJI_RE.test(text)) score -= 2;

  // Punctuation emphasis
  const excl = (text.match(/!/g) || []).length;        // excitement
  const ellipses = (text.match(/\.{3}/g) || []).length; // uncertainty
  score += Math.min(excl, 3) * 0.5;
  score -= Math.min(ellipses, 3) * 0.5;

  const words = tokenize(text);

  let negateWindow = 0;
  let amp = 1;

  for (const w of words) {
    if (NEGATIONS.has(w)) {
      negateWindow = 3; // flip next few sentiment tokens
      continue;
    }
    if (AMPLIFIERS.has(w)) {
      amp = Math.min(amp + 0.5, 2.5);
      continue;
    }

    let delta = 0;
    if (POSITIVE_WORDS.has(w)) delta = 1;
    else if (NEGATIVE_WORDS.has(w)) delta = -1;

    if (negateWindow > 0 && delta !== 0) {
      delta *= -1; // invert polarity under negation
      negateWindow--;
    } else if (negateWindow > 0) {
      negateWindow--;
    }

    score += delta * amp;

    // decay amplifier gradually
    if (amp > 1) amp = Math.max(1, amp - 0.25);
  }

  return score;
}

export const analyzeSentiment = async (text: string): Promise<Sentiment> => {
  const score = sentimentScore(text);
  if (score > 1) return 'POSITIVE';
  if (score < -1) return 'NEGATIVE';
  return 'NEUTRAL';
};

// Heuristic "vibe" detector: looks at positivity ratio across lines/messages
export const analyzeConnectionVibe = async (messageHistory: string): Promise<boolean> => {
  // Split transcript into lines/messages; ignore empties
  const lines = messageHistory.split(/\n+/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return false;

  let pos = 0, neg = 0;
  for (const line of lines) {
    const s = sentimentScore(line);
    if (s > 0.5) pos++;
    else if (s < -0.5) neg++;
  }

  const total = pos + neg;
  if (total === 0) return false;

  const positivity = pos / total;

  // Strong vibe threshold; tweak as needed
  return positivity >= 0.6 && pos >= Math.max(2, neg + 1);
};
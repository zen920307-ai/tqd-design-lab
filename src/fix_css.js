const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'styles.css');
const c = fs.readFileSync(cssPath, 'utf8');

// Find the first @media (max-width: 980px) block
const first980 = c.indexOf('@media (max-width: 980px) {');

if (first980 === -1) {
  console.log('ERROR: Could not find 980px block');
  process.exit(1);
}

// Keep everything BEFORE the 980px block (the clean original content)
const before980 = c.substring(0, first980);

// Now extract all the enhanced mobile style content that was added
// We need to pull out the useful rules from the messy middle section
// Find the 480px query and landscape queries
const q480Start = c.indexOf('@media (max-width: 480px) {');
const q480End = c.indexOf('}', q480Start + 30);

// Extract 480px content
const q480Content = c.substring(q480Start, q480End + 1);

// Find landscape queries - get the last occurrence with content
const landStart = c.lastIndexOf('@media (max-width: 980px) and (orientation: landscape) {');
const landEnd = c.indexOf('}', landStart + 30);

const landContent = c.substring(landStart, landEnd + 1);

// Also extract the enhanced mobile styles that were inside the original 980px block
// Find them by looking for "Mobile hamburger", "career-screen mobile" etc
const mobileStylesStart = c.indexOf('/* Mobile hamburger */');
const mobileStylesEnd = c.indexOf('/* Lightbox */');

const mobileEnhancements = c.substring(mobileStylesStart, mobileStylesEnd + ('/* Lightbox */'.length));

// Build the clean CSS
const finalCSS = before980 + '\n' + mobileEnhancements + '\n\n' + q480Content + '\n\n' + landContent + '\n';

// Verify brace balance
const open = (finalCSS.match(/{/g) || []).length;
const close = (finalCSS.match(/}/g) || []).length;
console.log('Open:', open, 'Close:', close, 'Diff:', open - close);

if (open === close) {
  fs.writeFileSync(cssPath, finalCSS);
  console.log('CSS file rewritten successfully! Length:', finalCSS.length);
} else {
  console.log('ERROR: Braces still unbalanced!');
  // Write it anyway for debugging
  fs.writeFileSync(cssPath, finalCSS);
}

// content.js

function applyFontSettings(fontName, selector) {
  if (!fontName) return;

  const fontId = 'edge-font-changer-link';
  const styleId = 'edge-font-changer-style';

  // 1. Clean up
  const existingLink = document.getElementById(fontId);
  const existingStyle = document.getElementById(styleId);
  if (existingLink) existingLink.remove();
  if (existingStyle) existingStyle.remove();

  // 2. Load Google Font
  const formattedFontName = fontName.split(' ').join('+');
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${formattedFontName}:wght@300;400;500;700&display=swap`;

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = googleFontUrl;
  document.head.appendChild(link);

  // 3. Construct CSS
  const style = document.createElement('style');
  style.id = styleId;

  const hdCss = `
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  `;

  // --- THE HOLY GRAIL FIX ---
  // We use :not(:is(...)) to exclude elements AND their children completely.
  
  // A. Define the "Forbidden Zones" (Containers that should not be touched)
  const forbiddenContainers = [
    // 1. Code Blocks
    "pre", "code", "kbd", "samp", "var",
    
    // 2. Math Libraries (KaTeX, MathJax, MathML)
    ".katex", 
    ".MathJax", 
    ".mjx-container", 
    "math", 
    
    // 3. Icons (Material, FontAwesome, Bootstrap, Generic)
    ".material-icons", 
    ".material-symbols-outlined",
    "[class*='fa-']", 
    "[class*='bi-']",
    "[class*='icon']",   // Catches 'gtdrpicon', 'icon-calendar'
    "[class*='Icon']", 
    "[class*='ico-']", 
    "[class*='glyph']", 
    "[class*='symbol']",
    "i" // Generic italics tag often used for icons
  ];

  // B. Construct the Exclusion Selector
  // This logic says: "If the element IS inside a forbidden container, exclude it."
  // :is(.katex *) matches any descendant of .katex
  // :is(.katex) matches the container itself
  
  // We combine the container AND its descendants into one list
  const exclusionRules = forbiddenContainers.map(tag => `:not(:is(${tag}, ${tag} *))`).join('');

  // C. Combine with User Selector
  // Result looks like: * :not(:is(pre, pre *)) :not(:is(.katex, .katex *)) ...
  const finalSelector = `${selector}${exclusionRules}`;

  style.textContent = `
    ${finalSelector} {
      font-family: '${fontName}', sans-serif !important;
      ${hdCss}
    }
  `;

  document.head.appendChild(style);
  console.log(`Edge Font Changer: Applied ${fontName} with Deep Exclusion Logic.`);
}

function loadSettings() {
  const hostname = window.location.hostname;
  chrome.storage.sync.get([hostname], (result) => {
    if (result[hostname]) {
      const { font, selector } = result[hostname];
      applyFontSettings(font, selector);
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateFont") {
    applyFontSettings(request.font, request.selector);
  } else if (request.action === "resetFont") {
    const existingLink = document.getElementById('edge-font-changer-link');
    const existingStyle = document.getElementById('edge-font-changer-style');
    if (existingLink) existingLink.remove();
    if (existingStyle) existingStyle.remove();
  }
});

loadSettings();
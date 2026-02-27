// popup.js

const defaultFonts = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Source Sans Pro",
  "Slabo 27px", "Raleway", "PT Sans", "Merriweather", "Noto Sans", "Nunito",
  "Concert One", "Prompt", "Work Sans", "Rubik", "Poppins", "Karla", "Inter",
  "Lora", "Ubuntu", "Playfair Display", "Fira Sans", "Inconsolata", "Quicksand",
  "Titillium Web", "Mukta", "Josefin Sans", "Arvo", "Libre Baskerville", "Anton",
  "Cabin", "Hind", "Crimson Text", "Bitter", "Dosis", "Oxygen", "Varela Round"
];

const fontSelect = document.getElementById('fontSelect');
const selectorInput = document.getElementById('selectorInput');
const applyBtn = document.getElementById('applyBtn');
const resetBtn = document.getElementById('resetBtn');
const currentSiteSpan = document.getElementById('currentSite');
const urlInput = document.getElementById('urlInput');
const addUrlBtn = document.getElementById('addUrlBtn');
const urlMsg = document.getElementById('urlMsg');

// New Elements
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');

function showMsg(text, isError = false) {
  urlMsg.textContent = text;
  urlMsg.style.display = 'block';
  urlMsg.style.color = isError ? 'red' : 'green';
  setTimeout(() => { urlMsg.style.display = 'none'; }, 4000);
}

function renderFontList(savedUserFonts = [], selectedFont = "") {
  fontSelect.innerHTML = ""; 

  defaultFonts.sort().forEach(font => {
    const option = document.createElement('option');
    option.value = font;
    option.textContent = font;
    fontSelect.appendChild(option);
  });

  if (savedUserFonts.length > 0) {
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = "--- Your Added Fonts ---";
    fontSelect.appendChild(separator);

    savedUserFonts.forEach(font => {
      const option = document.createElement('option');
      option.value = font;
      option.textContent = `${font} [User]`; 
      fontSelect.appendChild(option);
    });
  }

  if (selectedFont) {
    fontSelect.value = selectedFont;
  }
}

// Initialize
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];
  const hostname = new URL(activeTab.url).hostname;
  currentSiteSpan.textContent = hostname;

  chrome.storage.sync.get([hostname, 'customUserFonts'], (result) => {
    const userFonts = result.customUserFonts || [];
    const siteSettings = result[hostname];
    
    renderFontList(userFonts, siteSettings ? siteSettings.font : "");

    if (siteSettings && siteSettings.selector) {
      selectorInput.value = siteSettings.selector;
    }
  });
});

// Add URL Logic
addUrlBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('googleapis.com') && !urlObj.hostname.includes('google.com')) {
      throw new Error("Not a Google Fonts URL");
    }
    const params = new URLSearchParams(urlObj.search);
    const families = params.getAll('family');
    if (families.length === 0) throw new Error("No fonts found in URL");

    chrome.storage.sync.get(['customUserFonts'], (result) => {
      let currentFonts = result.customUserFonts || [];
      let addedCount = 0;

      families.forEach(familyString => {
        let cleanName = familyString.split(':')[0];
        cleanName = cleanName.replace(/\+/g, ' ');
        if (!currentFonts.includes(cleanName) && !defaultFonts.includes(cleanName)) {
          currentFonts.push(cleanName);
          addedCount++;
        }
      });

      if (addedCount > 0) {
        chrome.storage.sync.set({ customUserFonts: currentFonts }, () => {
          renderFontList(currentFonts, currentFonts[currentFonts.length - 1]);
          showMsg(`Success! Added ${addedCount} new font(s).`);
          urlInput.value = "";
        });
      } else {
        showMsg("Fonts already exist.", true);
      }
    });
  } catch (err) {
    showMsg("Invalid URL.", true);
  }
});

// Apply Logic
applyBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const hostname = new URL(activeTab.url).hostname;
    const selectedFont = fontSelect.value;
    const selector = selectorInput.value || "*";

    if (!selectedFont) return;

    chrome.storage.sync.set({
      [hostname]: { font: selectedFont, selector: selector }
    }, () => {
      chrome.tabs.sendMessage(activeTab.id, {
        action: "updateFont",
        font: selectedFont,
        selector: selector
      });
      window.close();
    });
  });
});

// Reset Logic
resetBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const hostname = new URL(activeTab.url).hostname;
    chrome.storage.sync.remove(hostname, () => {
      chrome.tabs.sendMessage(activeTab.id, { action: "resetFont" });
      window.close();
    });
  });
});

// ==========================================
// NEW: Export / Import Logic
// ==========================================

// 1. Export Settings to JSON File
exportBtn.addEventListener('click', () => {
  // Get ALL data from storage
  chrome.storage.sync.get(null, (items) => {
    const jsonStr = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create hidden download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edge-font-changer-backup.json';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});

// 2. Import Trigger (Click hidden input)
importBtn.addEventListener('click', () => {
  fileInput.click();
});

// 3. Process Import File
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      
      // Save data to storage
      chrome.storage.sync.set(data, () => {
        showMsg("Settings Imported Successfully!");
        
        // Refresh UI
        chrome.storage.sync.get(['customUserFonts'], (result) => {
            const userFonts = result.customUserFonts || [];
            renderFontList(userFonts);
        });
      });
    } catch (err) {
      showMsg("Error parsing JSON file.", true);
      console.error(err);
    }
  };
  reader.readAsText(file);
});
Here is a comprehensive, professional `README.md` file tailored for your project. You can copy this directly into your project folder.

I have included sections on **Installation**, **Usage**, **Smart Features** (like the Math/Icon protection), and **Technical Details**.

***

# Edge Font Changer 🎨

**Edge Font Changer** is a lightweight, privacy-focused browser extension that allows you to enforce custom **Google Fonts** on any website.

It is built with **Manifest V3** and is compatible with Microsoft Edge, Google Chrome, Brave, and other Chromium-based browsers.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 🌟 Key Features

*   **Google Fonts Integration:** Choose from a curated list of top 50 fonts or import **any** font URL directly from Google Fonts.
*   **Per-Site Persistence:** Settings are saved automatically for each domain. You can have *Inter* on Wikipedia and *Open Sans* on GitHub.
*   **Smart Element Protection:** intelligently avoids breaking icons, mathematical formulas (KaTeX/MathJax), and code blocks.
*   **High-Definition Rendering:** Forces `-webkit-font-smoothing` for crisp text rendering on Windows.
*   **CSS Selectors:** Apply fonts to the whole page (`*`) or specific elements (e.g., `h1, p, .article-body`).
*   **Data Portability:** Export and Import your settings to sync across different computers.

---

## 🚀 Installation

Since this extension is not yet in the Edge Add-ons Store, you can install it in "Developer Mode".

1.  **Clone or Download** this repository to a folder on your computer.
2.  Open your browser (Edge or Chrome).
3.  Navigate to the extensions page:
    *   **Edge:** `edge://extensions`
    *   **Chrome:** `chrome://extensions`
4.  Enable **Developer Mode** (usually a toggle switch in the sidebar or top right).
5.  Click the **"Load unpacked"** button.
6.  Select the folder where you saved these files.

---

## 📖 Usage Guide

### 1. Changing a Font
1.  Navigate to any website (e.g., [Wikipedia](https://wikipedia.org)).
2.  Click the **Edge Font Changer** icon in your browser toolbar.
3.  Select a font from the dropdown list.
4.  Click **Apply & Save**. The page will update instantly.

### 2. Adding a Custom Google Font
1.  Go to [Google Fonts](https://fonts.google.com/).
2.  Select a font family (e.g., "Bungee Spice").
3.  Click "Get Font" -> "Get Embed Code".
4.  Copy the **URL** from the `<link href="...">` tag.
    *   *Example:* `https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap`
5.  Paste this URL into the **"Add from Google Fonts URL"** box in the extension popup.
6.  Click **Add to List**. It will now appear in your dropdown with a `[User]` tag.

### 3. Backup & Sync
1.  Open the extension popup.
2.  Click **Export JSON** to save a backup of your site settings and custom fonts.
3.  On another computer, click **Import JSON** to restore your setup.

---

## 🛡️ Smart Exclusions & Protection

One of the biggest challenges with font changers is that they often break **Icons**, **Math Formulas**, and **Code Blocks**.

This extension uses a robust **"Exclude & Restore"** CSS strategy:

*   **Icons:** Automatically detects and ignores FontAwesome, Material Icons, Bootstrap Icons, and generic classes like `.icon`, `.ico`, `.glyph`.
*   **Math:** Detects **KaTeX** and **MathJax** containers and forces them to inherit the correct mathematical fonts so equations render correctly.
*   **Code:** Forces `pre`, `code`, and `kbd` blocks to use the system monospace font stack (Consolas, Menlo, etc.) for readability.

---

## 🛠️ Technical Details

### Project Structure
```text
EdgeFontChanger/
├── manifest.json   # Extension configuration (Manifest V3)
├── popup.html      # The UI layout
├── popup.js        # Logic for saving settings and parsing URLs
├── content.js      # The script that injects CSS into webpages
└── icons/          # (Optional) Icon files
```

### Permissions Explained
*   `storage`: Used to save your font preferences per website (hostname) and your custom font list.
*   `activeTab`: Required to determine which website you are currently viewing.
*   `scripting`: Required to inject the font styles into the page securely.

---

## 🤝 Contributing

Contributions are welcome! If you find a website where the font breaks icons or layout, please open an Issue with the URL and a screenshot.

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
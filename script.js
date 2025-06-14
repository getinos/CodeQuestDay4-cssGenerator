// DOM elements
const htmlTab = document.getElementById('htmlTab');
const cssTab = document.getElementById('cssTab');
const htmlEditor = document.getElementById('htmlEditor');
const cssEditor = document.getElementById('cssEditor');
const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');
const desktopPreview = document.getElementById('desktopPreview');
const mobilePreview = document.getElementById('mobilePreview');
const deviceSelect = document.getElementById('deviceSelect');
const generateMobileCSSBtn = document.getElementById('generateMobileCSS');

// Tab switching
htmlTab.addEventListener('click', () => {
  htmlTab.classList.add('active');
  cssTab.classList.remove('active');
  htmlEditor.classList.remove('hidden');
  cssEditor.classList.add('hidden');
});

cssTab.addEventListener('click', () => {
  cssTab.classList.add('active');
  htmlTab.classList.remove('active');
  cssEditor.classList.remove('hidden');
  htmlEditor.classList.add('hidden');
});

// Live preview updates
htmlCode.addEventListener('input', updatePreviews);
cssCode.addEventListener('input', updatePreviews);

// Device selector
deviceSelect.addEventListener('change', () => {
  const [width, height] = deviceSelect.value.split(',');
  mobilePreview.style.width = `${width}px`;
  mobilePreview.style.height = `${height}px`;
  updatePreviews();
});

// Preview update logic
function updatePreviews() {
  const html = htmlCode.value;
  const css = cssCode.value;
  const fullContent = `<style>${css}</style>${html}`;

  // Desktop preview (div)
  desktopPreview.innerHTML = fullContent;

  // Mobile preview (iframe)
  const mobileDoc = mobilePreview.contentWindow.document;
  mobileDoc.open();
  mobileDoc.write(fullContent);
  mobileDoc.close();
}

// Gemini API-powered CSS Generator
async function generateMobileCSS() {
  const currentHTML = htmlCode.value;
  const currentCSS = cssCode.value;

  if (currentCSS.includes('@media')) {
    alert("Mobile CSS already exists.");
    return;
  }

  const btn = generateMobileCSSBtn;
  const originalText = btn.innerHTML;

  btn.innerText = "Generating...";
  btn.disabled = true;

  try {
    const API_KEY = "YOUR_API_KEY_HERE";
    const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-pro:generateContent";

    const prompt = `You're a responsive web design assistant.
Given this HTML and desktop CSS, generate optimized CSS for mobile view using a media query (@media max-width: 768px). 
Make sure the layout becomes vertical, easy to scroll, and touch friendly.

HTML:
${currentHTML}

CSS:
${currentCSS}`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1024
        }
      })
    });

    if (!response.ok) {
      console.error(await response.text());
      alert("API Error — check the console.");
      return;
    }

    const data = await response.json();
    const mobileCSS = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!mobileCSS || !mobileCSS.includes('@media')) {
      alert("Invalid mobile CSS output.");
      return;
    }

    // Append to editor
    cssCode.value = `${currentCSS}\n\n/* Generated Mobile CSS */\n${mobileCSS}`;
    updatePreviews();

    // Feedback
    btn.innerText = "CSS Generated!";
    btn.style.backgroundColor = "#16a34a";

    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.backgroundColor = "#6366f1";
      btn.disabled = false;
    }, 2000);
  } catch (err) {
    console.error(err);
    alert("Failed to generate CSS. See console.");
    btn.innerText = originalText;
    btn.disabled = false;
  }
}

generateMobileCSSBtn.addEventListener('click', generateMobileCSS);
updatePreviews(); // Initial preview

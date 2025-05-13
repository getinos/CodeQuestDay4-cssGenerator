
// DOM elements
const darkModeToggle = document.getElementById('darkModeToggle');
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
  htmlTab.classList.add('text-indigo-600', 'dark:text-indigo-400', 'border-b-2', 'border-indigo-600', 'dark:border-indigo-400');
  htmlTab.classList.remove('text-gray-500', 'dark:text-gray-400');
  cssTab.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'border-b-2', 'border-indigo-600', 'dark:border-indigo-400');
  cssTab.classList.add('text-gray-500', 'dark:text-gray-400');
  htmlEditor.classList.remove('hidden');
  cssEditor.classList.add('hidden');
});

cssTab.addEventListener('click', () => {
  cssTab.classList.add('text-indigo-600', 'dark:text-indigo-400', 'border-b-2', 'border-indigo-600', 'dark:border-indigo-400');
  cssTab.classList.remove('text-gray-500', 'dark:text-gray-400');
  htmlTab.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'border-b-2', 'border-indigo-600', 'dark:border-indigo-400');
  htmlTab.classList.add('text-gray-500', 'dark:text-gray-400');
  cssEditor.classList.remove('hidden');
  htmlEditor.classList.add('hidden');
});

// Update previews when code changes
htmlCode.addEventListener('input', updatePreviews);
cssCode.addEventListener('input', updatePreviews);



// Generate Mobile CSS button
generateMobileCSSBtn.addEventListener('click', generateMobileCSS);

// Initial setup
function updatePreviews() {
    const html = htmlCode.value;
    const css = cssCode.value;
    const combinedContent = `
      <style>${css}</style>
      ${html}
    `;
  
    // Update desktop preview (still a div)
    desktopPreview.innerHTML = combinedContent;
  
    // Update mobile preview (iframe)
    const mobileFrame = mobilePreview.contentWindow.document;
    mobileFrame.open();
    mobileFrame.write(combinedContent);
    mobileFrame.close();
  }
  

async function generateMobileCSS() {
    const currentCSS = cssCode.value;
    const currentHTML = htmlCode.value;
  
    // Check for existing media queries
    if (currentCSS.includes('@media')) {
      alert('Mobile CSS already exists in your code!');
      return;
    }
  
    const btn = generateMobileCSSBtn;
    const originalText = btn.innerHTML;
  
    try {
      const API_KEY = "AIzaSyAKyKvLgfA-xEKHw7UN4qGLvf8NLWQVXVk";
      const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";
  
      const prompt = `You're a responsive web design assistant.
  Given the following HTML and desktop CSS, generate optimized CSS for mobile view for any mobile or tablet
  
  HTML:
  ${currentHTML}
  
  CSS:
  ${currentCSS}
  
  Your output must give the mobile version a clean and beautiful look and you can move the elements if required `;
  
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1024
          }
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        alert("Error generating mobile CSS. Check the console.");
        return;
      }
  
      const data = await response.json();
      const mobileCSS = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
      if (!mobileCSS) {
        alert("Failed to generate CSS. Try again.");
        return;
      }
  
      // Append mobile CSS to existing CSS
      cssCode.value = `${currentCSS}\n\n/* Generated Mobile CSS */\n${mobileCSS}`;
      updatePreviews();
  
      // Show success state on the button
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        CSS Generated!
      `;
      btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
      btn.classList.add('bg-green-600', 'hover:bg-green-700');
  
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
        btn.classList.remove('bg-green-600', 'hover:bg-green-700');
      }, 2000);
  
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong with the API call. Check console.");
    }
  }
  deviceSelect.addEventListener('change', () => {
    const [width, height] = deviceSelect.value.split(',');
    mobilePreview.style.width = `${width}px`;
    mobilePreview.style.height = `${height}px`;
  
    // Force re-render after size change
    updatePreviews();
  });
  

// Initialize
updatePreviews();

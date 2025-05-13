 Overview
This project is a web-based development utility tool that allows users to write and preview HTML and CSS in real time while also offering a one-click AI-powered solution to generate mobile-responsive CSS using the Google Gemini 2.0 Flash model.

It’s designed to help web developers and designers quickly visualize and adapt their layouts across devices without manually writing media queries.

🧩 Key Components
📝 Code Editors
Two tab-based editors for:

HTML

CSS

Switching between tabs shows respective editor using JavaScript.

🖼️ Live Previews
Desktop Preview: A div element renders combined HTML & CSS directly.

Mobile Preview: An iframe simulates how the layout appears on mobile.

Real-time updates: Any change in HTML or CSS updates both previews instantly.

📲 Device Selector
A dropdown lets users choose between predefined screen sizes (like iPhone, tablet, etc.).

Changing the selection updates the width and height of the mobile preview to simulate real devices.

🧠 Generate Mobile CSS (AI-powered)
One-click button sends current HTML and CSS to Google Gemini 2.0 Flash API.

Gemini returns mobile-optimized CSS, which gets:

Appended to the existing CSS

Automatically applied to both previews

🌙 Dark Mode Toggle
A dark/light theme toggle button that enhances user experience.

⚙️ Technical Flow (Behind the Scenes)
User Inputs HTML and CSS in respective textareas.

JavaScript captures the inputs and dynamically injects the content into:

A div (desktopPreview)

An iframe (mobilePreview)

When the user clicks “Generate Mobile CSS”:

JS sends a request to Google’s Gemini API with current HTML & CSS

Gemini analyzes and generates a clean, responsive mobile-first CSS using media queries

The mobile CSS is appended to the existing CSS code

Previews update instantly with new mobile styles

The device dropdown triggers style changes to simulate various devices by modifying the iframe’s size.

📦 Use Case
Ideal for:

Developers quickly testing mobile responsiveness

Designers wanting instant feedback without switching devices

Students learning how desktop layouts can translate to mobile

Prototyping fast without writing complex responsive media queries

🔐 Security Note
This project uses Google Gemini's API, and the API key is manually embedded. Make sure to:

Use environment variables/server-side logic in production to avoid exposing keys.

Rotate keys if compromised.

✅ Future Improvements (Suggestions)
Add code saving/loading from localStorage or cloud

Implement HTML/CSS syntax highlighting (e.g., with CodeMirror or Monaco)

Allow downloading the generated mobile CSS separately

Use a backend proxy to hide API keys securely

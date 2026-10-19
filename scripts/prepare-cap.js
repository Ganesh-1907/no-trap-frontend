import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, ".output", "public");
const assetsDir = path.join(publicDir, "assets");

if (!fs.existsSync(publicDir)) {
  console.error("Directory .output/public does not exist. Run 'npm run build' first.");
  process.exit(1);
}

// Find main js and css in assets directory
let cssFile = "";
let jsFile = "";

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  for (const f of files) {
    if (f.startsWith("styles-") && f.endsWith(".css")) {
      cssFile = `assets/${f}`;
    }
    if (f.startsWith("index-") && f.endsWith(".js")) {
      jsFile = `assets/${f}`;
    }
  }
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no" />
  <title>NoTrap.co — Scope Agreement & Protection</title>
  <meta name="theme-color" content="#F5F1E8" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=Manrope:wght@400;500;700&display=swap" />
  <link rel="icon" href="favicon.ico" type="image/x-icon" />
  ${cssFile ? `<link rel="stylesheet" href="${cssFile}" />` : ""}
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F5F1E8;
      font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
    }
    #app-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      width: 100vw;
      background: #F5F1E8;
      color: #0D1527;
      text-align: center;
      padding: 24px;
      box-sizing: border-box;
    }
    .loader-brand {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .loader-spinner {
      margin-top: 18px;
      width: 32px;
      height: 32px;
      border: 3px solid rgba(13, 21, 39, 0.1);
      border-top-color: #0B7C62;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="root">
    <div id="app-loader">
      <div class="loader-brand">NoTrap<span style="color:#0B7C62">.co</span></div>
      <p style="font-size:13px;color:#596780;margin:8px 0 0 0;">Clear project agreements. Zero confusion.</p>
      <div class="loader-spinner"></div>
    </div>
  </div>
  ${jsFile ? `<script type="module" src="${jsFile}"></script>` : ""}
</body>
</html>
`;

fs.writeFileSync(path.join(publicDir, "index.html"), htmlContent, "utf-8");
console.log("✓ Successfully generated .output/public/index.html for Capacitor");

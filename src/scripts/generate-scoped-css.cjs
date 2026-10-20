const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../../../../HUREMASO/frontend/dist/assets/index-DMHBn_NZ.css');
const targetPath = path.resolve(__dirname, '../styles/huremaso-scoped.css');

const css = fs.readFileSync(cssPath, 'utf8');

const containerStyles = `/* =========================================================================
   Huremaso HRMS Scoped Stylesheet for LETGETIN ERP Integration
   All styles strictly scoped to .huremaso-scope to prevent collisions
========================================================================= */

.huremaso-scope {
  --primary-color: #004848;
  --primary-hover: #003333;
  --primary-font-color: #ffffff;
  --secondary-color: #f3f4f6;
  --secondary-font-color: #1f2937;
  --primary-gradient-1: #002222;
  --primary-gradient-2: #007878;
  position: relative;
  width: 100%;
  min-height: calc(100vh - 170px);
  contain: paint;
  transform: translateZ(0);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  background-color: #f8fafc;
  color: #1e293b;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Ensure header and aside inside .huremaso-scope sit cleanly within the container */
.huremaso-scope header {
  position: absolute !important;
}

.huremaso-scope aside {
  position: absolute !important;
}

/* Scoped Huremaso Tailwind & Component Rules */
@scope (.huremaso-scope) {
`;

const fullCss = containerStyles + '\n' + css + '\n}\n';
fs.writeFileSync(targetPath, fullCss);
console.log('Generated huremaso-scoped.css successfully, length:', fullCss.length);

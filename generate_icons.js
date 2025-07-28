const fs = require('fs');
const path = require('path');

// Base64 encoded 16x16 icon (blue play button with skip arrow)
const icon16Base64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADrSURBVDiNpdK9SgNBEAbgby8xYBAjWFiIIFhY2FhY2Fj4AraCjYVgYW1hY2FhY2FhYWGjYCEoKIgQwQcR9G4nM7uzu4lX7MDCzP7z7c7s7PwjpQqM6wXWcYw7vOEJt7jH1V8V1nCJb6Rf4x3n2Pqtwj5eQwX9eMZ+WcU9vJQoF8cFimc4qWg0I9zrJYp7OClROEbm2UKR3gvUfjEVpnCNT5KFD6wXaZwhc8ShXfslCmc4b1E4Q27ZQrHeCtReMVemcIRXksUXrBfpnCIlxKFFxyUKRzg+Q+FYxyWKRzhuUThCYdlCvt4KlF4xFGZwh4eSxQecFymcI+TEoVbnJYp3OGsTOEW52UKN7goU7jGZZnCFa7KFP4Bc4s5WZ9QYl4AAAAASUVORK5CYII=';

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Save the 16x16 icon
fs.writeFileSync(
  path.join(iconsDir, 'icon16.png'),
  Buffer.from(icon16Base64, 'base64')
);

console.log('Icons generated successfully!');
console.log('1. Go to chrome://extensions/');
console.log('2. Enable "Developer mode" in the top right');
console.log('3. Click "Load unpacked" and select the extension directory');
console.log('4. The icon should now appear in your Chrome toolbar');

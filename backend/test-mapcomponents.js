// Quick test to check if mapComponents method exists
import { readFileSync } from 'fs';

const serverCode = readFileSync('./server.js', 'utf8');

console.log('🔍 Checking for mapComponents method...');

// Check if mapComponents is defined in the code
const hasMapComponentsMethod = serverCode.includes('mapComponents(analysis)');
const hasMapComponentsCall = serverCode.includes('this.mapComponents(analysis)');

console.log('Has mapComponents method definition:', hasMapComponentsMethod);
console.log('Has mapComponents call:', hasMapComponentsCall);

// Find the line numbers
const lines = serverCode.split('\n');
lines.forEach((line, index) => {
  if (line.includes('mapComponents(analysis)')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});

console.log('✅ Test complete');
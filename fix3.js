const fs = require('fs');

let nodeConfig = fs.readFileSync('packages/tsconfig/node.json', 'utf8');
nodeConfig = nodeConfig.replace(/"module": "NodeNext"/g, '"module": "ES2022"');
nodeConfig = nodeConfig.replace(/"moduleResolution": "NodeNext"/g, '"moduleResolution": "bundler"');
fs.writeFileSync('packages/tsconfig/node.json', nodeConfig);


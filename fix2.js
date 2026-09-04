const fs = require('fs');

// Revert index.ts
let indexContent = fs.readFileSync('packages/shared/src/index.ts', 'utf8');
indexContent = indexContent.replace(/\.js'/g, "'");
fs.writeFileSync('packages/shared/src/index.ts', indexContent);

// Fix auth.ts
let authContent = fs.readFileSync('services/api/src/middlewares/auth.ts', 'utf8');
authContent = authContent.replace(/as UserProfile/g, "as any");
fs.writeFileSync('services/api/src/middlewares/auth.ts', authContent);

// Fix pagination.ts
let pagContent = fs.readFileSync('services/api/src/utils/pagination.ts', 'utf8');
pagContent = pagContent.replace(/const PAGINATION_DEFAULTS = \{ page: 1, pageSize: 20 \};/g, "const PAGINATION_DEFAULTS = { page: 1, pageSize: 20, maxPageSize: 100 };");
fs.writeFileSync('services/api/src/utils/pagination.ts', pagContent);

// Modify node.json to use bundler
let nodeConfig = fs.readFileSync('packages/tsconfig/node.json', 'utf8');
nodeConfig = nodeConfig.replace(/"moduleResolution": "NodeNext"/g, '"moduleResolution": "bundler"');
fs.writeFileSync('packages/tsconfig/node.json', nodeConfig);


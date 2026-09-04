const fs = require('fs');
const path = require('path');

// 1. Fix shared/src/index.ts
const sharedIndex = 'packages/shared/src/index.ts';
if (fs.existsSync(sharedIndex)) {
    let content = fs.readFileSync(sharedIndex, 'utf8');
    content = content.replace(/from '\.\/types'/g, "from './types.js'");
    content = content.replace(/from '\.\/constants'/g, "from './constants.js'");
    content = content.replace(/from '\.\/schemas'/g, "from './schemas.js'");
    fs.writeFileSync(sharedIndex, content);
    console.log('Fixed shared/src/index.ts');
}

// 2. Fix controllers req.params.id
const controllers = [
    'services/api/src/modules/contactEnquiries/contactEnquiry.controller.ts',
    'services/api/src/modules/corporateEnquiries/corporateEnquiry.controller.ts',
    'services/api/src/modules/heroSlides/heroSlide.controller.ts',
    'services/api/src/modules/orders/order.controller.ts',
    'services/api/src/modules/salesCampaigns/salesCampaign.controller.ts'
];

controllers.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/req\.params\.id/g, '(req.params.id as string)');
        fs.writeFileSync(file, content);
        console.log('Fixed ' + file);
    }
});

// 3. Fix repositories dto[camelKey]
const repos = [
    'services/api/src/modules/contactEnquiries/contactEnquiry.repository.ts',
    'services/api/src/modules/corporateEnquiries/corporateEnquiry.repository.ts',
    'services/api/src/modules/festivals/festival.repository.ts',
    'services/api/src/modules/orders/order.repository.ts'
];

repos.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/dto\[camelKey\] = value;/g, '(dto as any)[camelKey] = value;');
        fs.writeFileSync(file, content);
        console.log('Fixed ' + file);
    }
});

// 4. Fix auth.ts (Missing UserProfile)
const authFile = 'services/api/src/middlewares/auth.ts';
if (fs.existsSync(authFile)) {
    let content = fs.readFileSync(authFile, 'utf8');
    // If UserProfile is imported from shared but missing, we can just use any for the middleware cast
    content = content.replace(/import \{ UserProfile \} from '@grandmas-ladle\/shared';/g, '');
    content = content.replace(/req\.user = decoded as UserProfile;/g, 'req.user = decoded as any;');
    fs.writeFileSync(authFile, content);
    console.log('Fixed auth.ts');
}

// 5. Fix pagination.ts (Missing PAGINATION_DEFAULTS)
const pagFile = 'services/api/src/utils/pagination.ts';
if (fs.existsSync(pagFile)) {
    let content = fs.readFileSync(pagFile, 'utf8');
    content = content.replace(/import \{ PAGINATION_DEFAULTS \} from '@grandmas-ladle\/shared';/g, "const PAGINATION_DEFAULTS = { page: 1, pageSize: 20 };");
    fs.writeFileSync(pagFile, content);
    console.log('Fixed pagination.ts');
}


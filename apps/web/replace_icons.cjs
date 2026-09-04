const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/features/home/pages/HomePage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  '<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">',
  '<div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto mt-12">'
);

const flexItemClass = '<div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-brand-cream/50 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">';
const oldItemClass = '<div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-brand-cream/50">';
content = content.split(oldItemClass).join(flexItemClass);

const oldFreshClass = '<div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-brand-cream/50 lg:col-start-1 lg:col-end-3 lg:w-1/2 lg:ml-auto lg:mr-4">';
content = content.replace(oldFreshClass, flexItemClass);

const oldLoveClass = '<div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-brand-cream/50 lg:col-start-3 lg:col-end-4 lg:w-full">';
content = content.replace(oldLoveClass, flexItemClass);

const svgs = {
  traditional: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2C4A3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-brand-green"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  homemade: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2C4A3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-brand-green"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
  wholesome: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2C4A3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-brand-green"><path d="M12 2v20"/><path d="m15 13-3 3"/><path d="m9 13 3 3"/><path d="m15 9-3 3"/><path d="m9 9 3 3"/><path d="m15 5-3 3"/><path d="m9 5 3 3"/></svg>',
  fresh: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2C4A3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-brand-green"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.1-1.9-2.2-3.5a1 1 0 0 1 1-1h3.7z"/><path d="M14.1 7.4c-.9 1.1-1.3 2.6-1.8 4.1 2.2.1 4 .1 5.4-.7 1.2-.8 2.1-2.1 2.2-3.7a1 1 0 0 0-1-1h-4.8z"/></svg>',
  love: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2C4A3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-brand-green"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'
};

content = content.replace(/<span className="text-4xl mb-4" aria-hidden="true">.*?<\/span>\s*<h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Traditional<\/h3>/, svgs.traditional + '\n              <h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Traditional</h3>');
content = content.replace(/<span className="text-4xl mb-4" aria-hidden="true">.*?<\/span>\s*<h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Homemade<\/h3>/, svgs.homemade + '\n              <h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Homemade</h3>');
content = content.replace(/<span className="text-4xl mb-4" aria-hidden="true">.*?<\/span>\s*<h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Wholesome<\/h3>/, svgs.wholesome + '\n              <h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Wholesome</h3>');
content = content.replace(/<span className="text-4xl mb-4" aria-hidden="true">.*?<\/span>\s*<h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Fresh<\/h3>/, svgs.fresh + '\n              <h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Fresh</h3>');
content = content.replace(/<span className="text-4xl mb-4" aria-hidden="true">.*?<\/span>\s*<h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Made with love<\/h3>/, svgs.love + '\n              <h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Made with love</h3>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Homepage updated successfully!');

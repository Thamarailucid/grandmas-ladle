const http = require('http');
http.get('http://localhost:5000/api/v1/SalesCampaign', {
  headers: { 'Cookie': 'connect.sid=some-cookie-if-needed' }
}, (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log(data); });
}).on('error', (err) => { console.log('Error: ' + err.message); });

const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'asset.brandfetch.io',
  port: 443,
  path: '/idf8O733kX/idT-EwA2c1.png',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('c:/Projects/cake/public/cta/navi.png');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded');
    });
  } else if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
      console.log('Redirected to: ' + res.headers.location);
  } else {
    console.log(`Failed with status: ${res.statusCode}`);
  }
});
req.on('error', (e) => {
  console.error(e);
});
req.end();

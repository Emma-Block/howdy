const https = require('https');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const eventURL = 'https://www.robotevents.com/robot-competitions/vex-robotics-competition/RE-VRC-16-5190.html';

https.get(eventURL, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^text\/html/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected text/html but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      // const parsedData = JSON.parse(rawData);
      // console.log(parsedData);
      // console.log(rawData);
      const { document } = (new JSDOM(rawData)).window;
      let teamList = document.querySelector('#teamList');
      // console.log(teamList.innerHTML);
      let teamCells = teamList.querySelectorAll('tbody tr td:first-child');
      let teams = [...teamCells].map((cell) => cell.textContent);
      console.log(teams);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

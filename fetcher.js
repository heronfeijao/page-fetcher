const fs = require('fs');
const request = require('request');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2);
const website = args[0];
const newFile = args[1];

request(website, (error, response, body) => {
  const writeFile = (newFile, body) => {
    fs.writeFile(newFile, body, err => {
      if (err) {
        console.error(err);
        process.exit();
      }
      const fileSize = fs.statSync(newFile).size;
      console.log(`Downloaded and saved ${fileSize} bytes to ${newFile}`);
      process.exit();
    });
  };

  fs.access(newFile, fs.R_OK, (err) => {
    if (err) {
      writeFile(newFile, body, err);
      return;
    } else {
      rl.question('File already exists. Would you like to replace it? (y/n) ', (answer) => {
        if (answer === 'y') {
          writeFile(newFile, body, err);
        } else if (answer === 'n') {
          process.exit();
        }
      });
    }
  });
});


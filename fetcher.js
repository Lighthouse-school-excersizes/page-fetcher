const fs = require('fs');
const request = require('request');
const readline = require('readline');
const isValid = require('is-valid-path');
const userInputArr = process.argv.slice(2);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const userAnswers = (answer) => {
  if (answer === 'n') {
    rl.close();
  } else if (answer === 'y') {
    fileInfo(userInputArr);
    rl.close();
  } else if (answer !== 'y' || answer !== 'n') {
    rl.question('please type y/n: ', (answer) => {
      userAnswers(answer);
    });
  }
};

const fileInfo = (userInputArr) => {
  request(userInputArr[0], (err, response, body) => {
    if (err) throw err;
    fs.writeFile(userInputArr[1], body, (err) => {
      if (err) throw err;
      const stats = fs.statSync(userInputArr[1]);
      const fileSizeInBytes = stats["size"];
      console.log(`Downloaded and saved ${fileSizeInBytes} bytes to ${userInputArr[1]}`);
    });
  });
};

const fetcher = () => {
  if (fs.existsSync(userInputArr[1])) {
    rl.question(`file ${userInputArr[1]} already exist, would you like to overwrite? y/n: `, (answer) => {
      userAnswers(answer);
    });
  } else {
    if (!isValid(userInputArr[1])) {
      console.log('invalid file path');
      rl.close();
    } else if (!userInputArr[0].includes('http://')) {
      console.log('invalid url');
      rl.close();
    } else {
      fileInfo(userInputArr);
    }
    rl.close();
  }
};
fetcher();
#!/usr/local/bin/node
const readline = require('readline');
const crypto = require('crypto')
const request = require('request')
let shasum = crypto.createHash('sha1');


if(process.argv.length < 3) {
  console.log(`No password specified usage: ${process.argv[0]} ${process.argv[1]} password`);
  return;
}


shasum.update(process.argv[2] || '');

const hex = shasum.digest('hex')
const test = hex.substr(0,5);
const match = hex.substr(5);

console.log(`Looking for prefix   ${hex.substr(0,5)} in pwnedpasswords.com`);

getData(`https://api.pwnedpasswords.com/range/${test}`).then(data => {
  if(data.indexOf(match.toUpperCase()) > -1) {
    let pwncount = (data.substr(data.indexOf(match.toUpperCase()), 40).trim().split(':')[1]);
    console.log(`Pwned! ${pwncount} times`);
  }else {
    console.log(`Safe!`);
  }
}).catch(err => {
  console.log(err)
})

function getData(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {

      if(err) {
        reject(err);
      }
      resolve(body)
    });
    //reject();
  })
}




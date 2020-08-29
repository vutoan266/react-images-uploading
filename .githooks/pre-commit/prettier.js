#!/usr/bin/env node

const { exec } = require('child_process');
const chalk = require('chalk');

exec('npm run prettier', function(err, stdout) {
  if (err) {
    console.error(err);
  }
  console.log(chalk.green(stdout));
});

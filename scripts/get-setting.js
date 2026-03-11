#!/usr/bin/env node
const path = require('path');
const { resolveSetting } = require('../src/lib/config/setting-resolver');

const varName = process.argv[2];
const fallback = process.argv[3] || 'ask';

if (!varName) {
  console.error("Usage: get-setting.js <VAR_NAME> [fallback]");
  process.exit(1);
}

const val = resolveSetting(varName, process.cwd());
console.log(val !== undefined ? val : fallback);

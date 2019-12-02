'use strict';

const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 9001;

const storedConfig = require('./config.js');

const config = {}; //External variables not for Git, credentials etc

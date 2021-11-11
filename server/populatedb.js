#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true',
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
const mongoose = require('mongoose');
const mongoDB = userArgs[0];
const async = require('async');
const Schema = mongoose.Schema;
const model = mongoose.model;

const sitterServiceSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  method: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
  },
  headers: {
    type: Object,
  },
});

const sitterServiceModel = model('SitterService', sitterServiceSchema);

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = [];
var genres = [];
var books = [];
var bookinstances = [];

function sitterServiceCreate(url, method, data, headers) {
  const sitterService = new sitterServiceModel({
    url,
    method,
    data,
    headers,
  });

  sitterService.save(function (err) {
    console.log(err);
  });
}

function createSitterServices() {
  async.series([
    function () {
      const url = 'https://spb.profi.ru/graphql/?gqlid=%24GQLID%7Bbc07a13e532565e061564412f05d352b%7D';
      const method = 'post';
      const data = {
        query: '$GQLID{bc07a13e532565e061564412f05d352b}',
        variables: {
          wizardInput: {
            projectId: 'vet',
            pserviceId: 2000774,
            answers: [],
            profileIds: [],
            wizardSession: '5ff30188-2114-462c-bc02-d312705f',
          },
          wizardSessionId: '5ff30188-2114-462c-bc02-d312705f',
          pageType: 'order.seamless',
          geoCityId: 'spb',
          searchFilter: {
            p: 1,
            sort: 'SEAMLESS',
          },
          photoWidth: 1500,
        },
      };
      sitterServiceCreate(url, method, data, null);
    },
    function () {
      const url =
        'https://dogsy.ru/search?bounds=((59.398630000000004,%2029.77413),%20(60.47863,%2030.854129999999998))&placeName=%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F,%20%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3';
      const method = 'get';
      const headers = { 'x-requested-with': 'XMLHttpRequest' };
      sitterServiceCreate(url, method, null, headers);
    },
  ]);
}

async.series(
  [createSitterServices],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  },
);

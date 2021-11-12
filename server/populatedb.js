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

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  fullAddress: {
    type: String,
    required: true,
  },
  geo: {
    type: Object,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  description: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  externalId: {
    type: String,
  },
  rating: {
    type: Number,
  },
  reviewsCount: {
    type: Number,
  },
});

const hotelModel = model('Hotel', hotelSchema);

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let hotels = [];
let sitterServices = [];

function sitterServiceCreate(url, method, data, headers, cb) {
  const sitterService = new sitterServiceModel({
    url,
    method,
    data,
    headers,
  });

  sitterService.save(function (err) {
    if (err) {
      console.log('ERROR CREATING SitterService: ' + sitterService);
      cb(err, null);
      return;
    }
    console.log('New SitterService: ' + sitterService);
    sitterServices.push(sitterService);
    cb(null, sitterService);
  });
}

function hotelCreate(name, fullAddress, geo, link, icon, phone, email, cb) {
  const hotel = new hotelModel({
    name,
    fullAddress,
    geo,
    link,
    icon,
    phone,
    email,
  });

  hotel.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Hotel: ' + hotel);
      cb(err, null);
      return;
    }
    console.log('New Hotel: ' + hotel);
    hotels.push(hotel);
    cb(null, hotel);
  });
}

function createSitterServices(cb) {
  async.series(
    [
      function (cb) {
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
        sitterServiceCreate(url, method, data, null, cb);
      },
      function (cb) {
        const url =
          'https://dogsy.ru/search?bounds=((59.398630000000004,%2029.77413),%20(60.47863,%2030.854129999999998))&placeName=%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F,%20%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3';
        const method = 'get';
        const headers = { 'x-requested-with': 'XMLHttpRequest' };
        sitterServiceCreate(url, method, null, headers, cb);
      },
    ],
    cb,
  );
}

function createHotels(cb) {
  async.series(
    [
      function (cb) {
        hotelCreate(
          '"Питомцы в Радости" гостиница для кошек, маленьких собак, грызунов и хорьков',
          'ул. Лабутина д. 8',
          { lat: 59.93569, lng: 30.37659 },
          'pitomcivradosti.ru',
          'https://zooprice.ru/articles_img/hotels/pitomcivradosti/pr1.jpg',
          '+7 (911) 217-10-17',
          'pitomcivradosti@yandex.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Котэ" гостиница для кошек и мелких животных',
          'Большой пр. В. О., д. 89',
          { lat: 59.93869, lng: 30.28261 },
          'otelkote.ru',
          'https://zooprice.ru/articles_img/hotels/KOTE/logkote.jpg',
          '+7 (900) 622-86-41',
          'mail@otelkote.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"ГулиГавка", гостиница для животных',
          'ул. Николая Рубцова, д. 11',
          { lat: 60.07721, lng: 30.33878 },
          'www.guligavka.ru',
          'https://zooprice.ru/articles_img/hotels/guligavka/avgul1.jpg',
          '+7 (981) 881-69-16',
          'gulin@guligavka.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Гранат", гостиница для животных',
          'Парголово, ул. Подгорная, д. 92',
          { lat: 60.0904, lng: 30.25608 },
          'zoohotelgranat.ru',
          'https://zooprice.ru/articles_img/hotels/granat/gr.jpg',
          '+7 (812) 642-40-55',
          'corsospb@yandex.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Котэ" гостиница для кошек и мелких животных Ключевая',
          'Ключевая ул., д. 13',
          { lat: 59.974421, lng: 30.405557 },
          'otelkote.ru',
          'https://zooprice.ru/articles_img/hotels/KOTE/logkote.jpg',
          '+7 (931) 100-48-89',
          'mail@otelkote.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          'Лаки, ветеринарный центр',
          'Учительская ул., д. 14, кор. 2',
          { lat: 60.033531, lng: 30.3999761 },
          'zverideti.ru',
          'https://zooprice.ru/articles_img/hotels/logo/Lucky.jpg',
          '+7 (812) 291-57-58',
          null,
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Верные друзья", ветклиника, зоогостиница',
          'ул. Демьяна Бедного, д.26, корп.1',
          { lat: 60.046089, lng: 30.3883761 },
          'vdvet.ru',
          'https://zooprice.ru/articles_img/hotels/logo/VernDr.jpg',
          '+7 (812) 497-62-52',
          null,
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Котвиль", гостиница для кошек',
          'ул. Политехническая, д. 9Н',
          { lat: 59.9921459, lng: 30.361573 },
          'kotville.ru',
          'https://zooprice.ru/articles_img/hotels/kotvil/kotvil1.jpg',
          '+7 (812) 923-53-33',
          null,
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Cat Town", гостиница для кошек',
          'Ленинский пр., д. 139',
          { lat: 59.8515508, lng: 30.285348 },
          'cat-town.ru',
          'https://zooprice.ru/articles_img/hotels/CatTown/ct.jpg',
          '+7 (812) 645-70-17',
          'ct-zoo@yandex.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Ветслужба № 1", ветклиника, зоогостиница',
          'Ленинский 106',
          { lat: 59.8527612, lng: 30.230279 },
          null,
          'https://zooprice.ru/articles_img/hotels/logo/VS1.jpg',
          null,
          null,
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          'КотОпес - зоогостиница, зоотакси',
          'Колпино',
          { lat: 59.79895, lng: 30.6458021 },
          'kotopesspb.ru',
          'https://zooprice.ru/articles_img/hotels/kotopes/kpkat.jpg',
          '+7 (931) 256-24-99',
          '9312562499@mail.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Tommy", зоогостиница',
          'ул.2-ая Поперечная, дом 32А',
          { lat: 59.97844449999999, lng: 30.5517869 },
          'hotel-tommy.ru',
          'https://zooprice.ru/articles_img/hotels/tommy/avTom.jpg',
          '+7 (921) 980-50-00',
          'info@hotel-tommy.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Веста", ветклиника, зоогостиница',
          'ул. Котина, дом 2, кор 1',
          { lat: 59.85613900000001, lng: 30.2095849 },
          'vesta.vet',
          'https://zooprice.ru/articles_img/clinics/vesta/avavesta.jpg',
          '+7 (812) 962-19-20',
          null,
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"МуррЛяндия", отель для кошек',
          'ул.Софийская, д.8',
          { lat: 59.88367659999999, lng: 30.3901494 },
          'murrlandia.ru',
          'https://zooprice.ru/articles_img/hotels/murrlandia/loga.jpg',
          '+7 (921) 790-29-27',
          'info@murrlandia.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          'Гостиница для кошек "Мяу Сити"',
          'ул. Кольцевая,д.13. Курортный район',
          { lat: 60.1368162, lng: 29.9985989 },
          'maucity.ru',
          'https://zooprice.ru/articles_img/hotels/myausity/av.jpg',
          '+7 (981) 780-40-10',
          null,
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          'Гостиница для животных "Зоотель"',
          'Московское шоссе, д. 14, к. 1, пом. 17-Н',
          { lat: 59.836592, lng: 30.336135 },
          'zooecohotel.ru',
          'https://zooprice.ru/articles_img/hotels/logo/ZooEcoHotel.jpg',
          '+7 (812) 411-44-84',
          'info@zooecohotel.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          'Будка, салон, гостиница',
          'ул. Гастелло, д. 28',
          { lat: 59.858618, lng: 30.3331911 },
          'www.hotel-budka.ru',
          'https://zooprice.ru/articles_img/hotels/budka/logokat.jpg',
          'hotel-budka@mail.ru',
          null,
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          'Ветеринарный центр доктора Костикова',
          'Московский пр., д. 136 – 2а',
          { lat: 59.8873013, lng: 30.3202912 },
          'www.vetmedicina.com',
          'https://zooprice.ru/articles_img/clinics/Kostikov/Kostikov1.jpg',
          '+7 (812) 387-18-01',
          'info@vetmedicina.com',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          'Зоогостиница, для кошек "Cat Diamonds"',
          'ул. Ворошилова, д. 2',
          { lat: 59.9226966, lng: 30.4425068 },
          'catdiamonds.ru',
          'https://zooprice.ru/articles_img/hotels/catDiamonds/cdav.jpg',
          '+7 (911) 038-52-77',
          'info@catdiamonds.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          'Зоогостиница, ветклиника "Ответ"',
          'ул. Коллонтай, д.41',
          { lat: 59.92358300000001, lng: 30.497075 },
          'www.vetotvet.com',
          'https://zooprice.ru/articles_img/clinics/otvet/otvet.jpg',
          '+7 (812) 642-95-86',
          null,
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          'Зоогостиница, ветклиника "ДокВет"',
          'Московское шоссе, д. 14, к. 1, пом. 17-Н',
          { lat: 59.915039, lng: 30.45492 },
          'dokvet.com',
          'https://zooprice.ru/articles_img/clinics/docvet/dv.jpg',
          '+7 (812) 242-87-55',
          'info@dokvet.com',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Милый друг" гостиница для животных и зоосалон',
          'П.С. улица Ленина, д. 20',
          { lat: 59.9618879, lng: 30.3040858 },
          'zoohotelspb.ru',
          'https://zooprice.ru/articles_img/hotels/logo/MilyjDrug.jpg',
          '+7 (952) 262-65-65',
          'info@zoohotelspb.ru',
          cb,
        );
      },
      function (cb) {
        hotelCreate(
          '"Petty Burg", зоогостиница для кошек, грызунов, птиц и хорьков',
          'Воронежская ул., д. 37, оф. 4',
          { lat: 59.91331079999999, lng: 30.345797 },
          'pettyburg.ru',
          'https://zooprice.ru/articles_img/hotels/Petty_Burg/pbav.jpg',
          '+7 (999) 213-38-00',
          null,
          cb,
        );
      },
    ],
    cb,
  );
}

async.series(
  [createSitterServices, createHotels],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  },
);

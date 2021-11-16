import axios, { AxiosRequestHeaders, Method } from 'axios';
import { SearchCategoryType } from '../enums/search.category.type';
import { SitterSourceType } from '../enums/sitter.source.type';
import NodeCache from 'node-cache';
import NodeGeocoder from 'node-geocoder';
import { SearchResponse } from '../interfaces/search.response.interface';
import { PetType } from '../enums/pet.type';
import {Sitter} from "../interfaces/sitter.interface";

const objectMapper = require('object-mapper');

const options = {
  provider: 'google',
  apiKey: 'AIzaSyB9BfnD76TfXlYQ-u_oZCjwC5f82ZgEhVI',
};

const geocoder = NodeGeocoder(options);

type SitterResponseFromService = Omit<SearchResponse, 'paging'>;

type RequestOptions = {
  url?: string;
  page?: number;
  url_DOGSITTING: string;
  url_DOGSITTING_REMOTE: string;
  method: Method;
  data?: Object;
  headers?: AxiosRequestHeaders;
  convert: (data: any) => SitterResponseFromService;
};

const serviceType = {
  2036230: 'зооняни',
  2000774: 'передержка животных',
  2002774: 'передержка кошек',
  2002775: 'передержка собак',
};

const petType = {
  2000774: [PetType.CAT, PetType.DOG, PetType.OTHER],
  2002774: [PetType.CAT],
  2002775: [PetType.DOG],
  2036230: [PetType.CAT, PetType.CAT, PetType.CAT],
};

const categoryType = {
  2000774: SearchCategoryType.DOGSITTING_REMOTE,
  2002774: SearchCategoryType.DOGSITTING,
  2002775: SearchCategoryType.DOGSITTING,
  2036230: SearchCategoryType.DOGSITTING,
};

const geoMap = {
  'Выезд к клиенту': SearchCategoryType.DOGSITTING_REMOTE,
  Район: SearchCategoryType.DOGSITTING,
  'Принимает у себя': SearchCategoryType.DOGSITTING,
};

const totalCountPattern = '.*<strong>([0-9]*?)</strong>.*';

const sitterServices: RequestOptions[] = [
  {
    url_DOGSITTING: 'https://spb.profi.ru/graphql/?gqlid=%24GQLID%7Bbc07a13e532565e061564412f05d352b%7D',
    url_DOGSITTING_REMOTE: 'https://spb.profi.ru/graphql/?gqlid=%24GQLID%7Bbc07a13e532565e061564412f05d352b%7D',
    method: 'post',
    data: {
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
    },
    convert: data => ({
      data: data.data.pxf.profiles.edges
        .map(edge => {
          const address = `Санкт-Петербург, ${
            edge.node.geo?.find(item => 'Район' === item.title || 'Принимает у себя' === item.title).values[0].values[0].text
          }`;
          return {
            ...objectMapper(edge.node, {
              id: 'externalId',
              fullName: 'name',
              avatar: {
                key: 'avatar',
                transform: val => `https:${val}`,
              },
              newRank: 'rating',
              reviewsCount: 'reviewsCount',
              geo: { key: 'address', transform: () => address },
              'priceListPreview.prices': {
                key: 'prices',
                transform: val => {
                  return val
                    ?.filter(item => Object.keys(categoryType).includes(item.price.serviceId))
                    .map(item => ({
                      category: categoryType[item.price.serviceId],
                      petType: petType[item.price.serviceId],
                      from: item.price.from,
                      currency: item.price.currency.code,
                    }));
                },
              },
            }),
            categories: edge.node.geo?.map(geo => geoMap[geo.title]),
          };
        })
        .map(sitter => ({
          source: SitterSourceType.PROFI,
          ...sitter,
        })),
      size: data.data.pxf.profiles.totalCount,
      source: SitterSourceType.PROFI,
    }),
  },
  {
    url_DOGSITTING:
      'https://dogsy.ru/search?bounds=((59.398630000000004,%2029.77413),%20(60.47863,%2030.854129999999998))&placeName=%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F,%20%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3',
    url_DOGSITTING_REMOTE:
      'https://dogsy.ru/search?bounds=((59.744315,%2030.043382),%20(60.090921,%2030.566435))&service_type=3&price_type=4&&placeName=%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F,%20%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3',
    method: 'get',
    headers: { 'x-requested-with': 'XMLHttpRequest' },
    convert: data => ({
      data: data.resultsList
        .map(sitter =>
          objectMapper(
            {
              ...sitter,
              fullName: `${sitter.lastName} ${sitter.firstName}`,
            },
            {
              id: 'externalId',
              fullName: 'name',
              district: 'address',
              avatar: 'avatar',
              price: {
                key: 'prices',
                transform: val => [
                  {
                    category: sitter.priceType === '' ? SearchCategoryType.DOGSITTING : SearchCategoryType.DOGSITTING_REMOTE,
                    petType: PetType.DOG, //need fix
                    from: val,
                    currency: 'RUB',
                  },
                ],
              },
              reviewsRating: 'rating',
              reviewsCount: 'reviewsCount',
              location: {
                key: 'geo',
                transform: val => {
                  const latLng = val.slice(1, val.length - 1).split(',');
                  return { lat: parseFloat(latLng[0]), lng: parseFloat(latLng[1]) };
                },
              },
            },
          ),
        )
        .map(sitter => ({
          source: SitterSourceType.DOGSY,
          ...sitter,
        })),
      size: parseInt(data.resultsCount.match(totalCountPattern)[1], 10),
      source: SitterSourceType.DOGSY,
    }),
  },
];

function getAllData(requestOptions: RequestOptions[]) {
  return Promise.all(requestOptions.map(fetchData));
}

function fetchGeo(item): Sitter {
  return geocoder
    .geocode(item.address)
    .then(function (result) {
      return { ...item, geo: { lat: result[0].latitude, lng: result[0].longitude } };
    })
    .catch(function (error) {
      console.log(error);
      return item;
    });
}

function fetchData(requestOptions: RequestOptions) {
  return axios({
    method: requestOptions.method,
    url: `${requestOptions.url}&page=${requestOptions.page}`,
    data: {
      ...requestOptions.data,
      variables: {
        ...requestOptions.data?.variables,
        searchFilter: {
          p: requestOptions.page,
          sort: 'SEAMLESS',
        },
      },
    },
    headers: requestOptions.headers,
  })
    .then(function (response) {
      return {
        success: true,
        data: requestOptions.convert(response.data),
      };
    })
    .catch(function (error) {
      return { success: false, data: null };
    });
}

class SitterService {
  public async getSittersByCategory(searchCategory: SearchCategoryType, cache: NodeCache) {
    const result = await getAllData(
      sitterServices.map(sitterService => ({
        ...sitterService,
        url: sitterService[`url_${searchCategory}`],
        page: 1,
      })),
    );

    const totalCounts = result.filter(value => value.success).map(value => ({ totalCount: value.data.size, source: value.data.source }));

    const allDataRequests = [
      ...Array(Math.floor(totalCounts.filter(value => value.source === SitterSourceType.PROFI).map(value => value.totalCount) / 20) + 1)
        .fill(sitterServices[0])
        .map((value, index) => ({
          ...value,
          url: value[`url_${searchCategory}`],
          page: index + 1,
        })),
      ...Array(Math.floor(totalCounts.filter(value => value.source === SitterSourceType.DOGSY).map(value => value.totalCount) / 30) + 1)
        .fill(sitterServices[1])
        .map((value, index) => ({
          ...value,
          url: value[`url_${searchCategory}`],
          page: index + 1,
        })),
    ];

    getAllData(allDataRequests)
      .then(value => {
        const formattedResult = value
          .filter(value => value.success)
          .map(value => value.data.data)
          .reduce((previousValue, currentValue) => {
            return previousValue.concat(currentValue);
          });
        console.log(formattedResult);
        return Promise.all(formattedResult.map(item => (!item.geo && item.address ? fetchGeo(item) : item)));
      })
      .then(result => {
        console.log(result);
        cache.set(
          searchCategory,
          result.filter(value => !value.categories || value.categories?.includes(searchCategory)),
        );
      });

    const formattedResult = result
      .filter(value => value.success)
      .map(value => value.data.data)
      .reduce((previousValue, currentValue) => {
        return previousValue.concat(currentValue);
      });

    const formattedResultWithLatLng = await Promise.all(formattedResult.map(item => (!item.geo ? fetchGeo(item) : item)));

    return formattedResultWithLatLng
      .filter(value => !value.categories || value.categories?.includes(searchCategory))
      .sort((value1, value2) => value1.name.localeCompare(value2.name));
  }
}

export default SitterService;

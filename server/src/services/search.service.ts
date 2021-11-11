import axios, { AxiosRequestHeaders, Method } from 'axios';
import { SitterSourceType } from '@/enums/sitter.source.type';
import sitterServiceModel from '../models/sitter.services.model';
import { SearchRequestDto } from '../dtos/rq/search.request.dto';
import { SearchCategoryType } from '../enums/search.category.type';
import NodeCache from 'node-cache';

const objectMapper = require('object-mapper');

type RequestOptions = {
  url?: string;
  page?: number;
  url_DOGSITTING: string;
  url_DOGSITTING_REMOTE: string;
  method: Method;
  data?: Object;
  headers?: AxiosRequestHeaders;
  convert: Function;
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
        .map(edge => ({
          ...objectMapper(edge.node, {
            id: 'externalId',
            fullName: 'fullName',
            'geo[0].values[0].values[0].text': 'location',
            'priceListPreview.prices[0]': 'price',
          }),
          categories: edge.node.geo?.map(geo => geoMap[geo.title]),
        }))
        .map(sitter => ({
          source: SitterSourceType.PROFI,
          ...sitter,
        })),
      totalCount: data.data.pxf.profiles.totalCount,
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
              fullName: 'fullName',
              district: 'location',
              price: 'price',
            },
          ),
        )
        .map(sitter => ({
          source: SitterSourceType.DOGSY,
          ...sitter,
        })),
      totalCount: parseInt(data.resultsCount.match(totalCountPattern)[1], 10),
      source: SitterSourceType.DOGSY,
    }),
  },
];

function getAllData(requestOptions: RequestOptions[]) {
  return Promise.all(requestOptions.map(fetchData));
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
      console.log(response.data);
      return {
        success: true,
        data: requestOptions.convert(response.data),
      };
    })
    .catch(function (error) {
      return { success: false, data: null };
    });
}

const cache = new NodeCache({ stdTTL: 900 });

class SearchService {
  public sitterService = sitterServiceModel;

  public async search(searchRequest: SearchRequestDto) {
    const category = searchRequest.category;
    if (cache.has(category)) {
      return cache.get(category);
    }
    const result = await getAllData(
      sitterServices.map(sitterService => ({
        ...sitterService,
        url: sitterService[`url_${category}`],
        page: 1,
      })),
    );

    console.log(result);

    const totalCounts = result.filter(value => value.success).map(value => ({ totalCount: value.data.totalCount, source: value.data.source }));

    const allDataRequests = [
      ...Array(Math.floor(totalCounts.filter(value => value.source === SitterSourceType.PROFI).map(value => value.totalCount) / 20) + 1)
        .fill(sitterServices[0])
        .map((value, index) => ({
          ...value,
          url: value[`url_${category}`],
          page: index + 1,
        })),
      ...Array(Math.floor(totalCounts.filter(value => value.source === SitterSourceType.DOGSY).map(value => value.totalCount) / 30) + 1)
        .fill(sitterServices[1])
        .map((value, index) => ({
          ...value,
          url: value[`url_${category}`],
          page: index + 1,
        })),
    ];

    getAllData(allDataRequests).then(value =>
      cache.set(
        category,
        value
          .filter(value => value.success)
          .map(value => value.data.data)
          .reduce((previousValue, currentValue) => {
            return previousValue.concat(currentValue);
          })
          .filter(value => !value.categories || value.categories?.includes(category)),
      ),
    );

    return result
      .filter(value => value.success)
      .map(value => value.data.data)
      .reduce((previousValue, currentValue) => {
        return previousValue.concat(currentValue);
      })
      .filter(value => !value.categories || value.categories?.includes(category));
  }
}

export default SearchService;

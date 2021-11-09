import axios, {AxiosRequestHeaders, Method} from "axios";
import {SitterSourceType} from "@/enums/sitter.source.type";
const objectMapper = require('object-mapper');

type RequestOptions = {
  url: string,
  method: Method,
  data?: Object,
  headers?: AxiosRequestHeaders,
  convert: Function
}

function getAllData(requestOptions: RequestOptions[]) {
  return Promise.all(requestOptions.map(fetchData));
}

function fetchData(requestOptions: RequestOptions) {
  return axios({
    method: requestOptions.method,
    url: requestOptions.url,
    data: requestOptions.data,
    headers: requestOptions.headers,
  })
    .then(function (response) {
      console.log(response.data.resultsList);
      return {
        success: true,
        data: requestOptions.convert(response.data)
      };
    })
    .catch(function (error) {
      return {success: false, data: null};
    });
}

class SearchService {

  public async search() {
    const map1 = {
      "id": "externalId",
      "fullName": "fullName",
      "geo[0].values[0].values[0].text": "location",
      "priceListPreview.prices[0]": "price"
    }

    const map2 = {
      "id": "externalId",
      "fullName": "fullName",
      "district": "location",
      "price": "price",
    }

    const requestOptions1: RequestOptions = {
      url: 'https://spb.profi.ru/graphql/?gqlid=%24GQLID%7Bbc07a13e532565e061564412f05d352b%7D',
      method: 'post',
      data: {
        "query": "$GQLID{bc07a13e532565e061564412f05d352b}",
        "variables": {
          "wizardInput": {
            "projectId": "vet",
            "pserviceId": 2000774,
            "answers": [],
            "profileIds": [],
            "wizardSession": "5ff30188-2114-462c-bc02-d312705f"
          },
          "wizardSessionId": "5ff30188-2114-462c-bc02-d312705f",
          "pageType": "order.seamless",
          "geoCityId": "spb",
          "searchFilter": {
            "p": 1,
            "sort": "SEAMLESS"
          },
          "photoWidth": 1500
        }
      },
      convert: (data) => data.data.pxf.profiles.edges.map(edge => objectMapper(edge.node, map1)).map(sitter => ({
        source: SitterSourceType.PROFI,
        ...sitter
      }))
    }

    const requestOptions2: RequestOptions = {
      url: 'https://dogsy.ru/search?bounds=((59.398630000000004,%2029.77413),%20(60.47863,%2030.854129999999998))&placeName=%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F,%20%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3',
      method: 'get',
      headers: {'x-requested-with': 'XMLHttpRequest'},
      convert: (data) => data.resultsList.map(sitter => objectMapper({...sitter, fullName: `${sitter.lastName} ${sitter.firstName}`}, map2)).map(sitter => ({
        source: SitterSourceType.DOGSY,
        ...sitter
      }))
    }

    const result = await getAllData([requestOptions1, requestOptions2]);

    return result.filter(value => value.success).map(value => value.data).reduce((previousValue, currentValue) => {
      return previousValue.concat(currentValue)
    });
  }
}

export default SearchService;

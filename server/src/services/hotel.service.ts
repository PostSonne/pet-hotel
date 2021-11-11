import NodeCache from 'node-cache';
import axios, { AxiosRequestHeaders, Method } from 'axios';

type RequestOptions = {
  url: string;
  method: Method;
  pageToken?: string;
  data?: Object;
  headers?: AxiosRequestHeaders;
  convert: Function;
};

const hotelServices: RequestOptions[] = [
  {
    url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?location=59.938977,30.324583&query=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8%20%D0%BF%D0%BE%20%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D0%BE%D0%BC%D1%83%20%D0%BF%D1%80%D0%BE%D0%B6%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D1%8E%20%D0%B4%D0%BE%D0%BC%D0%B0%D1%88%D0%BD%D0%B8%D1%85%20%D0%B6%D0%B8%D0%B2%D0%BE%D1%82%D0%BD%D1%8B%D1%85&radius=50000&key=AIzaSyB9BfnD76TfXlYQ-u_oZCjwC5f82ZgEhVI',
    method: 'get',
    convert: data =>
      data.results.map(value => ({
        name: value.name,
        location: value.formatted_address,
        externalId: value.place_id,
        rating: value.rating,
        reviewsCount: value.user_ratings_total
      })),
  },
];

function fetchData(requestOptions: RequestOptions, data: []) {
  console.log(data.length);
  return axios({
    method: requestOptions.method,
    url: `${requestOptions.url}${requestOptions.pageToken ? `&pagetoken=${requestOptions.pageToken}` : ''}`,
  })
    .then(
      response =>
        new Promise(resolve =>
          setTimeout(() => {
            const pageToken = response.data.next_page_token;
            console.log(pageToken);
            resolve(
              pageToken
                ? fetchData({ ...requestOptions, pageToken }, requestOptions.convert(response.data).concat(data))
                : {
                    success: true,
                    data: requestOptions.convert(response.data).concat(data),
                  },
            );
          }, 2000),
        ),
    )
    .catch(function (error) {
      console.log(error);
      return { success: false, data: null };
    });
}

class HotelService {
  public async getHotels(cache: NodeCache) {
    const result = await fetchData(hotelServices[0], []);
    return [result]
      .filter(value => value.success)
      .map(value => value.data)
      .reduce((previousValue, currentValue) => {
        return previousValue.concat(currentValue);
      });
  }
}

export default HotelService;

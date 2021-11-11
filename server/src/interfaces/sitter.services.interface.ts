import { AxiosRequestHeaders, Method } from 'axios';

export interface SitterService {
  _id: string;
  url: string;
  method: Method;
  data?: Object;
  headers?: AxiosRequestHeaders;
}

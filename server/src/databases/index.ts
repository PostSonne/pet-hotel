import config from 'config';
import { dbConfig } from 'interfaces/db.interface';

const { url, database }: dbConfig = config.get('dbConfig');

export const dbConnection = {
  url: `${url}/${database}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};

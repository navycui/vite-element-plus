import { setup } from './utils/axios/index2';
const api = {
  // baseURL: VITE_BASE_URL
  baseURL: 'http://localhost:8080'
};
setup(api);
export default { config: { api } };

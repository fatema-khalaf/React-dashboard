import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const privateAxios = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookies.get('token')}`,
  },
});
export default privateAxios;

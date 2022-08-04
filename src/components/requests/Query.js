import { useQuery } from 'react-query';
import axios from 'axios';
import AppUrl from '../../RestAPI/AppUrl';

const getResponse = async () => {
  const res = await axios.get(AppUrl.AllBrands);
  const data = await res.data.data;
  console.log(data);
  return data;
};
export const useApiCall = () => useQuery(['brands'], getResponse);

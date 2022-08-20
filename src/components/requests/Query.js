// THIS FILE NOT IN USE

import { useQuery } from 'react-query';
import axios from 'axios';
import AppUrl from '../../RestAPI/AppUrl';
import privateAxios from '../../RestAPI/axios';

const getResponse = async () => {
  const res = await privateAxios.get(AppUrl.Brands);
  const data = await res.data;
  console.log(data);
  return data;
};
export const useApiCall = () => useQuery(['brands'], getResponse);

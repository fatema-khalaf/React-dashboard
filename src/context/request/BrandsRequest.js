import { useState, useEffect, useRef } from 'react';
import AppUrl from '../../RestAPI/AppUrl';
import RestClient from '../../RestAPI/RestClient';

// returns brand data to added to select input field as options
const useGetBrands = (ref, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ref.current) {
      (async () => {
        try {
          const res = await RestClient.GetRequest(AppUrl.Brands);
          setData(
            res.data.map((item) => {
              return {
                label: item.attributes.brand_name_en,
                value: item.id,
              };
            })
          );
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    }
    return () => {
      ref.current = false;
    };
  }, []);
  console.log(data);
  return { loading, data, error };
};
export default useGetBrands;

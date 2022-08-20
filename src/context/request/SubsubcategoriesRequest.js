import { useState, useEffect, useRef, useContext } from 'react';
import AppUrl from '../../RestAPI/AppUrl';
import RestClient from '../../RestAPI/RestClient';
// alert
import AlertAction from '../alertContext/AlertAction';
import { AlertContext } from '../alertContext/alert-constext';

// returns subsubcategories data to added to select input field as options
const useGetSubsubcategories = (ref, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(AlertContext);

  useEffect(() => {
    if (ref.current) {
      (async () => {
        try {
          const res = await RestClient.GetRequest(AppUrl.Subsubcategories);
          setData(
            res.data.map((item) => {
              return {
                label: item.attributes.subsubcategory_name_en,
                value: item.id,
              };
            })
          );
        } catch (err) {
          dispatch(AlertAction.showErrorAlert('Internal Error, Please try again later!'));
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
export default useGetSubsubcategories;

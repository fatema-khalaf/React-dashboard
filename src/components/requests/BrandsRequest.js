import { useQuery } from 'react-query';
import axios from 'axios';
import AppUrl from '../../RestAPI/AppUrl';

function Request() {
  const getResponse = async () => {
    const res = await axios.get(AppUrl.AllBrands);
    const data = await res.data;
    return data;
  };
  const { isLoading, error, data, refetch } = useQuery(['brands'], getResponse);
  console.log(data);
  console.log(error);

  if (error) {
    return <h1>error</h1>;
  }
  if (isLoading) {
    return <h1> Loading....</h1>;
  }
  return (
    <div>
      {Object.keys(data.data).map((k) => (
        <h1>{data.data[k].attributes.brand_name_en}</h1>
      ))}
      <button onClick={() => refetch()}>rerfetch</button>
    </div>
  );
}
export default Request;

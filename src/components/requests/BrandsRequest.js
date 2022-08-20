// THIS FILE NOT IN USE

import { useApiCall } from './Query';

function Request() {
  const { data, isLoading, error, refetch } = useApiCall();

  if (error) {
    return <h1>{error.response}</h1>;
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

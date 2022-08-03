// NOTE: THIS FILE NOT IN USE YET

import React, { useContext, useState, useEffect, createContext } from 'react';
import axios from 'axios';
import AppUrl from '../../RestAPI/AppUrl';

const APIContext = createContext();

export function APIContextProvider({ children }) {
  const [brand, setBrand] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`${AppUrl.AllBrands}/104`);
      console.log(data);
      setBrand({
        id: data.data.id,
        brand_name_en: data.data.attributes.brand_name_en,
        brand_name_ar: data.data.attributes.brand_name_ar,
        brand_image: data.data.attributes.brand_image,
      });
    }
    fetchData();
  }, []);
  return (
    <APIContext.Provider
      value={{
        brand,
      }}
    >
      {children}
    </APIContext.Provider>
  );
}
export function useAPI() {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error('Context must be used within a Provider');
  }
  return context;
}

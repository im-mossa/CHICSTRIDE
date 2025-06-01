// src/hooks/useCategoryApi.js
import { useBaseApi } from "./baseApi";

export default function useCategoryApi() {
  const { getData } = useBaseApi();

  const getAllCategories = (onSuccess) => {
    getData("productCategory", onSuccess);
  };

  const getCategoryById = (id, onSuccess) => {
    getData(`productCategory/${id}`, onSuccess);
  };

  return { getAllCategories, getCategoryById };
}

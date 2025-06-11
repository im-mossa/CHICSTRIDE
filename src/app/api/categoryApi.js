import { useCallback } from "react";
import { useBaseApi } from "./baseApi";

export default function useCategoryApi() {
  const { getData } = useBaseApi();

  const getAllCategories = useCallback(
    (onSuccess) => getData("productCategory", onSuccess),
    [getData]
  );

  const getCategoryById = useCallback(
    (id, onSuccess) => getData(`productCategory/${id}`, onSuccess),
    [getData]
  );

  return { getAllCategories, getCategoryById };
}

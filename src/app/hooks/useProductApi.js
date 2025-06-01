// src/hooks/useProductApi.js
import { useCallback } from "react";
import { useBaseApi } from "../api/baseApi";

/**
 * Custom hook for product-related API operations.
 */
export function useProductApi() {
  const { getData } = useBaseApi();

  /** Fetch a paginated list of products */
  const getAll = useCallback(
    (pageIndex, pageSize, onSuccess) =>
      getData(`product?pageIndex=${pageIndex}&pageSize=${pageSize}`, onSuccess),
    [getData]
  );

  /** Fetch a single product by its ID */
  const getById = useCallback(
    (id, onSuccess) => getData(`product/${id}`, onSuccess),
    [getData]
  );

  /** Fetch products belonging to a category */
  const getByCategoryId = useCallback(
    (catId, pageIndex, pageSize, onSuccess) =>
      getData(
        `product/cat/${catId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        onSuccess
      ),
    [getData]
  );

  /** Fetch the newest products */
  const getNewProducts = useCallback(
    (onSuccess) => getData("product/new", onSuccess),
    [getData]
  );

  /** Fetch the most popular products */
  const getPopularProducts = useCallback(
    (onSuccess) => getData("product/popular", onSuccess),
    [getData]
  );

  return {
    getAll,
    getById,
    getByCategoryId,
    getNewProducts,
    getPopularProducts,
  };
}

// app/api/SliderApi.js
import { useBaseApi } from "./baseApi";
import { useCallback } from "react";

export default function useSliderApi() {
  const { getData } = useBaseApi();

  // این فانکشن‌ها حالا فقط وقتی getData تغییر کنه دوباره ساخته می‌شن
  const getAll = useCallback(
    (onSuccess) => {
      getData("slider", onSuccess);
    },
    [getData]
  );

  const getById = useCallback(
    (id, onSuccess) => {
      getData(`slider/${id}`, onSuccess);
    },
    [getData]
  );

  return { getAll, getById };
}
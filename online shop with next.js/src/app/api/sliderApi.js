// src/api/SliderApi.js
import { useBaseApi } from "./baseApi";

export default function useSliderApi() {
  const { getData } = useBaseApi();

  const getAll = (onSuccess) => {
    getData("slider", onSuccess);
  };

  const getById = (id, onSuccess) => {
    getData(`slider/${id}`, onSuccess);
  };

  return { getAll, getById };
}
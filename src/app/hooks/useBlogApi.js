import { useCallback } from "react";
import { useBaseApi } from "../api/baseApi";

export function useBlogApi() {
    const { getData } = useBaseApi();

    const getAllPosts = useCallback(
        (onSuccess) => {
            getData("blog", onSuccess);
        },
        [getData]
    );

    const getPostById = useCallback(
        (id, onSuccess) => {
            getData(`blog/${id}`, onSuccess);
        },
        [getData]
    );

    return { getAllPosts, getPostById };
}

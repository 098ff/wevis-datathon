import { apiClient } from "./client";
import { CommentDTO } from "../types/dto";

export const getComments = async (): Promise<CommentDTO[]> => {
    const response = await apiClient.get<CommentDTO[]>("/comments");
    return response.data;
};

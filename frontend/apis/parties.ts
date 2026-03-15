import { apiClient } from "./client";
import {
    PartyDTO,
    PartyClusteringDTO,
    PartySpiderDTO,
    PartyPerformanceDTO,
} from "../types/dto";

export const getParties = async (): Promise<PartyDTO[]> => {
    const response = await apiClient.get<PartyDTO[]>("/parties");
    return response.data;
};

export const getPartyClustering = async (): Promise<PartyClusteringDTO[]> => {
    const response = await apiClient.get<PartyClusteringDTO[]>("/parties/clustering");
    return response.data;
};

export const getPartySpider = async (): Promise<PartySpiderDTO[]> => {
    const response = await apiClient.get<PartySpiderDTO[]>("/parties/spider");
    return response.data;
};

export const getPartyPerformance = async (): Promise<PartyPerformanceDTO[]> => {
    const response = await apiClient.get<PartyPerformanceDTO[]>("/parties/performance");
    return response.data;
};

import { BookSummary, StatisticsData } from "@/@types/statistics.types";
import * as HandlerError from "@/service/HandlerApiException";
import api from "./ConnectionApi";

export const getStatistics = async (): Promise<StatisticsData> => {
  try {
    const response = await api.get<StatisticsData>("/stats/");
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar as estatísticas.");
  }
};

export const getRecommendations = async (): Promise<BookSummary[]> => {
  try {
    const response = await api.get<BookSummary[]>("/stats/recommendation");
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar as recomendações.");
  }
};

import axios from "axios";
import { Opportunity } from "../interfaces/IOpportunity.ts";

const API_BASE_URL = "http://localhost:3000/opportunities";
export const getOpportunities = async (filters: {
  type?: string[] | string;
  publish_date_start?: string;
  publish_date_end?: string;
} = {}): Promise<Opportunity[]> => {
  try {
    const cleanedFilters: Record<string, string> = {};

    if (Array.isArray(filters.type)) {
      if (filters.type.length === 1) {
        cleanedFilters.type = filters.type[0];
      }
    } else if (typeof filters.type === "string" && filters.type.trim() !== "") {
      cleanedFilters.type = filters.type; // single dropdown use-case
    }

    if (filters.publish_date_start && filters.publish_date_start.trim() !== "") {
      cleanedFilters.publish_date_start = filters.publish_date_start;
    }

    if (filters.publish_date_end && filters.publish_date_end.trim() !== "") {
      cleanedFilters.publish_date_end = filters.publish_date_end;
    }

    const query = new URLSearchParams(cleanedFilters).toString();
    const url = `${API_BASE_URL}?${query}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching opportunities...", error);
    throw error.response?.data.message || "Error fetching opportunities";
  }
};
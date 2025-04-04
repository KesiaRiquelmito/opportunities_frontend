import axios from "axios";
import { Opportunity } from "../interfaces/IOpportunity.ts";

const API_BASE_URL = "http://localhost:3000";
export const getOpportunities = async (): Promise<Opportunity[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/opportunities`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching opportunities...", error);
    throw error.response?.data.message || "Error fetching opportunities";
  }
};
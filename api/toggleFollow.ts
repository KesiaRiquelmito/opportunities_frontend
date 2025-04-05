import axios from "axios";
import { Opportunity } from "../interfaces/IOpportunity.ts";

const API_BASE_URL = "http://localhost:3000/opportunities";
export const toggleFollow = async (id: number): Promise<Opportunity[]> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}/toggle-follow`);
    return response.data;
  } catch (error: any) {
    console.error(`Error in toggle follow with id: ${id}`, error);
    throw error.response?.data.message || `Error toggle followed opportunity with id ${id}`;
  }
}
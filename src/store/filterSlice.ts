import { Filters } from "../../interfaces/IFilters.ts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Filters = {
  type: [],
  publish_date_start: '',
  publish_date_end: '',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setType(state, action: PayloadAction<string[]>) {
      state.type = action.payload;
    },
    setDateRange(
      state, action: PayloadAction<{start: string; end:string}>
    ) {
      state.publish_date_start = action.payload.start;
      state.publish_date_end = action.payload.end;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setType, setDateRange, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
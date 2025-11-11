import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lastSeen: null,
  createdAt: null,
  optedIn: 'All',
  incomingBlocked: 'All',
  attributes: [],
};

const contactFilterSlice = createSlice({
  name: 'contactFilters',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearFilters: () => initialState,
  },
});

export const { setFilter, clearFilters } = contactFilterSlice.actions;
export default contactFilterSlice.reducer;

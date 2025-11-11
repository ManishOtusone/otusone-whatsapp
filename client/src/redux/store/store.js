import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import contactFilterReducer from '../slices/contactFilterSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    contactFilters: contactFilterReducer,
  },
});

export default store;

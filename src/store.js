import { configureStore } from '@reduxjs/toolkit';
import counter from "./features";
import transaction from "./features/countTransaction";

export const store = configureStore({
  reducer: {
      counter,
      transaction
  },
})
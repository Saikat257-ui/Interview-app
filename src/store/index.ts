import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import interviewReducer from './slices/interviewSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['candidates', 'currentCandidate'], // Only persist these slices
};

const persistedReducer = persistReducer(persistConfig, interviewReducer);

export const store = configureStore({
  reducer: {
    interview: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER', 'persist/FLUSH'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Fix for redux-persist types
export type PersistedRootState = RootState & {
  _persist: {
    version: number;
    rehydrated: boolean;
  };
};
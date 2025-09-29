import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Helper hook to access interview state specifically
export const useInterviewState = () => {
  const interviewState = useAppSelector(state => state.interview);
  return interviewState;
};
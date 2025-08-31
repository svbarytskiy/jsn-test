import { configureStore } from '@reduxjs/toolkit'
import superheroesReducer from './slices/superheroes/superheroes-slice.ts'
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux'

export const store = configureStore({
  reducer: {
    superheroes: superheroesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

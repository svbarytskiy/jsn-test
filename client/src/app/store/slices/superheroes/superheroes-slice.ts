import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Superhero } from './types'
import {
  createSuperhero,
  deleteSuperhero,
  fetchSuperheroById,
  fetchSuperheroes,
  updateSuperhero,
} from './superheroes-thunk'

interface SuperheroesState {
  list: Superhero[]
  selectedSuperhero: Superhero | null
  loading: boolean
  error: string | null
}

const initialState: SuperheroesState = {
  list: [],
  selectedSuperhero: null,
  loading: false,
  error: null,
}

export const superheroesSlice = createSlice({
  name: 'superheroes',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSuperheroes.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchSuperheroes.fulfilled,
        (state, action: PayloadAction<Superhero[]>) => {
          state.loading = false
          state.list = action.payload
        },
      )
      .addCase(fetchSuperheroes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch superheroes'
      })
      .addCase(fetchSuperheroById.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchSuperheroById.fulfilled,
        (state, action: PayloadAction<Superhero>) => {
          state.loading = false
          state.selectedSuperhero = action.payload
        },
      )
      .addCase(fetchSuperheroById.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.error.message || 'Failed to fetch superhero details'
      })
      .addCase(
        createSuperhero.fulfilled,
        (state, action: PayloadAction<Superhero>) => {
          state.list.push(action.payload)
        },
      )
      .addCase(
        updateSuperhero.fulfilled,
        (state, action: PayloadAction<Superhero>) => {
          const index = state.list.findIndex(
            sh => sh._id === action.payload._id,
          )
          if (index !== -1) {
            state.list[index] = action.payload
          }
        },
      )
      .addCase(
        deleteSuperhero.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.list = state.list.filter(sh => sh._id !== action.payload)
        },
      )
  },
})

export default superheroesSlice.reducer

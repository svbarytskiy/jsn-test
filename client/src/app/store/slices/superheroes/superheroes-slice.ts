import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Superhero, SuperheroListItem } from './types'
import {
  createSuperhero,
  deleteSuperhero,
  fetchSuperheroById,
  fetchSuperheroes,
  updateSuperhero,
} from './superheroes-thunk'

interface SuperheroesListResponse {
  superheroes: SuperheroListItem[]
  totalPages: number
  totalItems: number
  currentPage: number
}

interface SuperheroesState {
  list: SuperheroListItem[]
  selectedSuperhero: Superhero | null
  loading: boolean
  error: string | null
  currentPage: number
  totalItems: number
}

const initialState: SuperheroesState = {
  list: [],
  selectedSuperhero: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalItems: 0,
}

export const superheroesSlice = createSlice({
  name: 'superheroes',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    clearSelectedSuperhero: state => {
      state.selectedSuperhero = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSuperheroes.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchSuperheroes.fulfilled,
        (state, action: PayloadAction<SuperheroesListResponse>) => {
          state.loading = false
          state.list = action.payload.superheroes
          state.totalItems = action.payload.totalItems
          state.currentPage = action.payload.currentPage
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
        (state, _action: PayloadAction<Superhero>) => {
          state.currentPage = 1
        },
      )
      .addCase(
        updateSuperhero.fulfilled,
        (state, action: PayloadAction<Superhero>) => {
          if (state.selectedSuperhero?._id === action.payload._id) {
            state.selectedSuperhero = action.payload
          }
        },
      )
      .addCase(
        deleteSuperhero.fulfilled,
        (state, _action: PayloadAction<string>) => {
          if (state.list.length === 1 && state.currentPage > 1) {
            state.currentPage -= 1
          }
        },
      )
  },
})

export const { setCurrentPage, clearSelectedSuperhero } =
  superheroesSlice.actions

export default superheroesSlice.reducer

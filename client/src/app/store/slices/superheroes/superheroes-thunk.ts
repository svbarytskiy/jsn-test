import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { Superhero } from './types'

export const fetchSuperheroes = createAsyncThunk(
  'superheroes/fetch-superheroes',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await axios.get(
      `http://localhost:3000/superheroes?page=${page}&limit=${limit}`,
    )
    return response.data.data as Superhero[]
  },
)

export const fetchSuperheroById = createAsyncThunk(
  'superheroes/fetch-superhero-by-id',
  async (id: string) => {
    const response = await axios.get(`http://localhost:3000/superheroes/${id}`)
    return response.data.data as Superhero
  },
)

export const createSuperhero = createAsyncThunk(
  'superheroes/create-superhero',
  async (superheroData: FormData) => {
    const response = await axios.post(
      'http://localhost:3000/superheroes',
      superheroData,
    )
    return response.data.data as Superhero
  },
)

export const updateSuperhero = createAsyncThunk(
  'superheroes/update-superhero',
  async ({ id, superheroData }: { id: string; superheroData: FormData }) => {
    const response = await axios.put(
      `http://localhost:3000/superheroes/${id}`,
      superheroData,
    )
    return response.data.data as Superhero
  },
)

export const deleteSuperhero = createAsyncThunk(
  'superheroes/delete-superhero',
  async (id: string) => {
    await axios.delete(`http://localhost:3000/superheroes/${id}`)
    return id
  },
)

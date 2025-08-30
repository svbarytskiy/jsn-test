import { createAsyncThunk } from '@reduxjs/toolkit'
import type { Superhero } from './types'
import axiosInstance from '@/app/api/axios'

export const fetchSuperheroes = createAsyncThunk(
  'superheroes/fetch-superheroes',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await axiosInstance.get(
      `/superheroes?page=${page}&limit=${limit}`,
    )
    return response.data.data as Superhero[]
  },
)

export const fetchSuperheroById = createAsyncThunk(
  'superheroes/fetch-superhero-by-id',
  async (id: string) => {
    const response = await axiosInstance.get(`/superheroes/${id}`)
    return response.data.data as Superhero
  },
)

export const createSuperhero = createAsyncThunk(
  'superheroes/create-superhero',
  async (superheroData: FormData) => {
    const response = await axiosInstance.post('/superheroes', superheroData)
    return response.data.data as Superhero
  },
)

export const updateSuperhero = createAsyncThunk(
  'superheroes/update-superhero',
  async ({ id, superheroData }: { id: string; superheroData: FormData }) => {
    const response = await axiosInstance.put(
      `/superheroes/${id}`,
      superheroData,
    )
    return response.data.data as Superhero
  },
)

export const deleteSuperhero = createAsyncThunk(
  'superheroes/delete-superhero',
  async (id: string) => {
    await axiosInstance.delete(`/superheroes/${id}`)
    return id
  },
)

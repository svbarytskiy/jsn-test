import { createAsyncThunk } from '@reduxjs/toolkit'
import type { Superhero, SuperheroListItem } from './types'
import axiosInstance from '@/app/api/axios'

interface SuperheroesListResponse {
  superheroes: SuperheroListItem[]
  totalPages: number
  totalItems: number
  currentPage: number
}

export const fetchSuperheroes = createAsyncThunk(
  'superheroes/fetch-superheroes',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await axiosInstance.get(
      `/superheroes?page=${page}&limit=${limit}`,
    )
    return response.data as SuperheroesListResponse
  },
)

export const fetchSuperheroByNickname = createAsyncThunk(
  'superheroes/fetch-superhero-by-id',
  async (nickname: string) => {
    const response = await axiosInstance.get(`/superheroes/${nickname}`)
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
  async ({
    nickname,
    superheroData,
  }: {
    nickname: string
    superheroData: FormData
  }) => {
    const response = await axiosInstance.put(
      `/superheroes/${nickname}`,
      superheroData,
    )
    return response.data as Superhero
  },
)

export const deleteSuperhero = createAsyncThunk(
  'superheroes/delete-superhero',
  async (nickname: string) => {
    await axiosInstance.delete(`/superheroes/${nickname}`)
    return nickname
  },
)

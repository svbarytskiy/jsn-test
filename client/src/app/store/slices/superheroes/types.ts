export interface Superhero {
  _id: string
  nickname: string
  real_name: string
  origin_description: string
  superpowers: string[]
  catch_phrase: string
  images: string[]
}

export interface SuperheroListItem {
  _id: string
  nickname: string
  images: string
}

export interface SuperheroesListResponse {
  superheroes: SuperheroListItem[]
  totalPages: number
  totalItems: number
  currentPage: number
}

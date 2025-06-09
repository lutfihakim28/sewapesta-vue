import type { ApiResponseList } from '@/dto/ApiResponse';
import type { City } from '@/dto/City';
import type { District } from '@/dto/District';
import type { Province } from '@/dto/Province';
import type { Subdistrict } from '@/dto/Subdistrict';
import { useApiFetch } from '@/plugins/api-fetch';
import { defineStore } from 'pinia';
import { shallowRef, watch } from 'vue';

export const useLocationStore = defineStore('location', () => {
  const provinces = shallowRef<Province[]>([]);
  const cities = shallowRef<City[]>([]);
  const districts = shallowRef<District[]>([])
  const subdistricts = shallowRef<Subdistrict[]>([])
  const apiFetch = useApiFetch()

  const { data: provincesData, isFetching: provinceFetch } = apiFetch<ApiResponseList<Province>>('/public/locations/provinces')
  const { data: cityData, isFetching: cityFetch } = apiFetch<ApiResponseList<City>>('/public/locations/cities')
  const { data: districtData, isFetching: districtFetch } = apiFetch<ApiResponseList<District>>('/public/locations/districts')
  const { data: subdistrictData, isFetching: subdistrictFetch } = apiFetch<ApiResponseList<Subdistrict>>('/public/locations/subdistricts')

  watch(provincesData, (data) => {
    if (data) {
      provinces.value = data.data
    }
  })

  watch(cityData, (data) => {
    if (data) {
      cities.value = data.data
    }
  })

  watch(districtData, (data) => {
    if (data) {
      districts.value = data.data
    }
  })

  watch(subdistrictData, (data) => {
    if (data) {
      subdistricts.value = data.data
    }
  })

  return {
    provinces,
    cities,
    districts,
    subdistricts,
    provinceFetch,
    cityFetch,
    districtFetch,
    subdistrictFetch
  }
})

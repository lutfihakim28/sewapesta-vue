import { useApiFetch } from '@/utils/composables/useApiFetch';
import type { ApiResponseList } from '@/utils/dtos/ApiResponse';
import type { City } from '@/utils/dtos/City';
import type { District } from '@/utils/dtos/District';
import type { Province } from '@/utils/dtos/Province';
import type { Subdistrict } from '@/utils/dtos/Subdistrict';
import { defineStore } from 'pinia';
import { shallowRef, watch } from 'vue';

export const useLocationStore = defineStore('location', () => {
  const provinces = shallowRef<Province[]>([]);
  const cities = shallowRef<City[]>([]);
  const districts = shallowRef<District[]>([])
  const subdistricts = shallowRef<Subdistrict[]>([])

  const { data: provincesData, isFetching: provinceFetch } = useApiFetch<ApiResponseList<Province>>('/public/locations/provinces')
  const { data: cityData, isFetching: cityFetch } = useApiFetch<ApiResponseList<City>>('/public/locations/cities')
  const { data: districtData, isFetching: districtFetch } = useApiFetch<ApiResponseList<District>>('/public/locations/districts')
  const { data: subdistrictData, isFetching: subdistrictFetch } = useApiFetch<ApiResponseList<Subdistrict>>('/public/locations/subdistricts')

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

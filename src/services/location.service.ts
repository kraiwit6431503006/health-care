import type { Province } from '../types/location'

let provinces: Province[] = []

export async function loadLocations() {
  if (provinces.length) return
  const res = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json')
  provinces = await res.json()
}

export function getProvinces() {
  return provinces
}

export function getAmphures(province: string) {
  return provinces.find(p => String(p.name_th) === province)?.amphure || []
}

export function getTambons(amphure: string) {
  const found = provinces.flatMap(p => p.amphure)
    .find(a => a.name_th === amphure)
  return found?.tambon || []
}

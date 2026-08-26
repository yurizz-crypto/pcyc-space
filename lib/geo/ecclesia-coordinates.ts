/**
 * Philippine Cities & Regions Geocoding Coordinates for Christadelphian Ecclesias
 * Fallback coordinate mapping for accurate geographic pin placement on the Leaflet Map.
 */

export interface GeoLocation {
  lat: number;
  lng: number;
}

// Known coordinates for Philippine cities, provinces, and specific ecclesia areas
export const PHILIPPINES_CITY_COORDINATES: Record<string, GeoLocation> = {
  // Metro Manila & NCR
  cubao: { lat: 14.6202, lng: 121.0536 },
  'quezon city': { lat: 14.676, lng: 121.0437 },
  manila: { lat: 14.5995, lng: 120.9842 },
  pasay: { lat: 14.5378, lng: 120.9996 },
  taguig: { lat: 14.5176, lng: 121.0509 },
  makati: { lat: 14.5547, lng: 121.0244 },
  pasig: { lat: 14.5764, lng: 121.0851 },
  marikina: { lat: 14.6507, lng: 121.1029 },
  valenzuela: { lat: 14.7011, lng: 120.983 },
  caloocan: { lat: 14.657, lng: 120.984 },
  laspiñas: { lat: 14.4445, lng: 120.9939 },
  'las piñas': { lat: 14.4445, lng: 120.9939 },
  muntinlupa: { lat: 14.4081, lng: 121.0415 },
  parañaque: { lat: 14.4793, lng: 121.0198 },

  // Luzon Provinces
  baguio: { lat: 16.4023, lng: 120.596 },
  benguet: { lat: 16.5, lng: 120.65 },
  angeles: { lat: 15.145, lng: 120.5887 },
  'san fernando': { lat: 15.0298, lng: 120.6896 },
  pampanga: { lat: 15.05, lng: 120.65 },
  bataan: { lat: 14.6826, lng: 120.5366 },
  balanga: { lat: 14.6826, lng: 120.5366 },
  hermosa: { lat: 14.8315, lng: 120.505 },
  dagupan: { lat: 16.0433, lng: 120.3333 },
  pangasinan: { lat: 15.92, lng: 120.33 },
  laoag: { lat: 18.196, lng: 120.5927 },
  'ilocos norte': { lat: 18.19, lng: 120.6 },
  vigan: { lat: 17.5747, lng: 120.3869 },
  'ilocos sur': { lat: 17.57, lng: 120.39 },
  malolos: { lat: 14.8527, lng: 120.816 },
  bulacan: { lat: 14.85, lng: 120.82 },
  antipolo: { lat: 14.5842, lng: 121.1763 },
  rizal: { lat: 14.6, lng: 121.2 },
  lipa: { lat: 13.9419, lng: 121.1644 },
  batangas: { lat: 13.7565, lng: 121.0583 },
  imus: { lat: 14.4296, lng: 120.9367 },
  dasmariñas: { lat: 14.3294, lng: 120.9367 },
  cavite: { lat: 14.42, lng: 120.94 },
  calamba: { lat: 14.2117, lng: 121.1656 },
  'san pedro': { lat: 14.3583, lng: 121.0583 },
  laguna: { lat: 14.28, lng: 121.25 },
  lucena: { lat: 13.9314, lng: 121.6172 },
  quezon: { lat: 14.0, lng: 122.0 },
  naga: { lat: 13.6218, lng: 123.1948 },
  legazpi: { lat: 13.1391, lng: 123.7438 },
  bicol: { lat: 13.4, lng: 123.4 },

  // Visayas
  cebu: { lat: 10.3157, lng: 123.8854 },
  'cebu city': { lat: 10.3157, lng: 123.8854 },
  mandaue: { lat: 10.3396, lng: 123.9406 },
  talisay: { lat: 10.2447, lng: 123.8492 },
  lapulapu: { lat: 10.3103, lng: 123.9494 },
  iloilo: { lat: 10.7202, lng: 122.5621 },
  'iloilo city': { lat: 10.7202, lng: 122.5621 },
  jaro: { lat: 10.7303, lng: 122.5519 },
  bacolod: { lat: 10.6765, lng: 122.9509 },
  'bacolod city': { lat: 10.6765, lng: 122.9509 },
  'negros occidental': { lat: 10.5, lng: 123.0 },
  dumaguete: { lat: 9.3068, lng: 123.3054 },
  'negros oriental': { lat: 9.5, lng: 123.1 },
  tagbilaran: { lat: 9.6729, lng: 123.873 },
  bohol: { lat: 9.85, lng: 124.14 },
  tacloban: { lat: 11.2433, lng: 125.0039 },
  leyte: { lat: 11.0, lng: 124.8 },
  ormoc: { lat: 11.005, lng: 124.6075 },
  roxas: { lat: 11.5853, lng: 122.7511 },
  capiz: { lat: 11.45, lng: 122.65 },
  kalibo: { lat: 11.7065, lng: 122.3644 },
  aklan: { lat: 11.6, lng: 122.3 },

  // Mindanao
  davao: { lat: 7.1907, lng: 125.4553 },
  'davao city': { lat: 7.1907, lng: 125.4553 },
  matina: { lat: 7.0608, lng: 125.5901 },
  'cagayan de oro': { lat: 8.4542, lng: 124.6319 },
  cdo: { lat: 8.4542, lng: 124.6319 },
  'misamis oriental': { lat: 8.6, lng: 124.8 },
  'general santos': { lat: 6.1164, lng: 125.1716 },
  gensan: { lat: 6.1164, lng: 125.1716 },
  'south cotabato': { lat: 6.3, lng: 124.9 },
  zamboanga: { lat: 6.9214, lng: 122.079 },
  'zamboanga city': { lat: 6.9214, lng: 122.079 },
  cotabato: { lat: 7.2236, lng: 124.2464 },
  'cotabato city': { lat: 7.2236, lng: 124.2464 },
  butuan: { lat: 8.9475, lng: 125.5406 },
  'butuan city': { lat: 8.9475, lng: 125.5406 },
  iligan: { lat: 8.228, lng: 124.2452 },
  tagum: { lat: 7.4479, lng: 125.8078 },
  koronadal: { lat: 6.5034, lng: 124.8478 },
  marbel: { lat: 6.5034, lng: 124.8478 },
  kidapawan: { lat: 7.0086, lng: 125.0894 },
  surigao: { lat: 9.7899, lng: 125.495 },
  'surigao city': { lat: 9.7899, lng: 125.495 },
  dipolog: { lat: 8.5878, lng: 123.3403 },
  pagadian: { lat: 7.8247, lng: 123.4372 },
  ozamiz: { lat: 8.1481, lng: 123.8427 },
  malaybalay: { lat: 8.1575, lng: 125.1278 },
  bukidnon: { lat: 8.0, lng: 125.0 },
};

// Region default center coordinates
export const REGION_CENTERS = {
  ALL: { lat: 12.8797, lng: 121.774, zoom: 6 },
  Luzon: { lat: 15.3, lng: 120.9, zoom: 7 },
  Visayas: { lat: 10.7, lng: 123.3, zoom: 7.5 },
  Mindanao: { lat: 7.8, lng: 124.8, zoom: 7 },
};

/**
 * Get coordinates for an ecclesia by its city, name, address, or region
 */
export function getEcclesiaCoordinates(
  city: string | null | undefined,
  name: string | null | undefined,
  address: string | null | undefined,
  region: string | null | undefined,
  index = 0
): GeoLocation {
  const normalize = (str: string | null | undefined) => (str || '').trim().toLowerCase();
  const c = normalize(city);
  const n = normalize(name);
  const a = normalize(address);
  const r = normalize(region);

  // 1. Direct city match
  if (c && PHILIPPINES_CITY_COORDINATES[c]) {
    return offsetCoords(PHILIPPINES_CITY_COORDINATES[c], index);
  }

  // 2. City substring check in lookup table
  for (const [key, coords] of Object.entries(PHILIPPINES_CITY_COORDINATES)) {
    if (c.includes(key) || n.includes(key) || a.includes(key)) {
      return offsetCoords(coords, index);
    }
  }

  // 3. Fallback to Region centers with slight spread
  if (r.includes('luzon')) {
    return offsetCoords(REGION_CENTERS.Luzon, index, 0.25);
  }
  if (r.includes('visayas')) {
    return offsetCoords(REGION_CENTERS.Visayas, index, 0.25);
  }
  if (r.includes('mindanao')) {
    return offsetCoords(REGION_CENTERS.Mindanao, index, 0.25);
  }

  // 4. Default to Manila center with offset
  return offsetCoords(PHILIPPINES_CITY_COORDINATES.cubao, index);
}

// Add a slight deterministic offset so multiple ecclesias in the same city don't completely overlap
function offsetCoords(base: GeoLocation, index: number, spread = 0.015): GeoLocation {
  if (index === 0) return { lat: base.lat, lng: base.lng };
  const angle = (index * 137.5 * Math.PI) / 180; // Golden ratio angle
  const radius = spread * Math.sqrt(index);
  return {
    lat: base.lat + radius * Math.cos(angle),
    lng: base.lng + radius * Math.sin(angle),
  };
}

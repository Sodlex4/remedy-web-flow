export interface GeocodeResult {
  county: string;
  town: string;
  region: string;
}

interface NominatimAddress {
  county?: string;
  state?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  city_district?: string;
  [key: string]: unknown;
}

interface NominatimResponse {
  address: NominatimAddress;
  display_name: string;
}

function extractFromAddress(address: NominatimAddress): { county: string; town: string } {
  const county = address.county || address.state || '';
  const town = address.city || address.town || address.village || address.municipality || address.city_district || '';
  return { county, town };
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  const cacheKey = `geo:${lat.toFixed(4)},${lng.toFixed(4)}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached) as GeocodeResult;
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'RemedyWebFlow/1.0',
    },
  });

  if (!res.ok) {
    throw new Error(`Geocode failed: ${res.status}`);
  }

  const data = (await res.json()) as NominatimResponse;
  const { county, town } = extractFromAddress(data.address);

  const result: GeocodeResult = {
    county,
    town,
    region: county,
  };

  sessionStorage.setItem(cacheKey, JSON.stringify(result));
  return result;
}


import { LocationDetail } from '../types';

export const reverseGeocode = async (lat: number, lng: number): Promise<Partial<LocationDetail>> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: { 'Accept-Language': 'ar,en' }
    });
    const data = await response.json();
    const addr = data.address || {};
    
    return {
      country: addr.country || '',
      city: addr.city || addr.town || addr.village || addr.state || '',
      district: addr.suburb || addr.neighbourhood || addr.road || '',
      address: data.display_name || ''
    };
  } catch (error) {
    console.error("Geocoding error", error);
    return {
      country: 'Unknown',
      city: 'Unknown',
      district: 'Unknown',
      address: 'Unknown'
    };
  }
};

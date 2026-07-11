import { Property } from "@/types";

// Mock property data
let properties: Property[] = [
  {
    id: "1",
    name: "Mutah Residence",
    description: "Luxurious student housing located just minutes from Mutah University. Features modern amenities and a comfortable living environment perfect for students.",
    location: "Jordan, Al-Karak",
    price: 30,
    currency: "JOD",
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    images: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    university: "Mutah University",
    amenities: ["WiFi", "AC", "Furnished", "Security", "Laundry"],
    lat: 31.0893,
    lng: 35.7019,
  },
  {
    id: "2",
    name: "Jordan University Apartments",
    description: "Modern student apartments located near the campus of University of Jordan. Offers a range of amenities designed specifically for student life.",
    location: "Amman, Jordan",
    price: 45,
    currency: "JOD",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1583845112203-29329902332e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    ],
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    university: "University of Jordan",
    amenities: ["WiFi", "AC", "Furnished", "Gym", "Parking"],
    lat: 31.9539,
    lng: 35.9106,
  },
  {
    id: "3",
    name: "Yarmouk Student Housing",
    description: "Cozy and affordable student housing near Yarmouk University. Ideal for students looking for a comfortable living space close to campus.",
    location: "Irbid, Jordan",
    price: 25,
    currency: "JOD",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1084&q=80",
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 30,
    university: "Yarmouk University",
    amenities: ["WiFi", "Furnished", "Security"],
    lat: 32.5393,
    lng: 35.8569,
  },
  {
    id: "4",
    name: "JUST Residence Hall",
    description: "Premium student residence conveniently located near Jordan University of Science and Technology. Features all the amenities needed for a productive student life.",
    location: "Irbid, Jordan",
    price: 40,
    currency: "JOD",
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80",
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    university: "Jordan University of Science and Technology",
    amenities: ["WiFi", "AC", "Furnished", "Study Room", "Laundry"],
    lat: 32.4779,
    lng: 35.9937,
  },
  {
    id: "5",
    name: "Al-Karak Student Housing",
    description: "Comfortable and affordable housing option near Mutah University. Perfect for students who prefer a quiet environment for studying.",
    location: "Al-Karak, Jordan",
    price: 28,
    currency: "JOD",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1084&q=80",
    images: [
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1084&q=80",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    university: "Mutah University",
    amenities: ["WiFi", "Furnished", "Security"],
    lat: 31.1819,
    lng: 35.7029,
  },
  {
    id: "6",
    name: "Amman Student Lofts",
    description: "Modern loft apartments in the heart of Amman, conveniently located for students of all nearby universities. Features stylish design and all modern conveniences.",
    location: "Amman, Jordan",
    price: 55,
    currency: "JOD",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    ],
    bedrooms: 2,
    bathrooms: 1,
    area: 60,
    university: "University of Jordan",
    amenities: ["WiFi", "AC", "Furnished", "Gym", "Swimming Pool"],
    lat: 31.9639,
    lng: 35.9306,
  },
];

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

interface PropertyFilters {
  university?: string;
  location?: string;
  roomType?: 'single' | 'shared' | 'studio' | '1br' | '2br';
  priceMin?: number;
  priceMax?: number;
  amenities?: string[];
  userLocation?: {
    latitude: number;
    longitude: number;
    radius?: number;
  };
}

interface PropertyWithDistance extends Property {
  distance: number;
}

export const getProperties = (filters?: PropertyFilters): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!filters) {
        resolve(properties);
        return;
      }

      let filteredProperties: (Property | PropertyWithDistance)[] = [...properties];

      // Filter by university
      if (filters.university) {
        filteredProperties = filteredProperties.filter(
          (p) => p.university.toLowerCase().includes(filters.university.toLowerCase())
        );
      }

      // Filter by location
      if (filters.location) {
        if (filters.location.toLowerCase() === 'no location') {
          filteredProperties = filteredProperties.filter(p => p.noLocation);
        } else {
          filteredProperties = filteredProperties.filter(
            (p) => p.location?.toLowerCase().includes(filters.location.toLowerCase())
          );
        }
      }

      // Filter by room type (bedrooms)
      if (filters.roomType) {
        const roomTypeMap: Record<string, number> = {
          single: 1,
          shared: 1,
          studio: 0,
          "1br": 1,
          "2br": 2,
        };
        
        if (roomTypeMap[filters.roomType] !== undefined) {
          filteredProperties = filteredProperties.filter(
            (p) => p.bedrooms === roomTypeMap[filters.roomType]
          );
        }
      }

      // Filter by price range
      if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
        filteredProperties = filteredProperties.filter(
          (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
        );
      }

      // Filter by amenities
      if (filters.amenities && filters.amenities.length > 0) {
        filteredProperties = filteredProperties.filter((p) =>
          filters.amenities.every((amenity: string) =>
            p.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
          )
        );
      }
      
      // Filter by proximity to user's location
      if (filters.userLocation && typeof filters.userLocation === 'object' &&
          filters.userLocation.latitude && filters.userLocation.longitude) {
        
        const { latitude, longitude, radius } = filters.userLocation;
        
        // Add distance to each property
        filteredProperties = filteredProperties.map(property => {
          if (property.lat && property.lng) {
            const distance = calculateDistance(
              latitude, 
              longitude, 
              property.lat, 
              property.lng
            );
            return { ...property, distance } as PropertyWithDistance;
          }
          // If property doesn't have coordinates, put it at the bottom
          return { ...property, distance: Number.MAX_VALUE } as PropertyWithDistance;
        });
        
        // Filter by radius if provided, otherwise just sort by distance
        if (radius && typeof radius === 'number') {
          filteredProperties = filteredProperties.filter((p): p is PropertyWithDistance => 
            'distance' in p && p.distance <= radius
          );
        }
        
        // Sort by proximity
        filteredProperties.sort((a, b) => 
          (a as PropertyWithDistance).distance - (b as PropertyWithDistance).distance
        );
      }

      resolve(filteredProperties);
    }, 500);
  });
};

export const getPropertyById = (id: string): Promise<Property | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const property = properties.find((p) => p.id === id) || null;
      resolve(property);
    }, 300);
  });
};

export const getSimilarProperties = (id: string, university: string): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const similarProperties = properties
        .filter((p) => p.id !== id && p.university === university)
        .slice(0, 3);
      resolve(similarProperties);
    }, 300);
  });
};

// New function to get properties near user's current location
export const getNearbyProperties = (
  latitude: number, 
  longitude: number, 
  radiusKm: number = 10
): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate distance for each property
      const propertiesWithDistance = properties.map(property => {
        if (property.lat && property.lng) {
          const distance = calculateDistance(
            latitude, 
            longitude, 
            property.lat, 
            property.lng
          );
          return { ...property, distance };
        }
        return { ...property, distance: Number.MAX_VALUE };
      });
      
      // Filter properties within radius and sort by distance
      const nearbyProperties = propertiesWithDistance
        .filter(property => property.distance <= radiusKm)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      resolve(nearbyProperties);
    }, 500);
  });
};

export const addProperty = (property: Omit<Property, 'id'>): Promise<Property> => {
  return new Promise((resolve) => {
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
    };
    properties = [...properties, newProperty];
    resolve(newProperty);
  });
};

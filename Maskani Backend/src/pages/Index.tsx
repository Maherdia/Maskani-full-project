import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchFilter from "@/components/SearchFilter";
import DormCard from "@/components/DormCard";
import { PropertyMap } from "@/components/PropertyMap";
import NearbyProperties from "@/components/NearbyProperties";
import Footer from "@/components/Footer";
import { dormAPI } from "@/lib/api/dorm";
import { SearchDormParams, DormData } from "@/lib/api/types";
import { MapPin, Building, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [featuredDorms, setFeaturedDorms] = useState<DormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([31.1829, 35.7046]); // Default to Jordan
  
  const handleSearch = async (filters: SearchDormParams) => {
    setLoading(true);
    try {
      const results = await dormAPI.searchDorms(filters);
      setDorms(results);
      
      // We can't easily center map without lat/lng on DormData
    } catch (error) {
      console.error("Error searching dorms:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    async function fetchDorms() {
      setLoading(true);
      try {
        const allDorms = await dormAPI.getAllDorms();
        setDorms(allDorms);
        
        const featured = [...allDorms]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        setFeaturedDorms(featured);
      } catch (error) {
        console.error("Error fetching dorms:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDorms();
  }, []);
  
  const heroProperties = featuredDorms.map(d => ({
    id: d.dormID || '',
    name: d.dormName,
    image: "/dorm-placeholder.jpg",
    location: d.address,
  }));

  const mapProperties = dorms.map(d => ({
      id: d.dormID || d.dormName,
      name: d.dormName,
      lat: 31.18, // Placeholder
      lng: 35.7, // placeholder
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {heroProperties.length > 0 && <Hero properties={heroProperties} />}
        
        <div className="container mx-auto px-4 py-8">
          
          {/* Nearby Properties */}
          
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Student Housing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredDorms.map((dorm) => (
                <DormCard key={dorm.dormID} dorm={dorm} />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Browse Student Housing</h2>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="animate-pulse bg-white rounded-lg overflow-hidden shadow-md">
                      <div className="h-48 bg-gray-300"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : dorms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dorms.map((dorm) => (
                    <DormCard key={dorm.dormID} dorm={dorm} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center shadow-md">
                  <p className="text-gray-600 mb-4">No properties found matching your criteria.</p>
                  <Button 
                    onClick={() => handleSearch({})} 
                    variant="outline"
                  >
                    Show All Properties
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Property Locations</h2>
              <div className="sticky top-6">
                <PropertyMap properties={mapProperties} center={mapCenter} height="600px" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Why Choose Maskani for Student Housing?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-maskani-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-maskani-primary" />
                </div>
                <h3 className="font-bold mb-2">Prime Locations</h3>
                <p className="text-gray-600">
                  Find housing options near your university to minimize commute time.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-maskani-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Building className="h-8 w-8 text-maskani-primary" />
                </div>
                <h3 className="font-bold mb-2">Quality Accommodations</h3>
                <p className="text-gray-600">
                  Comfortable and well-maintained properties that meet student needs.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-maskani-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-maskani-primary" />
                </div>
                <h3 className="font-bold mb-2">Student Community</h3>
                <p className="text-gray-600">
                  Connect with fellow students and build lasting friendships.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-maskani-primary/10 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-maskani-primary" />
                </div>
                <h3 className="font-bold mb-2">Academic Success</h3>
                <p className="text-gray-600">
                  Create an environment conducive to learning and achievement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { getPropertyById, getSimilarProperties } from "@/services/propertyService";
import { addPropertyToViewed } from "@/services/userPreferenceService"; 
import { Property } from "@/types";
import { MapPin, Home, School, Phone, Mail, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyMap } from "@/components/PropertyMap";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getPropertyById(id);
        setProperty(data);
        
        if (data) {
          // Add to viewed properties for AI recommendations
          addPropertyToViewed(id);
          
          // Fetch similar properties
          const similar = await getSimilarProperties(id, data.university);
          setSimilarProperties(similar);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);
  
  const nextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };
  
  const prevImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded mb-6"></div>
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/apartments')}>
              Browse Properties
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-600 hover:text-maskani-primary flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to search results
          </button>
        </div>
        
        <div className="mb-8">
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <img 
              src={property.images[currentImageIndex]} 
              alt={property.name} 
              className="w-full h-full object-cover"
            />
            
            {property.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-2xl font-bold mb-2">{property.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location}</span>
              </div>
              
              <p className="text-gray-700 mb-8">{property.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Home className="h-5 w-5 mx-auto mb-2 text-maskani-primary" />
                  <span className="block text-sm text-gray-500">Bedrooms</span>
                  <span className="font-semibold">{property.bedrooms}</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto mb-2 text-maskani-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span className="block text-sm text-gray-500">Bathrooms</span>
                  <span className="font-semibold">{property.bathrooms}</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto mb-2 text-maskani-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  <span className="block text-sm text-gray-500">Area</span>
                  <span className="font-semibold">{property.area} m²</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <School className="h-5 w-5 mx-auto mb-2 text-maskani-primary" />
                  <span className="block text-sm text-gray-500">University</span>
                  <span className="font-semibold truncate">{property.university}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-maskani-primary mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-3">Location</h2>
                <div className="h-[300px] rounded-lg overflow-hidden">
                  <PropertyMap 
                    properties={[property]} 
                    center={[property.lat || 31.1829, property.lng || 35.7046]}
                    zoom={15}
                    height="300px"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-maskani-primary">
                  {property.price} {property.currency}
                </h2>
                <span className="text-gray-500">Monthly Rent</span>
              </div>
              
              <div className="space-y-4">
                <Button 
                  className="w-full bg-maskani-primary hover:bg-maskani-primary/90 text-white"
                  onClick={() => navigate(`/booking/${id}`)}
                >
                  Book Now
                </Button>
                
                <Button variant="outline" className="w-full">
                  Contact Landlord
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Property Manager</h2>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h3 className="font-semibold">Maskani Team</h3>
                  <p className="text-gray-600 text-sm">Property Manager</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+962 79 123 4567</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>info@maskani.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((similar) => (
                <PropertyCard key={similar.id} property={similar} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetails;

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HeroProperty = {
  id: string;
  name: string;
  image: string;
  location?: string;
};

type HeroProps = {
  properties: HeroProperty[];
};

const Hero = ({ properties }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % properties.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, properties.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, handleNextSlide]);

  const handlePrevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + properties.length) % properties.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const property = properties[currentSlide];

  return (
    <div className="relative h-[70vh] overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
          isTransitioning ? "opacity-0 scale-110" : "opacity-100 scale-100"
        }`}
        style={{
          backgroundImage: `url(${property.image})`,
        }}
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-white">
        <div className="max-w-4xl">
          {property.location && <span className="text-sm font-semibold mb-2">{property.location}</span>}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-maskani-primary">{property.name}</span>
          </h1>
          
          <div className="flex gap-4 mb-16">
            <Link 
              to={`/dorms/${property.id}`} 
              className="bg-maskani-primary/90 text-white px-6 py-3 rounded-full hover:bg-maskani-primary transition"
            >
              View Details
            </Link>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {properties.map((_, index) => (
              <button
                key={index}
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-maskani-primary" : "bg-white/60"
                }`}
                onClick={() => {
                  if (isTransitioning) return;
                  setIsTransitioning(true);
                  setCurrentSlide(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsTransitioning(false), 1000);
                }}
              ></button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={handlePrevSlide}
              disabled={isTransitioning}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={handleNextSlide}
              disabled={isTransitioning}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

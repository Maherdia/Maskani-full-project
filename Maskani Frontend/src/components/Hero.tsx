import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSlideImages } from "@/services/imageService";
import { motion, AnimatePresence } from "framer-motion";

// Constants
const SLIDE_DURATION = 3000; // 3 seconds
const TRANSITION_DURATION = 1000; // 1 second

// Animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

type HeroProperty = {
  id: string;
  name: string;
  image: string;
  location?: string;
};

type HeroProps = {
  properties?: HeroProperty[];
  slideDuration?: number;
};

const Hero = ({ 
  properties = [], 
  slideDuration = SLIDE_DURATION 
}: HeroProps) => {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideImages, setSlideImages] = useState<string[]>([]);

  useEffect(() => {
    // Load slide images from public/images folder
    setSlideImages(getSlideImages());
  }, []);

  const paginate = useCallback((newDirection: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlide(([current]) => {
      const nextSlide = (current + newDirection + slideImages.length) % slideImages.length;
      return [nextSlide, newDirection];
    });
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  }, [isTransitioning, slideImages.length]);

  useEffect(() => {
    if (!isAutoPlaying || slideImages.length <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, slideDuration);

    return () => clearInterval(timer);
  }, [isAutoPlaying, paginate, slideImages.length, slideDuration]);

  const handleSlideClick = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const direction = index > currentSlide ? 1 : -1;
    setSlide([index, direction]);
    setIsAutoPlaying(false);
    setTimeout(() => {
      setIsTransitioning(false);
      setIsAutoPlaying(true);
    }, TRANSITION_DURATION);
  };

  if (slideImages.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slideImages[currentSlide]})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="container mx-auto h-full flex flex-col justify-center items-start px-4"
          >
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            >
              Find Your Perfect Student Housing
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
            >
              Browse a wide range of student apartments designed for modern living near your university.
              Enjoy fully furnished spaces, high-speed internet, and a supportive community environment.
              Start your journey with a home that fits your lifestyle and fuels your success.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/apartments">
             
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {slideImages.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-1 w-8 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-maskani-primary" : "bg-white/60"
                  }`}
                  onClick={() => handleSlideClick(index)}
                ></motion.button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={() => paginate(-1)}
                  disabled={isTransitioning}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={() => paginate(1)}
                  disabled={isTransitioning}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

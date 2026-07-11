
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold inline-block mb-4">
              <span className="text-gray-700">Mask</span>
              <span className="text-maskani-primary">ani</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Finding the perfect student housing near your university has never been easier.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-maskani-primary transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-maskani-primary transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-maskani-primary transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-maskani-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/apartments" className="text-gray-600 hover:text-maskani-primary transition">
                  Apartments
                </Link>
              </li>
              <li>
                <Link to="/universities" className="text-gray-600 hover:text-maskani-primary transition">
                  Universities
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-maskani-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-maskani-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Student Housing</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/apartments?university=mutah" className="text-gray-600 hover:text-maskani-primary transition">
                  Mutah University
                </Link>
              </li>
              <li>
                <Link to="/apartments?university=jordan" className="text-gray-600 hover:text-maskani-primary transition">
                  University of Jordan
                </Link>
              </li>
              <li>
                <Link to="/apartments?university=yarmouk" className="text-gray-600 hover:text-maskani-primary transition">
                  Yarmouk University
                </Link>
              </li>
              <li>
                <Link to="/apartments?university=just" className="text-gray-600 hover:text-maskani-primary transition">
                  Jordan University of Science and Technology
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-maskani-primary mr-2 mt-1" />
                <span className="text-gray-600">
                  Amman, Jordan<br />King Abdullah II St.
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-maskani-primary mr-2" />
                <span className="text-gray-600">+962 79 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-maskani-primary mr-2" />
                <span className="text-gray-600">info@maskani.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Maskani. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

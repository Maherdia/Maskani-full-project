import { Link } from "react-router-dom";
import { Menu, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="w-full bg-white py-4 px-6 shadow-sm flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold">
        <span className="text-gray-700">Mask</span>
        <span className="text-maskani-primary">ani</span>
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8">
        <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">
          Home
        </Link>
        <Link to="/apartments" className="text-gray-700 hover:text-gray-900 font-medium">
          Apartments
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
          Contact
        </Link>
        {isAuthenticated && user?.role === 'Student' && (
          <Link to="/student-booking" className="text-gray-700 hover:text-gray-900 font-medium">
            Student Booking
          </Link>
        )}
        {isAuthenticated && user?.role === 'Owner' && (
          <Link to="/owner-dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
            Owner Dashboard
          </Link>
        )}
        {isAuthenticated && (user?.role === 'Admin' || user?.role === 'User') && (
          <Link to="/admin-dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
            Admin Dashboard
          </Link>
        )}
        {!isAuthenticated ? (
          <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
            Login
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <UserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                {user?.firstName} {user?.lastName}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/account/edit">Edit Account</Link>
              </DropdownMenuItem>
              {user?.role === 'Owner' && (
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/owner-dashboard">Owner Dashboard</Link>
                </DropdownMenuItem>
              )}
              {(user?.role === 'Admin' || user?.role === 'User') && (
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/admin-dashboard">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              {user?.role === 'Student' && (
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/student-booking">Student Booking</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                Home
              </Link>
              <Link to="/apartments" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                Apartments
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                Contact
              </Link>
              {isAuthenticated && user?.role === 'Student' && (
                <Link to="/student-booking" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                  Student Booking
                </Link>
              )}
              {isAuthenticated && user?.role === 'Owner' && (
                <Link to="/owner-dashboard" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                  Owner Dashboard
                </Link>
              )}
              {isAuthenticated && (user?.role === 'Admin' || user?.role === 'User') && (
                <Link to="/admin-dashboard" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                  Admin Dashboard
                </Link>
              )}
              {!isAuthenticated ? (
                <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                  Login
                </Link>
              ) : (
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-gray-900 font-medium text-lg text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;

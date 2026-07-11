import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Search, Navigation, Move, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { dormAPI } from "@/lib/api/dorm";
import { ownerAPI } from "@/lib/api/owner";
import { DormData, AddDormDTO, OwnerDTO } from "@/lib/api/types";
import DormMapClient from "@/components/DormMap";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { UniversityCombobox } from "@/components/UniversityCombobox";
import { AddRoomForm } from "@/components/AddRoomForm";
import { RoomDelete } from "@/components/RoomDelete";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const amenities = [
  "WiFi",
  "AC",
  "Furnished",
  "Security",
  "Washing Machine",
  "Gym",
  "Parking",
  "Study Room",
  "Kitchen",
  "TV"
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [owners, setOwners] = useState<OwnerDTO[]>([]);
  const [isAddingDorm, setIsAddingDorm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [selectedDormForRooms, setSelectedDormForRooms] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddDormDTO>({
    dormID: "",
    dormName: "",
    address: "",
    universityID: "",
    ownerID: 0,
    furnishedOrNot: false,
    distance: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const loadDorms = useCallback(async () => {
    try {
      const result = await dormAPI.getAllDorms();
      setDorms(result);
    } catch (error) {
      console.error("Error loading dorms:", error);
      toast({
        title: "Error",
        description: "Failed to load dorms",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    loadDorms();
  }, [loadDorms]);

  // Load owners
  useEffect(() => {
    const loadOwners = async () => {
      try {
        const ownersData = await ownerAPI.getAllOwners();
        // Ensure we always set an array, even if API returns null/undefined
        setOwners(Array.isArray(ownersData) ? ownersData : []);
      } catch (error) {
        console.error("Error loading owners:", error);
        // Set empty array on error
        setOwners([]);
        toast({
          title: "Error",
          description: "Failed to load owners",
          variant: "destructive",
        });
      }
    };

    loadOwners();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate distance between two points in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return Math.round(R * c); // Convert to meters and round to nearest meter
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    // Calculate distance from university location (example coordinates for University of Jordan)
    const universityLat = 32.0178;
    const universityLng = 35.8733;
    const distanceInMeters = calculateDistance(lat, lng, universityLat, universityLng);
    
    setFormData(prev => ({
      ...prev,
      dormID: `${lat},${lng}`,
      distance: distanceInMeters
    }));
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ", Jordan"
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setSelectedLocation([parseFloat(lat), parseFloat(lon)]);
        setFormData(prev => ({
          ...prev,
          dormID: `${lat},${lon}`,
          address: data[0].display_name
        }));
        toast({
          title: "Location Found",
          description: "Location has been marked on the map",
        });
      } else {
        toast({
          title: "Error",
          description: "Location not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error searching for location",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation([latitude, longitude]);
        setFormData(prev => ({
          ...prev,
          dormID: `${latitude},${longitude}`,
          distance: 0
        }));
        toast({
          title: "Location Set",
          description: "Your current location has been marked on the map",
        });
      },
      (error) => {
        toast({
          title: "Error",
          description: "Failed to get your current location",
          variant: "destructive",
        });
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      toast({
        title: "Error",
        description: "Please select a location on the map",
        variant: "destructive",
      });
      return;
    }

    try {
      const nameExists = await dormAPI.dormNameExists(formData.dormName);
      if (nameExists) {
        toast({
          title: "Error",
          description: "Dorm name already exists",
          variant: "destructive",
        });
        return;
      }

      await dormAPI.addDorm(formData);
      
      toast({
        title: "Success",
        description: "Dorm added successfully",
      });

      setFormData({
        dormID: "",
        dormName: "",
        address: "",
        universityID: "",
        ownerID: 0,
        furnishedOrNot: false,
        distance: 0
      });
      setSelectedLocation(null);
      setIsAddingDorm(false);
      
      loadDorms();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add property",
        variant: "destructive",
      });
    }
  };

  // Convert owners to ComboboxOption format with safety checks
  const ownerOptions: ComboboxOption[] = Array.isArray(owners) 
    ? owners.map(owner => ({
        value: owner.ownerID.toString(),
        label: `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || `Owner ${owner.ownerID}`
      }))
    : [];

  const handleDeleteDorm = async (dormID: string) => {
    try {
      await dormAPI.deleteDorm(dormID);
      toast({
        title: "Success",
        description: "Dorm deleted successfully",
      });
      loadDorms();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete dorm",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
          <Button 
            onClick={() => setIsAddingDorm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Add New Dorm
          </Button>
        </div>

        {isAddingDorm ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-100">
            <h2 className="text-xl font-semibold mb-6 text-black">Add New Dorm</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dormID" className="text-black">Dorm ID</Label>
                  <Input
                    id="dormID"
                    name="dormID"
                    value={formData.dormID || ''}
                    onChange={handleInputChange}
                    required
                    className="text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dormName" className="text-black">Dorm Name</Label>
                  <Input
                    id="dormName"
                    name="dormName"
                    value={formData.dormName}
                    onChange={handleInputChange}
                    required
                    className="text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-black">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="universityID" className="text-black">University</Label>
                  <UniversityCombobox
                    value={formData.universityID}
                    onValueChange={(value) => handleSelectChange("universityID", value)}
                    placeholder="Select University"
                    className="w-full text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerID" className="text-black">Owner</Label>
                  <Combobox
                    options={ownerOptions}
                    value={formData.ownerID ? formData.ownerID.toString() : ""}
                    onValueChange={(value) => {
                      const numericValue = value ? parseInt(value, 10) : 0;
                      setFormData((prev) => ({
                        ...prev,
                        ownerID: numericValue,
                      }));
                    }}
                    placeholder="Select Owner"
                    emptyText="No owners found"
                    className="text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="furnishedOrNot" className="text-black">Furnished</Label>
                  <Select
                    value={formData.furnishedOrNot.toString()}
                    onValueChange={(value) => 
                      setFormData(prev => ({
                        ...prev,
                        furnishedOrNot: value === 'true'
                      }))
                    }
                  >
                    <SelectTrigger className="text-black">
                      <SelectValue placeholder="Furnishing Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance" className="text-black">Distance (meters)</Label>
                  <Input
                    id="distance"
                    name="distance"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.distance}
                    onChange={handleInputChange}
                    required
                    className="text-black"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-black">Location on Map</Label>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search for address or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
                      className="border-green-200 focus:border-green-500 text-black"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSearchLocation}
                    disabled={isSearching}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    My Location
                  </Button>
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <DormMapClient
                    dorms={selectedLocation ? [{
                      dormID: `${selectedLocation[0]},${selectedLocation[1]}`,
                      dormName: formData.dormName || 'Selected Location',
                      address: `${selectedLocation[0]},${selectedLocation[1]}`,
                      furnishedOrNot: formData.furnishedOrNot,
                      distance: formData.distance,
                      universityName: ''
                    }] : []}
                  />
                  <div className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-md">
                    <p className="text-sm text-black flex items-center">
                      <Move className="h-4 w-4 mr-2" />
                      Drag marker to set exact location
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 sm:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingDorm(false)}
                  className="border-green-600 text-green-600 hover:bg-green-50 h-8 text-sm min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white h-8 text-sm min-w-[100px]"
                >
                  Add Dorm
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dorms.map((dorm) => (
              <Card key={dorm.dormID} className="overflow-hidden border border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-black">{dorm.dormName}</h3>
                    <span className="text-sm text-black">ID: {dorm.dormID}</span>
                  </div>
                  <div className="space-y-2 text-sm text-black">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-green-500" />
                      <span>{dorm.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>{dorm.universityName}</span>
                    </div>
                    <div className="text-sm text-black">
                      {dorm.furnishedOrNot ? "Furnished" : "Unfurnished"}
                    </div>
                    <div className="text-sm text-black">
                      Distance: {dorm.distance.toLocaleString()} meters
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button
                        onClick={() => setSelectedDormForRooms(dorm.dormID)}
                        className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white h-8 text-sm"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add Rooms
                      </Button>
                     
                      <RoomDelete
                        dormID={dorm.dormID}
                        onSuccess={loadDorms}
                      />

                      <Button
                        onClick={() => handleDeleteDorm(dorm.dormID)}
                        variant="destructive"
                        className="flex-1 min-w-[120px] h-8 text-sm"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete Dorm
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedDormForRooms} onOpenChange={() => setSelectedDormForRooms(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-right">Add New Room</DialogTitle>
          </DialogHeader>
          {selectedDormForRooms && (
            <AddRoomForm
              dormId={selectedDormForRooms}
              onSuccess={() => {
                setSelectedDormForRooms(null);
                toast({
                  title: "Success",
                  description: "Room added successfully",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
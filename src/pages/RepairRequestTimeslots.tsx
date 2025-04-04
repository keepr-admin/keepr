
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CalendarTimeslots from "@/components/calendar/CalendarTimeslots";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Tables } from "@/integrations/supabase/types";

type Location = Tables<"locations">;

const RepairRequestTimeslots = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');

        if (error) {
          console.error('Error fetching locations:', error);
          return;
        }

        if (data) {
          setLocations(data);
          // If there are locations, select the first one by default
          if (data.length > 0 && !selectedLocation) {
            setSelectedLocation(data[0].location_id);
          }
        }
      } catch (error) {
        console.error('Error in fetchLocations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [selectedLocation]);

  const handleTimeslotsSelected = async (selectedTimeslots: string[]) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would save these timeslots to the database
      console.log("Selected timeslots:", selectedTimeslots);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        
        // Redirect to confirmation page
        navigate("/repair-request-confirmation");
      }, 1000);
    } catch (error) {
      console.error("Error submitting timeslots:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your timeslot selection. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-keepr-green-100 py-8 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold text-keepr-green-800 mb-4 text-center">
              Choose Repair Timeslots
            </h1>
            <p className="text-lg text-keepr-green-700 max-w-2xl mx-auto text-center mb-6">
              Select one or more available timeslots that work for you. A repairer will confirm one of your chosen slots.
            </p>
            
            {/* Location Dropdown */}
            {!loading && locations.length > 0 && (
              <div className="max-w-md mx-auto mb-4">
                <label htmlFor="location-select" className="block text-sm font-medium text-keepr-green-700 mb-2">
                  Choose a location for your repair:
                </label>
                <Select 
                  value={selectedLocation || undefined} 
                  onValueChange={(value) => setSelectedLocation(value)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.location_id} value={location.location_id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </section>

        {/* Calendar Section */}
        <section className="py-8 px-4 md:px-8">
          <div className="container mx-auto">
            <CalendarTimeslots 
              onTimeslotsSelected={handleTimeslotsSelected} 
              selectedLocationId={selectedLocation}
            />
            
            {isSubmitting && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepr-green-500 mb-4"></div>
                  <p className="text-keepr-green-800">Submitting your selection...</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RepairRequestTimeslots;

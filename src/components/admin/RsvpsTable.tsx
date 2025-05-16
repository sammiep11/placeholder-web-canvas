
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Rsvp {
  id: string;
  name: string;
  phone: string;
  attendance: string;
  guests: number;
}

const RsvpsTable = ({ rsvps, setRsvps, loading }: { 
  rsvps: Rsvp[];
  setRsvps: React.Dispatch<React.SetStateAction<any[]>>;
  loading: boolean;
}) => {
  const { toast } = useToast();

  const handleDeleteRsvp = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rsvps_comments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setRsvps(rsvps.filter((rsvp) => rsvp.id !== id));
      
      toast({
        title: "RSVP deleted",
        description: "The RSVP has been removed."
      });
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      toast({
        title: "Error deleting RSVP",
        description: "There was a problem deleting the RSVP.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <p className="text-center py-4">Loading RSVPs...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 spacehey-table">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Attending</th>
            <th className="px-4 py-2 text-left">Guests</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rsvps.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-2 text-center">
                No RSVPs yet
              </td>
            </tr>
          ) : (
            rsvps.map((rsvp) => (
              <tr key={rsvp.id}>
                <td className="px-4 py-2">{rsvp.name}</td>
                <td className="px-4 py-2">{rsvp.phone}</td>
                <td className="px-4 py-2">{rsvp.attendance}</td>
                <td className="px-4 py-2">{rsvp.guests}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRsvp(rsvp.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RsvpsTable;

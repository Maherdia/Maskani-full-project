import React, { useState } from 'react';
import { roomAPI } from '@/lib/api/room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface AddRoomFormProps {
  dormId: string;
  onSuccess?: () => void;
}

export const AddRoomForm: React.FC<AddRoomFormProps> = ({ dormId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    price: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const roomData = {
        dormID: dormId,
        roomNumber: parseInt(formData.roomNumber),
        price: parseFloat(formData.price),
        description: formData.description
      };

      await roomAPI.addRoom(roomData);
      
      toast({
        title: "Success",
        description: "Room added successfully",
      });

      // Reset form
      setFormData({
        roomNumber: '',
        price: '',
        description: ''
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error occurred while adding the room",
        variant: "destructive"
      });
      console.error('Error adding room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium mb-1 text-left">
              Room Number
            </label>
            <Input
              id="roomNumber"
              name="roomNumber"
              type="number"
              value={formData.roomNumber}
              onChange={handleChange}
              required
              min="1"
              placeholder="Enter room number"
              className="text-left"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1 text-left">
              Monthly Price
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Enter monthly price"
              className="text-left"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1 text-left">
              Room Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter room description"
              rows={3}
              className="text-left"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Room'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { api } from '@/lib/api';

const bookingSchema = z.object({
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  checkIn: z.date(),
  checkOut: z.date(),
  roomType: z.enum(['standard', 'deluxe', 'suite', 'presidential']),
  numberOfGuests: z.number().min(1).max(4),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const ROOM_TYPES = [
  { value: 'standard', label: 'Standard Room', price: 100 },
  { value: 'deluxe', label: 'Deluxe Room', price: 200 },
  { value: 'suite', label: 'Suite', price: 300 },
  { value: 'presidential', label: 'Presidential Suite', price: 500 },
];

export default function BookingPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const selectedRoomType = watch('roomType');
  const selectedRoom = ROOM_TYPES.find(room => room.value === selectedRoomType);

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsLoading(true);
      const totalNights = Math.ceil(
        (data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = totalNights * (selectedRoom?.price || 0);

      const response = await api.createBooking({
        ...data,
        totalAmount,
      });

      toast.success('Booking created successfully!', {
        description: `Booking reference: ${response._id}`,
      });

      // Reset form
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
    } catch (error) {
      toast.error('Failed to create booking', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Book Your Stay</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guest Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="guestName">Guest Name</Label>
              <Input
                id="guestName"
                placeholder="Enter your name"
                {...register('guestName')}
              />
              {errors.guestName && (
                <p className="text-sm text-destructive mt-1">{errors.guestName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="Enter your phone number"
                {...register('phoneNumber')}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div>
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? (
                      format(checkInDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={(date) => {
                      setCheckInDate(date);
                      setValue('checkIn', date as Date);
                    }}
                    disabled={(date) =>
                      date < new Date() || (checkOutDate ? date > checkOutDate : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? (
                      format(checkOutDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={(date) => {
                      setCheckOutDate(date);
                      setValue('checkOut', date as Date);
                    }}
                    disabled={(date) =>
                      date < new Date() || (checkInDate ? date < checkInDate : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Room Type</Label>
              <Select
                onValueChange={(value) => setValue('roomType', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((room) => (
                    <SelectItem key={room.value} value={room.value}>
                      {room.label} - ${room.price}/night
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="numberOfGuests">Number of Guests</Label>
              <Input
                id="numberOfGuests"
                type="number"
                min="1"
                max="4"
                {...register('numberOfGuests', { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="specialRequests">Special Requests</Label>
          <Input
            id="specialRequests"
            placeholder="Any special requests?"
            {...register('specialRequests')}
          />
        </div>

        {selectedRoom && checkInDate && checkOutDate && (
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-semibold mb-2">Booking Summary</h3>
            <p>Room Type: {selectedRoom.label}</p>
            <p>Price per night: ${selectedRoom.price}</p>
            <p>Number of nights: {
              Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
            }</p>
            <p className="font-bold mt-2">
              Total Amount: ${
                Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) 
                * selectedRoom.price
              }
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Book Now'}
        </Button>
      </form>
    </Card>
  );
}

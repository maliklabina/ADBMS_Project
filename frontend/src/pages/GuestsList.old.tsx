import { useState, useEffect } from 'react';
import { useBookings, Booking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, CheckCircle2, XCircle, CircleDot } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditBookingModal from '@/components/modals/EditBookingModal';

const GuestsList = () => {
  const { bookings, loading, error, fetchBookings, updateBookingStatus, cancelBooking } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('GuestsList: Component mounted');
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log('GuestsList: Auth state', { hasToken: !!token, isAdmin });
    
    if (!token || !isAdmin) {
      console.log('GuestsList: No token or not admin, redirecting...');
      return;
    }

    console.log('GuestsList: Fetching bookings...');
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = bookings.filter((booking) =>
    booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancel = async () => {
    if (deleteId) {
      try {
        await cancelBooking(deleteId);
        toast.success('Booking cancelled successfully');
        setDeleteId(null);
      } catch (err: any) {
        toast.error(err.message || 'Failed to cancel booking');
      }
    }
  };

  const handleStatusChange = async (bookingId: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update booking status');
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'checked-in': 'bg-green-100 text-green-800',
      'checked-out': 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={variants[status]}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-lg">Loading bookings...</p>
          </div>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="p-12 text-center">
          <p className="text-destructive text-lg">Error: {error}</p>
          <Button onClick={fetchBookings} className="mt-4">Retry</Button>
        </Card>
      );
    }

    if (!loading && bookings.length === 0) {
      return (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No bookings found</p>
        </Card>
      );
    }

    // Show loading state
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30">
          <Card className="p-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-muted-foreground text-lg">Loading bookings...</p>
            </div>
          </Card>
        </div>
      );
    }

    // Show error state
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30">
          <Card className="p-12 text-center">
            <p className="text-destructive text-lg">Error loading bookings: {error}</p>
            <Button onClick={fetchBookings} className="mt-4">Retry</Button>
          </Card>
        </div>
      );
    }

    // Show main content
    return (
      if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Card className="p-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-lg">Loading bookings...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Card className="p-12 text-center">
          <p className="text-destructive text-lg">Error loading bookings: {error}</p>
          <Button onClick={fetchBookings} className="mt-4">Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Guest Bookings</h1>
          <p className="text-muted-foreground text-lg">Manage all hotel reservations</p>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6 shadow-elegant">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, booking ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </Card>

        {/* Bookings Table */}
        {renderContent()}
          <Card className="overflow-hidden shadow-elegant animate-scale-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-primary text-primary-foreground">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Booking ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Guest Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Room Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Check-in</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Check-out</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-secondary/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 text-sm font-medium">{booking._id}</td>
                      <td className="px-6 py-4 text-sm">{booking.guestName}</td>
                      <td className="px-6 py-4 text-sm">{booking.roomType}</td>
                      <td className="px-6 py-4 text-sm">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <div>{booking.contactNumber}</div>
                        <div className="text-xs text-muted-foreground">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              {getStatusBadge(booking.status)}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            {booking.status !== 'cancelled' && (
                              <>
                                {booking.status === 'pending' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking._id, 'confirmed')}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    <span>Confirm Booking</span>
                                  </DropdownMenuItem>
                                )}
                                {booking.status === 'confirmed' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking._id, 'checked-in')}>
                                    <CircleDot className="mr-2 h-4 w-4" />
                                    <span>Check In</span>
                                  </DropdownMenuItem>
                                )}
                                {booking.status === 'checked-in' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking._id, 'checked-out')}>
                                    <CircleDot className="mr-2 h-4 w-4" />
                                    <span>Check Out</span>
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          {booking.status !== 'cancelled' && booking.status !== 'checked-out' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditBooking(booking)}
                                className="hover:bg-primary hover:text-primary-foreground transition-all"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteId(booking._id)}
                                className="hover:bg-destructive hover:text-destructive-foreground transition-all"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will cancel the booking. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, keep it</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90">
                Yes, cancel booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Modal */}
        {editBooking && (
          <EditBookingModal
            booking={editBooking}
            isOpen={!!editBooking}
            onClose={() => setEditBooking(null)}
          />
        )}
      </div>
    </div>
  );
};

export default GuestsList;

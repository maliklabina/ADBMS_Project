import { useNavigate } from 'react-router-dom';
import BookingPanel from '@/components/BookingPanel';

const BookingForm = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Book Your Stay</h1>
          <p className="text-muted-foreground text-lg">Fill in your details to reserve a room</p>
        </div>
        <BookingPanel />
      </div>
    </div>
  );
};

export default BookingForm;

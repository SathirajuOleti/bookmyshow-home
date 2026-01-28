-- Add seat_numbers column to bookings table to track which specific seats were booked
ALTER TABLE public.bookings 
ADD COLUMN seat_numbers text[] DEFAULT '{}';

-- Create an index for querying booked seats by showtime
CREATE INDEX idx_bookings_showtime_seats ON public.bookings(showtime_id) WHERE booking_status != 'cancelled';
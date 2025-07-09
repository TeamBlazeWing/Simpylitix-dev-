export const transformEventData = (backendEvent, userEnrollments) => {
  const isEnrolled = userEnrollments.some(enrollment => {
    const enrollmentEventId = enrollment.event?._id || enrollment.event?.id || enrollment.eventId;
    return enrollmentEventId === backendEvent._id;
  });
  
  return {
    id: backendEvent._id,
    title: backendEvent.title,
    description: backendEvent.description,
    eventCode: backendEvent.eventCode,
    type: backendEvent.type,
    date: backendEvent.date,
    time: backendEvent.time || 'Time TBA',
    location: backendEvent.location || 'Location TBA',
    imageUrl: backendEvent.imageUrl || '/simplytix.svg',
    district: backendEvent.district || 'General',
    createdBy: backendEvent.createdBy,
    createdByName: typeof backendEvent.createdBy === 'object' && backendEvent.createdBy?.name 
      ? backendEvent.createdBy.name 
      : backendEvent.createdBy || 'Unknown',
    maxAttendees: backendEvent.maxAttendees || 100,
    attendees: backendEvent.attendees || 0,
    tags: backendEvent.tags || [],
    isEnrolled: isEnrolled,
    tickets: backendEvent.tickets && backendEvent.tickets.length > 0 
      ? backendEvent.tickets.map(ticket => ({
          id: ticket._id || ticket.id,
          name: ticket.name,
          price: ticket.price,
          totalQuantity: ticket.totalQuantity || ticket.quantity || 100,
          availableQuantity: ticket.availableQuantity || ticket.quantity || 100,
          soldQuantity: ticket.soldQuantity || 0,
          quantity: ticket.totalQuantity || ticket.quantity || 100,
          isAvailable: (ticket.availableQuantity || ticket.quantity || 100) > 0,
          percentageSold: ticket.totalQuantity ? ((ticket.soldQuantity || 0) / ticket.totalQuantity * 100).toFixed(1) : 0
        }))
      : [{
          id: 'default',
          name: 'General Admission',
          price: 0,
          totalQuantity: 100,
          availableQuantity: 100,
          soldQuantity: 0,
          quantity: 100,
          isAvailable: true,
          percentageSold: 0
        }],
    price: backendEvent.tickets && backendEvent.tickets.length > 0 ? backendEvent.tickets[0].price : 0,
    ticketTypes: backendEvent.tickets && backendEvent.tickets.length > 0 
      ? backendEvent.tickets.map(ticket => ({
          id: ticket._id || ticket.id,
          name: ticket.name,
          price: ticket.price,
          totalQuantity: ticket.totalQuantity || ticket.quantity || 100,
          availableQuantity: ticket.availableQuantity || ticket.quantity || 100,
          soldQuantity: ticket.soldQuantity || 0,
          quantity: ticket.totalQuantity || ticket.quantity || 100,
          isAvailable: (ticket.availableQuantity || ticket.quantity || 100) > 0,
          percentageSold: ticket.totalQuantity ? ((ticket.soldQuantity || 0) / ticket.totalQuantity * 100).toFixed(1) : 0
        }))
      : [{
          id: 'default',
          name: 'General Admission',
          price: 0,
          totalQuantity: 100,
          availableQuantity: 100,
          soldQuantity: 0,
          quantity: 100,
          isAvailable: true,
          percentageSold: 0
        }],
    formattedDate: backendEvent.date ? new Date(backendEvent.date).toLocaleDateString() : '',
    formattedTime: backendEvent.time || 'Time TBA',
    category: backendEvent.category || backendEvent.type,
    isFree: backendEvent.tickets ? backendEvent.tickets.every(ticket => ticket.price === 0) : true,
    totalSoldTickets: backendEvent.totalSoldTickets || 0,
    totalAvailableTickets: backendEvent.totalAvailableTickets || 0,
    totalTickets: backendEvent.totalTickets || (backendEvent.totalSoldTickets || 0) + (backendEvent.totalAvailableTickets || 0) || 
      (backendEvent.tickets && backendEvent.tickets.length > 0 
        ? backendEvent.tickets.reduce((sum, ticket) => sum + (ticket.totalQuantity || ticket.quantity || 0), 0)
        : 100),
    isSoldOut: backendEvent.totalAvailableTickets === 0,
    createdAt: backendEvent.createdAt,
    updatedAt: backendEvent.updatedAt
  };
};
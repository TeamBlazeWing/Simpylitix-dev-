import QRCode from "qrcode";

export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return false;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

export const processTickets = (ticketsData) => {
  return ticketsData.map(ticket => {
    let status = "active";
    if (ticket.checkedIn) {
      status = "used";
    } else if (ticket.eventId && ticket.eventId.date && new Date(ticket.eventId.date) < new Date()) {
      status = "expired";
    }
    
    return {
      ...ticket,
      status
    };
  });
};

export const generateQRCodes = async (ticketList) => {
  const qrCodeMap = {};
  for (const ticket of ticketList) {
    try {
      const qrData = `SimplyTix-Ticket:${ticket.ticketCode || ticket._id}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      qrCodeMap[ticket._id] = qrCodeDataURL;
    } catch (error) {
      console.error(`Error generating QR code for ticket ${ticket._id}:`, error);
    }
  }
  return qrCodeMap;
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "text-green-400 bg-green-400/20 border-green-400/40";
    case "cancelled":
      return "text-red-400 bg-red-400/20 border-red-400/40";
    case "expired":
      return "text-gray-400 bg-gray-400/20 border-gray-400/40";
    case "used":
      return "text-blue-400 bg-blue-400/20 border-blue-400/40";
    default:
      return "text-yellow-400 bg-yellow-400/20 border-yellow-400/40";
  }
};

import { FaCircleCheck, FaCircleXmark, FaClock, FaTicket, FaHourglass } from "react-icons/fa6";

export const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return FaCircleCheck;
    case "cancelled":
      return FaCircleXmark;
    case "expired":
      return FaClock;
    case "used":
      return FaTicket;
    default:
      return FaHourglass;
  }
};

export const generateQRData = (ticket) => {
  return `SimplyTix-Ticket:${ticket._id}`;
};
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = (auctionId, onBidUpdate) => {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    if (auctionId) {
      socketRef.current.emit('join_auction', auctionId);
    }

    socketRef.current.on('bid_placed', (data) => {
      if (onBidUpdate) onBidUpdate(data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [auctionId, onBidUpdate]);

  const emitBid = (bidData) => {
    if (socketRef.current) {
      socketRef.current.emit('place_bid', bidData);
    }
  };

  return { emitBid };
};

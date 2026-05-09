# LuxeAuction: Enterprise Live Auction Platform

LuxeAuction is a premium, real-time bidding platform designed for luxury collectibles, featuring a robust proxy-bidding system, secure Stripe escrow payments, and a high-end Glassmorphism UI.

## 🚀 Features

- **Real-time Bidding**: Powered by Socket.io for instant synchronization across all connected clients.
- **Proxy Bidding System**: Automatic auto-increment system that bids on your behalf up to your maximum limit.
- **Secure Escrow**: Integrated Stripe payments with a hold-and-release workflow to protect both buyers and sellers.
- **Enterprise UI**: Built with React, Tailwind CSS, and Framer Motion for a stunning, smooth, and professional experience.
- **Role-based Dashboards**: Custom interfaces for Bidders, Sellers, and Admins.
- **JSP Certificates**: Dynamically generated certificates and receipts for auction winners.
- **Analytics**: Beautiful charts showing bidding trends and revenue.

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, Lucide React, Recharts.
- **Backend**: Node.js, Express.js, Socket.io, Mongoose, JWT, bcrypt, Stripe API, Node-Cron.
- **Database**: MongoDB (Atlas or Local).
- **Other**: JSP (Java Server Pages) for official documents.

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or a connection string)
- Stripe Account (for API keys)

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on the example below
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Variables (`.env` in /backend)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
FRONTEND_URL=http://localhost:5173
```

## 📜 Proxy Bidding Logic
The system uses a recursive auto-bid algorithm:
1. When a manual bid is placed, the system checks for any active proxy bids.
2. If a proxy bid's maximum limit is higher than the new bid, it automatically places a bid at `newBid + increment`.
3. If multiple proxy bids are active, they will compete automatically until only one remains within their limit.

## 🛡 Escrow Workflow
1. **Auction Ends**: The winner is notified.
2. **Payment**: Winner pays into a Stripe Escrow (Held status).
3. **Shipping**: Seller is notified and ships the item.
4. **Delivery**: Buyer confirms receipt.
5. **Release**: Funds are released to the seller's balance.

## 📂 Project Structure
- `/backend`: Express API, Sockets, and Services.
- `/frontend`: React application with Tailwind CSS.
- `/jsp`: Standalone JSP templates for certificates and invoices.

## 📄 License
MIT License. Built for Portfolio Showcase 2026.

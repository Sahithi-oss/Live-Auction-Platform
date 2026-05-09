# Live Auction Platform

A full-stack real-time auction platform where users can create auctions, place live bids, and securely complete transactions using an escrow-based payment workflow. The platform supports instant bid updates using WebSockets and includes an automatic proxy bidding system similar to popular e-commerce auction platforms.

---

# Features

* Real-time live bidding using Socket.io
* Proxy bidding system with automatic bid increments
* Auction countdown timer
* Secure escrow payment workflow using Stripe
* Seller dashboard for managing auction items
* Bidder dashboard with bidding history
* Live bid feed updates for all connected users
* Auction result certificate generation
* Payment receipt generation using JSP
* Responsive and modern React UI
* MongoDB database integration for storing auctions, bids, users, and payments

---

# Tech Stack

## Frontend

* React JS
* HTML5
* CSS3
* JavaScript

## Backend

* Node.js
* Express.js
* Socket.io

## Database

* MongoDB

## Payment Integration

* Stripe API

## Additional Technologies

* JSP for auction certificates and receipts
* JWT Authentication
* REST APIs

---

# System Modules

## User Authentication

* User registration and login
* JWT-based authentication
* Role-based access for sellers and bidders

## Auction Management

* Sellers can create auctions
* Upload item details and images
* Set starting price and auction duration
* Manage active and completed auctions

## Live Bidding System

* Real-time bid updates using WebSockets
* Current highest bid displayed instantly
* Bid validation to prevent invalid bids
* Live auction room with countdown timer

## Proxy Bidding

* Users can set a maximum bid amount
* System automatically increases bids on behalf of users
* Ensures competitive bidding without manual intervention

## Escrow Payment System

* Winning bidder makes payment through Stripe
* Payment is held securely in escrow
* Funds released to seller after delivery confirmation

## Auction Result & Receipt

* Auction winner certificate generation
* JSP-based payment receipt page
* Downloadable transaction proof

---

# Project Architecture

```

Client (React JS)
        |
        v
Express.js + Node.js Server
        |
        |---- Socket.io (Real-Time Communication)
        |
        |---- Stripe Payment Gateway
        |
        v
MongoDB Database

```

---

# Installation and Setup

## Clone the Repository

```bash
git clone https://github.com/Sahithi-oss/live-auction-platform.git
```

## Navigate to the Project Folder

```bash
cd live-auction-platform
```

## Install Backend Dependencies

```bash
npm install
```

## Install Frontend Dependencies

```bash
cd client
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory and add:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=5000
```

---

# Running the Project

## Start Backend Server

```bash
npm start
```

## Start Frontend

```bash
cd client
npm start
```

---

# Real-Time Auction Workflow

1. Seller creates an auction item.
2. Auction becomes visible to all users.
3. Bidders join the auction room.
4. Users place bids in real time.
5. Socket.io broadcasts updated bids instantly.
6. Proxy bid system auto-increments bids when necessary.
7. Auction timer ends automatically.
8. Highest bidder wins the auction.
9. Winner completes payment through Stripe.
10. Payment stays in escrow until delivery confirmation.
11. Seller receives funds after successful confirmation.

---

# Database Collections

## Users

* User information
* Authentication details
* Role management

## Auctions

* Item details
* Starting price
* Current highest bid
* Auction status
* End time

## Bids

* Bid history
* Bidder information
* Bid timestamps

## Proxy Bids

* Maximum bid settings
* Auto-increment logic

## Escrow Payments

* Payment records
* Transaction status
* Release confirmation

---

# Future Enhancements

* AI-based bid prediction system
* Multi-language support
* Mobile application support
* Fraud detection using machine learning
* Video-based live auction streaming
* Admin analytics dashboard
* Email and SMS notifications
* Blockchain-based transaction verification

---




# Learning Outcomes

* Real-time communication using Socket.io
* Full-stack MERN application development
* Payment gateway integration
* Secure authentication and authorization
* WebSocket-based event handling
* Database schema design
* Escrow workflow implementation

---

# Contributors

* Sahithi Gunturu


---

# License

This project is developed for educational and academic purposes.

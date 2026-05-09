<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>Payment Receipt - LuxeAuction</title>
    <style>
        body { font-family: sans-serif; color: #333; margin: 0; padding: 40px; background: #fafafa; }
        .receipt-container { max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .brand { color: #0284c7; font-size: 24px; font-weight: bold; margin-bottom: 30px; }
        .status { color: #16a34a; font-weight: bold; font-size: 14px; text-transform: uppercase; margin-bottom: 20px; display: block; }
        h1 { font-size: 28px; margin: 0 0 10px 0; }
        .details { margin: 30px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0; }
        .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
        .label { color: #666; }
        .value { font-weight: 600; }
        .total { font-size: 20px; font-weight: bold; margin-top: 20px; display: flex; justify-content: space-between; color: #000; }
        .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
        .qr { width: 80px; height: 80px; background: #f0f0f0; margin: 20px auto; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="brand">LuxeAuction</div>
        <span class="status">✓ Payment Successful</span>
        <h1>Payment Receipt</h1>
        <p style="color: #666; font-size: 14px;">Receipt #REC-<%= Math.round(Math.random() * 1000000) %></p>
        
        <div class="details">
            <div class="row">
                <span class="label">Date</span>
                <span class="value"><%= new java.util.Date() %></span>
            </div>
            <div class="row">
                <span class="label">Payment Method</span>
                <span class="value">Stripe / Credit Card</span>
            </div>
            <div class="row">
                <span class="label">Auction Item</span>
                <span class="value"><%= request.getParameter("itemName") != null ? request.getParameter("itemName") : "Auction Item" %></span>
            </div>
            <div class="row">
                <span class="label">Winning Bid</span>
                <span class="value">$<%= request.getParameter("amount") != null ? request.getParameter("amount") : "0.00" %></span>
            </div>
            <div class="row">
                <span class="label">Escrow Fee</span>
                <span class="value">$0.00</span>
            </div>
            <div class="total">
                <span>Total Amount Paid</span>
                <span>$<%= request.getParameter("amount") != null ? request.getParameter("amount") : "0.00" %></span>
            </div>
        </div>

        <div class="qr"></div>
        
        <div class="footer">
            Thank you for your purchase. This receipt is automatically generated and serves as proof of payment. 
            Funds are currently held in Luxe Escrow.
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; border: 1px solid #ccc; background: white; cursor: pointer;">Download PDF / Print</button>
    </div>
</body>
</html>

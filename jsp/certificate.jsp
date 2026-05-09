<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>Auction Winner Certificate - LuxeAuction</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7f6; padding: 50px; }
        .certificate { 
            background: white; border: 15px solid #0c4a6e; padding: 50px; text-align: center; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative; max-width: 800px; margin: auto;
        }
        .header { font-size: 48px; color: #0c4a6e; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; }
        .subheader { font-size: 24px; color: #64748b; margin-bottom: 40px; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 10px; }
        .content { font-size: 20px; line-height: 1.6; color: #1e293b; margin-bottom: 40px; }
        .highlight { color: #0ea5e9; font-weight: bold; }
        .qr-code { width: 120px; height: 120px; margin: 20px auto; background: #eee; display: flex; items-center; justify-center; border: 1px solid #ddd; }
        .footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
        .signature { border-top: 2px solid #334155; width: 200px; padding-top: 10px; font-weight: bold; color: #334155; }
        @media print { body { background: white; padding: 0; } .certificate { box-shadow: none; border-width: 10px; } }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">Certificate of Ownership</div>
        <div class="subheader">LuxeAuction Official Document</div>
        
        <div class="content">
            This is to certify that <br>
            <span class="highlight"><%= request.getParameter("winnerName") != null ? request.getParameter("winnerName") : "Elite Collector" %></span><br>
            is the official winner of the auction for<br>
            <span class="highlight"><%= request.getParameter("itemName") != null ? request.getParameter("itemName") : "Luxury Asset" %></span><br>
            at the final bid price of <br>
            <span class="highlight">$<%= request.getParameter("amount") != null ? request.getParameter("amount") : "0.00" %></span>
        </div>

        <div class="content" style="font-size: 14px; color: #64748b;">
            Date: <%= new java.util.Date() %><br>
            Transaction ID: LUX-<%= Math.round(Math.random() * 1000000) %>
        </div>

        <div class="qr-code">
            <!-- Simulated QR Code placeholder -->
            <div style="font-size: 10px; padding: 10px;">SCAN TO VERIFY AUTHENTICITY</div>
        </div>

        <div class="footer">
            <div class="signature">Auction Master</div>
            <div style="font-size: 12px; color: #94a3b8;">SECURED BY BLOCKCHAIN & LUXE ESCROW</div>
            <div class="signature">Official Registrar</div>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Certificate</button>
    </div>
</body>
</html>

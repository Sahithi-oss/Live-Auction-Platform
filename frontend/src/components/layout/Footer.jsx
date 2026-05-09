import React from 'react';
import * as Icons from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-bold gradient-text">
            {Icons.Gavel && <Icons.Gavel className="w-6 h-6 text-sky-400" />}
            <span>LuxeAuction</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            The world's premier digital auction house for luxury collectibles, art, and high-end electronics.
          </p>
          <div className="flex gap-4">
            {Icons.Twitter && <Icons.Twitter className="w-5 h-5 text-slate-500 hover:text-sky-400 cursor-pointer transition-colors" />}
            {Icons.Github && <Icons.Github className="w-5 h-5 text-slate-500 hover:text-sky-400 cursor-pointer transition-colors" />}
            {Icons.Linkedin && <Icons.Linkedin className="w-5 h-5 text-slate-500 hover:text-sky-400 cursor-pointer transition-colors" />}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-6">Marketplace</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="hover:text-white cursor-pointer transition-colors">All Auctions</li>
            <li className="hover:text-white cursor-pointer transition-colors">Art & Collectibles</li>
            <li className="hover:text-white cursor-pointer transition-colors">Electronics</li>
            <li className="hover:text-white cursor-pointer transition-colors">Real Estate</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
            <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
            <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
            <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6">Support</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
            <li className="hover:text-white cursor-pointer transition-colors">Safety Center</li>
            <li className="hover:text-white cursor-pointer transition-colors">Dispute Resolution</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-slate-500 text-xs">
        © 2026 LuxeAuction Platform. All rights reserved. Built with precision for elite collectors.
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/dashboard` },
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement className="mb-6" />
      <button 
        disabled={!stripe || isProcessing}
        className="w-full bg-sky-600 hover:bg-sky-500 py-4 rounded-xl font-bold transition-all shadow-lg shadow-sky-900/40 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Pay Now Securely'}
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);

  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchEscrowAndIntent = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`http://localhost:5000/api/escrow/${auctionId}`, config);
        setEscrow(res.data.data);
        
        const intentRes = await axios.post('http://localhost:5000/api/escrow/create-intent', { auctionId }, config);
        setClientSecret(intentRes.data.clientSecret);
        
        setLoading(false);
      } catch (err) {
        toast.error('Payment initialization failed');
        navigate('/dashboard');
      }
    };
    fetchEscrowAndIntent();
  }, [auctionId, token, navigate]);

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/escrow/confirm-payment', { paymentIntentId }, config);
      toast.success('Payment successful! Funds held in escrow.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to confirm escrow status.');
    }
  };

  if (loading) return <div className="p-10 text-center">Initializing Secure Checkout...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 w-full max-w-lg"
      >
        <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs mb-8">
          <ShieldCheck className="w-5 h-5" /> Secured by LuxeEscrow
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Complete Purchase</h1>
        
        <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
          <p className="text-slate-400 text-xs uppercase font-bold mb-2">Total Amount</p>
          <p className="text-4xl font-black text-white">${escrow?.amount?.toLocaleString()}</p>
          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-500">
            Winner: <span className="text-white font-semibold">{escrow?.winner?.username}</span>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Lock className="w-4 h-4" /> SSL Encrypted Payment
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <CreditCard className="w-4 h-4" /> Supports Visa, Mastercard, AMEX
          </div>
        </div>

        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
            <CheckoutForm onSuccess={handlePaymentSuccess} />
          </Elements>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentPage;

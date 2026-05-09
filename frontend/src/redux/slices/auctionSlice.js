import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auctions';

export const fetchAuctions = createAsyncThunk('auctions/fetchAll', async (filters, thunkAPI) => {
  try {
    const response = await axios.get(API_URL, { params: filters });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch auctions';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchAuctionById = createAsyncThunk('auctions/fetchById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch auction details';
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  auctions: [],
  currentAuction: null,
  isLoading: false,
  isError: false,
  message: '',
};

export const auctionSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    updateHighestBid: (state, action) => {
      if (state.currentAuction && state.currentAuction._id === action.payload.auctionId) {
        state.currentAuction.currentBid = action.payload.amount;
        state.currentAuction.highestBidder = action.payload.bidder;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctions = action.payload;
      })
      .addCase(fetchAuctionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAuction = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchAuctionById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { updateHighestBid } = auctionSlice.actions;
export default auctionSlice.reducer;

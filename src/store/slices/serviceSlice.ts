import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ServiceState {
  vehicles: any[];
  serviceRecords: any[];
  workItems: any[];
  advisors: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  vehicles: [],
  serviceRecords: [],
  workItems: [],
  advisors: [],
  loading: false,
  error: null,
};

export const fetchVehicles = createAsyncThunk("service/fetchVehicles", async () => {
  const response = await axios.get("/api/vehicles");
  return response.data;
});

export const fetchServiceRecords = createAsyncThunk("service/fetchServiceRecords", async () => {
  const response = await axios.get("/api/service-records");
  return response.data;
});

export const fetchWorkItems = createAsyncThunk("service/fetchWorkItems", async () => {
  const response = await axios.get("/api/work-items");
  return response.data;
});

export const fetchAdvisors = createAsyncThunk("service/fetchAdvisors", async () => {
  const response = await axios.get("/api/advisors");
  return response.data;
});

export const updateServiceRecord = createAsyncThunk(
  "service/updateServiceRecord",
  async ({ id, data }: { id: string; data: any }) => {
    const response = await axios.patch(`/api/service-records/${id}`, data);
    return response.data;
  }
);

export const createServiceRecord = createAsyncThunk(
  "service/createServiceRecord",
  async (data: any) => {
    const response = await axios.post("/api/service-records", data);
    return response.data;
  }
);

export const createVehicle = createAsyncThunk(
  "service/createVehicle",
  async (data: any) => {
    const response = await axios.post("/api/vehicles", data);
    return response.data;
  }
);

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.vehicles = action.payload;
      })
      .addCase(fetchServiceRecords.fulfilled, (state, action) => {
        state.serviceRecords = action.payload;
      })
      .addCase(fetchWorkItems.fulfilled, (state, action) => {
        state.workItems = action.payload;
      })
      .addCase(fetchAdvisors.fulfilled, (state, action) => {
        state.advisors = action.payload;
      })
      .addCase(updateServiceRecord.fulfilled, (state, action) => {
        const index = state.serviceRecords.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.serviceRecords[index] = action.payload;
        }
      })
      .addCase(createServiceRecord.fulfilled, (state, action) => {
        state.serviceRecords.push(action.payload);
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.vehicles.push(action.payload);
      });
  },
});

export default serviceSlice.reducer;

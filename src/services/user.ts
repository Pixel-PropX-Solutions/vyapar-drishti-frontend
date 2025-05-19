import adminApi from "@/api/adminApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createUser = createAsyncThunk(
  "create/BasicUser",
  async (
    {
      email,
      role,
    }: {
      email: string;
      role: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.post("/create/user", {
        email,
        role,
      });
      console.log("createUser response", response);

      if (response.data.success === true) {
        const id = response.data.id;
        // setCreatedId(userId);
        return { id };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed: Invalid credentials or server error."
      );
    }
  }
);

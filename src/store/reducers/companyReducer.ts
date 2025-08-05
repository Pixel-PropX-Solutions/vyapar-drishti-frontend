import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetCompany } from "@/utils/types";
import { createCompany, getAllCompanies, getCompany } from "@/services/company";

interface CompanyState {
    company: GetCompany | null;
    companies: Array<GetCompany> | [];
    loading: boolean;
    error: string | null;
}

const initialState: CompanyState = {
    company: null,
    companies: [],
    loading: false,
    error: null,
};

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(createCompany.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(createCompany.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createCompany.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(getCompany.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getCompany.fulfilled, (state, action: PayloadAction<any>) => {
                state.company = action.payload.company;
                state.loading = false;
            })
            .addCase(getCompany.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(getAllCompanies.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getAllCompanies.fulfilled, (state, action: PayloadAction<any>) => {
                // Ensure companies is an array of GetCompany objects
                state.companies = action.payload.companies;
                state.loading = false;
            })
            .addCase(getAllCompanies.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

    },
});

// export const {  } = companySlice.actions;
export default companySlice.reducer;

import { createChemist, getChemistProfile, updateChemist, viewAllChemist } from "@/services/chemist";
import { PageMeta, Chemist } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChemistState {
    chemistList: Chemist[];
    chemist: Chemist | null;
    chemistData: Chemist | null;
    loading: boolean,
    error: string | null;
    pageMeta: PageMeta
}

const initialState: ChemistState = {
    chemistList: [],
    chemist: null,
    chemistData: null,
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null
}

const chemistSlice = createSlice({
    name: "chemist",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(viewAllChemist.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllChemist.fulfilled, (state, action: PayloadAction<any>) => {
                state.chemistList = action.payload.chemistsData;
                state.pageMeta = action.payload.pageMeta;
                state.loading = false;
            })
            .addCase(viewAllChemist.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            // get chemist profile
            .addCase(getChemistProfile.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getChemistProfile.fulfilled,
                (state, action: PayloadAction<Chemist>) => {
                    state.chemist = action.payload;
                    state.loading = false;
                }
            )
            .addCase(getChemistProfile.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            // create chemist
            .addCase(createChemist.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(createChemist.fulfilled, (state, action: PayloadAction<any>) => {
                state.chemistData = action.payload.chemistData;
                state.loading = false;
            })
            .addCase(createChemist.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            // update chemist
            .addCase(updateChemist.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateChemist.fulfilled, (state) => {
                // state.chemistData = action.payload.chemistData;
                state.loading = false;
            })
            .addCase(updateChemist.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    }
});

export default chemistSlice.reducer;
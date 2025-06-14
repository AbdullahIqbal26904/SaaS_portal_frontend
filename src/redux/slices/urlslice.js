import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    openSlider: false,
    sliderData: "",
    openleftbar: true,
    activeSection: 'dashboard', // New field for tracking active section in admin dashboard
    modalOpen: false,
    modalContent: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setopenSlider: (state, action) => {
            state.openSlider = action.payload;
        },
        setshowloader: (state, action) => {
            state.loading = action.payload;
        },
        setsliderData: (state, action) => {
            state.sliderData = action.payload;
        },
        setopenleftbar: (state, action) => {
            state.openleftbar = action.payload;
        },
        setActiveSection: (state, action) => {
            state.activeSection = action.payload;
        },
        openModal: (state, action) => {
            state.modalOpen = true;
            state.modalContent = action.payload;
        },
        closeModal: (state) => {
            state.modalOpen = false;
            state.modalContent = null;
        },
    }
})

export const { 
    setopenSlider, 
    setshowloader, 
    setsliderData, 
    setopenleftbar,
    setActiveSection,
    openModal,
    closeModal
} = uiSlice.actions;
export default uiSlice.reducer;
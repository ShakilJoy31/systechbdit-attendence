import { createSlice } from "@reduxjs/toolkit";

export interface SidebarState {
  open: boolean;
}

const initialState: SidebarState = {
  open: true,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    showSidebarDrawer: (state) => {
      state.open = true;
    },
    onSidebarClose: (state) => {
      state.open = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { showSidebarDrawer, onSidebarClose } = sidebarSlice.actions;

const sidebarReducer = sidebarSlice.reducer;

export default sidebarReducer;
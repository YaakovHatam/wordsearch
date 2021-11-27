import { createSlice } from '@reduxjs/toolkit'
import { IState } from '../store';

export const categoriesSlice = createSlice({
   name: 'categories',
   initialState: {
      values: []
   },
   reducers: {
      setCategories: (state, action) => {
         state.values = action.payload;
      }
   },
})

export const { setCategories } = categoriesSlice.actions

export const selectCategories = (state: IState) => state.categories.values;

export default categoriesSlice.reducer
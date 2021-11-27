import { configureStore } from '@reduxjs/toolkit'
import { IWordSearchCategories } from '../models/categories.model'
import categoriesReducer from './reducers/categories.reducer'

export interface IState {
   categories: {
      values: IWordSearchCategories;
   }
}

export default configureStore({
   reducer: {
      categories: categoriesReducer
   },
})
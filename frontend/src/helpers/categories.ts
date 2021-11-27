import { IWordSearchCategories } from "../models/categories.model";

export async function WordSearchCategories(): Promise<IWordSearchCategories> {
   return (await fetch(`${process.env.PUBLIC_URL}/words/_categories.json`))
      .json();
}
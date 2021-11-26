interface IWordSearchCategories {
   [category: string]: {
      jsonPath: string;
      heb: string;
      desc: string;
   }
}
export const WordSearchCategories: IWordSearchCategories = {
   animals: {
      jsonPath: `${process.env.PUBLIC_URL}/words/animals.json`,
      heb: 'חיות',
      desc: 'תפזורת עם שמות של חיות'
   },
   keshet: {
      jsonPath: `${process.env.PUBLIC_URL}/words/keshet.json`,
      heb: 'שמות ד2',
      desc: 'תפזורת עם שמות שמות של בנות ד2'
   },
   rivers: {
      jsonPath: `${process.env.PUBLIC_URL}/words/river.json`,
      heb: 'נחלים בישראל',
      desc: 'שמות של נחלים בארץ ישראל'
   }
}
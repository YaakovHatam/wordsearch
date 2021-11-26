import { createTwoDimmArray } from "../arrays";

export const randomChar = (length: number) => {
   let result = '';
   const characters = 'אבגדהוזחטיכלמנסעפצקרשת';
   const charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export const randomCharTable = (rows: number, cols: number) => {
   const table: string[][] = createTwoDimmArray(rows, cols, '') as string[][];
   for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
         table[r][c] = randomChar(1);
      }
   }
   return table;
}
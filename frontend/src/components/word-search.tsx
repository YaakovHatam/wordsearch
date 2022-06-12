import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { WordTable } from "./word-table";
import { WordPacker } from "../helpers/word-packer";
import { useSelector } from "react-redux";
import { selectCategories } from "../store/reducers/categories.reducer";

const randomWords = (jsonPath: string) =>
   fetch(jsonPath).then(res => res.json().then((jRes: string[]) =>
      jRes.sort(() => .5 - Math.random()).slice(0, 15)
   ));


export function WordSearch() {
   const ROWS = 18;
   const COLS = 15;

   const params = useParams();
   const categories = useSelector(selectCategories);

   const [wordSearchTable, setWordSearchTable] = useState<string[][]>([]);
   const [availableSlots, setAvailableSlots] = useState<string[][]>([]);

   const [selectedWords, setSelectedWords] = useState<string[]>([]);
   const category = categories[params.category as string];

   const makeTables = (words: string[]) => {
      const wordPacker = WordPacker.createWordPacker(words, COLS, ROWS);

      setWordSearchTable(wordPacker.getLetterGrid());
      setAvailableSlots(wordPacker.getLetterGridClean());
      setSelectedWords(wordPacker.getWords());
   }
   const fetchWordsAndMakeTables = () => randomWords(`${process.env.PUBLIC_URL}/words/${category.jsonFile}`).then(words => makeTables(words));

   useEffect(() => {
      fetchWordsAndMakeTables();
   }, []);

   return (
      <>
         <div className="container">
            <h2 className='mb-4 text-center'>תפזורת של {category.heb}</h2>
            <div className='text-end'>
               <Button variant="outline-success text-start d-print-none" onClick={e => fetchWordsAndMakeTables()}>
                  יצירת תשבץ חדש
               </Button>
            </div>
         </div>
         <div className="container">
            {wordSearchTable.length > 0 ?
               <WordTable wordSearchTable={wordSearchTable} availableSlots={availableSlots} />
               : <></>}
         </div>
         <div className="container">
            <section className='row fs-5 d-flex'>
               {selectedWords.map((w, wi) => <div key={wi} tabIndex={0} className="col-2 flex-grow-1 " title={w}>{w}</div>)}
            </section>
         </div>
      </>
   );
}

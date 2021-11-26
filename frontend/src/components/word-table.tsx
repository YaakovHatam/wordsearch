import { useEffect, useState } from "react";
import classNames from "classnames";
import { Button } from "react-bootstrap";

interface WordTableProps {
   wordSearchTable: string[][];
   availableSlots: string[][];
}
export function WordTable(props: WordTableProps) {
   const [wordSearchTable, setWordSearchTable] = useState<string[][]>([]);
   const [availableSlots, setAvailableSlots] = useState<string[][]>([]);
   const [showAnswers, setShowAnswers] = useState<boolean>(false);

   useEffect(() => {
      setWordSearchTable(props.wordSearchTable);
   }, [props.wordSearchTable]);

   useEffect(() => {
      setAvailableSlots(props.availableSlots);
   }, [props.availableSlots]);

   return (
      (wordSearchTable.length > 0 && availableSlots.length > 0) ?
         <>
            <div className="text-end my-3 d-print-none">
               <Button onClick={e => setShowAnswers(!showAnswers)} variant={showAnswers ? "primary" : "outline-secondary"}>הראה תשובות...</Button>
            </div>
            <table className='table table-bordered border-dark text-center fs-5'>
               <tbody>
                  {wordSearchTable.map((r, ri) =>
                     <tr className="table-light" key={ri}>{r.map((c, ci) =>
                        <td className={classNames({
                           "table-primary": availableSlots[ri][ci] === c && showAnswers
                        })}
                           key={ci}>{c}</td>
                     )}
                     </tr>
                  )}
               </tbody>
            </table>
         </> : <></>
   );
}

import { useNavigate } from "react-router-dom";
import { WordSearchCategories } from "../helpers/categories";

export function ChooseCategory() {
   let navigate = useNavigate();

   const handleClick = (category: string) => navigate(`/generate/${category}`);

   const wordSearchCategories = Object.entries(WordSearchCategories);

   return (
      <div className="container mt-5">
         <label>בחירת גודל תפזורת:
            <select className="form-select form-select-lg" size={8} aria-label="size 3 select example">
               <option value="1">23 שורות ו34 עמודות</option>
               <option value="2">Two</option>
               <option value="3">Three</option>
            </select>
         </label>
         <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5">
            {wordSearchCategories.map(wsc =>
               <div className="col d-flex align-items-start" onClick={e => handleClick(wsc[0])}>
                  <div>
                     <h2 className="fw-bold mb-0">{wsc[1].heb}</h2>
                     <p>{wsc[1].desc}</p>
                     <span role='button' className="btn btn-lg btn-light">לחולל תשבץ</span>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { WordSearchCategories } from "../helpers/categories";
import { selectCategories, setCategories } from "../store/reducers/categories.reducer";

export function ChooseCategory() {
   const navigate = useNavigate();
   const dispatch = useDispatch()


   const categories = useSelector(selectCategories)

   const handleClick = (category: string) => navigate(`/generate/${category}`);

   useEffect(() => {
      WordSearchCategories().then(res => dispatch(setCategories(res)))
   }, [])

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
            {Object.entries(categories).map(wsc =>
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

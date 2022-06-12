import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { WordSearchCategories } from "../helpers/categories";
import { selectCategories, setCategories } from "../store/reducers/categories.reducer";

export function ChooseCategory() {
   const dispatch = useDispatch()


   const categories = useSelector(selectCategories)

   useEffect(() => {
      WordSearchCategories().then(res => dispatch(setCategories(res)))
   }, [])

   return (
      <div className="container mt-5">
         {/*<label>בחירת גודל תפזורת:
            <select className="form-select form-select-lg" size={8} aria-label="size 3 select example">
               <option value="1">23 שורות ו34 עמודות</option>
               <option value="2">Two</option>
               <option value="3">Three</option>
            </select>
         </label>*/}
         <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5">
            {Object.entries(categories).map(wsc =>
               <Link key={wsc[1].jsonFile} to={`/generate/${wsc[0]}`}>
                  <div className="col d-flex align-items-start">
                     <div>
                        <h2 className="fw-bold mb-0">{wsc[1].heb}</h2>
                        <p>{wsc[1].desc}</p>
                        <span role='button' className="btn btn-lg btn-light">לחולל תשבץ</span>
                     </div>
                  </div>
               </Link>
            )}
         </div>
      </div>
   );
}

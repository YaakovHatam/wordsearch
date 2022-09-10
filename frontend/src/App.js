import './App.css';
import { ChooseCategory } from "./components/choose-category";
import { WordSearch } from "./components/word-search";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/wordsearch" element={<ChooseCategory />} />
            <Route path="/wordsearch/:category" element={<WordSearch />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;


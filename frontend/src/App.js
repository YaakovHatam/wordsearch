import './App.css';
import { ChooseCategory } from "./components/choose-category";
import { WordSearch } from "./components/word-search";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
   return (
      <BrowserRouter basename="/wordsearch">
         <Routes>
            <Route path="/" element={<ChooseCategory />} />
            <Route path="/generate/:category" element={<WordSearch />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;


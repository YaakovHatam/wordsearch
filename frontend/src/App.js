import './App.css';
import { ChooseCategory } from "./components/choose-category";
import { WordSearch } from "./components/word-search";

import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";

function App() {
   return (
      <MemoryRouter>
         <Routes>
            <Route path="/" element={<ChooseCategory />} />
            <Route path="/generate/:category" element={<WordSearch />} />
         </Routes>
      </MemoryRouter>
   );
}

export default App;


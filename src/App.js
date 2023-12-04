import logo from './logo.svg';
import './App.css';
import Demo from "./views/demo";
import Caller from "./views/caller";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Demo />}></Route>
        <Route path="/test" element={<Caller />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

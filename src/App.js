import './App.css';
import './Styletics.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Achievements } from "./components/Achievements";
import { Timeline } from "./components/Timeline";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Showcase } from "./components/Showcase"

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
            
            <Route path='/'
                   element={
                <>
                <NavBar />
                <Banner />
                <Achievements />
                <Timeline />
                <Showcase />
                <Contact />
                <Footer />
                </>
              
              } 
            />
            
        </Routes>
      </Router>
    </div>
  );
}

export default App;

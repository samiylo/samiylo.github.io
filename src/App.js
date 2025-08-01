import './App.css';
import './Styletics.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Timeline } from "./components/Timeline";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Showcase } from "./components/Showcase"
import FloatingShapes from './components/FloatingShapes';
import RouletteEmbed from './components/RouletteEmbed';

function App() {
  return (
    <div className='App'>
      <div className="global-background">
        <FloatingShapes 
          count={8} 
          minSize={40} 
          maxSize={120} 
          minDelay={0} 
          maxDelay={15} 
          minDuration={12} 
          maxDuration={30}
          className="global-floating-shapes"
        />
      </div>
      <Router>
        <Routes>
            
            <Route path='/'
                   element={
                <>
                <NavBar />
                <Banner />
                <Showcase />
                <Timeline />
                
                <Contact />
                <Footer />
                </>
              
              } 
            />
            
            {/* Roulette app redirect route */}
            <Route path='/roulette' element={<Navigate to="https://bled-roulette.netlify.app" replace />} />
            
            {/* Roulette app embedded route (alternative approach) */}
            <Route path='/bled-roulette' element={<RouletteEmbed />} />
            
        </Routes>
      </Router>
    </div>
  );
}

export default App;

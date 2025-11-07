import './App.css';
import './Styletics.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Timeline } from "./components/Timeline";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import FloatingShapes from './components/FloatingShapes';
import GeometricBloom from './components/GeometricShape';
import RouletteEmbed from './components/RouletteEmbed';
import Spa1Analysis from './components/hft/Spa1Analysis';
import { AgentDashboard } from './components/AgentDashboard';

function App() {
  return (
    <div className='App'>
      <GeometricBloom />
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
            
            {/* HFT Analysis Interactive route */}
            <Route path='/spa1' element={<Spa1Analysis />} />
            
            {/* Agent Dashboard route */}
            <Route path='/agents' element={<AgentDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

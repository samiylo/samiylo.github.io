import './App.css';
import './Styletics.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Timeline } from "./components/Timeline";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Showcase } from "./components/Showcase"
import FloatingShapes from './components/FloatingShapes';

function App() {
  return (
    <div className='App'>
      <div className="global-background">
        <FloatingShapes 
          count={5} 
          minSize={30} 
          maxSize={80} 
          minDelay={0} 
          maxDelay={10} 
          minDuration={8} 
          maxDuration={20}
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
            
        </Routes>
      </Router>
    </div>
  );
}

export default App;

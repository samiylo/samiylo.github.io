import './App.css';
import './Styletics.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import GetJwtToken from './components/session/GetLogin';
import LGLJClient from './components/external/lglj/LGLJClient'
import { ProjectCard } from './components/ProjectCard';
import { Lglj } from './components/external/lglj/Lglj';

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
                <Projects />
                <Skills />
                <Contact />
                <Footer />
                </>
              
              } 
            />
            <Route path='/login' element={<GetJwtToken />} />
            <Route path='/lglj' element={<>
            {/* <NavBar></NavBar> */}
            <Lglj />
             </>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

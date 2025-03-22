import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import colorSharp from "../../../assets/img/project-img1.png"
import { Color } from 'three';
import lilyLogoYellow from "../../../assets/img/lglj-logo-bread.jpg"

export const Lglj = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <section className="skill" id="skills">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <h2>LGLJ Dashboard</h2>
                        
                        <h5>Derek McCallum</h5>
                        <a className='web-links' href="https://www.lg-lj.net/">lglj.net</a>
                        <p>Bakery & Accessories </p>

                        
                        
                    </div>
                    <div className="skill-bx wow zoomIn">
                         
                        <h1>Baked Bread Design</h1>
                        <p>Letters made out of baked bread</p>
                        <img src={lilyLogoYellow} /> 
                    </div>
                    <div className="skill-bx wow zoomIn">

                        <h1>Logo Design #2</h1>
                        <p>Dashboard for Dericks LGLJ Company</p>
                        
                        
                    </div>
                    <div className="skill-bx wow zoomIn">

                        <h1>Logo Design #3</h1>
                        <p>Dashboard for Dericks LGLJ Company</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

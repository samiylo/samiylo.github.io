import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import Spline from '@splinetool/react-spline';

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);

  useEffect(() => {
    const toRotate = [ "Apps Developer", "Software Engineer", "Cloud Architect" ];
    const period = 2000;

    const tick = () => {
      let i = loopNum % toRotate.length;
      let fullText = toRotate[i];
      let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

      setText(updatedText);

      if (isDeleting) {
        setDelta(prevDelta => prevDelta / 2);
      }

      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true);
        setDelta(period);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setDelta(500);
      }
    };

    let ticker = setInterval(tick, delta);

    return () => { clearInterval(ticker) };
  }, [delta, text, loopNum, isDeleting]);

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                
                <h1 className="">{`Hi! I'm Samiylo, `} <span className="txt-rotate" dataPeriod="1000" data-rotate='[ " Apps Engineer", "Web Eccommerce Architect", "UX/UI Designer" ]'><span className="wrap">{text}</span></span></h1>
                  <p>Machine Learning for Digital Experience</p>
              </div>}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                  {/* <img src={headerImg} alt="Header Img"/> */}
                  {/* <div><BufferGeometryLines></BufferGeometryLines></div> */}
                </div>}
                <Spline scene="https://prod.spline.design/kcNfbALfc98G-jW2/scene.splinecode" />
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

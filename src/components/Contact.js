import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import emailjs from '@emailjs/browser';

export const Contact = () => {
  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  }
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('Send');
  const [status, setStatus] = useState({});
  const [showNotification, setShowNotification] = useState(false);

  const onFormUpdate = (category, value) => {
      setFormDetails({
        ...formDetails,
        [category]: value
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Sending...");
    setShowNotification(false);

    try {
      const response = await emailjs.send(
        'service_abc123',
        'template_abc123',
        {
          from_name: `${formDetails.firstName} ${formDetails.lastName}`,
          from_email: formDetails.email,
          from_phone: formDetails.phone,
          message: formDetails.message,
        },
        'user_abc123'
      );

      if (response.status === 200) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setShowNotification(true);
        setFormDetails(formInitialDetails);
      } else {
        setStatus({ type: 'error', message: 'Something went wrong, please try again.' });
        setShowNotification(true);
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong, please try again.' });
      setShowNotification(true);
    }

    setButtonText("Send");
  };

  return (
    <section className="contact" id="connect">
      
      
      <Container>
        <Row className="align-items-center">
          <Col size={12} md={6}>
            <TrackVisibility>
            
                  <h2>Get In Touch</h2>
               
            </TrackVisibility>
          </Col>
          <Col size={12} md={6}>
            <TrackVisibility>
             
                  <form onSubmit={handleSubmit}>
                    <Row>
                      <Col size={12} sm={6} className="px-1">
                        <input type="text" value={formDetails.firstName} placeholder="First Name" onChange={(e) => onFormUpdate('firstName', e.target.value)} />
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input type="text" value={formDetails.lastName} placeholder="Last Name" onChange={(e) => onFormUpdate('lastName', e.target.value)}/>
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input type="email" value={formDetails.email} placeholder="Email Address" onChange={(e) => onFormUpdate('email', e.target.value)} />
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input type="tel" value={formDetails.phone} placeholder="Phone No." onChange={(e) => onFormUpdate('phone', e.target.value)}/>
                      </Col>
                      <Col size={12} className="px-1">
                        <textarea rows="6" value={formDetails.message} placeholder="Message" onChange={(e) => onFormUpdate('message', e.target.value)}></textarea>
                        <button type="submit"><span>{buttonText}</span></button>
                      </Col>
                      {showNotification && (
                        <Col>
                          <p className={status.type === 'success' ? 'success' : 'danger'}>{status.message}</p>
                        </Col>
                      )}
                    </Row>
                  </form>
            
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
};

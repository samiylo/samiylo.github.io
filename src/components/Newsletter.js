import { useState, useEffect } from "react";
import { Col, Row, Alert } from "react-bootstrap";

export const Newsletter = ({ status, message, onValidated }) => {
  const [email, setEmail] = useState('');
  const [buttonText, setButtonText] = useState('Submit');

  useEffect(() => {
    if (status === 'success') clearFields();
  }, [status])

  const clearFields = () => {
    setEmail('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Sending...");
    const discordMessage =  {
      content: email
    }
    
    try {
        const discordResponse = await fetch("https://discord.com/api/webhooks/1311435779662286858/VKfGYACrupZ7WfKdLAF5cWzQeirz470DHdbt3Z-9aY86dxHBQE58fMT6aiEjXwzRB58G", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discordMessage),
        });

        if (!discordResponse.ok) {
            throw new Error("Failed to send message to Discord");
        } else {
          // setStatus({ success: true });
          setButtonText("Submitted")
        }

    } catch (error) {
        console.error("Error:", error);
        // setStatus({ success: true, message: "Failed to send the message." });
    }

  
};

  return (
      <Col lg={12}>
        <div className="newsletter-bx wow slideInUp">
          <Row>
            <Col lg={12} md={6} xl={5}>
              <h3>Subscribe to our Newsletter<br></br> & Never miss latest updates</h3>
              {status === 'sending' && <Alert>Sending...</Alert>}
              {status === 'error' && <Alert variant="danger">{message}</Alert>}
              {status === 'success' && <Alert variant="success">{message}</Alert>}
            </Col>
            <Col md={6} xl={7}>
              <form onSubmit={handleSubmit}>
                <div className="new-email-bx">
                  <input value={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                  <button id="send" type="submit">{buttonText}</button>
                </div>
                
              </form>
            </Col>
          </Row>
        </div>
      </Col>
  )
}

const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/contact", async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  const msg = {
    to: "flanks.dunks.0b@icloud.com",
    from: "skryshu@gmail.com",
    subject: "Contact Form Submission",
    html: `
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

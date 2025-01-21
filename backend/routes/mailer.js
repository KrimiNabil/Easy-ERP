const express=require('express');
// import nodemailer
const nodemailer = require('nodemailer');
  
async function  mail(agent) {
  const subject = `Welcom our news member`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to [Company X]</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <table align="center" width="600" style="border-collapse: collapse; background-color: #ffffff;">
    <!-- Header Section -->
    <tr>
      <td style="padding: 20px; background-color: #4CAF50; color: #ffffff; text-align: center;">
        <h2>Welcome to [Company X]</h2>
      </td>
    </tr>

    <!-- Greeting Section -->
    <tr>
      <td style="padding: 20px; color: #333333;">
        <p>Dear ${agent.firstName},</p>
        <p>Congratulations! We are excited to inform you that you have been added as an Accounting Agent at [Company X].</p>
      </td>
    </tr>

    <!-- Account Information Section -->
    <tr>
      <td style="padding: 20px;">
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
          To get started, please use the following login credentials:
        </p>
        <ul style="color: #555555; font-size: 16px;">
          <li><strong>Email:</strong> ${agent.contactDetails.email}</li>
          <li><strong>Temporary Password:</strong> ${agent.pwd}</li>
        </ul>
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
          Please log in using the email and temporary password provided. Once logged in, we highly recommend that you change your password to something secure and memorable.
        </p>
      </td>
    </tr>

    <!-- Call-to-Action Section -->
    <tr>
      <td style="padding: 20px; text-align: center;">
        <a href="https://localhost/user/login" style="background-color: #4CAF50; color: #ffffff; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Log In Now</a>
      </td>
    </tr>

    <!-- Additional Instructions Section -->
    <tr>
      <td style="padding: 20px;">
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
          If you have any questions or need assistance, please don't hesitate to reach out to our support team at <a href="mailto:support@example.com">support@example.com</a>.
        </p>
      </td>
    </tr>

    <!-- Footer Section -->
    <tr>
      <td style="padding: 20px; background-color: #f4f4f4; text-align: center; color: #999999; font-size: 12px;">
        <p>&copy; 2024 [Company X]. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
  const from = "user-fdfbf407-f346-4691-83a7-48b006899c16@mailslurp.biz";
  const to = `${agent.contactDetails.email}`;

  let transporter = nodemailer.createTransport({
    host: 'mxslurp.click',
    port: '2525',
    secure: false,
    auth: {
      user: 'PPIPq1wuV5ySGvWnr7n67K3tIQ1mcrbQ',
      pass: 'g4M7AI1tJ4Bq0Uv4ffWshkzi5wVNSdAB',

    }
  })
  try{const info = await transporter.sendMail({ 
    subject,
     html, 
     from,
      to
     })
     console.log("Email sent successfully:", info.response);
     return info; // Return the email info
  } catch (error){
    console.error("Error sending email:", error.message);
    throw error; // Rethrow the error to propagate it
  }
 
}


module.exports = mail;
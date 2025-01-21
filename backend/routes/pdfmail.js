const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');

async function sendPdfEmail(send) {
    console.log("Incoming data for sendPdfEmail:", send);

    // Validate inputs
    if (!send || !send.customerEmail || !send.pdfUrl) {
        console.error("Invalid data: Missing customerEmail or pdfUrl.");
        throw new Error("Invalid data: Missing customerEmail or pdfUrl.");
    }

    // Correctly resolve the absolute path
    const absolutePdfPath = path.join(
        __dirname, // Current directory of this file
        '../payablePDFs/invoicePDF/PDFs',
        path.basename(send.pdfUrl) // Get only the file name
    );
    console.log("Resolved PDF path:", absolutePdfPath);

    // Configure the mail transporter
    let transporter = nodemailer.createTransport({
        host: 'mxslurp.click',
        port: 2525,
        secure: false,
        auth: {
            user: 'PPIPq1wuV5ySGvWnr7n67K3tIQ1mcrbQ',
            pass: 'g4M7AI1tJ4Bq0Uv4ffWshkzi5wVNSdAB',
        },
    });

    try {
        // Check if the file exists
        if (!fs.existsSync(absolutePdfPath)) {
            throw new Error(`File not found: ${absolutePdfPath}`);
        }

        // Read the PDF file to attach
        const pdfAttachment = fs.readFileSync(absolutePdfPath);

        // Send the email
        const info = await transporter.sendMail({
            from: "user-fdfbf407-f346-4691-83a7-48b006899c16@mailslurp.biz",
            to: send.customerEmail,
            subject: "Your Invoice",
            html: `
                <p>Dear Customer,</p>
                <p>Thank you for your business. Please find your invoice attached.</p>
                <p>Best regards,<br>Your Company</p>
            `,
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: pdfAttachment,
                    contentType: 'application/pdf',
                },
            ],
        });

        console.log("Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error;
    }
}

module.exports = sendPdfEmail;

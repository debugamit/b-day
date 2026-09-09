require('dotenv').config();
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configure your email transport
// For Gmail, you will need to generate an "App Password" in your Google Account settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your app password
    }
});

// Function to send the birthday email
async function sendBirthdayEmail() {
    try {
        console.log(`[${new Date().toISOString()}] Preparing to send birthday email...`);
        
        // Read the HTML template
        const templatePath = path.join(__dirname, 'email_template.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');
        
        // Personalize the template if needed (e.g., inject the current year)
        const currentYear = new Date().getFullYear();
        htmlContent = htmlContent.replace(/{{YEAR}}/g, currentYear);

        const mailOptions = {
            from: `"Your Love" <${process.env.EMAIL_USER}>`,
            to: process.env.HER_EMAIL, // Her email address
            subject: `🎉 Happy Birthday My Love! (${currentYear})`,
            html: htmlContent,
            // If you want to attach an image natively:
            // attachments: [
            //     {
            //         filename: 'our_photo.jpg',
            //         path: path.join(__dirname, 'our_photo.jpg'),
            //         cid: 'our_photo' // Reference this cid in the HTML template via src="cid:our_photo"
            //     }
            // ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[${new Date().toISOString()}] Email sent successfully! Message ID: ${info.messageId}`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Failed to send email:`, error);
    }
}

// Schedule the cron job
// '0 0 10 9 *' means: 
// Minute 0, Hour 0, Day of Month 10, Month 9 (September)
// Note: node-cron months are 1-12, so 9 is September!
console.log('Birthday Email Scheduler is running. Waiting for September 10th at 00:00...');
cron.schedule('0 0 10 9 *', () => {
    console.log('It is September 10th 12:00 AM! Triggering email...');
    sendBirthdayEmail();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Adjust to your local timezone!
});

// Uncomment the line below to test sending the email immediately when you run `node email_worker.js`
// sendBirthdayEmail();

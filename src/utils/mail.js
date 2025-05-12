import Mailgen from 'mailgen'
import nodemailer from "nodemailer"

export const sendMail=async(options)=>{
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
          
            name: 'Task Manager',
            link: 'https://mailgen.js/'
            
        }
    })
    const emailHtml = mailGenerator.generate(options.mailGenContent);
    const emailText = mailGenerator.generatePlaintext(options.mailGenContent);
// Generate the plaintext version of the e-mail (for clients that do not support HTML)


const transporter = nodemailer.createTransport({
    host: process.env.MAIL_TRAP_HOST,
    port: process.env.MAIL_TRAP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user:process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASSWORD,
    },
  });

  const mail={
    from: process.env.MAIL_TRAP_USER,
  to: options.email,
  subject: options.subject,
  text: emailText, // plain‑text body
  html: emailHtml, // HTML body
  }
  try {
    await transporter.sendMail(mail)
  } catch (error) {
    console.error(err)
  }
}

export const emailVerificationContentMailGenContent=(username,verificationUrl)=>{
    return {
        body:{
            name:username,
            intro: 'Welcome to our App! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with our App, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify your email',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

export const forgotPasswordMailGenContent=(username,passwordResetUrl)=>{
    return {
        body:{
            name:username,
            intro: 'We got a request to reset password.',
            action: {
                instructions: 'To change the password click the button',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'reset Password',
                    link: passwordResetUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}


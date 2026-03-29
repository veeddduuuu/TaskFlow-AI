import Mailgen from "mailgen";
import nodemailer from "nodemailer";

export const sendEmail = async(options)=>{
    try{
        const transport = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            auth: {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS
            }
        });

        const mailGenerator = new Mailgen({
            theme : "default",
            product : {
                name : "TaskFlow",
                link : process.env.FRONTEND_URL
            }
        });

        const emailTextual = mailGenerator.generatePlaintext(options.mailGenContent);
        const emailHtml = mailGenerator.generate(options.mailGenContent);
        
        const mail = {
            from: "TaskFlow <no-reply@taskflow.com>",
            to: options.email,
            subject: options.subject,
            html: emailHtml,
            text : emailTextual
        };
        await transport.sendMail(mail);
    }
    catch(error){
        console.error("Error sending email :", error, " Make sure to enter correct credentials");
        throw new Error("Failed to send email");
    }
}

export const emailVerificationMailGenContent = (username, verificationUrl) => {
    return{
        body :{
            name : username,
            intro : "Welcome to TaskFlow! We're excited to have you on board.",
            action : {
                instructions : "To get started with TaskFlow, please click the button below to verify your email address:",
                button : {
                    color : "#22BC66",
                    text : "Verify Email",
                    link : verificationUrl
                }
            },
            outro : "If you did not create an account with us, no further action is required on your part."
        }
    }
}

export const passwordResetMailGenContent = (username, resetUrl) => {
    return{
        body :{
            name : username,
            intro : "You have requested to reset your password for your TaskFlow account.",
            action : {
                instructions : "To reset your password, please click the button below:",
                button : {
                    color : "#DC4D2F",
                    text : "Reset Password",
                    link : resetUrl
                }
            },
            outro : "If you did not request a password reset, please ignore this email. Your password will remain unchanged."
        }
    }
}   



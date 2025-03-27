import { transporter } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "Dotvizion <info@dotvizion.com>",
      to: user.email,
      subject: "Dotvizion - Confirm account",
      text: "Dotvizion - Confirm account",
      html: `<p>Hello: ${user.name}, You have created your account in Differacting, everything is almost ready, you just have to confirm your account. </p>
        <p>Visit the following link: </p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm account</a>
        <p>and enter the code: <b>${user.token}</b> </p>
        <p>this token expires in 10 minutes</p>
        <img src="https://res.cloudinary.com/landingpage2/image/upload/v1739727604/5000x5000-3-removebg-preview_qvlhb9.webp" style="width:350px" style="margin-top:30px"/>        
        `,
    });
    console.log(info.messageId);
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "Dotvizion <info@dotvizion.com>",
      to: user.email,
      subject: "Dotvizion-Restore your password",
      text: "Dotvizion - restore your password",
      html: `<p>Hello: ${user.name}, you request to change your password </p>
        <p>Visit the following link: </p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Change Password</a>
        <p>and enter the code: <b>${user.token}</b> </p>
        <p>this token expires in 10 minutes</p>
        <img src="https://res.cloudinary.com/landingpage2/image/upload/v1739727604/5000x5000-3-removebg-preview_qvlhb9.webp" style="width:350px" style="margin-top:30px"/>        
        `,
    });
    console.log(info.messageId);
  };
}


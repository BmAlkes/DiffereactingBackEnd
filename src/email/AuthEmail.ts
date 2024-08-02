import { transporter } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "Differeacting <info@differeacting.com>",
      to: user.email,
      subject: "Differeacting - Confirm account",
      text: "Diffeacting - Confirm account",
      html: `<p>Hello: ${user.name}, You have created your account in Differacting, everything is almost ready, you just have to confirm your account. </p>
        <p>Visit the following link: </p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm account</a>
        <p>and enter the code: <b>${user.token}</b> </p>
        <p>this token expires in 10 minutes</p>
        <img src="https://res.cloudinary.com/landingpage2/image/upload/v1715794760/Logo_Horizontal_C_2_ducktr.png" style="width:350px" style="margin-top:30px"/>        
        `,
    });
    console.log(info.messageId);
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "Differeacting <info@differeacting.com>",
      to: user.email,
      subject: "Differeacting -Restore your password",
      text: "Diffeacting - restore your password",
      html: `<p>Hello: ${user.name}, you request to change your password </p>
        <p>Visit the following link: </p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Change Password</a>
        <p>and enter the code: <b>${user.token}</b> </p>
        <p>this token expires in 10 minutes</p>
        <img src="https://res.cloudinary.com/landingpage2/image/upload/v1715794760/Logo_Horizontal_C_2_ducktr.png" style="width:350px" style="margin-top:30px"/>        
        `,
    });
    console.log(info.messageId);
  };
}


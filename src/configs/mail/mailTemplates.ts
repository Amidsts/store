import emailConfig from ".";

const templates = {
  forgotPasswordEmail: async (to: string, userName: string, code: string) =>
    await emailConfig({
      to,
      subject: "Forgot Your Password ?",
      html: `
            <html>
                <head>
                </head>
                <body>
                    <h4>Hello ${userName},</h4> <p>We received a request to change the password to your Store account. To reset you password, please use the following One-Time Password (OTP): </p>
                    <h3 style=\"text-align: center\">${code}</h3>
                    <p style=\"text-align: center\"><strong>Note:</strong> This code expires in 30 minutes.</p>
                    <p>If you did not initiate this password reset mail, kindly ignore to keep your account safe</p>
                </body>
            </html>
        `,
    }),
};

const sendEmail = async (
  purpose: string,
  to: string,
  userName: string,
  code: string
) => {
  switch (purpose) {
    case "forgotPasswordEmail":
      await templates.forgotPasswordEmail(to, userName, code);
      break;

    default:
      break;
  }

  return;
};

export default sendEmail;

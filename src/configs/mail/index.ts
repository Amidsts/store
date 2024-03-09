import axios from "axios";
import appConfig from "..";
import qs from "qs";

const { mailgunApiKey, mailgunDomain, appEmail } = appConfig;

async function emailConfig({
  to,
  subject,
  html,
  from = appEmail,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const { data } = await axios.post(
      `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
      qs.stringify({
        from,
        to,
        subject,
        html,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: "api",
          password: mailgunApiKey,
        },
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
}

export default sendMail;

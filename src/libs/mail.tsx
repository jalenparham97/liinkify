import { env } from "@/env";
import { Resend } from "resend";
import SignInEmailTemplate from "@/emails/signin-email";
import VerifyEmailTemplate from "@/emails/verify-email-template";
import { COMPANY_NAME } from "@/utils/constants";

export const resend = new Resend(env.RESEND_API_KEY);

const emailFrom = `${COMPANY_NAME} <${env.EMAIL_FROM}>`;

export async function sendMagicLink(email: string, link: string) {
  return await resend.emails.send({
    subject: `Sign in to ${COMPANY_NAME}`,
    from: emailFrom,
    to: email,
    react: (
      <SignInEmailTemplate
        email={email}
        link={link}
        logoImageBaseUrl={`${env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL}/logo.png`}
      />
    ),
  });
}

export async function sendVerifyEmail(email: string, link: string) {
  return await resend.emails.send({
    subject: "Verify your email address",
    from: emailFrom,
    to: email,
    react: <VerifyEmailTemplate email={email} link={link} />,
  });
}

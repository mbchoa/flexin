import crypto from 'crypto';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { createTransport } from 'nodemailer';
import mjm2html from 'mjml';

import { prisma } from 'lib/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 60 * 5, // allow magic code to be valid for 5 minutes
      async generateVerificationToken() {
        return crypto.randomInt(100000, 999999).toString();
      },
      async sendVerificationRequest({
        identifier: email,
        token,
        provider: { server, from },
      }) {
        const defaultTransportOptions = {
          host: server as string,
          pool: true,
        };
        const transport = createTransport(
          process.env.NODE_ENV === 'development'
            ? defaultTransportOptions
            : {
                ...defaultTransportOptions,
                // StackOverflow suggestion: https://stackoverflow.com/questions/64470449/nodejs-nodemailer-sendgrid-smtp-username-password-to-api-key-using-existing
                auth: {
                  user: 'apikey',
                  pass: process.env.SENDGRID_API_KEY,
                },
              }
        );
        const msg = {
          to: email,
          from: from as string,
          subject: `Your flexin Account Code`,
          text: text({ token }),
          html: html({ token }),
        };
        try {
          await transport.sendMail(msg);
        } catch (e) {
          // TODO: handle error
        }
      },
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
});

// Email HTML body
function html({ token }: Record<'token', string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedToken = `${token.replace(/\./g, '&#8203;.')}`;

  const { html } = mjm2html(`
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px" color="#5e5e5e" font-family="helvetica" font-weight="700">
              <span style="font-size: 30px">💪</span> flexin
              <span style="color: #bcbaba; font-weight: 100;">Account</span>
            </mj-text>
            <mj-divider border-color="#5e5e5e" border-width="1px"></mj-divider>
            <mj-text font-size="30px" color="#373b42" font-weight="500">Use this code to login:</mj-text>
            <mj-text font-size="28px" color="#373b42" font-weight="500" padding="12px 25px">${escapedToken}</mj-text>
            <mj-text font-size="16px" color="#72757a">The code will expire in 5 minutes.</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `);
  return html;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ token }: Record<'token', string>) {
  return `Sign in using the following code: ${token}`;
}

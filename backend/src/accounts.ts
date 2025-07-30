import type { ImapFlowOptions } from "imapflow";
import dotenv from "dotenv";
dotenv.config();

const { USER_ONE, USER_TWO, USER_ONE_PASSWORD, USER_TWO_PASSWORD } =
  process.env;

export const accounts: ImapFlowOptions[] = [
  {
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: USER_ONE as string,
      pass: USER_ONE_PASSWORD as string,
    },
  },
  {
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: USER_TWO as string,
      pass: USER_TWO_PASSWORD as string,
    },
  },
];

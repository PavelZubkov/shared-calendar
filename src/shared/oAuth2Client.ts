import { google, Auth } from "googleapis";
import { credentials } from "./google-credentials";

export function getOAuth2Client(baseUrl: string): Auth.OAuth2Client {
  const { clientSecret, clientId } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${baseUrl}/auth/google/callback`
  );
  return oAuth2Client;
}

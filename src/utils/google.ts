import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/calendar']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN = {
    "access_token": "ya29.Il-yB85yoV74OjXiCzZcyvbMmfMQL5IfjNOoiw6kGAI6TbiHjReQzQQzEc11sd9jpJWzzvL2TMCK_GKJ5_5fafGbwrmKFkMiMRPw-6avdUO1fWq_RoqGQs0tkmFA_70X8A",
    "refresh_token": "1//09gZOr1llc0cBCgYIARAAGAkSNwF-L9IrKOI-WFgZVOtYKWWYB4vqQy9bFHPcvRyqjFKUK6-klhROOwKP8h5We90Vv8ttj_BaPKU",
    "scope": "https://www.googleapis.com/auth/calendar",
    "token_type": "Bearer",
    "expiry_date": 1574440553391
  }

const CREDENTIALS = {"installed":{"client_id":"529938793020-6954of89fc6pg0jt0tui1be5dcl7mmri.apps.googleusercontent.com","project_id":"quickstart-1574436156544","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"vMJlUYhSglyGsJMsiFUprqMw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}

export const authorize = (callback) => {
  const { client_secret, client_id, redirect_uris } = CREDENTIALS.installed
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
  oAuth2Client.setCredentials(TOKEN)
  callback(oAuth2Client)
}

export const getToken = () => TOKEN
export const getCredentials = () => CREDENTIALS
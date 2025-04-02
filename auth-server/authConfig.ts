/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import dotenv from 'dotenv';
dotenv.config();
import { LogLevel } from '@azure/msal-node';

/**
 * Diese Umgebungsvariablen definieren URLs und Subdomain-Kontext für MSAL.
 */
export const TENANT_SUBDOMAIN: string = process.env.TENANT_SUBDOMAIN || 'studyconnectpm4';
export const REDIRECT_URI: string = process.env.REDIRECT_URI || 'http://localhost:3001/auth/redirect';
export const POST_LOGOUT_REDIRECT_URI: string = process.env.POST_LOGOUT_REDIRECT_URI || 'http://localhost:3001';

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID || 'bb752368-77a2-4910-9a43-57bc139919b6', // Application (client) ID
    authority: process.env.AUTHORITY || `https://${TENANT_SUBDOMAIN}.ciamlogin.com/`, // Authority URL
    clientSecret: process.env.CLIENT_SECRET || ' ', // Generated client secret
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel: LogLevel, message: string): void {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
    },
  },
};
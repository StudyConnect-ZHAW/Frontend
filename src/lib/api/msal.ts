// This file contains the configuration for MSAL (Microsoft Authentication Library)
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.CLIENT_ID!,
    authority: `https://${process.env.TENANT_SUBDOMAIN}.ciamlogin.com/${process.env.TENANT_SUBDOMAIN}.onmicrosoft.com`,
    clientSecret: process.env.CLIENT_SECRET!,
  },
};

export const msalInstance = new ConfidentialClientApplication(msalConfig);
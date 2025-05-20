# Zotero Integration Setup
*Created: 2025-05-20*
*Last Updated: 2025-05-20*

## Overview
This document outlines the setup process and implementation details for integrating Zotero with arxivite. The integration allows users to export papers directly to their Zotero libraries.

## Prerequisites
- Zotero account
- arxivite development environment
- Access to Zotero API

## Setup Process

### 1. Application Registration
- **Date Registered**: 2025-05-19 23:45:02
- **Application Name**: arxivite
- **Website**: arxivite.vercel.app
- **Application Type**: Website
- **Callback URL**: 
  - Development: `http://localhost:5173/api/auth/zotero/callback`
  - Production: `https://arxivite.vercel.app/api/auth/zotero/callback` (to be added)

### 2. API Credentials
```plaintext
Client Key: <ZOTERO_CLIENT_KEY>
Client Secret: <ZOTERO_CLIENT_SECRET>
```

### 3. OAuth Flow Endpoints
#### Development
- **Authorization URL**: `https://www.zotero.org/oauth/authorize`
- **Access Token URL**: `https://www.zotero.org/oauth/access`
- **Callback URL**: `http://localhost:5173/api/auth/zotero/callback`

#### Production
- **Authorization URL**: `https://www.zotero.org/oauth/authorize`
- **Access Token URL**: `https://www.zotero.org/oauth/access`
- **Callback URL**: `https://arxivite.vercel.app/api/auth/zotero/callback` (to be added)

## Implementation Steps

### 1. Environment Setup
Add the following variables to `.env`:
```plaintext
ZOTERO_CLIENT_ID=<ZOTERO_CLIENT_KEY>
ZOTERO_CLIENT_SECRET=<ZOTERO_CLIENT_SECRET>
ZOTERO_REDIRECT_URI=http://localhost:5173/api/auth/zotero/callback
```

### 2. Required API Routes
Create the following API routes:
1. `/api/auth/zotero/login` - Initiates OAuth flow
2. `/api/auth/zotero/callback` - Handles OAuth callback
3. `/api/zotero/export` - Handles paper export to Zotero

### 3. Data Models
```typescript
interface ZoteroAuthState {
  accessToken: string;
  userID: string;
  username: string;
  expiresAt: number;
}

interface ZoteroExportPayload {
  title: string;
  abstractNote: string;
  url: string;
  DOI?: string;
  creators: Array<{
    firstName: string;
    lastName: string;
    creatorType: 'author'
  }>;
  itemType: 'journalArticle';
  publicationTitle: 'arXiv';
  archive: 'arXiv';
  archiveLocation: string; // arXiv ID
  date: string; // Submission date
  extra?: string; // Additional metadata
}
```

### 4. Security Considerations
- Store tokens securely in HTTP-only cookies
- Implement CSRF protection
- Use state parameter in OAuth flow
- Validate all API inputs
- Rate limit API endpoints
- Implement token refresh mechanism

### 5. Error Handling
- Handle OAuth errors gracefully
- Provide clear error messages to users
- Log errors for debugging
- Implement retry mechanism for failed exports

## Testing Checklist
- [ ] OAuth flow works in development
- [ ] OAuth flow works in production
- [ ] Paper export succeeds
- [ ] Error handling works as expected
- [ ] Rate limiting is effective
- [ ] Token refresh works correctly
- [ ] Security measures are in place

## References
- [Zotero Web API Documentation](https://www.zotero.org/support/dev/web_api/v3/)
- [Zotero OAuth Documentation](https://www.zotero.org/support/dev/web_api/v3/oauth)
- [arXiv Metadata Schema](https://arxiv.org/help/api/user-manual#_metadata_field_descriptions)

## Future Improvements
- Implement batch export
- Add export progress indicator
- Support custom collections
- Add export history
- Implement offline queue for failed exports
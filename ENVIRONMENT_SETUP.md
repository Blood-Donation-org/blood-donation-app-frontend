# Environment Variables Configuration Guide

## Frontend Environment Variables Setup

The frontend now uses environment variables to manage the backend API URL configuration. This makes it easy to switch between development, staging, and production environments.

## Environment Files

### .env (for development)
```bash
# Backend API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# Builder.io Configuration (if using)
VITE_PUBLIC_BUILDER_KEY=a6387f2edffc4ad1908903ea31def4c5
```

### .env.example (template)
This file serves as a template and should be committed to version control. Developers can copy this to create their own `.env` file.

## API Configuration

### Centralized API Management

The `src/config/api.js` file provides:

1. **Environment-based URL configuration**: Automatically uses `VITE_API_URL` from environment variables
2. **Centralized endpoint definitions**: All API endpoints are defined in one place
3. **Fallback configuration**: Defaults to `http://localhost:5000/api/v1` if no environment variable is set

### Available API Endpoints

```javascript
import { API_ENDPOINTS } from '../config/api';

// User endpoints
API_ENDPOINTS.USER.LOGIN
API_ENDPOINTS.USER.REGISTER
API_ENDPOINTS.USER.FORGOT_PASSWORD
API_ENDPOINTS.USER.RESET_PASSWORD
API_ENDPOINTS.USER.CHANGE_PASSWORD(id)
API_ENDPOINTS.USER.UPDATE(id)
API_ENDPOINTS.USER.GET_ALL
API_ENDPOINTS.USER.GET_BY_ID(id)
API_ENDPOINTS.USER.GET_BY_ROLE(role)

// Blood Inventory endpoints
API_ENDPOINTS.BLOOD_INVENTORY.GET_ALL
API_ENDPOINTS.BLOOD_INVENTORY.CREATE
API_ENDPOINTS.BLOOD_INVENTORY.UPDATE(id)
API_ENDPOINTS.BLOOD_INVENTORY.DELETE(id)

// And many more...
```

## Usage in Components

### Before (hardcoded URLs):
```javascript
const response = await axios.post(
  "http://localhost:5000/api/v1/users/login",
  formData
);
```

### After (using environment variables):
```javascript
import { API_ENDPOINTS } from '../config/api';

const response = await axios.post(
  API_ENDPOINTS.USER.LOGIN,
  formData
);
```

## Updated Files

### Pages updated to use centralized API configuration:
- `src/pages/SignInPage.jsx`
- `src/pages/ForgotPasswordPage.jsx`
- `src/pages/ResetPasswordPage.jsx`

### New files created:
- `src/config/api.js` - Centralized API configuration
- `.env.example` - Environment variable template

### Modified files:
- `.env` - Added VITE_API_URL configuration

## Environment Configuration for Different Stages

### Development
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

### Staging
```bash
VITE_API_URL=https://staging-api.yourapp.com/api/v1
```

### Production
```bash
VITE_API_URL=https://api.yourapp.com/api/v1
```

## Benefits

1. **Easy deployment**: Change API URL by updating environment variables only
2. **No hardcoded URLs**: All API endpoints are centralized and configurable
3. **Development flexibility**: Different developers can use different backend URLs
4. **Production readiness**: Easy to deploy to different environments
5. **Maintainability**: Single place to update API endpoints

## How to Use

### For new developers:
1. Copy `.env.example` to `.env`
2. Update `VITE_API_URL` to match your backend server
3. Start development server: `npm run dev`

### For existing components:
```javascript
// 1. Import the API configuration
import { API_ENDPOINTS } from '../config/api';

// 2. Use predefined endpoints instead of hardcoded URLs
const response = await axios.post(API_ENDPOINTS.USER.LOGIN, data);

// 3. For custom endpoints, use the base URL
import { API_BASE } from '../config/api';
const customEndpoint = `${API_BASE}/custom-endpoint`;
```

## Important Notes

1. **Environment variable prefix**: Use `VITE_` prefix for all frontend environment variables in Vite
2. **Restart required**: Restart the development server after changing environment variables
3. **Security**: Never commit sensitive data like API keys to version control
4. **Fallback**: The configuration includes fallback to localhost for development convenience

## Testing

To verify the configuration is working:

1. Check browser console for any API errors
2. Verify network requests in DevTools show correct API URLs
3. Test forgot password functionality to ensure emails are sent correctly

## Future Enhancements

Consider adding these environment variables as needed:

```bash
# Additional configurations
VITE_TIMEOUT=10000
VITE_RETRY_ATTEMPTS=3
VITE_API_VERSION=v1
VITE_DEBUG_MODE=false
```

This centralized configuration makes your application more maintainable and deployment-friendly!
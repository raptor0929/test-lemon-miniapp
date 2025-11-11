# Lemon Cash Mini App

A simple Mini App integrated with Lemon Cash that authenticates users, triggers deposits, and demonstrates the core SDK functionality.

## Quickstart

This project was created following the [Lemon Cash Mini App SDK Quickstart Guide](https://lemoncash.mintlify.app/quickstart/quickstart).

## Features

- ✅ User authentication using Sign In With Ethereum (SIWE)
- ✅ WebView environment detection
- ✅ Deposit functionality
- ✅ Modern React + TypeScript setup
- ✅ Vite for fast development

## Installation

```bash
npm install
```

**Note**: If you encounter issues with the package name, the documentation shows both `@lemoncash/mini-app-sdk` (for installation) and `@lemonatio/mini-app-sdk` (for imports). This project uses `@lemonatio/mini-app-sdk` as shown in all code examples. If needed, you can adjust the package name in `package.json`.

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Testing in Lemon Cash

To test this mini app in the Lemon Cash mobile app:

1. **Get a Mini App ID**: You need to request your Mini App ID from the Lemon Cash team until the developer dashboard is ready.

2. **Deploy your app**: Deploy the built app to a public URL (e.g., Vercel, Netlify, or any static hosting).

3. **Open in Lemon Cash**: Use the deeplink format:
   ```
   lemoncash://app/mini-apps/webview/:mini-app-id
   ```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── MiniApp.tsx      # Main mini app component
│   │   └── MiniApp.css      # Component styles
│   ├── App.tsx              # Root app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

## SDK Functions Used

- `authenticate()` - Authenticates the user and returns wallet address
- `deposit()` - Initiates deposits from Lemon Cash wallet to Mini App wallet
- `isWebView()` - Detects if running in React Native WebView environment

## Important Notes

- **Testnet**: Deposits are blocked if your Mini App is connected to a testnet. Use faucets to get testnet tokens instead.
- **WebView Required**: All SDK functions require the app to run inside the Lemon Cash mobile app's WebView.
- **Authentication**: The authenticate function uses Sign In With Ethereum (SIWE) for secure wallet authentication.

## Documentation

For complete documentation, visit: https://lemoncash.mintlify.app/

## License

MIT


# Welcome to your Expo app 👋

## Get started

1. Install dependencies

   npm i expo-auth-session expo-secure-store axios zustand @tanstack/react-query expo-web-browser expo-dev-client expo-crypto expo-constants @react-native-async-storage/async-storage

   ```expo-auth-session: For Google OAuth flow.
      expo-web-browser: Used by expo-auth-session to open the browser for OAuth.
      expo-crypto: Required by expo-auth-session for PKCE support.

      expo-secure-store: To securely save the accessToken and user data.
      @tanstack/react-query: For managing server state (login/register mutations, user session).
      axios: For making HTTP requests to your backend.
      expo-dev-client: Needed to create development builds for testing OAuth locally (Expo Go limitations).
      expo-constants: To access manifest constants like expo-auth-session proxy settings.
      @react-native-async-storage/async-storage: Needed for the React Query persister.
   ```

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

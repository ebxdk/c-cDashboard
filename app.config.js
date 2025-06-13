export default {
  expo: {
    name: "expo-on-replit",
    slug: "expo-on-replit",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    statusBarHidden: true,
    extra: {
      googleApiKey: process.env.GOOGLE_API_KEY,
      googleCalendarId: process.env.GOOGLE_CALENDAR_ID,
    },
    ios: {
      supportsTablet: true,
      statusBarHidden: true,
      statusBarStyle: "default",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      statusBar: {
        hidden: true,
        translucent: false,
      },
      usesCleartextTraffic: true,
      networkSecurityConfig: {
        "domain-config": [
          {
            domain: "minara-3-ebadkhan5487.replit.app",
            cleartextTrafficPermitted: true,
          },
        ],
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
}; 
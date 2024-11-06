import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Moov',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: "#E8E5DE",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: false,
      splashImmersive: false
    },

    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    
    CapacitorPdfGenerator: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    },
    FileSystem: {
      requestPermissions: true
    }
  }
  
};

export default config;

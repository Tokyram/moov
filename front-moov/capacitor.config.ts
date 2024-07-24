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
    }
  }
};

export default config;

# Android Development Environment Setup Guide

## Current Status
- ✅ ADB is available
- ❌ Android SDK/Emulator not found
- ❌ No devices connected

## Quick Setup Options

### Option 1: Install Android Studio (Recommended)
1. Download Android Studio from: https://developer.android.com/studio
2. Install Android Studio
3. Open Android Studio and follow the setup wizard
4. Install Android SDK and create an AVD (Android Virtual Device)
5. Add Android SDK to PATH:
   ```bash
   echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
   echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
   echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
   source ~/.zshrc
   ```

### Option 2: Use Physical Device
1. Enable Developer Options on your Android device:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Go to Settings > Developer Options
   - Enable "USB Debugging"
3. Connect device via USB
4. Run: `adb devices` to verify connection

### Option 3: Command Line Tools Only
```bash
# Install Android SDK command line tools
brew install --cask android-commandlinetools

# Accept licenses
sdkmanager --licenses

# Install required packages
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0" "emulator" "system-images;android-33;google_apis;x86_64"

# Create AVD
avdmanager create avd -n "Pixel_API_33" -k "system-images;android-33;google_apis;x86_64"
```

## Alternative Testing Methods

### 1. Chrome DevTools Mobile Simulation
```bash
# Start the dev server
npm run dev

# Open Chrome and navigate to: http://localhost:8080
# Press F12 > Toggle Device Toolbar
# Select various mobile devices for testing
```

### 2. Browser-based Testing
- Use responsive design mode in browsers
- Test on actual mobile browsers
- Use online device simulators

### 3. Capacitor Live Reload with Device
Once you have a device connected:
```bash
# Check connected devices
adb devices

# Run with live reload
npx cap run android --live-reload
```

## Troubleshooting

### If emulator command not found:
```bash
# Add to PATH
export PATH=$PATH:$HOME/Library/Android/sdk/emulator
```

### If no devices found:
1. Check USB debugging is enabled
2. Verify device is connected: `adb devices`
3. Start emulator manually: `emulator -avd Pixel_API_33`

### Common Issues:
- **Permission denied**: Run `adb kill-server && adb start-server`
- **Device unauthorized**: Accept debugging prompt on device
- **Emulator won't start**: Check virtualization is enabled in BIOS

## Next Steps
1. Choose one of the setup options above
2. Verify setup with `adb devices` or `emulator -list-avds`
3. Run `npx cap run android --live-reload` again

## Quick Test Commands
```bash
# Check Android setup
adb devices
emulator -list-avds

# Start emulator (if available)
emulator -avd <avd_name>

# Run Capacitor with live reload
npx cap run android --live-reload
```
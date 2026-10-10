# Destiny 💗 — Shared App starter

This package now includes a responsive web app prototype, Firebase Authentication hooks, shared chat message sending, cloud mood entry saving, a media upload helper, private Firestore/Storage rule templates, and Capacitor Android wrapper configuration.

## What is implemented in source
- Daily mood selector and local mood diary; when Firebase is configured and the user is authenticated/allowlisted, mood entries are also saved to Firestore.
- Shared Account panel with email/password registration and sign-in.
- Chat UI sends a message to Firestore when the Firebase config and allowlist are ready; until then it remains a local demo.
- `window.DestinyCloud.uploadMemory(file, kind)` uploads a selected media file to Firebase Storage and returns a URL/path. Connect this helper to the photo/voice upload UI before production use.
- Capacitor config for an Android project.

## Required before shared cloud works
1. Create a Firebase project under your account. Enable Email/Password Authentication, Firestore, and Storage.
2. Copy the web app config into `web/firebase-config.js`.
3. Register the two accounts from the Shared Account panel, then copy each account's UID from Firebase Authentication into both `allowedMemberUids` in `web/firebase-config.js` and the UID lists in both `firebase/firestore.rules` and `firebase/storage.rules`.
4. Publish Firestore and Storage rules. Do not use public/open rules. Test with a third account that it cannot read data.
5. Serve/deploy `web` on HTTPS (Firebase Hosting is one option). ES module imports from Firebase CDN generally require a web server; opening the HTML directly as `file://` may not work for cloud features.
6. Before production, wire photo and recorded voice blobs to `DestinyCloud.uploadMemory`, save metadata to `sharedMemories`, and render the resulting cloud URLs. This prototype does not automatically sync selected photos or voice recordings yet.

## Build Android APK
Prerequisites: Node.js/npm, Android Studio, Android SDK/platform tools, and a JDK version supported by your installed Android Gradle Plugin.

```sh
npm install
npm run android:add       # only once
npm run android:sync
npm run android:open      # open in Android Studio, wait for Gradle sync
```
Then use Android Studio **Build > Build Bundle(s) / APK(s) > Build APK(s)**. For release sharing, create a signed release build and test it on both phones. This source package is not itself a compiled/signed APK.

## Privacy
This app is intended for two named users only. Do not publish until both UID allowlists and rules are configured and tested. Do not store passwords in app code or share them in chat. Firebase client config is not a password; authorization must be enforced by security rules.

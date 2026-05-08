# Mobile Issue Tracker (React Native + TypeScript)

A React Native assignment app that supports:
- mock authentication
- issue CRUD flows
- issue detail actions (resolve/close)
- search + status/priority filters
- dashboard summary counts
- local persistence with AsyncStorage
- refresh from mock API
- offline-friendly pending action queue + manual sync retry
- export issues as JSON/CSV using native share flow
- basic dark mode support through React Navigation theme

## Tech Stack
- React Native (Expo)
- TypeScript
- React Navigation (native stack)
- Zustand (state management)
- AsyncStorage (local persistence)
- Axios + mock API service
- Jest + React Native Testing Library

## Folder Structure

```text
src/
  components/
  navigation/
  screens/
  services/
  store/
  types/
  utils/
  __tests__/
```

## Setup

1. Install dependencies
2. Start the app
3. Run tests

```bash
npm install
npm run start
npm run test
```

### Run Targets

```bash
npm run ios
npm run android
npm run web
```

## Assumptions
- Login is mocked and accepts any valid email + password with at least 6 characters.
- Initial issue data comes from a local mock service plus one Axios request to a public placeholder endpoint to simulate networking.
- Local issue updates are optimistic and immediately reflected in UI.
- Pending queue retry is manual (`Sync Queue` button) and also attempted once on app launch.

## Feature Checklist
- [x] Authentication screen with validation and mock login
- [x] Issue list with title/status/priority/created date
- [x] Dashboard summary for Open / In Progress / Resolved
- [x] Create and edit issue forms
- [x] Issue detail with full data and action buttons
- [x] Resolve/close confirmation actions
- [x] Search + filter (title, status, priority)
- [x] Loading, empty, and error states
- [x] Pull-to-refresh and manual refresh
- [x] AsyncStorage persistence across restarts
- [x] Navigation flow across auth/list/detail/form
- [x] Offline queue with retry handling
- [x] Reusable components + clean structure
- [x] Basic tests (validation + core flow + one screen action)
- [x] Theme support (light/dark aware navigation)
- [x] Export to JSON/CSV share output

## Completion Note
Finished:
- End-to-end app structure and all core requirements
- Offline queue (create/update/resolve/close)
- Local persistence and mock API refresh
- Export functionality and baseline tests

Skipped / Not included:
- Real backend integration
- File/image attachments for issues
- CI pipeline config and production build automation

## Submission Artifacts
Add these before final submission:
1. Source repository URL
2. Emulator video or screen recording
3. APK/TestFlight build artifact (if required by reviewer)

### Android Preview Build (APK install page)
- [EAS Build Link](https://expo.dev/accounts/dasun001s-organization/projects/mobile-issue-tracker/builds/8848b69d-a6ea-4a76-8462-c24cc791ca56)

### APK Install QR
Scan this QR code to open the Android build install page:

<img src="./assets/apk-qr.png" alt="APK Install QR" width="220" />

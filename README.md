# WebRTC Softphone Application

This project provides a WebRTC-based softphone interface. Users can start and end calls, mute/unmute the microphone, and manage call states. The project is built with React, TypeScript, and Vite.

## Features

- **Start Call**
- **End Call**
- **Mute/Unmute Microphone**
- **Call State Management (Idle, Calling, In Call, etc.)**
- **All call logic managed via a `useCall` custom hook**
- **Modern, user-friendly UI**

## Setup Instructions

1. **Clone the repository:**

   ```sh
   git clone <repo-url>
   cd webrtc_task
   ```

2. **Install dependencies:**

   ```sh
   yarn install
   ```

   or

   ```sh
   npm install
   ```

3. **Start the development server:**

   ```sh
   yarn dev
   ```

   or

   ```sh
   npm run dev
   ```

4. **Open the app:**
   - Go to `http://localhost:5173` in your browser.

## Usage

- **To start a call:** Click the "Start Call" button.
- **To end a call:** Click the "End Call" button.
- **To mute/unmute:** Use the "Mute" or "Unmute" button.

All call functionalities are managed via the `useCall` custom hook located in `src/hooks/useCall.ts`.
UI components are located in the `src/components/` directory.

## Project Structure

```
webrtc_task/
├── src/
│   ├── components/
│   │   ├── SoftPhone.tsx
│   │   └── ui/
│   │       └── sonner.tsx
│   ├── hooks/
│   │   └── useCall.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── README.md
```

## Notes

- The project centralizes all call logic in a custom hook for maintainability and scalability.
- UI and logic are modular and easily customizable.
- If you encounter errors during development, ensure you open the project from the root directory and that alias settings (`@/`) are correct.

## Contributing

To contribute, fork the repository, create a new branch, and submit a pull request.

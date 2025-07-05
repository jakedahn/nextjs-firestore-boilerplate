# Next.js + Firestore Boilerplate

A modern, production-ready boilerplate for building full-stack applications with Next.js 15, Firebase/Firestore, and TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- Firebase CLI: `npm install -g firebase-tools`
- A Google account for Firebase

## Features

- 🚀 **Next.js 15** with App Router
- ⚛️ **React 19** with Server Components
- 🔥 **Firebase Integration**
  - Authentication (Email/Password, Google OAuth)
  - Firestore Database
  - Cloud Storage ready
- 🎨 **Tailwind CSS v4** (alpha) + **shadcn/ui**
- 📝 **TypeScript** with strict mode
- 🔐 **Authentication** with protected routes
- 📱 **Responsive Design** with modern UI components
- 🔄 **Real-time Updates** with Firestore listeners
- 🎯 **Type-safe** database operations

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nextjs-firestore-boilerplate.git
cd nextjs-firestore-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Firebase project:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google providers)
   - Get your configuration values from Project Settings

4. Create a `.env.local` file based on `.env.example`:
```env
# Client-side configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# For production server-side operations (optional in development)
FIREBASE_SERVICE_ACCOUNT_BASE64=base64_encoded_service_account_json
```

5. Initialize Firebase and create Firestore database:
```bash
firebase login
firebase init firestore
firebase firestore:databases:create "(default)" --location nam5
firebase deploy --only firestore:rules
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Firebase Setup Guide

This section provides detailed steps to connect your Firebase instance to this boilerplate.

### Step 1: Authenticate with Firebase CLI

```bash
firebase login
```

### Step 2: Initialize Firebase in Your Project

1. Navigate to your project directory and initialize Firebase:
```bash
firebase init
```

2. When prompted, select your existing Firebase project or create a new one

3. Select **Firestore** when asked which Firebase features to set up

4. Accept the default file names for Firestore rules and indexes

### Step 3: Create Firestore Database

If your Firestore database doesn't exist yet, create it:

```bash
firebase firestore:databases:create "(default)" --location nam5
```

**Note:** Choose an appropriate location for your database. Common options:
- `nam5` (United States)
- `eur3` (Europe)
- `asia-southeast1` (Asia)

### Step 4: Deploy Firestore Security Rules

The boilerplate includes basic security rules. Deploy them:

```bash
firebase deploy --only firestore:rules
```

The default rules allow:
- Authenticated users to read/write their own data
- Public read access to certain collections (customize as needed)

### Step 5: Enable Authentication Methods

In the [Firebase Console](https://console.firebase.google.com):

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Enable **Google** authentication (optional)
4. Configure authorized domains if needed

### Step 6: Create Collections (Optional)

The app will create collections automatically, but you can create them manually:

1. Go to **Firestore Database** in Firebase Console
2. Create the following collections:
   - `users` - User profiles
   - `todos` - Todo items (example)
   - `counters` - For the counter demo

### Step 7: Test Your Setup

1. Visit `/counter` to test real-time Firestore functionality
2. Try creating an account at `/auth/register`
3. Check the Firebase Console to see data being created

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and configurations
│   └── firebase/         # Firebase setup and helpers
└── middleware.ts          # Route protection
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Key Features Explained

### Authentication
- Email/password authentication with email verification
- Google OAuth integration
- Protected routes with middleware
- User profiles stored in Firestore

### Database (Firestore)
- Type-safe database operations with TypeScript
- Real-time data synchronization
- Offline persistence support
- Optimized query patterns

### UI Components
- 40+ pre-built shadcn/ui components
- Dark mode support
- Responsive design
- Tailwind CSS v4 with modern features

### Example Implementations

#### Todo Application
A fully functional Todo app demonstrating:
- CRUD operations with Firestore
- Real-time updates
- User authentication
- Type-safe data handling

#### Counter Demo (`/counter`)
A simple real-time counter showcasing:
- Anonymous user support
- Real-time synchronization across devices
- Firestore document operations
- Optimistic UI updates

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables
Make sure to add all required environment variables in your deployment platform:

1. **Client-side variables** (all `NEXT_PUBLIC_FIREBASE_*`)
2. **Service Account** for server-side operations:
   ```bash
   # Mac: Copy to clipboard
   base64 -i service-account.json | pbcopy
   
   # Linux: Output to console
   base64 -w 0 service-account.json
   
   # Windows: Save to file
   certutil -encode service-account.json encoded.txt
   ```
   Then set `FIREBASE_SERVICE_ACCOUNT_BASE64` with the encoded value

## Firebase Security Rules

Example Firestore security rules for the todos collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Todos are private to each user
    match /todos/{todoId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Firestore 400 Bad Request Error
**Error:** `GET https://firestore.googleapis.com/.../Listen/channel 400 (Bad Request)`

**Solution:** Your Firestore database doesn't exist. Create it using:
```bash
firebase firestore:databases:create "(default)" --location nam5
```

#### 2. Permission Denied Errors
**Error:** `Missing or insufficient permissions`

**Solution:** 
- Ensure you're authenticated: Check `useAuth()` hook
- Deploy your security rules: `firebase deploy --only firestore:rules`
- Verify rules in `firestore.rules` file

#### 3. Firebase Project Not Found
**Error:** `FirebaseError: Project 'your-project-id' not found`

**Solution:**
1. Verify project ID in `.env.local` matches your Firebase project
2. Run `firebase use your-project-id` to set the active project
3. Ensure you're logged in: `firebase login`

#### 4. Connection Errors in Development
**Issue:** WebChannel connection errors during development

**Solution:** 
- Check if all environment variables are set correctly
- Ensure Firestore database is created
- Try using Firebase Emulators for local development:
  ```bash
  firebase emulators:start
  ```
  Then set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in `.env.local`

#### 5. Counter Demo Not Working
**Issue:** Counter at `/counter` shows errors or doesn't update

**Solution:**
- Ensure Firestore database exists
- Check browser console for specific errors
- Verify security rules allow anonymous counter access
- Clear browser cache and cookies

### Using Firebase Emulators (Alternative)

For local development without connecting to production Firebase:

1. Install and start emulators:
```bash
firebase emulators:start
```

2. Add to `.env.local`:
```env
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

3. Access emulator UI at `http://localhost:4000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
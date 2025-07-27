# Crowd Control AI

This is a Next.js application built with Firebase Studio, designed to be an AI-powered command center for event and crowd management. It leverages Genkit and Google's AI models to provide real-time insights and operational tools.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
3.  **Run the Genkit AI flows**:
    In a separate terminal, start the Genkit development server.
    ```bash
    npm run genkit:dev
    ```
Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Features Implemented

This section details the features that have been built and how they work behind the scenes.

### 1. Core UI & Layout

The application is built using Next.js and React. The UI components are from **ShadCN/UI**, providing a consistent and modern look.

-   **Responsive Sidebar**: The main navigation is a collapsible sidebar that works on both desktop and mobile. On desktop, it can be collapsed to an icon-only view. On mobile, it acts as an off-canvas menu.
    -   **Code**: `src/components/ui/sidebar.tsx`, `src/app/page.tsx`
    -   **How it works**: A React Context (`SidebarProvider`) manages the open/closed state of the sidebar. The main content area (`SidebarInset`) uses CSS variables and data attributes (`data-state`) to adjust its margin, preventing any overlap.

-   **Dark/Light Mode**: The application supports theme switching.
    -   **Code**: `src/components/dashboard/header.tsx`, `src/components/theme-provider.tsx`, `src/app/globals.css`
    -   **How it works**: It uses the `next-themes` package. The `Header` component contains a button that calls the `setTheme` function to toggle between 'light' and 'dark'. The color scheme is defined using CSS variables in `globals.css` for both `:root` (light) and `.dark` selectors.

### 2. Real-Time Crowd Flow & Density Analysis

This feature uses a live video feed from the user's camera to analyze crowd conditions.

-   **Component**: `src/components/dashboard/crowd-map.tsx`
-   **AI Flow**: `src/ai/flows/analyze-crowd-flow.ts`
-   **How it works**:
    1.  The `CrowdMap` component requests camera permission using `navigator.mediaDevices.getUserMedia`.
    2.  The live video is displayed in a `<video>` element.
    3.  When the "Analyze Crowd" button is clicked, a frame is captured from the video and drawn onto a hidden `<canvas>`, then converted to a Base64-encoded JPEG data URI.
    4.  This data URI is sent to the `analyzeCrowdFlow` Genkit flow.
    5.  The AI model (Gemini) analyzes the image and returns a structured JSON object describing the crowd's `density`, `flow`, and potential `bottlenecks`.
    6.  The result is displayed on the dashboard, and a new entry is added to the Analysis Log.

### 3. Role-Based Staff Heatmaps

This extends the Venue Map feature to identify staff members by T-shirt color.

-   **Component**: `src/components/dashboard/crowd-map.tsx`
-   **AI Flow**: `src/ai/flows/identify-staff-roles.ts`
-   **How it works**:
    1.  When the "Staff Heatmap" tab is active, the user can click "Identify Staff".
    2.  A frame is captured from the video feed, just like in the crowd analysis.
    3.  The image data is sent to the `identifyStaffRoles` Genkit flow.
    4.  The prompt instructs the AI to act as a computer vision expert, identifying people wearing specific T-shirt colors (blue for Security, green for Volunteers, etc.).
    5.  The AI returns an array of detected staff members, including their role and a normalized bounding box (`x`, `y`, `width`, `height`) for their location.
    6.  The `CrowdMap` component then renders these bounding boxes as overlays on top of the video feed, effectively creating a "heatmap" of staff locations.

### 4. AI-Generated Situational Summaries

This feature provides high-level briefings by synthesizing multiple data points.

-   **Component**: `src/components/dashboard/situational-summary.tsx`
-   **AI Flow**: `src/ai/flows/generate-situational-summary.ts`
-   **How it works**:
    1.  The component has a `Textarea` pre-filled with sample data representing crowd density, flow, incident reports, and sentiment.
    2.  When "Generate Summary" is clicked, this data is sent as a structured input to the `generateSituationalSummary` flow.
    3.  The AI model processes the input and generates a concise, human-readable paragraph summarizing the key points, which is then displayed.

### 5. Crowd Sentiment Analysis

Analyzes social media chatter to gauge public mood.

-   **Component**: `src/components/dashboard/sentiment-analysis.tsx`
-   **AI Flow**: `src/ai/flows/crowd-sentiment-analysis.ts`
-   **How it works**:
    1.  A `Textarea` contains sample social media posts.
    2.  This text is sent to the `analyzeCrowdSentiment` flow.
    3.  The AI analyzes the text for tone and content, returning a structured summary of the `overallSentiment`, `keyIssues`, and a detailed `sentimentBreakdown`.

### 6. Multilingual AI Assistant

A chatbot that can understand and respond to queries in multiple languages.

-   **Component**: `src/components/dashboard/ai-assistant.tsx`
-   **AI Flow**: `src/ai/flows/multilingual-ai-assistant.ts`
-   **How it works**:
    1.  The user types a question in any language into the chat input.
    2.  The query is sent to the `multilingualAssistant` flow.
    3.  The prompt is designed to be language-agnostic, simply asking the AI to respond to the `query` in the same language it was asked. Gemini's multilingual capabilities handle the detection and response generation automatically.

### 7. AI-Powered Lost & Found

Helps staff log and categorize found items using image analysis.

-   **Component**: `src/components/dashboard/lost-and-found.tsx`
-   **AI Flow**: `src/ai/flows/analyze-lost-item.ts`
-   **How it works**:
    1.  A user uploads a photo of a found item and writes a description.
    2.  The photo is converted to a Base64 data URI.
    3.  Both the image data and the text description are sent to the `analyzeLostItem` flow.
    4.  The AI analyzes both the image and text to determine the item's `category`, extract any `potentialOwnerInfo`, and recommend an `action`.

### 8. Crowd Analysis Log

A persistent log of all crowd analysis snapshots.

-   **Component**: `src/components/dashboard/analysis-log.tsx`
-   **How it works**:
    1.  The main page (`page.tsx`) maintains a state variable (`analysisLog`).
    2.  When a new analysis is performed in the `CrowdMap` component, it calls a callback prop (`onNewAnalysis`) passed down from the main page.
    3.  This adds the new analysis data (timestamp, summary, image snapshot) to the log.
    4.  The `AnalysisLog` component receives this log as a prop and renders the list. Clicking "View Snapshot" opens a dialog to display the captured image.

---
This project is built in **Firebase Studio**.

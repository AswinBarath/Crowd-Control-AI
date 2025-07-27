# **App Name**: Crowd Control AI

## Core Features:

- Real-Time Crowd Flow & Density Analysis: Utilizes Vertex AI Vision to analyze live video feeds, tracking crowd movement and density in real-time. Helps identify crowd build-up areas, ensuring safer navigation and space management.
- Predictive Bottleneck Forecasting: Powered by Vertex AI Forecasting, the app anticipates crowd congestion points before they occur. This allows staff to take preventive actions such as rerouting or crowd nudging to avoid surges and blockages.
- AI-Generated Situational Summaries: Leverages Gemini + Vertex AI Agent Builder to generate natural language situational summaries. These provide event commanders and security heads with actionable insights in human-readable briefings, reducing decision-making delays.
- Role-Based Staff Heatmaps: Uses T-shirt color recognition via computer vision (Vertex AI Vision) to detect roles (e.g., security, volunteers) and generate live heatmaps. Helps ensure staff are optimally placed across zones for crowd control and assistance.
- Multimodal Anomaly Detection: Combines video, sensor, and social chatter inputs to detect anomalies such as smoke, fire, panic behavior, or crowd surges. Triggers real-time alerts and notifications using Gemini’s multimodal capabilities.
- Automated Intelligent Dispatch: When an incident is detected, the system uses Google Maps API for routing and GPS tracking to automatically dispatch the nearest medical or security unit—minimizing response times without relying on manual radio communication.
- Mobile Incident Reporting + AI-Powered Lost & Found: A Flutter-based cross-platform app enables field staff and visitors to: Report incidents with photos/text. Upload Lost & Found items and match images in real-time using AI-powered visual search.
- Crowd Sentiment Analysis: Processes real-time social media chatter using NLP to gauge crowd sentiment. Detects early signals of unrest, excitement, or dissatisfaction, giving organizers time to adapt.
- Autonomous Drone Integration (Optional): Enables integration with autonomous drones to monitor high-priority zones or deploy instantly to anomaly locations for visual inspection.
- Smart Evacuation Simulator: Provides a scenario-based evacuation planning tool that uses historical data, crowd flow predictions, and GPS heatmaps to simulate emergency responses.
- Gamified Crowd Nudging & Incentives: Promotes movement in low-traffic zones using gamification and incentives. Useful for avoiding bottlenecks and promoting engagement at underutilized sections of the venue.
- Multilingual Voice & Text AI Assistant: A visitor-facing assistant that answers questions, guides users to exits, booths, or help desks in multiple languages—enhancing accessibility and safety.
- Firebase Studio Backend Orchestration: Firestore DB + Realtime DB for data storage. Cloud Functions for real-time data triggers. Firebase Hosting for dashboards and mobile apps. Firebase Cloud Messaging (FCM) for live alerts. Role-based access and scalable orchestration via Firebase Studio low-code interface.
- Optional IoT/Wearable Support: Extendable to integrate biometric devices or wristbands for entry validation, heat & panic detection, or location-based staff tracking.

## Style Guidelines:

- Primary color: A vibrant sky blue (#468BFF), to evoke trust and a sense of calm vigilance. Avoid teal.
- Background color: Light gray (#F0F4F9), a desaturated tint of blue. Lighter backgrounds help ensure easy readability of maps and other complex visuals.
- Accent color: A muted violet (#907AD6), an analogous color to the blue, with distinct brightness, can indicate less critical actionable items.
- Body font: 'Inter', sans-serif, for a modern, neutral, and objective feel suitable for a command dashboard. Headlines will also use this font, because the dashboard content involves mostly short labels and brief summaries rather than longer copy.
- Code font: 'Source Code Pro', monospace, for displaying system or log data.
- Simple, clear icons to represent different incident types and staff roles, making the interface easy to understand at a glance.
- Clean and structured layout with a focus on data visualization for crowd density, flow, and resource allocation.
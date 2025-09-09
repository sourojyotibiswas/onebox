# Onebox Email Aggregator

Onebox is a full-stack intelligent email aggregator that connects multiple Gmail accounts, categorizes emails using AI (BART transformer), indexes data in Elasticsearch for fast search, and sends smart Slack/webhook alerts for high-priority messages — all within a sleek React UI.


## Table of Contents

1. [Project Pipeline Overview](#project-pipeline-overview)
2. [Assignment Implementation Overview](#assignment-implementation-overview)
   - [1. Real-Time Email Synchronization](#1-real-time-email-synchronization)
   - [2. Searchable Storage using Elasticsearch](#2-searchable-storage-using-elasticsearch)
   - [3. AI-Based Email Categorization](#3-ai-based-email-categorization)
   - [4. Slack & Webhook Integration](#4-slack--webhook-integration)
   - [5. Frontend Interface](#5-frontend-interface)
   - [6. AI-Powered Suggested Replies](#6-ai-powered-suggested-replies-currently-not-available)
3. [AI Model Implementation Details](#ai-model-implementation-details)
   - [Current Approach: Subject-Based Classification](#current-approach-subject-based-classification)
   - [Alternative Approach: Subject + Body Classification](#alternative-approach-subject--body-classification)
4. [Email Fetching & Processing Flow](#email-fetching--processing-flow)
   - [Initial Sync Process](#initial-sync-process)
   - [Real-Time Monitoring](#real-time-monitoring)
   - [UID Tracking System](#uid-tracking-system)
   - [Multi-Account Management](#multi-account-management)
   - [Folder Processing Strategy](#folder-processing-strategy)
5. [Architecture](#architecture)
6. [Prerequisites](#prerequisites)
7. [Setup Instructions](#setup-instructions)
   - [1. Clone the Repository](#1-clone-the-repository)
   - [2. Environment Configuration](#2-environment-configuration)
   - [3. Start Elasticsearch with Docker](#3-start-elasticsearch-with-docker)
   - [4. AI Service Setup](#4-ai-service-setup)
   - [5. Backend Setup](#5-backend-setup)
   - [6. Frontend Setup](#6-frontend-setup)
8. [Running the Application](#running-the-application)
   - [Complete Startup Sequence](#complete-startup-sequence)
   - [Accessing the Application](#accessing-the-application)
9. [Project Structure](#project-structure)
10. [Features](#features)
11. [API Endpoints](#api-endpoints)
12. [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Port Configuration](#port-configuration)
13. [Development Notes](#development-notes)
14. [Security Considerations](#security-considerations)
15. [Quick Start Commands](#quick-start-commands)

## Project Pipeline Overview

1. **Email Sync**: IMAP service connects to Gmail accounts and syncs emails
2. **AI Classification**: Machine learning model categorizes emails (Interested, Not Interested, Meeting Booked, Spam, Out of Office)
3. **Data Storage**: Emails are indexed in Elasticsearch for fast search and retrieval
4. **Smart Notifications**: Interested emails trigger Slack and webhook notifications
5. **Web Interface**: React frontend provides email browsing, search, and filtering capabilities

## Assignment Implementation Overview

This project implements 5 out of 6 required features from the assignment:

### 1. Real-Time Email Synchronization

- **Multiple IMAP Accounts**: For now I have implemeted with 2 Gmail accounts configured via environment variables
- **30+ Days Email Fetch**: Retrieves emails from the last day (configurable) with full historical access
- **Persistent IMAP Connections**: Uses ImapFlow with IDLE mode for real-time updates
- **Flow**: `IMAP Connect → Folder Scan → IDLE Mode → Real-time Monitoring → Email Processing`

### 2. Searchable Storage using Elasticsearch

- **Local Elasticsearch**: Docker-based setup with custom mapping schema
- **Full Indexing**: All email fields (subject, body, from, to, date, folder, account) indexed
- **Advanced Filtering**: Filter by folder, account, category
- **Flow**: `Email Data → Elasticsearch Index → Search API → Frontend Filters`

### 3. AI-Based Email Categorization

- **Required Categories**: Interested, Meeting Booked, Not Interested, Spam, Out of Office
- **Model**: BART-large-mnli for zero-shot classification
- **Current Implementation**: Subject-based classification (fast, moderate accuracy)
- **Alternative Available**: Subject + Body classification (slower, higher accuracy)
- **Flow**: `Email Subject → BART Model → Category Prediction → Storage`

### 4. Slack & Webhook Integration

- **Slack Notifications**: Automatic alerts for "Interested" emails
- **Webhook Triggers**: External automation via webhook.site for interested prospects
- **Flow**: `Email Categorized as "Interested" → Slack Alert + Webhook POST`

### 5. Frontend Interface

- **Email Display**: Clean, responsive UI with email list and detailed view
- **Filtering**: By account, folder, category with active filter management
- **Search**: Elasticsearch-powered full-text search across all email content
- **Flow**: `User Input → API Request → Elasticsearch Query → Results Display`

### 6. AI-Powered Suggested Replies [Currently Not Available]

- **Status**: Not implemented due to time constraints
- **Reason**: Would require vector database setup (Pinecone/Weaviate) and LLM integration

## AI Model Implementation Details

### Current Approach: Subject-Based Classification

```
Email Subject → BART Model → Category (Fast, ~1-2s response)
```

- **Advantages**: Quick response time, suitable for real-time processing
- **Limitations**: Limited context, moderate accuracy (~70-80%)

### Alternative Approach: Subject + Body Classification

```
Email Subject + Body → BART Model → Category (Slower, ~5-10s response)
```

- **Implementation**: Available in codebase (commented code in aiService.ts)
- **Advantages**: Higher accuracy (~85-95%), full email context
- **Trade-off**: Longer processing time, requires more computational resources

## Email Fetching & Processing Flow

### Initial Sync Process

```
1. IMAP Connection → Gmail Servers
2. Mailbox Discovery → List All Folders
3. Folder Processing → Each Folder Independently
4. UID Tracking → Persistent State Management
5. Email Indexing → Elasticsearch Storage
```

### Real-Time Monitoring

```
1. INBOX IDLE Mode → Listen for New Emails
2. Event Trigger → "exists" event fired
3. Incremental Fetch → Only new UIDs processed
4. AI Classification → Category prediction
5. Notification Logic → Slack/Webhook for "Interested"
6. Index Update → Elasticsearch storage
```

### UID Tracking System

- **Purpose**: Prevents duplicate processing and enables incremental sync
- **Storage**: JSON file (`uid_tracker.json`) with account/folder/UID mapping
- **Logic**: Only process emails with UID > last_seen_UID
- **Benefits**: Efficient, stateful, handles connection interruptions

### Multi-Account Management

```
Account 1 (USER_ONE) ─┐
                      ├─→ Parallel Processing ─→ Shared Elasticsearch
Account 2 (USER_TWO) ─┘
```

- **Isolation**: Each account processed independently
- **Error Handling**: Account failures don't affect others
- **Scalability**: Easy to add more accounts via configuration

### Folder Processing Strategy

- **Selective Sync**: Skips system folders (\\Noselect flag)
- **Force Include**: Important folders like "[Gmail]/Sent Mail"
- **Locking**: Mailbox locks prevent concurrent access issues
- **Error Recovery**: Individual folder failures don't stop entire sync

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + TypeScript + Express
- **AI Service**: Python + Flask + Transformers (BART model)
- **Database**: Elasticsearch
- **Email Integration**: IMAP (Gmail)
- **Notifications**: Slack webhooks

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Docker and Docker Compose
- Gmail accounts with App Passwords enabled

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd onebox
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Gmail Credentials (use App Passwords, not regular passwords)
USER_ONE=your-first-email@gmail.com
USER_ONE_PASSWORD=your-app-password-1
USER_TWO=your-second-email@gmail.com
USER_TWO_PASSWORD=your-app-password-2

# Notification Settings
SLACK_WEBHOOK_URL=your-slack-webhook-url
WEBHOOK_URL=your-custom-webhook-url
```

**Note**: Enable 2FA on Gmail and generate App Passwords for secure authentication.

### 3. Start Elasticsearch with Docker

```bash
# From the backend directory
cd backend
docker-compose up -d
```

This will start Elasticsearch on `http://localhost:9200`

### 4. AI Service Setup

```bash
# Navigate to ML directory
cd backend/ml

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download and cache the AI model (first time only)
python download_model.py

# Start the AI service
python email_classifier.py
```

The AI service will run on `http://localhost:5000`

### 5. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm run dev
```

The backend API will run on `http://localhost:3000`

### 6. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Running the Application

### Complete Startup Sequence

1. **Start Elasticsearch**: `docker-compose up -d` (from backend directory)
2. **Start AI Service**: `python email_classifier.py` (from backend/ml directory with .venv activated)
3. **Start Backend**: `npm run dev` (from backend directory)
4. **Start Frontend**: `npm run dev` (from frontend directory)

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/emails
- **AI Service**: http://localhost:5000
- **Elasticsearch**: http://localhost:9200

## Project Structure

```
onebox/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── utils/          # Utility modules
│   │   ├── accounts.ts     # Email account configuration
│   │   ├── api.ts          # Express API routes
│   │   ├── elasticClient.ts # Elasticsearch client
│   │   ├── emailIndexer.ts # Email indexing logic
│   │   ├── imapService.ts  # IMAP email sync
│   │   └── index.ts        # Main entry point
│   ├── ml/                 # AI service
│   │   ├── email_classifier.py # Flask ML API
│   │   ├── download_model.py   # Model setup
│   │   └── requirements.txt    # Python dependencies
│   ├── docker-compose.yml  # Elasticsearch setup
│   └── package.json
└── README.md
```

## Features

- **Multi-Account Email Sync**: Connect multiple Gmail accounts
- **AI-Powered Classification**: Automatic email categorization
- **Smart Notifications**: Instant alerts for interested prospects
- **Advanced Search**: Full-text search across all emails
- **Intelligent Filtering**: Filter by account, folder, category
- **Real-time Updates**: Live email monitoring
- **Responsive Design**: Modern, mobile-friendly interface

## API Endpoints

- `GET /api/emails`: Fetch emails with optional filters
  - Query parameters: `q` (search), `fromDate`, `toDate`, `folder`, `page`, `size`
- `POST /predict`: Classify email subject (AI service)
- `POST /parse`: Parse raw email content (AI service)

## Troubleshooting

### Common Issues

1. **Elasticsearch not starting**: Ensure Docker is running and port 9200 is available
2. **Gmail authentication fails**: Verify App Passwords are correctly set in .env
3. **AI model not loading**: Run `python download_model.py` to cache the model
4. **Backend connection errors**: Check if all services are running on correct ports

### Port Configuration

- Frontend: 5173
- Backend: 3000
- AI Service: 5000
- Elasticsearch: 9200

## Development Notes

- The AI model uses BART for zero-shot classification
- Emails are processed incrementally using UID tracking
- Elasticsearch provides fast full-text search capabilities
- React frontend uses Tailwind CSS for styling
- All TypeScript code is properly documented

## Security Considerations

- Use Gmail App Passwords instead of regular passwords
- Keep webhook URLs secure and private
- Elasticsearch runs locally without authentication (development only)
- Environment variables contain sensitive information - never commit .env files

---

## Quick Start Commands

```bash
# Terminal 1: Start Elasticsearch
cd backend && docker-compose up -d

# Terminal 2: Start AI Service
cd backend/ml && .venv\Scripts\activate && python email_classifier.py

# Terminal 3: Start Backend
cd backend && npm run dev

# Terminal 4: Start Frontend
cd frontend && npm run dev
```

# Snake Leaderboard System

This document describes the complete snake leaderboard system and the new features added.

## Overview

The snake leaderboard system provides comprehensive functionality for managing game scores, rankings, and leaderboards with multiple game modes. It includes authentication, permissions, and full CRUD operations.

## New Features Added

### 1. Leaderboard Rankings Display

**Endpoint**: `GET /leaderboardrankings`

**Parameters**:
- `leaderboardId` (required) - The ID of the leaderboard
- `gameModeId` (required) - The ID of the game mode

**Response**:
```json
{
  "message": "Ok",
  "status": 200,
  "rankings": [
    {
      "position": 1,
      "accountId": "player-uuid",
      "playerName": "PlayerOne",
      "displayName": "Player One",
      "score": 1000,
      "dateModified": "2024-01-01T12:00:00Z"
    }
  ]
}
```

**Features**:
- Returns ranked leaderboard with player information
- Sorted by best score (descending)
- Includes position, player details, and timestamps
- Validates leaderboard-gamemode associations

### 2. Default Initialization

**Endpoint**: `POST /initializedefaults`

**Authentication**: Requires admin permissions

**Response**:
```json
{
  "message": "Default game modes and leaderboards initialized successfully",
  "status": 200,
  "gameModes": [...],
  "leaderboards": [...]
}
```

**What it creates**:

#### Default Game Modes:
- **Any Percent** (`any-percent`) - Speedrun category for fastest completion
- **100 Percent** (`100-percent`) - Complete game category
- **Speed Run** (`speed-run`) - General speed-focused category
- **Survival** (`survival`) - Endurance-focused category

#### Default Leaderboards:
- **Main Snake Leaderboard** (`main-leaderboard`) - Associated with all game modes
- **Any Percent Leaderboard** (`any-percent-leaderboard`) - Dedicated Any Percent leaderboard

## Client Usage

```typescript
import { SnakeClient } from "shared/clients/snake";

const client = new SnakeClient({ baseUrl: "http://localhost:8082" });

// Initialize defaults (admin only)
const adminClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
adminClient.setApikey("admin-api-key");
await adminClient.initializeDefaults();

// Get leaderboard rankings
const rankings = await client.getLeaderboardRankings(
  "main-leaderboard", 
  "any-percent"
);

// Submit a score (requires player authentication)
const playerClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
playerClient.setApikey("player-api-key");
await playerClient.insertGameModeScore({
  accountId: "player-uuid",
  gameModeId: "any-percent",
  score: 1500
});
```

## Existing Features

The system already includes comprehensive functionality:

- **Player Management**: Registration, authentication, profiles
- **Game Mode Management**: CRUD operations for game modes
- **Leaderboard Management**: Create and manage multiple leaderboards
- **Score Tracking**: Multiple score retrieval strategies
- **Permission System**: Role-based access control
- **API Authentication**: OpenPlanet integration with API keys

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/leaderboardrankings` | GET | Get ranked leaderboard | No |
| `/initializedefaults` | POST | Setup default data | Admin |
| `/leaderboards` | GET/POST | Manage leaderboards | Admin for POST |
| `/gamemodes` | GET/POST | Manage game modes | Admin for POST |
| `/gamemodescores` | GET/POST/DELETE | Score operations | Player for POST |
| `/players` | GET/POST | Player management | Various |
| `/auth/openplanet` | POST | Authentication | No |

## Database Schema

The system uses PostgreSQL with the following key tables:
- `Players` - Player information and profiles
- `GameModes` - Available game modes
- `GameModeScores` - Individual score entries
- `Leaderboards` - Leaderboard definitions
- `LeaderboardGameModes` - Associates game modes with leaderboards
- `Permissions` & `PlayerPermissions` - Access control
- `ApiKeys` - Authentication tokens

## Getting Started

1. Set up the database using the schema in `dbs/openplanetsnake/001_create_schema.sql`
2. Start the API server
3. Use an admin account to call `/initializedefaults` to set up default data
4. Players can authenticate via OpenPlanet and start submitting scores
5. Use `/leaderboardrankings` to display leaderboards in your application
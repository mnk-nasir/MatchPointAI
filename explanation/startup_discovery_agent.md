# 🤖 Deep Dive: Startup Discovery Agent

The **Startup Discovery Agent** is an automated continuous background worker engineered to scan external data feeds identifying "stealth" or newly registered startups dynamically augmenting the platform intelligence layer.

---

## 🔬 1. Orchestration & Collectors

The orchestrator operates inside `backend/core/services/startup_discovery/agent.py` triggered every **12 hours** sequentially triggering sub-modules safely bypassing circular loops.

### 📡 A. Finder Streams

1.  **News Startup Finder (`news_startup_finder.py`)**
    -   **Rule**: Scrapes Tech Google News RSS continuous queries nodes arrays streams.
    -   **Extract**: Direct identification of variables isolating `[Company]` from funding descriptions verbs matching keywords arrays.

2.  **LinkedIn Signal Finder (`linkedin_signal_finder.py`)**
    -   **Rule**: Simulates detecting early Stealth-mode founder announcements triggers.
    -   **Extract**: Directly isolating `[FounderName]` mapped targeting corporate registries setup maps matching continuous streams.

3.  **Product Launch Finder (`product_launch_finder.py`)**
    -   **Rule**: Monitors release streams isolating incremental releases targets.
    -   **Extract**: Matches `[Launch]` payloads isolation increments mapped targeting continuous recalculations loops safely.

---

## 🏷️ 2. De-duplication & Promotion Matrix

All signals pass through a **Filter Pipeline Layout Wrapper**:

| Condition Check | Logic Threshold Node | Mapped Action |
| :---: | :---: | :--- |
| **URL Double** | Explicit match node | 🗑️ **Discard** existing rows |
| **Name Double** | `Name.lower() == existingName.lower()` | 🗑️ **Discard** existing rows |
| **Variables Count** | Array length `< 3` or `> 80` | ✅ **Safe buffer** loads outputs |

### 🚀 Auto-Promotion
If a discovered startup is deemed unique, the orchestrator triggers:
1.  **Continuous Index**: Saves row record inside `DiscoveredStartup` database.
2.  **Automatic Lift**: Generates a blank Questionnaire `StartupEvaluation` table appending discovery metadata payloads inside standard nested formats loops securely.

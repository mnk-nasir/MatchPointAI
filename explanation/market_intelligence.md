# 📊 Deep Dive: Market Intelligence Engine

The **Market Intelligence Engine** forces alignment between raw stream data logs (news, socials) and contextual analytical overlays. It derives momentum, sentiment tags, and attention thresholds to render onto visual components.

---

## 🔬 1. Scoring Architecture

Calculations run inside `backend/core/services/market_intelligence/engine.py` on recurring background schedules triggered every 1 hour.

### 🧮 Score Matrices

#### 📰 A. News Mentions Score
- **Timeline**: Node checks previous **30 Days** aggregates.
- **Rules Coefficient**: `Count(Recent Articles) * 5`.
- **Award Cap**: Strict capping limits applied scaling maximum **`100`** points proportionally to standard baseline.
  - *Example: 15 matching headlines over 30 days = 75 points.*

#### 🌐 B. Public Sentiment Value
- **Timeline**: Pulls the most current `SocialSignal` rows sequentially.
- **Value**: Directly mirrors numeric arrays from continuous ingestion buffers.
- **Fallback**: Locks to **`50`** score buffers if empty variables collide load outs safely.

#### 📈 C. Industry Momentum
- **Weights**: Computed analyzing macro funding logs mapped by sectors.
- **Formula**:
  $$ Momentum = 40 + (FundingCountInSector * 10) $$
  *(Strict cap capping linear array at Maximum **100** points)*

---

## 🏷️ 2. Classification Threshold mapping

Derived values map to proportional string nodes populated directly onto sidebar layouts triggers accurately representing state updates.

| Metric | Trigger Level | Mapped Node |
| :---: | :---: | :--- |
| **Points Value** | `>= 75` | 🟢 **High** level tags |
| **Points Value** | `>= 45` | 🟡 **Medium** level tags |
| **Points Value** | `< 45` | 🔴 **Low** level tags |

---

| Trend Metric | Trigger Trend | Mapped Node |
| :---: | :---: | :--- |
| **Points Value** | `>= 70` | 📈 **Rising** attention |
| **Points Value** | `>= 40` | 📊 **Stable** attention |
| **Points Value** | `< 40` | 📉 **Falling** attention |

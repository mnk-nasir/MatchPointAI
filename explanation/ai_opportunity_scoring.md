# 🧠 Deep Dive: AI Opportunity Scoring Engine

The **AI Opportunity Scoring Engine** is designed to compute dynamic predictive viability ratings for startups on the platform. It blends **Static Input** (Founder Assessment) with **Dynamic Variables** (Ingested External Signals) to calculate accurately rated match scores securely.

---

## 🔬 1. Scoring Architecture

The engine uses a **100-Point Adjustment Algorithm** modeled linearly inside `backend/core/services/ai_scoring/engine.py`.

### 🧮 Score Equation
$$ Score = Base + \Delta(Team) + \Delta(Social) + \Delta(Funding) $$

---

## 📊 2. The Weighting Matrix (Step-by-step)

### 🟢 A. Base Score Setting (Weight: ~50%)
- **Source**: Directly loaded using the startup's internal form aggregates.
- **Rule**: Standard fallback default starts at **`50`** points if empty.
- **Derived Risk Base**: `100 - BaseScore`.

### 👥 B. Team Strength Overlay (Weight: +10 Points)
- **Source**: Questionnaire Step 5 ("Co-Founders" checkbox node).
- **Condition**: If the response satisfies `coFounders != 'no'`.
- **Award**: 
  - ➕ **+10 Points** added to Opportunity.
  - ➖ **-5 Points** subtracted from Risk.

### 🌐 C. external News & Sentiment (Weight: +25 Points)
- **Source**: `SocialSignal` database table triggers parsed continuously.
- **Algorithm Rules**:
  1. **Hot Hype**: If `sentiment_score > 80` ➔ ➕ **+15 Opportunity** | ➖ **-10 Risk**.
  2. **Cold Standard**: If `sentiment_score < 40` ➔ ➖ **-10 Opportunity** | ➕ **+15 Risk**.
  3. **Buzz Adder**: If `popularity_score > 75` ➔ ➕ **+10 Opportunity** added boost.

### 💰 D. Capital Activity Overlay (Weight: +15 Points)
- **Source**: `FundingEvent` structured multipliers.
- **Rule Layout**:
  - **Mega Rounds**: If dollars accumulated `> $1,000,000` ➔ ➕ **+15 Opportunity** | ➖ **-10 Risk**.
  - **Standard Round**: If any smaller row node exists ➔ ➕ **+5 Opportunity**.

---

## 🏷️ 3. Classification Multipliers

All results are capped linearly between **[ 0 ➔ 100 ]** for proportional safety, then labeled under standard classification bands:

| Score Cap | Label | Display Profile Tag |
| :---: | :--- | :--- |
| **80 - 100** | 🚀 **High** | Safe high-traction accelerator flags. |
| **50 - 79** | ⚖️ **Medium** | Stable attention scoring tags. |
| **0 - 49** | ⚠️ **Low** | Requires review on risk multiplier thresholds. |

*(Values persist securely on the rows mapped targeting continuous recalculations loops safely backloaded.)*

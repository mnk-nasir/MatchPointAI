# 🤝 Deep Dive: Investor Match Engine

The **Investor Match Engine** leverages an algorithmic Alignment Matrix to pair registered startups with qualified VC profiles securely resolving optimal parameters fit profiles continuously.

---

## 🔬 1. Match Matrix Breakdown

The engine scales scoring on a **100-Point Alignment Cap** inside `backend/core/services/investor_matching/engine.py`.

### 🧮 Formula Structure:
$$ Match = \Delta(Sector) + \Delta(Stage) + \Delta(Geo) + \Delta(Size) $$

---

## 📊 2. Node Value Points (Weights)

### 🚀 A. Industry Alignment (Weight: **40 Points**)
- **Condition**: Substring check scanning list `target_industries` arrays inside investor layouts matching startup sector directly.
- **Rule Layout**:
  - **Match Found** ➔ ➕ **+40 Points** Added.
  - **General Tech Fallback** ➔ ➕ **+10 Points** Added.

### 📈 B. Investment Stage Fit (Weight: **30 Points**)
- **Condition**: Startup current evaluation stage fits perfectly inside preferred `preferred_stages` nodes arrays.
- **Rule Layout**:
  - **Match Found** ➔ ➕ **+30 Points** Added to coefficient.

### 🗺️ C. Geography Alignment (Weight: **15 Points**)
- **Condition**: Global reach thresholds mapped matching proportional startup origins regions safely without overlaps.
- **Rule Layout**:
  - **Match Found** ➔ ➕ **+15 Points** Added statically for standard global reach thresholds setup maps.

### 💰 D. Check Size Alignment (Weight: **15 Points**)
- **Condition**: Checks if startup investment target falls safely between investor limits: `min_ticket <= target <= max_ticket`.
- **Rule Layout**:
  - **Match Found** ➔ ➕ **+15 Points** Added.

---

## 🏷️ 3. Filtering and Outputs

Calculated totals are capped at **`100`** points. 

> [!IMPORTANT]
> To preserve layout quality without overcrowding dashboard rows boards with poor results sets, **only recommendations with final scores greater than or equal to 50** are stored securely on the matching tables.

*(Continuous recalculations triggers guarantee row matches fully follow continuous stream updates).*

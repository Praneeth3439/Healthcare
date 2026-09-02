# NIRF 2025 Medical Institutions Dataset Documentation

## 1. Overview & Source
- **Dataset Title**: National Institutional Ranking Framework (NIRF) 2025 – Medical Colleges
- **Raw File Location**: `data/raw/NIRF RANKING of 2025 Medical colleges.csv`
- **Processed File Locations**: 
  - `data/processed/nirf_medical_2025_processed.json`
  - `data/processed/nirf_medical_2025_processed.csv`
  - `frontend/src/data/nirf_data.json`
- **Total Record Count**: 50 Institutions (Ranked 1 to 50)
- **Data Source Authority**: Ministry of Education, Government of India (NIRF Medical Category)

---

## 2. Raw Schema vs. Processed Schema

| Raw Column | Raw Sample | Processed Field | Type | Description / Cleaning Applied |
|---|---|---|---|---|
| `Sl` | `1` | `serial_no` | `integer` | Verified sequential index 1 to 50 |
| `Name` | `All India Institute of Medical Sciences, Delhi` | `name` | `string` | Cleaned typographic quotes and whitespace |
| `NIRF Rank` | `1` | `nirf_rank` | `integer` | Official NIRF 2025 rank (1–50) |
| `Founded` | `1956` | `founded` | `string` | Year established (e.g., 1823 for JIPMER to 1974) |
| `Address` | `Sri Aurobindo Marg, Ansari Nagar East...` | `address` | `string` | Full postal address |
| `City` | `Delhi` (3 blank) | `city` | `string` | Missing values (PGI Chandigarh, JIPMER Puducherry, BHU Varanasi) resolved from official address |
| `STATE` | `New Delhi` (3 blank) | `state` | `string` | Normalized aliases (e.g., "New Delhi" $\to$ "Delhi", "Pondicherry" $\to$ "Puducherry") |
| `Latitude` | `28.565° N` | `latitude` | `float` | Converted from degrees/direction notation to decimal degrees (e.g., `28.565`) |
| `Longitude` | `77.21° E` | `longitude` | `float` | Converted from degrees/direction notation to decimal degrees (e.g., `77.210`) |
| *N/A* | *N/A* | `id` | `string` | Deterministic unique key (e.g., `nirf-med-001`) |
| *N/A* | *N/A* | `has_coordinates` | `boolean` | `true` for all 50 institutions (100% geocoded) |
| *N/A* | *N/A* | `doctor_info_available` | `boolean` | Explicitly `false` — flags absence of doctor-level records |
| *N/A* | *N/A* | `score` | `null` | Explicitly `null` because overall numerical scores are not in raw CSV |
| *N/A* | *N/A* | `notes` | `string` | Audit notice: "Doctor-level information is not included in the NIRF 2025 dataset." |

---

## 3. Dataset Characteristics & Summary Statistics

- **Total Medical Institutions**: 50
- **Rank Range**: 1 to 50 (continuous, no missing ranks)
- **Top 5 Institutions**:
  1. **All India Institute of Medical Sciences (AIIMS)**, Delhi (Rank 1, Founded 1956)
  2. **Post Graduate Institute of Medical Education and Research (PGIMER)**, Chandigarh (Rank 2, Founded 1962)
  3. **Christian Medical College (CMC)**, Vellore, Tamil Nadu (Rank 3, Founded 1900)
  4. **National Institute of Mental Health & Neuro Sciences (NIMHANS)**, Bengaluru, Karnataka (Rank 4, Founded 1974)
  5. **Jawaharlal Institute of Post Graduate Medical Education & Research (JIPMER)**, Puducherry (Rank 5, Founded 1823)
- **Geographical Distribution**:
  - **18 States & Union Territories represented**: Bihar, Chandigarh, Chhattisgarh, Delhi, Gujarat, Haryana, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Odisha, Puducherry, Punjab, Rajasthan, Tamil Nadu, Uttar Pradesh, Uttarakhand, West Bengal.
  - **32 Unique Cities represented**.
  - **Leading States by Count**: Tamil Nadu (7), Karnataka (6), Delhi (6), Uttar Pradesh (4), Kerala (3), Odisha (3).

---

## 4. Geospatial Data Integrity & Verification

1. **Coordinate Verification**:
   - Latitude bounding box: $8.5212^\circ \text{N}$ (Thiruvananthapuram, Kerala) to $30.9155^\circ \text{N}$ (Ludhiana, Punjab).
   - Longitude bounding box: $72.5800^\circ \text{E}$ (Ahmedabad, Gujarat) to $88.3614^\circ \text{E}$ (Kolkata, West Bengal).
   - All coordinates fall strictly within the territorial boundaries of India.
2. **Zero Fabrication Policy**:
   - No mock institutions, fake doctor profiles, or synthetic ranks were added.
   - Any unavailable fields are explicitly presented to the user with standard disclaimer labels: *"Information not available in the NIRF 2025 dataset."*

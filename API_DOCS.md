# Verde Grid Energy (VGE Technologies OÜ) — API Documentation

> **FastAPI Automatic Interactive Documentation**  
> When running the backend service (`uvicorn backend-api.main:app --reload`), access full interactive Swagger & OpenAPI documentation directly at:
> - **Swagger UI**: `http://localhost:8000/docs`
> - **ReDoc Specification**: `http://localhost:8000/redoc`

---

## 📌 Postman Collection & Database Architecture
* **Postman Collection**: 📁 `/mock-data/VGE_API_Postman_Collection.json`
* **PostgreSQL ORM Models (SQLAlchemy)**: 📁 `/backend-api/models.py`
* **PostgreSQL DDL Schema Script**: 📁 `/backend-api/schema.sql`

Import the Postman collection file to test all endpoints. Database tables are defined for `companies`, `users`, `solar_facilities`, `inverter_telemetry`, `irec_certificates`, and `ppa_contracts`.

---

## 🚀 API Endpoint Reference

Base URL (Local Dev): `http://localhost:8000`

### 1. Ingest Energy & Telemetry Data
Receives real-time IoT telemetry from commercial solar inverters (Growatt, Huawei, Sungrow, Volt Energy smart meters).

* **Endpoints:**
  * `POST /api/v1/telemetry/ingest`
  * `POST /api/v1/ingest-energy` *(Alias)*
* **Headers:** `Content-Type: application/json`
* **Request Body Example:**
```json
{
  "device_id": "INV-SUNGROW-SG250-88A1",
  "facility_id": "FAC-MY-PENANG-004",
  "timestamp": "2026-07-30T10:00:00Z",
  "active_power_kw": 245.8,
  "cumulative_yield_kwh": 124850.5,
  "grid_voltage_v": 415.2,
  "frequency_hz": 50.01,
  "grid_power_factor": 0.99,
  "temperature_celsius": 42.5,
  "signature": "a8fbc892d28174e198b10f0011928374"
}
```
* **Response Example (200 OK):**
```json
{
  "status": "success",
  "message": "Telemetry ingested and verified.",
  "payload_hash": "0xa8fbc892d28174e198b10f00119283748291a10b",
  "processed_at": "2026-07-30T10:00:01.204Z",
  "carbon_offset_kg": 159.77
}
```

---

### 2. Mint On-Chain I-REC / dREC Tokens
Triggers Polygon EVM smart contract execution to mint verified I-REC Renewable Energy Certificates for verified solar generation.

* **Endpoints:**
  * `POST /api/v1/irec/mint`
  * `POST /api/v1/mint-drec` *(Alias)*
* **Headers:** `Content-Type: application/json`
* **Request Body Example:**
```json
{
  "facility_id": "FAC-MY-PENANG-004",
  "mwh_generated": 150.5,
  "period_start": "2026-07-01T00:00:00Z",
  "period_end": "2026-07-30T00:00:00Z",
  "recipient_wallet": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
}
```
* **Response Example (200 OK):**
```json
{
  "tx_hash": "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
  "token_id": 88294,
  "mwh_tokenized": 150.5,
  "status": "MINTED_ON_CHAIN",
  "minted_at": "2026-07-30T10:01:15.912Z"
}
```

---

### 3. Smart Contract ABI (VerdeCertificate.sol)
Retrieves the complete JSON Application Binary Interface (ABI) for `VerdeCertificate.sol` (ERC-1155 I-REC Carbon Credit token contract).

* **Endpoint:** `GET /api/v1/contract/abi`
* **ABI File Location:** `backend-api/VerdeCertificate_ABI.json`
* **Response Example (200 OK):**
```json
{
  "status": "success",
  "contract_name": "VerdeCertificate",
  "standard": "ERC-1155 / I-REC Token",
  "abi": [ ... ]
}
```

---

### 3. Corporate ESG Certificates & Holdings
Fetches corporate ESG dashboard data, total certified MWh, CO2 offset stats, and Polygon blockchain certificate records for a given company.

* **Endpoint:** `GET /api/v1/certificates/{company_id}`
* **Path Parameters:** `company_id` (e.g., `penang-solar`, `intel-malaysia`, `foxconn-vnm`)
* **Response Example (200 OK):**
```json
{
  "status": "success",
  "company_id": "penang-solar",
  "company_name": "Penang Solar Solar Assets Corp",
  "total_certificates_issued": 142,
  "total_mwh_certified": 18450.0,
  "co2_offset_tonnes": 11992.5,
  "blockchain": "Polygon EVM (Chain ID 137)",
  "certificates": [
    {
      "certificate_id": "VGE-IREC-2026-001",
      "token_id": 88294,
      "facility_name": "Penang Solar Park (15 MWp)",
      "country": "Malaysia",
      "mwh_certified": 150.5,
      "co2_saved_tons": 97.8,
      "issued_at": "2026-07-28T12:00:00Z",
      "tx_hash": "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f"
    }
  ],
  "compliance_standards": ["CSRD Scope 2", "GHG Protocol", "RE100 Verified"]
}
```

---

### 4. Real-Time Production & Telemetry Analytics
Fetches time-series power curves, energy yields, and revenue performance for commercial solar assets.

* **Endpoint:** `GET /api/v1/analytics/production`
* **Query Parameters:**
  * `facility_id` *(optional, default: `FAC-MY-PENANG-004`)*
  * `timeframe` *(optional: `24h`, `7d`, `30d`, default: `24h`)*
* **Response Example (200 OK):**
```json
{
  "status": "success",
  "facility_id": "FAC-MY-PENANG-004",
  "facility_name": "Penang Solar Park (15 MWp)",
  "country": "Malaysia",
  "capacity_mwp": 15.0,
  "timeframe": "24h",
  "summary": {
    "current_power_kw": 11850.5,
    "total_yield_mwh": 64.2,
    "total_revenue_usd": 6099.0,
    "total_co2_tons": 41.7,
    "efficiency_rate_pct": 98.6
  },
  "series": [
    {
      "label": "12:00",
      "active_power_kw": 14250.0,
      "yield_mwh": 14.25,
      "revenue_usd": 1353.75,
      "co2_offset_tons": 9.26
    }
  ],
  "fetched_at": "2026-07-30T10:02:00Z"
}
```

---

### 5. Live Cumulative Network Yield
Provides dynamic real-time cumulative yield metrics across all APAC solar nodes.

* **Endpoint:** `GET /api/v1/yield/live`
* **Response Example (200 OK):**
```json
{
  "status": "success",
  "nodes_count": 14289,
  "yield_processed_usd": 18253412,
  "co2_offset_tons": 2148932.8,
  "recent_event": "Node #FAC-APAC-412 verified +284.1t CO2 dMRV yield",
  "timestamp": "2026-07-30T10:02:30Z"
}
```

---

### 6. Calculate PPA Yield & 20-Year Financial Model
Calculates 20-year B2B commercial solar PPA yields, tariff savings, degradation curves, and I-REC market valuations.

* **Endpoint:** `POST /api/v1/yield/calculate`
* **Request Body Example:**
```json
{
  "capacity_kwp": 1000.0,
  "grid_tariff_usd_kwh": 0.12,
  "ppa_discount_percent": 20.0,
  "annual_sun_hours": 1450.0,
  "degradation_rate_percent": 0.5
}
```
* **Response Example (200 OK):**
```json
{
  "annual_generation_mwh": 1450.0,
  "annual_ppa_revenue_usd": 139200.0,
  "annual_co2_offset_tonnes": 942.5,
  "twenty_year_net_yield_usd": 2642819.5,
  "irec_certificate_value_usd": 2682.5
}
```

---

### 7. System Health Check
Returns API service health, registry metadata, LEI code, and UTC system timestamp.

* **Endpoint:** `GET /api/v1/health`
* **Response Example (200 OK):**
```json
{
  "status": "healthy",
  "service": "Verde Grid Energy Backend API",
  "version": "1.0.0",
  "company": "VGE Technologies OÜ",
  "registry_code": "17556598",
  "lei": "9845003828CB77B80280",
  "system_time": "2026-07-30T10:03:00Z"
}
```

---

## 🛠️ Local Backend Setup Guide

1. **Install Dependencies:**
   ```bash
   pip install fastapi uvicorn pydantic
   ```

2. **Run Server:**
   ```bash
   python backend-api/main.py
   # or via uvicorn directly
   uvicorn backend-api.main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Access Interactive Docs:**
   Open browser at `http://localhost:8000/docs`

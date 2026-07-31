# Verde Grid Energy (VGE Technologies OÜ) — API & Data Flow Documentation

This document outlines the complete data flow, request/response formats, and architectural sequence for the **Verde Grid Energy** B2B Commercial Solar Telemetry, PPA Yield Analytics, and Polygon EVM dREC Carbon Credit Tokenization platform.

---

## 🏗 System Architecture & End-to-End Data Flow

```
+--------------------------+
|  Commercial Solar Assets |
| (SCADA Inverters & IoT)  |
+--------------------------+
             |
             |  (1) Real-time IoT Inverter Telemetry (JSON Payload)
             v
+--------------------------+
|  Backend Ingestion API   |  <--- Cryptographic dMRV Hashing (Keccak256/SHA256)
|   (FastAPI / Python)     |  <--- PostgreSQL Storage (models.py / schema.sql)
+--------------------------+
             |
             +----------------------------+
             |                            |
             | (2) dREC Minting           | (3) Real-time Data Stream
             v                            v
+--------------------------+    +--------------------------+
| Polygon EVM DLT Network  |    | Corporate ESG Dashboard  |
|  (VerdeCertificate.sol)  |    |  (React 18 + Tailwind)   |
+--------------------------+    +--------------------------+
```

---

## 📌 Endpoint 1: IoT Solar Data Ingestion

Ingests high-frequency telemetry from commercial solar inverters and SCADA devices, generates cryptographic dMRV payload hashes, and logs verified generation records.

* **Endpoint:** `POST /api/v1/telemetry/ingest` (Alias: `POST /api/v1/ingest-solar-data`)
* **Headers:** `Content-Type: application/json`

### Mock JSON Payload
```json
{
  "facility_id": "VOLT-IND-001",
  "timestamp": "2026-07-31T08:00:00Z",
  "energy_generated_kwh": 500.0,
  "device_id": "INV-SUNGROW-SG250-88A1",
  "active_power_kw": 245.8,
  "grid_voltage_v": 415.2,
  "frequency_hz": 50.01,
  "temperature_celsius": 42.5,
  "device_signature": "0xabc123e45f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a"
}
```

### Response Example (200 OK)
```json
{
  "status": "success",
  "facility_id": "VOLT-IND-001",
  "recorded_kwh": 500.0,
  "telemetry_hash": "0x7a89f3c12d45e67890b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3",
  "dmrv_verification": "PASSED_CRYPTOGRAPHICALLY",
  "timestamp": "2026-07-31T08:00:00Z"
}
```

---

## 📌 Endpoint 2: Corporate ESG Dashboard & Carbon Credit Holdings

Retrieves the verified carbon credits, certified renewable MWh, avoided CO2 emissions, and Polygon EVM blockchain certificate holdings for a corporate client.

* **Endpoint:** `GET /api/v1/corporate-dashboard/esg-credits` (Alias: `GET /api/v1/corporate/esg-certificates`)
* **Query Parameters:** `company_id` (optional, default: `penang-solar`)

### Response Example (200 OK)
```json
{
  "status": "success",
  "company_id": "penang-solar",
  "company_name": "Penang Solar Assets Corp",
  "summary": {
    "total_mwh_certified": 12850.5,
    "total_co2_offset_tons": 9059.6,
    "active_irec_tokens": 12850,
    "retired_irec_tokens": 4200,
    "corporate_wallet": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  },
  "certificates": [
    {
      "certificate_id": "VGE-IREC-2026-001",
      "token_id": 1042,
      "facility_name": "Penang Solar Park (15 MWp)",
      "country": "Malaysia",
      "mwh_certified": 150.5,
      "co2_saved_tons": 106.1,
      "tx_hash": "0x3a812b740ef8291a82f3c7b84d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
      "recipient_wallet": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      "status": "MINTED_ON_CHAIN",
      "issued_at": "2026-07-28T14:30:00Z"
    },
    {
      "certificate_id": "VGE-IREC-2026-002",
      "token_id": 1043,
      "facility_name": "Binh Duong Rooftop Solar (8 MWp)",
      "country": "Vietnam",
      "mwh_certified": 320.0,
      "co2_saved_tons": 225.6,
      "tx_hash": "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
      "recipient_wallet": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      "status": "RETIRED_FOR_SCOPE2",
      "issued_at": "2026-07-15T09:15:00Z"
    }
  ]
}
```

---

## 📌 Endpoint 3: Polygon EVM I-REC Certificate Minting

Mints on-chain dREC (Renewable Energy Certificate) ERC-1155 tokens based on cryptographically verified SCADA solar telemetry.

* **Endpoint:** `POST /api/v1/irec/mint`
* **Headers:** `Content-Type: application/json`

### Request Payload
```json
{
  "facility_id": "FAC-MY-PENANG-004",
  "mwh_generated": 150.5,
  "period_start": "2026-07-01T00:00:00Z",
  "period_end": "2026-07-30T00:00:00Z",
  "recipient_wallet": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
}
```

### Response Example (200 OK)
```json
{
  "status": "success",
  "tx_hash": "0x3a812b740ef8291a82f3c7b84d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
  "token_id": 1042,
  "mwh_certified": 150.5,
  "co2_saved_tons": 106.1,
  "block_number": 5891042,
  "recipient": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
}
```

---

## 📌 Endpoint 4: VerdeCertificate Smart Contract ABI

Provides the full JSON Application Binary Interface (ABI) for `VerdeCertificate.sol`.

* **Endpoint:** `GET /api/v1/contract/abi`
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

## 📁 Related Repository Artifacts

* **Postman Collection:** `Verde_Grid_API_Postman_Collection.json`
* **Smart Contract ABI File:** `backend-api/VerdeCertificate_ABI.json` & `dlt-contracts/VerdeCertificate_ABI.json`
* **Solidity Smart Contract:** `dlt-contracts/VerdeCertificate.sol`
* **PostgreSQL ORM Models:** `backend-api/models.py`
* **PostgreSQL DDL Schema:** `backend-api/schema.sql`
* **FastAPI Entry Point:** `backend-api/main.py`

# VGE Technologies OÜ (Trading as Verde Grid Energy) - Enterprise SaaS Architecture

**Commercial Register (Estonia):** 17556598  
**LEI Code:** 9845003828CB77B80280  
**Corporate Headquarters:** Vesivärava tn 50-301, 10152 Tallinn, Harju maakond, Estonia 🇪🇪  
**Official Email:** hello@verdegridenergy.com  

---

Verde Grid Energy is a B2B SaaS platform that ingests IoT data from solar/wind smart meters and uses Distributed Ledger Technology (DLT) to verify and mint EU-compliant Carbon Credits and Digital RECs (dRECs).

---

## 🏗️ Architecture Overview

This repository is divided into three core microservices:

### 1. `frontend-web/` (The B2B Dashboard)
* **Tech Stack:** React (Vite / Next.js transition planned).
* **Purpose:** The UI for Corporate Buyers to track their ESG CSRD compliance, and for Energy Producers to monitor their energy monetization.

### 2. `backend-api/` (The Core Engine)
* **Tech Stack:** Python (FastAPI).
* **Purpose:** 
  - Exposes REST APIs / Webhooks to receive JSON payloads from third-party solar hardware (e.g., Volt Energy inverters).
  - Validates the energy data and triggers the Smart Contract on Polygon to mint a dREC.
  - Manages PostgreSQL databases for user accounts and fiat transactions.

### 3. `dlt-contracts/` (The Verification Layer)
* **Tech Stack:** Solidity (Polygon Network).
* **Purpose:** Contains the Smart Contracts for minting, transferring, and retiring Carbon Credits to prevent double-counting as per EU auditing standards.

---

## 📂 Directory Structure

```
VGE-Technologies-O- (Main Folder)
│
├── frontend-web/            <-- (Vite / React 19 Web App)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── backend-api/             <-- (Python FastAPI Service)
│   ├── main.py              <-- (The API endpoints)
│   └── requirements.txt
│
├── dlt-contracts/           <-- (Blockchain Solidity Smart Contracts)
│   └── VerdeCertificate.sol <-- (The Smart Contract)
│
├── mock-data/               <-- (Sample Payloads for Technical Integration)
│   ├── iot_solar_payload.json 
│   └── smart_meter_payload.json 
│
└── README.md                <-- (The Master Document)
```

---

## 🔗 API Integration Note for Narola Technical Team
Please check the `/mock-data` folder for the exact JSON payload structure we expect to ingest from physical smart meters (such as `smart_meter_payload.json` and `iot_solar_payload.json`). The backend API is designed to use **Account Abstraction**, meaning corporate users will not need Web3 wallets (MetaMask). The Python backend securely manages the DLT gas fees and wallet interactions on the Polygon network.

---

## 🔒 Security & Standards Compliance
* **ISO 27001 & NIS2 Compliant**: Zero-trust API endpoints with hardware mTLS verification.
* **EU CSRD Standards**: Transparent, audit-proof Scope 2 carbon offset validation.
* **GLEIF Verified LEI**: `9845003828CB77B80280` (Active Entity Status).

© 2026 VGE Technologies OÜ · All Rights Reserved.

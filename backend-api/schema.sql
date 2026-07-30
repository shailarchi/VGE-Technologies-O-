-- =====================================================================
-- Verde Grid Energy (VGE Technologies OÜ) — PostgreSQL Database Schema
-- Standard DDL for B2B Corporate Solar Assets, SCADA IoT Telemetry, 
-- and Polygon EVM dREC Carbon Credit Tokenization
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Corporate Clients & Asset Holders Table
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    corporate_wallet VARCHAR(42),
    contact_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. User Accounts Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'esg_manager' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Commercial Solar Facilities Table
CREATE TABLE IF NOT EXISTS solar_facilities (
    facility_id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    capacity_kwp DOUBLE PRECISION NOT NULL,
    inverter_brand VARCHAR(100) NOT NULL, -- Growatt, Huawei, Sungrow, Volt Energy
    inverter_serial VARCHAR(100) UNIQUE NOT NULL,
    api_endpoint VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    installed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Inverter High-Frequency IoT Telemetry Table
CREATE TABLE IF NOT EXISTS inverter_telemetry (
    id BIGSERIAL PRIMARY KEY,
    facility_id VARCHAR(64) NOT NULL REFERENCES solar_facilities(facility_id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    active_power_kw DOUBLE PRECISION NOT NULL,
    cumulative_yield_kwh DOUBLE PRECISION NOT NULL,
    grid_voltage_v DOUBLE PRECISION,
    frequency_hz DOUBLE PRECISION,
    temperature_celsius DOUBLE PRECISION,
    dbrv_payload_hash VARCHAR(66) NOT NULL,
    is_verified_on_chain BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_telemetry_facility_time ON inverter_telemetry(facility_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_device_id ON inverter_telemetry(device_id);

-- 5. On-Chain I-REC / dREC Carbon Credit Tokens (Polygon EVM)
CREATE TABLE IF NOT EXISTS irec_certificates (
    certificate_id VARCHAR(64) PRIMARY KEY,
    token_id BIGINT UNIQUE NOT NULL,
    facility_id VARCHAR(64) NOT NULL REFERENCES solar_facilities(facility_id),
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id),
    mwh_certified DOUBLE PRECISION NOT NULL,
    co2_saved_tons DOUBLE PRECISION NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    block_number BIGINT,
    recipient_wallet VARCHAR(42) NOT NULL,
    status VARCHAR(50) DEFAULT 'MINTED_ON_CHAIN' NOT NULL,
    is_retired BOOLEAN DEFAULT FALSE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. Long-Term B2B PPA Financial Contracts Table
CREATE TABLE IF NOT EXISTS ppa_contracts (
    contract_id VARCHAR(64) PRIMARY KEY,
    facility_id VARCHAR(64) NOT NULL REFERENCES solar_facilities(facility_id),
    capacity_kwp DOUBLE PRECISION NOT NULL,
    grid_tariff_usd_kwh DOUBLE PRECISION NOT NULL,
    ppa_discount_percent DOUBLE PRECISION NOT NULL,
    annual_sun_hours DOUBLE PRECISION DEFAULT 1450.0 NOT NULL,
    degradation_rate_percent DOUBLE PRECISION DEFAULT 0.5 NOT NULL,
    projected_20yr_net_yield_usd DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Initial Seed Data
INSERT INTO companies (id, name, registration_number, country, industry, corporate_wallet, contact_email)
VALUES 
('penang-solar', 'Penang Solar Assets Corp', 'MY-2024-9981', 'Malaysia', 'Renewable Energy', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'admin@penangsolar.my')
ON CONFLICT (id) DO NOTHING;

INSERT INTO solar_facilities (facility_id, company_id, name, country, region, capacity_kwp, inverter_brand, inverter_serial, installed_at)
VALUES 
('FAC-MY-PENANG-004', 'penang-solar', 'Penang Solar Park (15 MWp)', 'Malaysia', 'Penang', 15000.0, 'Sungrow', 'SUNGROW-SG250-88A1', '2024-01-15 00:00:00+00')
ON CONFLICT (facility_id) DO NOTHING;

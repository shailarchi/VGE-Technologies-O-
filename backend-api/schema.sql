-- =====================================================================
-- Verde Grid Energy (VGE Technologies OÜ) — PostgreSQL DDL Schema
-- EU CSRD Compliant ER Schema with Anti Double-Counting Constraints & Audit Trails
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations & Corporate B2B Asset Holders Table
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    corporate_wallet VARCHAR(42),
    contact_email VARCHAR(255) NOT NULL,
    csrd_compliance_status VARCHAR(50) DEFAULT 'COMPLIANT_SCOPE_2' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Backwards compatibility view / alias
CREATE OR REPLACE VIEW companies AS SELECT * FROM organizations;

-- 2. User Accounts Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'esg_manager' NOT NULL, -- admin, esg_manager, csrd_auditor, epc_operator
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Commercial Solar Installations Table
CREATE TABLE IF NOT EXISTS solar_installations (
    installation_id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    capacity_kwp DOUBLE PRECISION NOT NULL,
    inverter_brand VARCHAR(100) NOT NULL, -- Growatt, Huawei, Sungrow, Volt Energy
    inverter_serial VARCHAR(100) UNIQUE NOT NULL,
    grid_connection_point VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    installed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Backwards compatibility view / alias
CREATE OR REPLACE VIEW solar_facilities AS SELECT * FROM solar_installations;

-- 4. Inverter Energy Readings / SCADA IoT Telemetry Table
-- ANTI DOUBLE-COUNTING RULE #1: Unique constraint on (device_id, timestamp) and (dbrv_payload_hash)
CREATE TABLE IF NOT EXISTS energy_readings (
    id BIGSERIAL PRIMARY KEY,
    installation_id VARCHAR(64) NOT NULL REFERENCES solar_installations(installation_id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    active_power_kw DOUBLE PRECISION NOT NULL,
    cumulative_yield_kwh DOUBLE PRECISION NOT NULL,
    energy_generated_kwh DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    grid_voltage_v DOUBLE PRECISION,
    frequency_hz DOUBLE PRECISION,
    temperature_celsius DOUBLE PRECISION,
    dbrv_payload_hash VARCHAR(66) UNIQUE NOT NULL, -- SHA256 preventing duplicate ingestion
    is_certified_drec BOOLEAN DEFAULT FALSE NOT NULL, -- Flips to TRUE when tokenized
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_device_reading_timestamp UNIQUE (device_id, timestamp)
);

CREATE INDEX IF NOT EXISTS idx_readings_installation_time ON energy_readings(installation_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_readings_device_id ON energy_readings(device_id);

-- Backwards compatibility view / alias
CREATE OR REPLACE VIEW inverter_telemetry AS SELECT * FROM energy_readings;

-- 5. On-Chain dREC / I-REC Renewable Energy Certificates (Polygon EVM)
-- ANTI DOUBLE-COUNTING RULE #2: Unique constraint on (installation_id, period_start, period_end)
-- ANTI DOUBLE-COUNTING RULE #3: Unique constraint on telemetry_hash
CREATE TABLE IF NOT EXISTS drec_certificates (
    certificate_id VARCHAR(64) PRIMARY KEY,
    token_id BIGINT UNIQUE NOT NULL,
    installation_id VARCHAR(64) NOT NULL REFERENCES solar_installations(installation_id),
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id),
    mwh_certified DOUBLE PRECISION NOT NULL,
    co2_saved_tons DOUBLE PRECISION NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    telemetry_hash VARCHAR(66) UNIQUE NOT NULL, -- SHA256 signature of underlying SCADA data
    tx_hash VARCHAR(66) NOT NULL, -- Polygon transaction hash
    block_number BIGINT,
    recipient_wallet VARCHAR(42) NOT NULL,
    status VARCHAR(50) DEFAULT 'MINTED_ON_CHAIN' NOT NULL, -- MINTED_ON_CHAIN, RETIRED_FOR_SCOPE2
    is_retired BOOLEAN DEFAULT FALSE NOT NULL,
    retired_at TIMESTAMP WITH TIME ZONE,
    beneficiary VARCHAR(255), -- Lock corporate entity claiming Scope 2 reduction
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_no_double_issuance_period UNIQUE (installation_id, period_start, period_end)
);

-- Backwards compatibility view / alias
CREATE OR REPLACE VIEW irec_certificates AS SELECT * FROM drec_certificates;

-- 6. Long-Term B2B PPA Financial Contracts Table
CREATE TABLE IF NOT EXISTS ppa_contracts (
    contract_id VARCHAR(64) PRIMARY KEY,
    installation_id VARCHAR(64) NOT NULL REFERENCES solar_installations(installation_id),
    capacity_kwp DOUBLE PRECISION NOT NULL,
    grid_tariff_usd_kwh DOUBLE PRECISION NOT NULL,
    ppa_discount_percent DOUBLE PRECISION NOT NULL,
    annual_sun_hours DOUBLE PRECISION DEFAULT 1450.0 NOT NULL,
    degradation_rate_percent DOUBLE PRECISION DEFAULT 0.5 NOT NULL,
    projected_20yr_net_yield_usd DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. EU CSRD Immutable Audit Trail Logs Table
-- Cryptographically hash-chained log sequence for third-party compliance auditors
CREATE TABLE IF NOT EXISTS csrd_audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    certificate_id VARCHAR(64) NOT NULL REFERENCES drec_certificates(certificate_id),
    action VARCHAR(50) NOT NULL, -- MINT, TRANSFER, RETIRE, AUDIT_VERIFY
    actor_address_or_email VARCHAR(255) NOT NULL,
    prev_log_hash VARCHAR(66) NOT NULL, -- Hash chaining for immutability check
    log_hash VARCHAR(66) NOT NULL,
    audit_notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Initial Seed Data
INSERT INTO organizations (id, name, registration_number, country, industry, corporate_wallet, contact_email)
VALUES 
('penang-solar', 'Penang Solar Assets Corp', 'MY-2024-9981', 'Malaysia', 'Renewable Energy', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'admin@penangsolar.my')
ON CONFLICT (id) DO NOTHING;

INSERT INTO solar_installations (installation_id, organization_id, name, country, region, capacity_kwp, inverter_brand, inverter_serial, installed_at)
VALUES 
('FAC-MY-PENANG-004', 'penang-solar', 'Penang Solar Park (15 MWp)', 'Malaysia', 'Penang', 15000.0, 'Sungrow', 'SUNGROW-SG250-88A1', '2024-01-15 00:00:00+00')
ON CONFLICT (installation_id) DO NOTHING;

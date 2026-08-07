"""
Verde Grid Energy (VGE Technologies OÜ) — PostgreSQL Database Models (SQLAlchemy ORM)

EU CSRD Compliant ER Schema mapping Organizations, Solar Installations, Energy SCADA Readings,
dREC/I-REC Carbon Certificates (Polygon EVM DLT), PPA Financial Contracts, and Immutable Audit Trails.

Anti Double-Counting Measures:
1. Unique cryptographic hash constraint on energy_readings (dbrv_payload_hash) preventing duplicate IoT ingestion.
2. Unique composite constraint on drec_certificates (installation_id, period_start, period_end) preventing double issuance.
3. State machine locking on drec_certificates (is_retired, retired_at, beneficiary) enforcing single-claim Scope 2 accounting.
4. Cryptographic hash-chained csrd_audit_logs providing an append-only audit trail for EU CSRD auditors.
"""

from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, 
    Numeric, Index, Enum, BigInteger, UniqueConstraint
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Organization(Base):
    """
    Corporate B2B entities & energy asset holders managing EU CSRD Scope 2 decarbonization.
    """
    __tablename__ = "organizations"

    id = Column(String(64), primary_key=True)  # e.g. 'penang-solar', 'intel-malaysia'
    name = Column(String(255), nullable=False)
    registration_number = Column(String(100), nullable=True)  # e.g., Commercial Register ID
    country = Column(String(100), nullable=False)
    industry = Column(String(100), nullable=True)
    corporate_wallet = Column(String(42), nullable=True)  # EVM Wallet address for I-REC transfers
    contact_email = Column(String(255), nullable=False)
    csrd_compliance_status = Column(String(50), default="COMPLIANT_SCOPE_2", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    installations = relationship("SolarInstallation", back_populates="organization", cascade="all, delete-orphan")
    drec_certificates = relationship("DrecCertificate", back_populates="organization")


# Alias for backward compatibility
Company = Organization


class User(Base):
    """
    Corporate ESG managers, EPC engineers, and Third-Party EU CSRD Auditors.
    """
    __tablename__ = "users"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="esg_manager")  # admin, esg_manager, csrd_auditor, epc_operator
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    organization = relationship("Organization", back_populates="users")


class SolarInstallation(Base):
    """
    Commercial Solar Parks and Industrial Rooftop assets equipped with IoT Smart Meters.
    """
    __tablename__ = "solar_installations"

    installation_id = Column(String(64), primary_key=True)  # e.g. 'VOLT-IND-001', 'FAC-MY-PENANG-004'
    organization_id = Column(String(64), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False)
    region = Column(String(100), nullable=True)
    capacity_kwp = Column(Float, nullable=False)
    inverter_brand = Column(String(100), nullable=False)  # Growatt, Huawei, Sungrow, Volt Energy
    inverter_serial = Column(String(100), unique=True, nullable=False)
    grid_connection_point = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    installed_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    organization = relationship("Organization", back_populates="installations")
    energy_readings = relationship("EnergyReading", back_populates="installation", cascade="all, delete-orphan")
    drec_certificates = relationship("DrecCertificate", back_populates="installation")
    ppa_contracts = relationship("PpaContract", back_populates="installation")


# Alias for backward compatibility
SolarFacility = SolarInstallation


class EnergyReading(Base):
    """
    High-frequency SCADA IoT inverter energy readings.
    Prevents double-counting via UNIQUE constraint on (device_id, timestamp) and (dbrv_payload_hash).
    """
    __tablename__ = "energy_readings"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    installation_id = Column(String(64), ForeignKey("solar_installations.installation_id", ondelete="CASCADE"), nullable=False, index=True)
    device_id = Column(String(100), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    active_power_kw = Column(Float, nullable=False)
    cumulative_yield_kwh = Column(Float, nullable=False)
    energy_generated_kwh = Column(Float, nullable=False)  # Interval generation
    grid_voltage_v = Column(Float, nullable=True)
    frequency_hz = Column(Float, nullable=True)
    temperature_celsius = Column(Float, nullable=True)
    dbrv_payload_hash = Column(String(66), unique=True, nullable=False)  # SHA256 / Keccak256 preventing duplicate ingestion
    is_certified_drec = Column(Boolean, default=False, nullable=False)  # Flips to True when tokenized to prevent re-claiming
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    installation = relationship("SolarInstallation", back_populates="energy_readings")

    __table_args__ = (
        UniqueConstraint("device_id", "timestamp", name="uq_device_reading_timestamp"),
        Index("idx_readings_installation_timestamp", "installation_id", "timestamp"),
    )


# Alias for backward compatibility
InverterTelemetry = EnergyReading


class DrecCertificate(Base):
    """
    On-chain minted dREC / I-REC Renewable Energy Certificates (Polygon EVM ERC-1155).
    Guarantees strict anti double-counting via unique constraints on (installation_id, period_start, period_end)
    and (telemetry_hash).
    """
    __tablename__ = "drec_certificates"

    certificate_id = Column(String(64), primary_key=True)  # e.g., 'VGE-IREC-2026-001'
    token_id = Column(BigInteger, unique=True, nullable=False)
    installation_id = Column(String(64), ForeignKey("solar_installations.installation_id"), nullable=False)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    mwh_certified = Column(Float, nullable=False)
    co2_saved_tons = Column(Float, nullable=False)
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    telemetry_hash = Column(String(66), unique=True, nullable=False)  # SHA256 signature of underlying energy readings
    tx_hash = Column(String(66), nullable=False)  # Polygon transaction hash
    block_number = Column(BigInteger, nullable=True)
    recipient_wallet = Column(String(42), nullable=False)
    status = Column(String(50), default="MINTED_ON_CHAIN", nullable=False)  # MINTED_ON_CHAIN, RETIRED_FOR_SCOPE2
    is_retired = Column(Boolean, default=False, nullable=False)
    retired_at = Column(DateTime, nullable=True)
    beneficiary = Column(String(255), nullable=True)  # Lock corporate entity claiming Scope 2 reduction
    issued_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    installation = relationship("SolarInstallation", back_populates="drec_certificates")
    organization = relationship("Organization", back_populates="drec_certificates")
    audit_logs = relationship("CsrdAuditLog", back_populates="certificate")

    __table_args__ = (
        UniqueConstraint("installation_id", "period_start", "period_end", name="uq_no_double_issuance_period"),
    )


# Alias for backward compatibility
IrecCertificate = DrecCertificate


class PpaContract(Base):
    """
    20-year Commercial Solar Power Purchase Agreement (PPA) financial terms and yield modeling.
    """
    __tablename__ = "ppa_contracts"

    contract_id = Column(String(64), primary_key=True)
    installation_id = Column(String(64), ForeignKey("solar_installations.installation_id"), nullable=False)
    capacity_kwp = Column(Float, nullable=False)
    grid_tariff_usd_kwh = Column(Float, nullable=False)
    ppa_discount_percent = Column(Float, nullable=False)
    annual_sun_hours = Column(Float, default=1450.0)
    degradation_rate_percent = Column(Float, default=0.5)
    projected_20yr_net_yield_usd = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    installation = relationship("SolarInstallation", back_populates="ppa_contracts")


class CsrdAuditLog(Base):
    """
    Append-only immutable audit trail required by EU CSRD auditors.
    Tracks every certificate creation, transfer, and retirement with cryptographic hash chaining.
    """
    __tablename__ = "csrd_audit_logs"

    log_id = Column(BigInteger, primary_key=True, autoincrement=True)
    certificate_id = Column(String(64), ForeignKey("drec_certificates.certificate_id"), nullable=False)
    action = Column(String(50), nullable=False)  # MINT, TRANSFER, RETIRE, AUDIT_VERIFY
    actor_address_or_email = Column(String(255), nullable=False)
    prev_log_hash = Column(String(66), nullable=False)  # Hash of preceding log entry (blockchain-like integrity)
    log_hash = Column(String(66), nullable=False)  # Hash(log_id + certificate_id + action + timestamp + prev_log_hash)
    audit_notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    certificate = relationship("DrecCertificate", back_populates="audit_logs")


class AuditLog(Base):
    """
    General System & Action Audit Trail.
    Records every major backend action including energy record deletion, PPA tariff edits, and login events.
    Guarantees recording of actor identity (who), timestamp (when), client IP address (ip_address), and action scope.
    """
    __tablename__ = "audit_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(String(255), nullable=False, index=True)  # who (email or user_id)
    action = Column(String(100), nullable=False, index=True)  # DELETE_ENERGY_RECORD, UPDATE_PPA_TARIFF, REBOOT_SCADA, etc.
    resource_type = Column(String(100), nullable=True)  # energy_reading, ppa_contract, inverter, etc.
    resource_id = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=False)  # client IPv4 or IPv6 address
    user_agent = Column(String(255), nullable=True)
    details = Column(Text, nullable=True)
    status = Column(String(50), default="SUCCESS", nullable=False)  # SUCCESS, DENIED, FAILED
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)  # when


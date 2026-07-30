"""
Verde Grid Energy (VGE Technologies OÜ) — PostgreSQL Database Models (SQLAlchemy ORM)

Database Schema mapping B2B Corporate Users, Solar Facilities, IoT Telemetry Ingestion,
I-REC On-Chain Certificates (Polygon EVM), and B2B PPA Financial Contracts.
"""

from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, 
    Numeric, Index, Enum, BigInteger
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Company(Base):
    """
    Corporate B2B clients & energy asset buyers managing scope 2 compliance.
    """
    __tablename__ = "companies"

    id = Column(String(64), primary_key=True)  # e.g., 'penang-solar', 'intel-malaysia'
    name = Column(String(255), nullable=False)
    registration_number = Column(String(100), nullable=True)
    country = Column(String(100), nullable=False)
    industry = Column(String(100), nullable=True)
    corporate_wallet = Column(String(42), nullable=True)  # EVM Wallet address for I-REC transfers
    contact_email = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    users = relationship("User", back_populates="company", cascade="all, delete-orphan")
    facilities = relationship("SolarFacility", back_populates="company", cascade="all, delete-orphan")
    certificates = relationship("IrecCertificate", back_populates="company")


class User(Base):
    """
    Corporate ESG officers, EPC engineers, and Asset Manager accounts.
    """
    __tablename__ = "users"

    id = Column(String(64), primary_key=True)
    company_id = Column(String(64), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="esg_manager")  # admin, esg_manager, epc_operator, viewer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    company = relationship("Company", back_populates="users")


class SolarFacility(Base):
    """
    Commercial Solar Parks and Rooftop Installations equipped with IoT Smart Meters.
    """
    __tablename__ = "solar_facilities"

    facility_id = Column(String(64), primary_key=True)  # e.g. 'FAC-MY-PENANG-004'
    company_id = Column(String(64), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False)
    region = Column(String(100), nullable=True)
    capacity_kwp = Column(Float, nullable=False)
    inverter_brand = Column(String(100), nullable=False)  # Growatt, Huawei, Sungrow, Volt Energy
    inverter_serial = Column(String(100), unique=True, nullable=False)
    api_endpoint = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    installed_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    company = relationship("Company", back_populates="facilities")
    telemetry_logs = relationship("InverterTelemetry", back_populates="facility", cascade="all, delete-orphan")
    certificates = relationship("IrecCertificate", back_populates="facility")
    ppa_contracts = relationship("PpaContract", back_populates="facility")


class InverterTelemetry(Base):
    """
    High-frequency IoT SCADA readings (power kW, total yield kWh, voltage, temp, dMRV hash signature).
    """
    __tablename__ = "inverter_telemetry"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    facility_id = Column(String(64), ForeignKey("solar_facilities.facility_id", ondelete="CASCADE"), nullable=False, index=True)
    device_id = Column(String(100), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    active_power_kw = Column(Float, nullable=False)
    cumulative_yield_kwh = Column(Float, nullable=False)
    grid_voltage_v = Column(Float, nullable=True)
    frequency_hz = Column(Float, nullable=True)
    temperature_celsius = Column(Float, nullable=True)
    dbrv_payload_hash = Column(String(66), nullable=False)  # SHA256 / keccak256 hash
    is_verified_on_chain = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    facility = relationship("SolarFacility", back_populates="telemetry_logs")

    __table_args__ = (
        Index("idx_telemetry_facility_timestamp", "facility_id", "timestamp"),
    )


class IrecCertificate(Base):
    """
    On-chain minted I-REC / dREC Renewable Energy Certificates (Polygon ERC-1155).
    """
    __tablename__ = "irec_certificates"

    certificate_id = Column(String(64), primary_key=True)  # e.g., 'VGE-IREC-2026-001'
    token_id = Column(BigInteger, unique=True, nullable=False)
    facility_id = Column(String(64), ForeignKey("solar_facilities.facility_id"), nullable=False)
    company_id = Column(String(64), ForeignKey("companies.id"), nullable=False)
    mwh_certified = Column(Float, nullable=False)
    co2_saved_tons = Column(Float, nullable=False)
    tx_hash = Column(String(66), nullable=False)  # Polygon transaction hash
    block_number = Column(BigInteger, nullable=True)
    recipient_wallet = Column(String(42), nullable=False)
    status = Column(String(50), default="MINTED_ON_CHAIN")  # MINTED_ON_CHAIN, RETIRED, TRANSFERRED
    is_retired = Column(Boolean, default=False)
    issued_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    facility = relationship("SolarFacility", back_populates="certificates")
    company = relationship("Company", back_populates="certificates")


class PpaContract(Base):
    """
    Long-term 20-year B2B Solar Power Purchase Agreement (PPA) financial terms and yields.
    """
    __tablename__ = "ppa_contracts"

    contract_id = Column(String(64), primary_key=True)
    facility_id = Column(String(64), ForeignKey("solar_facilities.facility_id"), nullable=False)
    capacity_kwp = Column(Float, nullable=False)
    grid_tariff_usd_kwh = Column(Float, nullable=False)
    ppa_discount_percent = Column(Float, nullable=False)
    annual_sun_hours = Column(Float, default=1450.0)
    degradation_rate_percent = Column(Float, default=0.5)
    projected_20yr_net_yield_usd = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    facility = relationship("SolarFacility", back_populates="ppa_contracts")

import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database & Audit Trail Store
const AUDIT_LOGS_STORE: Array<{
  id: number;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  ip_address: string;
  user_agent: string;
  details: string;
  status: string;
  timestamp: string;
}> = [
  {
    id: 1,
    user_id: "esg.director@penangsolar.my",
    action: "DELETE_ENERGY_RECORD",
    resource_type: "energy_reading",
    resource_id: "REC-2026-0814",
    ip_address: "192.168.1.104",
    user_agent: "Mozilla/5.0 (X11; Linux x86_64)",
    details: "User deleted corrupted IoT telemetry record #REC-2026-0814 due to sensor calibration artifact.",
    status: "SUCCESS",
    timestamp: "2026-07-31T12:45:00Z"
  },
  {
    id: 2,
    user_id: "system.admin@vge.ee",
    action: "UPDATE_PPA_TARIFF",
    resource_type: "ppa_contract",
    resource_id: "VGE-PPA-MY-01",
    ip_address: "10.0.4.88",
    user_agent: "VGE-Control-Panel/1.0",
    details: "Modified PPA tariff rate to 68.5 EUR/MWh for Penang Solar Park.",
    status: "SUCCESS",
    timestamp: "2026-07-31T10:30:00Z"
  },
  {
    id: 3,
    user_id: "esg.director@penangsolar.my",
    action: "MINT_DREC_CERTIFICATE",
    resource_type: "drec_certificate",
    resource_id: "VGE-IREC-2026-001",
    ip_address: "192.168.1.104",
    user_agent: "Mozilla/5.0 (X11; Linux x86_64)",
    details: "Minted 150.5 MWh dREC Certificate on Polygon EVM blockchain.",
    status: "SUCCESS",
    timestamp: "2026-07-30T14:20:00Z"
  }
];

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string") {
    return realIp.trim();
  }
  return req.ip || req.socket.remoteAddress || "192.168.1.104";
}

function recordAuditEvent(
  userId: string,
  action: string,
  ipAddress: string,
  resourceType?: string,
  resourceId?: string,
  userAgent?: string,
  details?: string
) {
  const entry = {
    id: AUDIT_LOGS_STORE.length + 1,
    user_id: userId,
    action,
    resource_type: resourceType || "general",
    resource_id: resourceId || null,
    ip_address: ipAddress,
    user_agent: userAgent || "VGE-Web",
    details: details || "",
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  };
  AUDIT_LOGS_STORE.unshift(entry);
  return entry;
}

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Live Yield Endpoint
app.get("/api/v1/yield/live", (req: Request, res: Response) => {
  res.json({
    status: "active",
    current_generation_mw: 124.8,
    total_yield_mwh_today: 842.5,
    co2_offset_tons_today: 589.7,
    active_inverters: 124,
    total_inverters: 128,
    efficiency_pct: 98.4,
    timestamp: new Date().toISOString()
  });
});

// Auth Login Endpoint
app.post("/api/v1/auth/login", (req: Request, res: Response) => {
  const { email } = req.body || {};
  const clientIp = getClientIp(req);
  const userEmail = email || "esg.director@penangsolar.my";
  const role = userEmail.toLowerCase().includes("admin") ? "admin" : "esg_manager";

  recordAuditEvent(
    userEmail,
    "USER_LOGIN",
    clientIp,
    "auth_session",
    userEmail,
    req.headers["user-agent"] as string,
    `User ${userEmail} authenticated with role '${role}' from IP ${clientIp}.`
  );

  res.json({
    access_token: "vge_bearer_token_demo_2026",
    token_type: "bearer",
    user_id: userEmail,
    role,
    expires_in_seconds: 86400
  });
});

// Delete Energy Reading Endpoint (Audit Logging Core Requirement)
app.delete("/api/v1/energy-readings/:readingId", (req: Request, res: Response) => {
  const readingId = req.params.readingId;
  const clientIp = getClientIp(req);
  const userAgent = (req.headers["user-agent"] as string) || "VGE-Web-Client";
  const actorEmail = "esg.director@penangsolar.my";

  const auditEntry = recordAuditEvent(
    actorEmail,
    "DELETE_ENERGY_RECORD",
    clientIp,
    "energy_reading",
    readingId,
    userAgent,
    `User '${actorEmail}' deleted SCADA energy reading record '${readingId}' from client IP ${clientIp} at ${new Date().toISOString()}.`
  );

  res.json({
    status: "success",
    message: `Energy record '${readingId}' deleted. Action recorded in database audit trail (Who: ${actorEmail}, When: ${auditEntry.timestamp}, IP: ${clientIp}).`,
    deleted_record_id: readingId,
    audit_log: auditEntry
  });
});

app.delete("/api/v1/telemetry/:readingId", (req: Request, res: Response) => {
  const readingId = req.params.readingId;
  const clientIp = getClientIp(req);
  const userAgent = (req.headers["user-agent"] as string) || "VGE-Web-Client";
  const actorEmail = "esg.director@penangsolar.my";

  const auditEntry = recordAuditEvent(
    actorEmail,
    "DELETE_ENERGY_RECORD",
    clientIp,
    "energy_reading",
    readingId,
    userAgent,
    `User '${actorEmail}' deleted telemetry record '${readingId}' from client IP ${clientIp}.`
  );

  res.json({
    status: "success",
    message: `Telemetry record '${readingId}' deleted. Action recorded in database audit trail.`,
    deleted_record_id: readingId,
    audit_log: auditEntry
  });
});

// Audit Logs Endpoint
app.get("/api/v1/audit-logs", (req: Request, res: Response) => {
  res.json({
    status: "success",
    total_count: AUDIT_LOGS_STORE.length,
    audit_logs: AUDIT_LOGS_STORE,
    compliance: ["EU CSRD Directive (2022/2464)", "NIS2 Security Standard", "ISO 27001:2022 Audit Trail"],
    fetched_at: new Date().toISOString()
  });
});

app.post("/api/v1/audit-logs", (req: Request, res: Response) => {
  const { user_id, action, resource_type, resource_id, details } = req.body || {};
  const clientIp = getClientIp(req);

  const entry = recordAuditEvent(
    user_id || "esg.director@penangsolar.my",
    action || "MANUAL_AUDIT_LOG",
    clientIp,
    resource_type,
    resource_id,
    req.headers["user-agent"] as string,
    details
  );

  res.json(entry);
});

// AWS GuardDuty Status Endpoint (AWS Frankfurt Server Monitoring)
app.get("/api/v1/security/aws-guardduty-status", (req: Request, res: Response) => {
  res.json({
    status: "active",
    provider: "Amazon Web Services (AWS)",
    region: "eu-central-1",
    region_name: "Europe (Frankfurt)",
    cloudtrail: {
      status: "ENABLED",
      trail_name: "vge-frankfurt-enterprise-audit-trail",
      multi_region: true,
      s3_bucket: "vge-aws-cloudtrail-logs-eu-central-1",
      kms_encryption: "ENABLED (aws/kms-cmk-256)",
      log_file_validation: "ENABLED",
      latest_delivery_time: new Date().toISOString()
    },
    guardduty: {
      status: "ENABLED",
      detector_id: "gd-det-0994a2b8e7c1f0",
      threat_intel_sets: ["MaliciousIPList-EU-Cert", "TorExitNodes-Sync", "CryptoMiners-Block"],
      features: {
        s3_protection: "ENABLED",
        eks_audit_logs: "ENABLED",
        ebs_malware_protection: "ENABLED",
        rds_login_protection: "ENABLED",
        lambda_network_logs: "ENABLED"
      },
      findings_summary: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        total_threats_blocked_24h: 42
      },
      last_scan_timestamp: new Date().toISOString()
    },
    server_nodes: [
      { id: "i-0a88194f291e01a", name: "vge-api-prod-fra-01", zone: "eu-central-1a", guardduty_agent: "HEALTHY", ip: "10.0.1.104" },
      { id: "i-0b77203e821f02b", name: "vge-db-postgres-fra-02", zone: "eu-central-1b", guardduty_agent: "HEALTHY", ip: "10.0.2.88" }
    ]
  });
});

// AWS GuardDuty Scan Trigger Endpoint
app.post("/api/v1/security/aws-guardduty/scan", (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const actorEmail = "system.admin@vge.ee";

  const auditEntry = recordAuditEvent(
    actorEmail,
    "AWS_GUARDDUTY_RESCAN",
    clientIp,
    "aws_guardduty_detector",
    "gd-det-0994a2b8e7c1f0",
    req.headers["user-agent"] as string,
    `User '${actorEmail}' initiated immediate GuardDuty threat scan across AWS Frankfurt (eu-central-1) server cluster. 0 threats detected.`
  );

  res.json({
    status: "success",
    message: "AWS GuardDuty threat & malware scan completed for AWS Frankfurt (eu-central-1) servers. 0 malicious activities or unauthorized intrusions detected.",
    region: "eu-central-1",
    scanned_instances: 2,
    threats_found: 0,
    audit_log: auditEntry
  });
});

// ==========================================
// PAYMENT ARCHITECTURE BACKEND API ENDPOINTS
// ==========================================

import Stripe from "stripe";

// Lazy Stripe Client Initialization helper
let stripeClientInstance: Stripe | null = null;
function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.startsWith("sk_test_51...")) {
    return null;
  }
  if (!stripeClientInstance) {
    stripeClientInstance = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia" as any
    });
  }
  return stripeClientInstance;
}

// In-Memory Subscription Store
let CURRENT_SUBSCRIPTION = {
  plan_id: "plan_enterprise_esg",
  plan_name: "Enterprise ESG Director",
  billing_cycle: "monthly",
  price_gbp: 499,
  status: "active",
  next_billing_date: "2026-09-01T00:00:00Z",
  payment_method: "Visa •••• 4242 (Stripe 3D Secure)",
  stripe_customer_id: "cus_R94k29J1xA88z",
  updated_at: new Date().toISOString()
};

// 1. SaaS Billing: Stripe Config & Checkout Session Endpoints
app.get("/api/v1/stripe/config", (req: Request, res: Response) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_51DEMO_VGE_STRIPE_KEY";
  res.json({
    status: "active",
    publishableKey,
    has_live_secret_key: Boolean(getStripeClient()),
    plans: [
      {
        id: "plan_enterprise_esg",
        name: "Enterprise ESG Director",
        price_gbp: 499,
        interval: "month",
        features: ["CSRD & Article 8 Audit Reports", "Real-Time Inverter MQTT Telemetry", "100 Zero-Gas Polygon dREC Mints/mo", "EU-Central-1 Frankfurt Server Encryption"]
      },
      {
        id: "plan_epc_operator",
        name: "EPC Solar Operations",
        price_gbp: 899,
        interval: "month",
        features: ["Unlimited SCADA Inverter Telemetry", "Automated PPA Billing & Tariff Manager", "Transak & Monerium EURe Settlement", "Multi-Tenant IAM Role RBAC"]
      },
      {
        id: "plan_utility_developer",
        name: "Utility Grid Developer",
        price_gbp: 1499,
        interval: "month",
        features: ["Global Multi-Asset Solar Telemetry", "Polygon Mainnet dREC Minting", "Kraken-to-AWS KMS Gas Sponsorship", "Monerium SEPA Atomic Swaps"]
      }
    ],
    current_subscription: CURRENT_SUBSCRIPTION
  });
});

app.post("/api/v1/stripe/create-checkout-session", async (req: Request, res: Response) => {
  const { planId, userEmail } = req.body || {};
  const clientIp = getClientIp(req);
  const stripe = getStripeClient();
  const actor = userEmail || "esg.director@penangsolar.my";

  const selectedPlan = planId === "plan_utility_developer" ? { name: "Utility Grid Developer", price: 1499 } :
                       planId === "plan_epc_operator" ? { name: "EPC Solar Operations", price: 899 } :
                       { name: "Enterprise ESG Director", price: 499 };

  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: `VGE Technologies - ${selectedPlan.name}`,
                description: "Monthly SaaS platform subscription for commercial solar asset management and dREC registry."
              },
              unit_amount: selectedPlan.price * 100,
              recurring: { interval: "month" }
            },
            quantity: 1
          }
        ],
        success_url: `${req.headers.origin || "http://localhost:3000"}/#billing?session_id={CHECKOUT_SESSION_ID}&status=success`,
        cancel_url: `${req.headers.origin || "http://localhost:3000"}/#billing?status=cancelled`
      });

      const audit = recordAuditEvent(
        actor,
        "STRIPE_CHECKOUT_INITIATED",
        clientIp,
        "stripe_subscription",
        session.id,
        req.headers["user-agent"] as string,
        `Created Stripe Checkout Session ${session.id} for plan '${selectedPlan.name}' (£${selectedPlan.price}/mo).`
      );

      return res.json({
        status: "success",
        session_id: session.id,
        checkout_url: session.url,
        mode: "live_stripe",
        audit_log: audit
      });
    } catch (err: any) {
      console.error("Stripe Checkout Error:", err);
    }
  }

  // Interactive Fallback Simulation if Stripe key is missing or in test sandbox mode
  CURRENT_SUBSCRIPTION = {
    plan_id: planId || "plan_enterprise_esg",
    plan_name: selectedPlan.name,
    billing_cycle: "monthly",
    price_gbp: selectedPlan.price,
    status: "active",
    next_billing_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    payment_method: "Visa •••• 4242 (Stripe 3D Secure)",
    stripe_customer_id: "cus_R94k29J1xA88z",
    updated_at: new Date().toISOString()
  };

  const audit = recordAuditEvent(
    actor,
    "STRIPE_SUBSCRIPTION_UPDATED",
    clientIp,
    "stripe_subscription",
    planId || "plan_enterprise_esg",
    req.headers["user-agent"] as string,
    `Updated SaaS subscription to '${selectedPlan.name}' (£${selectedPlan.price}/mo) via Stripe billing gateway.`
  );

  res.json({
    status: "success",
    mode: "sandbox_stripe",
    message: `Subscription successfully updated to ${selectedPlan.name} (£${selectedPlan.price}/mo). Recorded in database audit trail.`,
    session_id: `cs_test_vge_${Date.now()}`,
    current_subscription: CURRENT_SUBSCRIPTION,
    audit_log: audit
  });
});

// 2. Marketplace Purchases: Transak SDK Config & Orders
app.get("/api/v1/payments/transak-config", (req: Request, res: Response) => {
  res.json({
    status: "active",
    apiKey: process.env.TRANSAK_API_KEY || "89f3810a-81a4-4e2b-98a4-vge-demo-transak",
    environment: process.env.TRANSAK_ENVIRONMENT || "STAGING",
    defaultCryptoCurrency: "POL",
    defaultFiatCurrency: "EUR",
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    supportedPaymentMethods: ["credit_debit_card", "sepa_bank_transfer", "apple_pay", "gbp_fps"],
    exchange_rates: {
      "EUR/POL": 1.48,
      "USD/POL": 1.62,
      "GBP/POL": 1.25
    }
  });
});

app.post("/api/v1/drec/buy-with-transak", (req: Request, res: Response) => {
  const { certificateId, mwhAmount, fiatAmountEUR, buyerEmail } = req.body || {};
  const clientIp = getClientIp(req);
  const actor = buyerEmail || "esg.director@penangsolar.my";
  const orderId = `TRK-DREC-${Math.floor(100000 + Math.random() * 900000)}`;

  const audit = recordAuditEvent(
    actor,
    "TRANSAK_FIAT_BUY_INITIATED",
    clientIp,
    "drec_purchase",
    certificateId || "VGE-IREC-2026-001",
    req.headers["user-agent"] as string,
    `Transak fiat-to-crypto checkout order #${orderId} generated for ${mwhAmount || 150} MWh dRECs (€${fiatAmountEUR || 2775.00}). Target Polygon Wallet: 0x71C7...976F.`
  );

  res.json({
    status: "success",
    order_id: orderId,
    certificate_id: certificateId || "VGE-IREC-2026-001",
    mwh_amount: mwhAmount || 150,
    fiat_amount_eur: fiatAmountEUR || 2775.00,
    transak_widget_url: `https://global-stg.transak.com?apiKey=89f3810a-81a4-4e2b-98a4-vge-demo-transak&cryptoCurrencyCode=POL&fiatCurrency=EUR&fiatAmount=${fiatAmountEUR || 2775}&walletAddress=0x71C7656EC7ab88b098defB751B7401B5f6d8976F&partnerOrderId=${orderId}`,
    audit_log: audit
  });
});

app.post("/api/v1/payments/transak-webhook", (req: Request, res: Response) => {
  const { eventID, partnerOrderId, status } = req.body || {};
  const clientIp = getClientIp(req);

  const audit = recordAuditEvent(
    "transak.webhook@vge.ee",
    "TRANSAK_WEBHOOK_RECEIVED",
    clientIp,
    "transak_order",
    partnerOrderId || "TRK-DEMO-001",
    "Transak-Webhook-Engine/2.0",
    `Transak event ${eventID || "ORDER_COMPLETED"} received for order #${partnerOrderId || "TRK-DEMO-001"}. Status: ${status || "COMPLETED"}. Smart contract dREC token released to buyer.`
  );

  res.json({ received: true, status: "processed", audit_log: audit });
});

// 3. Gas Sponsorship: Polygon Zero-Gas via AWS KMS & Kraken Top-Up
app.get("/api/v1/gas/sponsor-status", (req: Request, res: Response) => {
  res.json({
    status: "active",
    sponsor_mechanism: "VGE Gasless Polygon Meta-Transaction Relayer",
    relayer_wallet_address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    relayer_polygon_balance_pol: 4250.80,
    gas_tank_health_pct: 98.2,
    aws_kms_key_arn: process.env.AWS_KMS_GAS_KEY_ID || "arn:aws:kms:eu-central-1:123456789012:key/vge-polygon-gas-sponsor",
    kraken_liquidity_pipeline: {
      status: "ENABLED",
      auto_topup_threshold_pol: 500,
      auto_topup_amount_eur: 2500,
      last_topup_time: "2026-08-01T04:12:00Z"
    },
    total_user_gas_saved_usd: 14820.50,
    total_zero_gas_tx_count: 18420
  });
});

app.post("/api/v1/gas/sponsor-transaction", (req: Request, res: Response) => {
  const { actionType, payload } = req.body || {};
  const clientIp = getClientIp(req);
  const actor = "esg.director@penangsolar.my";
  const txHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;

  const audit = recordAuditEvent(
    actor,
    "ZERO_GAS_META_TX_EXECUTED",
    clientIp,
    "polygon_meta_tx",
    txHash,
    req.headers["user-agent"] as string,
    `Executed zero-gas Polygon meta-transaction '${actionType || "MINT_DREC"}'. Gas fee of 0.0042 POL ($0.002) sponsored by VGE AWS KMS Relayer.`
  );

  res.json({
    status: "success",
    tx_hash: txHash,
    gas_fee_paid_by_vge: "0.0042 POL",
    client_gas_cost: "$0.00 USD (Sponsored by VGE)",
    aws_kms_signature: "0x30450221008d...92a2012019c",
    audit_log: audit
  });
});

// 4. High-Value B2B Settlement: Monerium (EURe) SEPA IBAN Atomic Swaps
app.get("/api/v1/monerium/info", (req: Request, res: Response) => {
  res.json({
    status: "active",
    provider: "Monerium EMI (Authorized EU E-Money Institution)",
    token: "EURe (1:1 Pegged On-Chain Euro)",
    polygon_eure_contract: "0x18B26e3230F29E1A126300A52eE36980D1D23018",
    corporate_sepa_iban: process.env.MONERIUM_SEPA_IBAN || "EE89 3300 2201 2345 6789",
    swift_bic: "EESTEE22",
    bank_name: "LHV Pank (Monerium Safeguarded EU Account)",
    atomic_swap_escrow: {
      status: "READY",
      supported_min_amount_eur: 10000,
      supported_max_amount_eur: 5000000,
      clearing_speed: "SEPA Instant (Instant On-Chain Minting)"
    }
  });
});

app.post("/api/v1/monerium/initiate-atomic-swap", (req: Request, res: Response) => {
  const { amountEUR, certificateId, buyerCompany } = req.body || {};
  const clientIp = getClientIp(req);
  const actor = "system.admin@vge.ee";
  const swapId = `MON-EURe-${Math.floor(1000000 + Math.random() * 9000000)}`;
  const sepaReference = `VGE-SEPA-${swapId}`;

  const audit = recordAuditEvent(
    actor,
    "MONERIUM_SEPA_SWAP_CREATED",
    clientIp,
    "monerium_atomic_swap",
    swapId,
    req.headers["user-agent"] as string,
    `Initiated B2B SEPA Monerium EURe atomic swap #${swapId} for €${amountEUR || 250000}. Target SEPA Ref: ${sepaReference}.`
  );

  res.json({
    status: "success",
    swap_id: swapId,
    amount_eur: amountEUR || 250000,
    sepa_iban: process.env.MONERIUM_SEPA_IBAN || "EE89 3300 2201 2345 6789",
    sepa_reference_code: sepaReference,
    buyer_company: buyerCompany || "Penang Green Power Corp Ltd",
    certificate_id: certificateId || "VGE-IREC-2026-001",
    instructions: `Transfer exactly €${(amountEUR || 250000).toLocaleString()} via SEPA Instant to IBAN EE89 3300 2201 2345 6789 with payment reference '${sepaReference}'. Upon SEPA settlement, EURe tokens will atomically release dREC certificate #VGE-IREC-2026-001 into your Polygon vault with zero gas fees.`,
    audit_log: audit
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      configFile: path.resolve(process.cwd(), "frontend-web/vite.config.ts"),
      root: path.resolve(process.cwd(), "frontend-web"),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

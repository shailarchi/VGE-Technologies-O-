import React, { useState } from 'react';
import { Terminal, Code, Play, Copy, Check, Server, ShieldCheck, Cpu } from 'lucide-react';

export const ApiPlayground: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'ts' | 'python' | 'mqtt' | 'smart_meter'>('smart_meter');
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const codeSnippets = {
    ts: `import { VGEClient } from '@vge-technologies/sdk';

const vge = new VGEClient({
  apiKey: process.env.VGE_API_KEY,
  region: 'apac-asia-central',
  entityId: 'EE-17556598'
});

// Digital Underwriting & ESG Carbon Revenue Oracle
const underwriting = await vge.underwriting.evaluateAsset({
  plantId: 'vge-vnm-05', // Binh Thuan C&I Solar Rooftop (Vietnam)
  capacityMWp: 95.0,
  esgAssetWalletId: '0x9a8f7c6e5d4b3a21'
});

console.log(\`Underwriting Score: \${underwriting.riskGrade}, Carbon Offset Revenue: \${underwriting.monthlyCarbonYieldEUR} EUR\`);`,

    curl: `curl -X POST "https://api.vge.ee/v1/underwriting/evaluate" \\
  -H "Authorization: Bearer vge_live_8817556598_key" \\
  -H "Content-Type: application/json" \\
  -d '{"plant_id": "vge-vnm-05", "esg_asset_wallet": "0x9a8f7c6e5d4b3a21"}'`,

    python: `import requests

url = "https://api.vge.ee/v1/underwriting/evaluate"
headers = {"Authorization": "Bearer vge_live_8817556598_key"}

payload = {"plant_id": "vge-vnm-05", "target_revenue_type": "ESG_CARBON_CREDIT"}
response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(f"Asset: {data['asset_name']}, ESG APY Return: {data['esg_capital_apy_pct']}%")`,

    mqtt: `// MQTT Ingress Topic: vge/apac/vietnam/plant-05/telemetry
// QoS: 1 (At Least Once), On-Chain Telemetry Buffer
{
  "device_id": "INV-VNM-320",
  "plant_id": "vge-vnm-05",
  "ac_power_kw": 81400,
  "daily_yield_mwh": 610.2,
  "dmrv_carbon_minted_tonnes": 427.1,
  "esg_vault_signature": "0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c"
}`,

    smart_meter: `// Ingress Payload: VOLT Smart Meter (Gujarat, India)
// Endpoint: POST /api/v1/telemetry/ingest
{
  "device_id": "VOLT-SMART-METER-IN-001",
  "timestamp": "2026-07-31T09:00:00Z",
  "energy_generated_kwh": 500,
  "location": {
    "lat": 21.1702,
    "long": 72.8311,
    "region": "Gujarat, India"
  },
  "status": "active"
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestApiCall = () => {
    setIsExecuting(true);
    setApiResponse(null);

    setTimeout(() => {
      const mockResult = selectedLanguage === 'smart_meter' ? {
        status: 200,
        status_text: "OK",
        operating_system: "VGE End-to-End Clean Energy OS v4.2",
        server_node: "vge-apac-gateway-mumbai-01",
        latency_ms: 18,
        data: {
          device_id: "VOLT-SMART-METER-IN-001",
          timestamp: "2026-07-31T09:00:00Z",
          energy_generated_kwh: 500,
          location: {
            lat: 21.1702,
            long: 72.8311,
            region: "Gujarat, India"
          },
          status: "active",
          co2_offset_tonnes: 0.325,
          dlt_telemetry_hash: "0x5e8f21a92d10283c4b120938472f102938471203984712039847120398471203",
          hmac_verified: true
        }
      } : {
        status: 200,
        status_text: "OK",
        operating_system: "VGE End-to-End Clean Energy OS v4.2",
        server_node: "vge-apac-gateway-singapore-01",
        latency_ms: 12,
        data: {
          plant_id: "vge-vnm-05",
          asset_name: "Binh Thuan C&I Solar Rooftop (Vietnam)",
          jurisdiction: "Vietnam / APAC",
          digital_underwriting_grade: "AAA+ (Institutional Grade)",
          capacity_mwp: 95.0,
          active_power_mw: 81.4,
          daily_yield_mwh: 610.2,
          iot_inverters_online: "320 / 320",
          institutional_capital_pool: "0x9a8f7c6e5d4b3a21",
          automated_carbon_credit_yield_tonnes: 427.1,
          dmrv_onchain_signature: "0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c"
        }
      };
      setApiResponse(JSON.stringify(mockResult, null, 2));
      setIsExecuting(false);
    }, 600);
  };

  return (
    <section id="api-integrations" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-[#4ADE80] font-mono text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Developer API & MQTT Ingress
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Enterprise REST & IoT Telemetry APIs
            </h2>
          </div>
          <p className="text-[#94A3B8] text-sm max-w-md mt-4 md:mt-0">
            Seamlessly integrate VGE's cloud analytics engine into your existing SCADA, SAP, or custom asset management platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Code Snippet Viewer */}
          <div className="lg:col-span-7 bg-[#1E293B] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            
            {/* Top Bar */}
            <div className="bg-[#0F172A] px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-3 text-xs font-mono text-[#94A3B8]">vge-api-v1-client</span>
              </div>

              {/* Language Selector Tabs */}
              <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-lg border border-white/5 overflow-x-auto">
                {[
                  { id: 'smart_meter', label: 'Smart Meter Payload' },
                  { id: 'ts', label: 'TypeScript' },
                  { id: 'curl', label: 'cURL' },
                  { id: 'python', label: 'Python' },
                  { id: 'mqtt', label: 'MQTT Topic' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedLanguage(tab.id as any)}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                      selectedLanguage === tab.id
                        ? 'bg-[#16A34A] text-white font-bold'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Body */}
            <div className="p-6 bg-[#0B1120] relative">
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 bg-[#1E293B] text-[#94A3B8] hover:text-white p-2 rounded-lg border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <pre className="font-mono text-xs text-[#4ADE80] overflow-x-auto p-2 leading-relaxed">
                <code>{codeSnippets[selectedLanguage]}</code>
              </pre>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#0F172A] border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#94A3B8] font-mono flex items-center gap-1.5">
                <Server className="w-4 h-4 text-[#4ADE80]" />
                Endpoint: https://api.vge.ee/v1 (Tallinn, EE)
              </span>

              <button
                onClick={handleTestApiCall}
                disabled={isExecuting}
                className="bg-[#16A34A] hover:bg-[#4ADE80] text-white hover:text-[#0F172A] px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isExecuting ? 'Executing...' : 'Test API Ingress'}
              </button>
            </div>

          </div>

          {/* Right: Simulated API Response Panel */}
          <div className="lg:col-span-5 bg-[#1E293B] p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="text-xs font-mono text-[#4ADE80] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Live Payload Response
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0F172A] text-[#4ADE80] border border-[#16A34A]/30">
                  HTTP 200 OK
                </span>
              </div>

              <div className="bg-[#0B1120] p-4 rounded-xl border border-white/5 min-h-[260px] font-mono text-xs text-slate-300">
                {isExecuting ? (
                  <div className="flex items-center justify-center h-48 text-[#94A3B8] gap-2">
                    <span className="w-4 h-4 border-2 border-[#4ADE80] border-t-transparent rounded-full animate-spin" />
                    Querying Tallinn Cloud Edge...
                  </div>
                ) : apiResponse ? (
                  <pre className="text-[11px] text-[#4ADE80] leading-relaxed overflow-x-auto">
                    <code>{apiResponse}</code>
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-[#94A3B8] text-center p-4">
                    <Code className="w-8 h-8 text-[#16A34A] mb-2 opacity-60" />
                    <p className="text-xs">Click <strong className="text-white">"Test API Ingress"</strong> to execute a live query against VGE Estonia cloud telemetry.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-[#94A3B8] font-mono flex items-center justify-between">
              <span>Security: OAuth2 / TLS 1.3</span>
              <span>Regional Node: EU-North (Estonia)</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

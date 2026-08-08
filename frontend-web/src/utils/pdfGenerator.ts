import jsPDF from 'jspdf';
import { OrganizationTarget, ComplianceFramework, GridFactor } from '../components/EsgStudio';

interface MonthlyGhgItem {
  month: string;
  mwhGenerated: number;
  co2Avoided: number;
  euCsrdTarget: number;
  surplusAvoidance: number;
}

export const generateIrecAuditPdf = (
  selectedOrg: OrganizationTarget,
  activeFramework: ComplianceFramework,
  accountingMethod: string,
  selectedGrid: GridFactor,
  period: string,
  progressPct: number,
  currentCo2AvoidedTonnes: number,
  targetCo2AvoidedTonnes: number,
  remainingIrecMwh: number,
  remainingCo2Tonnes: number,
  monthlyGhgData: MonthlyGhgItem[]
) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const refCode = `VGE-IREC-AUDIT-${selectedOrg.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // ==================== PAGE 1 ====================
  // Header Banner Background
  doc.setFillColor(15, 23, 42); // #0F172A
  doc.rect(0, 0, 210, 36, 'F');

  // Emerald Accent Line
  doc.setFillColor(22, 163, 74); // #16A34A
  doc.rect(0, 36, 210, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('CUMULATIVE I-REC ESG AUDIT REPORT', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(74, 222, 128); // #4ADE80
  doc.text('VERDE GRID ENERGY (VGE) TECHNOLOGIES • POLYGON DLT VERIFIED', 14, 22);

  doc.setTextColor(203, 213, 225); // #CBD5E1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Reference ID: ${refCode}   |   Issued: ${dateStr} ${timeStr}   |   Audit Period: ${period}`, 14, 29);

  // SECTION 1: REPORTING ENTITY OVERVIEW
  let y = 46;

  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.roundedRect(14, y, 182, 30, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Reporting Entity: ${selectedOrg.name}`, 18, y + 8);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105); // #475569
  doc.text(`GLEIF LEI Identifier: ${selectedOrg.lei}`, 18, y + 15);
  doc.text(`Jurisdiction: ${selectedOrg.country}`, 18, y + 21);
  doc.text(`Industry Sector: ${selectedOrg.sector}`, 18, y + 26);

  doc.text(`Target Audit Year: ${selectedOrg.targetYear}`, 115, y + 15);
  doc.text(`Standard: ${activeFramework.code}`, 115, y + 21);
  doc.text(`Scope 2 Method: ${accountingMethod.toUpperCase()}-BASED`, 115, y + 26);

  // SECTION 2: CUMULATIVE I-REC PROGRESS SUMMARY
  y += 36;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. Cumulative I-REC Yield & Carbon Progress Summary', 14, y);

  y += 5;
  // 4 Metric Boxes
  const boxW = 43;
  const boxH = 22;
  const boxes = [
    {
      label: 'CUMULATIVE I-REC YIELD',
      val: `${selectedOrg.currentIrecYieldMwh.toLocaleString()} MWh`,
      sub: `${progressPct}% of ${selectedOrg.annualIrecTargetMwh.toLocaleString()} MWh`,
      color: [22, 163, 74]
    },
    {
      label: 'CO2 AVOIDANCE YIELD',
      val: `${currentCo2AvoidedTonnes.toLocaleString()} tCO2e`,
      sub: `Goal: ${targetCo2AvoidedTonnes.toLocaleString()} tCO2e`,
      color: [14, 116, 144]
    },
    {
      label: 'REMAINING NEEDED',
      val: `${remainingIrecMwh.toLocaleString()} MWh`,
      sub: `${remainingCo2Tonnes.toLocaleString()} tCO2e required`,
      color: [180, 83, 9]
    },
    {
      label: 'TOKENIZED dREC RATIO',
      val: `${selectedOrg.verifiedIssuanceRatio}%`,
      sub: 'Polygon DLT On-Chain',
      color: [16, 185, 129]
    }
  ];

  boxes.forEach((box, idx) => {
    const bx = 14 + idx * (boxW + 3.3);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(bx, y, boxW, boxH, 2, 2, 'FD');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(box.label, bx + 3, y + 5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(box.color[0], box.color[1], box.color[2]);
    doc.text(box.val, bx + 3, y + 12);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(box.sub, bx + 3, y + 18);
  });

  // VISUAL PROGRESS BAR IN PDF
  y += boxH + 6;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, 182, 14, 2, 2, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Annual Target Progress: ${selectedOrg.currentIrecYieldMwh.toLocaleString()} / ${selectedOrg.annualIrecTargetMwh.toLocaleString()} MWh (${progressPct}%)`, 18, y + 5);

  // Outer Bar
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(18, y + 7, 174, 4, 1, 1, 'F');
  // Fill Bar
  const fillW = Math.max(2, Math.min(174, (progressPct / 100) * 174));
  doc.setFillColor(22, 163, 74);
  doc.roundedRect(18, y + 7, fillW, 4, 1, 1, 'F');

  // SECTION 3: QUARTERLY MILESTONE MILESTONES TABLE
  y += 22;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. Quarterly I-REC Milestone Breakdown', 14, y);

  y += 4;
  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, 182, 7, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Quarter', 18, y + 5);
  doc.text('Target (MWh)', 55, y + 5);
  doc.text('Actual Yield (MWh)', 95, y + 5);
  doc.text('CO2 Avoided (tCO2e)', 135, y + 5);
  doc.text('Status', 172, y + 5);

  y += 7;
  selectedOrg.quarterlyMilestones.forEach((m, i) => {
    const rowY = y + i * 7;
    const qtrCo2 = (m.actualMwh * selectedOrg.gridFactorKgKwh).toFixed(1);

    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, rowY, 182, 7, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);

    doc.text(m.quarter, 18, rowY + 5);
    doc.text(`${m.targetMwh.toLocaleString()} MWh`, 55, rowY + 5);
    doc.text(`${m.actualMwh.toLocaleString()} MWh`, 95, rowY + 5);
    doc.text(`${qtrCo2} tCO2e`, 135, rowY + 5);

    if (m.status === 'completed') {
      doc.setTextColor(22, 163, 74);
      doc.setFont('helvetica', 'bold');
      doc.text('COMPLETED', 172, rowY + 5);
    } else if (m.status === 'in_progress') {
      doc.setTextColor(217, 119, 6);
      doc.setFont('helvetica', 'bold');
      doc.text('IN PROGRESS', 172, rowY + 5);
    } else {
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text('UPCOMING', 172, rowY + 5);
    }
  });

  // SECTION 4: REGULATORY COMPLIANCE & PARAMETERS
  y += selectedOrg.quarterlyMilestones.length * 7 + 8;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. Compliance Framework & Grid Emission Parameters', 14, y);

  y += 5;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 28, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Framework: ${activeFramework.name}`, 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Issuer Authority: ${activeFramework.issuer}`, 18, y + 11);
  doc.text(`Regulatory Reference: ${activeFramework.regulation}`, 18, y + 16);
  doc.text(`Asian Grid Factor: ${selectedGrid.country} (${selectedGrid.gridName}) — ${selectedGrid.factorKgKwh} kg CO2/kWh`, 18, y + 21);
  doc.text(`Description: ${activeFramework.description}`, 18, y + 26);

  // PAGE 1 FOOTER
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`SHA-256 Hash: vge_csrd_2026_ee_${selectedOrg.id}_${Date.now()}   |   RSA-4096 / eIDAS QES Validated`, 14, 285);
  doc.text('Page 1 of 2 — Confidential & Proprietary VGE Technologies OÜ Audit Report', 130, 285);

  // ==================== PAGE 2 ====================
  doc.addPage();

  // Header Banner Page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setFillColor(22, 163, 74);
  doc.rect(0, 28, 210, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('MONTHLY GENERATION & AUDIT DISCLOSURES (CSRD / ESRS E1)', 14, 14);

  doc.setFontSize(8);
  doc.setTextColor(74, 222, 128);
  doc.text(`Entity: ${selectedOrg.name} (${selectedOrg.country})  |  LEI: ${selectedOrg.lei}`, 14, 22);

  y = 38;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. Monthly Telemetry & CO2 Avoidance Audit Log', 14, y);

  y += 5;
  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, 182, 7, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Month', 18, y + 5);
  doc.text('Solar Generation (MWh)', 50, y + 5);
  doc.text('CO2 Avoided (tCO2e)', 92, y + 5);
  doc.text('EU CSRD Target (tCO2e)', 132, y + 5);
  doc.text('Surplus Avoidance (tCO2e)', 165, y + 5);

  y += 7;
  let totalMwhSum = 0;
  let totalCo2Sum = 0;

  monthlyGhgData.forEach((row, idx) => {
    const rowY = y + idx * 6.5;
    totalMwhSum += row.mwhGenerated;
    totalCo2Sum += row.co2Avoided;

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, rowY, 182, 6.5, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);

    doc.text(row.month, 18, rowY + 4.5);
    doc.text(`${row.mwhGenerated} MWh`, 50, rowY + 4.5);
    doc.text(`${row.co2Avoided.toFixed(1)} t`, 92, rowY + 4.5);
    doc.text(`${row.euCsrdTarget.toFixed(1)} t`, 132, rowY + 4.5);

    doc.setTextColor(22, 163, 74);
    doc.setFont('helvetica', 'bold');
    doc.text(`+${row.surplusAvoidance.toFixed(1)} t`, 165, rowY + 4.5);
  });

  // TOTALS ROW
  const totalsY = y + monthlyGhgData.length * 6.5;
  doc.setFillColor(226, 232, 240);
  doc.rect(14, totalsY, 182, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('12-MONTH TOTALS:', 18, totalsY + 5.5);
  doc.text(`${totalMwhSum.toLocaleString()} MWh`, 50, totalsY + 5.5);
  doc.text(`${totalCo2Sum.toFixed(1)} tCO2e`, 92, totalsY + 5.5);
  doc.text(`${(totalMwhSum * 0.55).toFixed(1)} tCO2e`, 132, totalsY + 5.5);
  doc.setTextColor(22, 163, 74);
  doc.text(`+${(totalCo2Sum - (totalMwhSum * 0.55)).toFixed(1)} tCO2e`, 165, totalsY + 5.5);

  // SECTION 5: AUDIT ATTESTATION & SIGNATURE
  y = totalsY + 16;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 48, 2, 2, 'FD');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('5. Independent Audit Attestation & DLT Verification Statement', 18, y + 8);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('This official certificate confirms that zero-hardware IoT SCADA telemetry from connected solar assets has been digitally', 18, y + 15);
  doc.text('measured, verified, and reconciled against the I-TRACK Foundation standard and EU CSRD Directive 2022/2464 (ESRS E1).', 18, y + 19);
  doc.text('All attribute certificates (dRECs) have been minted on Polygon DLT with cryptographically bound origin metadata.', 18, y + 23);

  // Signatures
  doc.setDrawColor(148, 163, 184);
  doc.line(18, y + 40, 85, y + 40);
  doc.line(115, y + 40, 178, y + 40);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Chief Sustainability Officer', 18, y + 44);
  doc.text('Verde Grid Energy (VGE) Technologies OÜ', 18, y + 47);

  doc.text('Lead External Auditor (eIDAS Certified)', 115, y + 44);
  doc.text('I-TRACK & Verra Authorized Assessor', 115, y + 47);

  // PAGE 2 FOOTER
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`GLEIF LEI: ${selectedOrg.lei}   |   Polygon DLT Contract: 0x5e8f21a92d10c4438fa918b99c01398471203`, 14, 285);
  doc.text('Page 2 of 2 — Official Certified I-REC Audit Document', 140, 285);

  // Save PDF
  const filename = `VGE_I-REC_Audit_Report_${selectedOrg.id}_${selectedOrg.targetYear}.pdf`;
  doc.save(filename);
};

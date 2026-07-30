import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  googleCode: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English (Global)', flag: '🇬🇧', googleCode: 'en' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', googleCode: 'hi' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', googleCode: 'ja' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti (EU)', flag: '🇪🇪', googleCode: 'et' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', googleCode: 'de' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', googleCode: 'vi' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', googleCode: 'th' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', googleCode: 'fr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', googleCode: 'es' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', googleCode: 'zh-CN' },
];

// Dictionary of translations for primary UI elements across 10 languages
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    solutions: 'Solutions',
    calculator: 'Yield Calculator',
    apiIntegrations: 'API Integrations',
    esgCompliance: 'ESG Compliance',
    security: 'Enterprise Security',
    clientPortalLogin: 'Client Portal Login',
    liveDashboardDemo: 'Live Dashboard Demo',
    trustedByEpc: 'Trusted by Leading Solar EPCs.',
    epcTagline: 'Verde Grid Energy partners with India and Asia’s premier clean infrastructure developers.',
    heroTitle: 'Web3 Capital & IoT Operating System for Solar Assets',
    heroSub: 'Connecting Asian commercial solar assets directly to institutional liquidity, zero-hardware IoT telemetry, and automated I-REC carbon yields.',
    calcTitle: 'B2B Solar Yield & Revenue Calculator',
    connectWithUs: 'Connect With Us',
    rightsReserved: '© 2026 VGE Technologies OÜ or Its affiliates | All rights reserved',
  },
  hi: {
    solutions: 'समाधान',
    calculator: 'उपज कैलकुलेटर',
    apiIntegrations: 'एपीआई एकीकरण',
    esgCompliance: 'ईएसजी अनुपालन',
    security: 'एंटरप्राइज सुरक्षा',
    clientPortalLogin: 'क्लाइंट पोर्टल लॉगिन',
    liveDashboardDemo: 'लाइव डैशबोर्ड डेमो',
    trustedByEpc: 'प्रमुख सोलर ईपीसी द्वारा विश्वसनीय।',
    epcTagline: 'वर्दे ग्रिड एनर्जी भारत और एशिया के प्रमुख सौर डेवलपर्स के साथ साझेदारी करती है।',
    heroTitle: 'सौर परिसंपत्तियों के लिए Web3 कैपिटल और IoT ऑपरेटिंग सिस्टम',
    heroSub: 'एशियाई वाणिज्यिक सौर परिसंपत्तियों को संस्थागत तरलता, शून्य-हार्डवेयर IoT टेलीमेट्री और स्वचालित कार्बन क्रेडिट से जोड़ना।',
    calcTitle: 'B2B सोलर यील्ड और राजस्व कैलकुलेटर',
    connectWithUs: 'हमसे जुड़ें',
    rightsReserved: '© 2026 वीजीई टेक्नोलॉजीज ओयू या इसके सहयोगी | सर्वाधिकार सुरक्षित',
  },
  ja: {
    solutions: 'ソリューション',
    calculator: '収益計算ツール',
    apiIntegrations: 'API連携',
    esgCompliance: 'ESGコンプライアンス',
    security: 'エンタープライズセキュリティ',
    clientPortalLogin: 'クライアントポータルログイン',
    liveDashboardDemo: 'ライブデモダッシュボード',
    trustedByEpc: '大手ソーラーEPC企業から信頼されています。',
    epcTagline: 'Verde Grid Energyは、アジアの主要なクリーンインフラ開発者と提携しています。',
    heroTitle: '太陽光発電資産のためのWeb3資金調達＆IoTオペレーティングシステム',
    heroSub: 'アジアの産業用太陽光発電資産を機関投資家の流動性、ゼロハードウェアIoTテレメトリ、自動化されたI-RECカーボンクレジットに直結。',
    calcTitle: 'B2B 太陽光発電収益＆売上シミュレーター',
    connectWithUs: 'ソーシャルメディアで繋がる',
    rightsReserved: '© 2026 VGE Technologies OÜ またはその関連会社 | All rights reserved',
  },
  et: {
    solutions: 'Lahendused',
    calculator: 'Tootlikkuse Kalkulaator',
    apiIntegrations: 'API Integratsioonid',
    esgCompliance: 'ESG Nõuetele Vastavus',
    security: 'Ettevõtte Turvalisus',
    clientPortalLogin: 'Kliendiportaali Logimine',
    liveDashboardDemo: 'Reaalaja Töölaud',
    trustedByEpc: 'Juhtivate Päikeseenergia EPC-de Usaldusväärne Partner.',
    epcTagline: 'Verde Grid Energy teeb koostööd Aasia ja India juhtivate päikeseenergia arendajatega.',
    heroTitle: 'Web3 Kapital ja IoT Operatsioonisüsteem Päikeseparkidele',
    heroSub: 'Aasia päikeseparkide ühendamine institutsionaalse likviidsuse, riistvaravaba IoT telemeetria ja automatiseeritud I-REC süsinikukrediitidega.',
    calcTitle: 'B2B Päikeseenergia Tootlikkuse ja Tulu Kalkulaator',
    connectWithUs: 'Võta Meiega Ühendust',
    rightsReserved: '© 2026 VGE Technologies OÜ või selle sidusettevõtted | Kõik õigused kaitstud',
  },
  de: {
    solutions: 'Lösungen',
    calculator: 'Ertragsrechner',
    apiIntegrations: 'API-Integrationen',
    esgCompliance: 'ESG-Konformität',
    security: 'Unternehmenssicherheit',
    clientPortalLogin: 'Kundenportal-Login',
    liveDashboardDemo: 'Live-Dashboard-Demo',
    trustedByEpc: 'Vertraut von führenden Solar-EPCs.',
    epcTagline: 'Verde Grid Energy arbeitet mit den führenden Entwicklern sauberer Infrastruktur in Indien und Asien zusammen.',
    heroTitle: 'Web3-Kapital & IoT-Betriebssystem für Solaranlagen',
    heroSub: 'Anbindung asiatischer Gewerbe-Solaranlagen an institutionelle Liquidität, hardwarefreie IoT-Telemetrie und automatisierte I-REC-Zertifikate.',
    calcTitle: 'B2B Solarertrags- & Umsatzrechner',
    connectWithUs: 'Folgen Sie uns',
    rightsReserved: '© 2026 VGE Technologies OÜ oder verbundene Unternehmen | Alle Rechte vorbehalten',
  },
  vi: {
    solutions: 'Giải pháp',
    calculator: 'Công cụ tính lợi nhuận',
    apiIntegrations: 'Tích hợp API',
    esgCompliance: 'Tuân thủ ESG',
    security: 'Bảo mật doanh nghiệp',
    clientPortalLogin: 'Đăng nhập Portal',
    liveDashboardDemo: 'Xem Demo Dashboard',
    trustedByEpc: 'Được tin cậy bởi các đơn vị Solar EPC hàng đầu.',
    epcTagline: 'Verde Grid Energy hợp tác với các nhà phát triển hạ tầng năng lượng mặt trời hàng đầu tại Ấn Độ và Châu Á.',
    heroTitle: 'Hệ điều hành IoT & Vốn Web3 cho Tài sản Năng lượng Mặt trời',
    heroSub: 'Kết nối trực tiếp tài sản điện mặt trời thương mại Châu Á với thanh khoản định chế, giám sát IoT không phần cứng và tín chỉ carbon I-REC.',
    calcTitle: 'Công cụ tính Doanh thu & Sản lượng Điện B2B',
    connectWithUs: 'Kết nối với chúng tôi',
    rightsReserved: '© 2026 VGE Technologies OÜ hoặc các công ty liên kết | Bảo lưu mọi quyền',
  },
  th: {
    solutions: 'โซลูชัน',
    calculator: 'เครื่องคำนวณผลตอบแทน',
    apiIntegrations: 'การเชื่อมต่อ API',
    esgCompliance: 'การปฏิบัติตาม ESG',
    security: 'ความปลอดภัยระดับองค์กร',
    clientPortalLogin: 'เข้าสู่ระบบ พอร์ตัลลูกค้า',
    liveDashboardDemo: 'สาธิตแดชบอร์ดสด',
    trustedByEpc: 'ได้รับความไว้วางใจจาก EPC โซลาร์ชั้นนำ',
    epcTagline: 'Verde Grid Energy ร่วมมือกับผู้พัฒนาโครงสร้างพื้นฐานพลังงานสะอาดชั้นนำในอินเดียและเอเชีย',
    heroTitle: 'ระบบปฏิบัติการ IoT และเงินทุน Web3 สำหรับสินทรัพย์โซลาร์',
    heroSub: 'เชื่อมโยงโซลาร์เซลล์ภาคพาณิชย์ในเอเชียเข้ากับสภาพคล่องสถาบัน โทรมาตร IoT และคาร์บอนเครดิต I-REC อัตโนมัติ',
    calcTitle: 'เครื่องคำนวณผลตอบแทนและรายได้โซลาร์ B2B',
    connectWithUs: 'เชื่อมต่อกับเรา',
    rightsReserved: '© 2026 VGE Technologies OÜ หรือบริษัทในเครือ | สงวนลิขสิทธิ์ทั้งหมด',
  },
  fr: {
    solutions: 'Solutions',
    calculator: 'Calculateur de Rendement',
    apiIntegrations: 'Intégrations API',
    esgCompliance: 'Conformité ESG',
    security: 'Sécurité Entreprise',
    clientPortalLogin: 'Connexion Espace Client',
    liveDashboardDemo: 'Démo Tableau de Bord',
    trustedByEpc: 'Adopté par les plus grands EPC solaires.',
    epcTagline: 'Verde Grid Energy s’associe aux plus grands développeurs d’infrastructures solaires en Inde et en Asie.',
    heroTitle: 'Capital Web3 & Système d’Exploitation IoT pour Actifs Solaires',
    heroSub: 'Connecter les centrales solaires commerciales asiatiques aux liquidités institutionnelles, à la télémétrie IoT sans matériel et aux crédits carbone I-REC.',
    calcTitle: 'Calculateur B2B de Rendement & Revenus Solaires',
    connectWithUs: 'Suivez-nous',
    rightsReserved: '© 2026 VGE Technologies OÜ ou ses filiales | Tous droits réservés',
  },
  es: {
    solutions: 'Soluciones',
    calculator: 'Calculadora de Rendimiento',
    apiIntegrations: 'Integraciones API',
    esgCompliance: 'Cumplimiento ESG',
    security: 'Seguridad Empresarial',
    clientPortalLogin: 'Acceso Portal Clientes',
    liveDashboardDemo: 'Demo Panel en Vivo',
    trustedByEpc: 'Acreditado por EPCs Solares Líderes.',
    epcTagline: 'Verde Grid Energy se asocia con los principales desarrolladores de energía limpia de India y Asia.',
    heroTitle: 'Sistema Operativo IoT y Capital Web3 para Activos Solares',
    heroSub: 'Conectando activos solares comerciales asiáticos directamente con liquidez institucional, telemetría IoT sin hardware y créditos de carbono I-REC.',
    calcTitle: 'Calculadora B2B de Rendimiento e Ingresos Solares',
    connectWithUs: 'Conéctate con Nosotros',
    rightsReserved: '© 2026 VGE Technologies OÜ o sus filiales | Todos los derechos reservados',
  },
  zh: {
    solutions: '解决方案',
    calculator: '收益计算器',
    apiIntegrations: 'API 接口集成',
    esgCompliance: 'ESG 合规管理',
    security: '企业级安全保护',
    clientPortalLogin: '客户门户登录',
    liveDashboardDemo: '实时仪表盘演示',
    trustedByEpc: '深受领先太阳能 EPC 企业的信赖',
    epcTagline: 'Verde Grid Energy 与印度及亚洲顶尖的光伏清洁能源开发商紧密合作。',
    heroTitle: '太阳能资产 Web3 资本与 IoT 操作系统',
    heroSub: '将亚洲工商业光伏资产直接无缝连接至机构级流动性资金池、无硬件 IoT 遥测与自动化 I-REC 碳信用收益。',
    calcTitle: 'B2B 太阳能收益与收入计算器',
    connectWithUs: '关注我们',
    rightsReserved: '© 2026 VGE Technologies OÜ 或其关联公司 | 保留所有权利',
  },
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: LANGUAGES[0],
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0]);

  // Handle Google Translate script initialization & real-time cookie trigger
  useEffect(() => {
    // Inject google translate script if not present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      // Define global init function
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,ja,et,de,vi,th,fr,es,zh-CN',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);

    // Set Google Translate cookie 'googtrans' to trigger real-time DOM translation
    const targetCode = lang.googleCode;
    const cookieVal = targetCode === 'en' ? '' : `/en/${targetCode}`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=${cookieVal}; path=/`;

    // Trigger select change in Google Translate widget if present
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = targetCode;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      // Reload or trigger dynamic DOM translation event
      window.location.hash = targetCode !== 'en' ? `#googtrans(en|${targetCode})` : '#';
      // If needed force location reload for google translate script to catch full DOM
      if (window.location.hash) {
        window.location.reload();
      }
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[currentLanguage.code] || TRANSLATIONS['en'];
    return langDict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage: changeLanguage, t }}>
      {/* Hidden google translate container */}
      <div id="google_translate_element" className="hidden hidden-translate-box" style={{ display: 'none' }} />
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

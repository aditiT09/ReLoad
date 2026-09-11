'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'gu' | 'pa' | 'te' | 'ta' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    live_fleet: 'Live Fleet • Active Network',
    book_truck_title: 'Book a truck, the easy way.',
    return_load: 'Return Load Logistics',
    fast_dispatch: 'Fast highway dispatch, reliable payments, and transparent verified rates on all major Indian corridors.',
    get_started: 'Get Started • Proceed',
    listen_audio: 'Listen Audio Guide',
    tap_hear: 'Tap to hear app overview',
    zero_deadhead: 'Zero Empty Deadhead',
    active: 'ACTIVE',
    corridor_ai: 'NH Corridor AI Live',
    trucks_active: '1,420+ Trucks on Golden Quad & NH-48',
    helpline: '24/7 Helpline: 1800-RELOAD',
    vahan_sync: 'Fastag & Vahan Sync',
    choose_portal: 'Choose Your Portal',
    shipper: 'Shipper / Enterprise',
    driver: 'Driver Partner',
    admin: 'Operations Admin',
    book: 'Book Truck',
    bookings: 'My Bookings',
    support: 'Help & Support',
    profile: 'Profile',
    track: 'Live Track',
    accept: 'Accept',
    decline: 'Decline',
    fare: 'Guaranteed Fare',
    locked: 'Locked Rate',
    confirm_pickup: 'Confirm Pickup',
    confirm_delivery: 'Confirm Delivery',
    report_issue: 'Report an Issue',
    pay_now: 'Pay Now',
    total_paid: 'Total Paid',
    active_bookings: 'Active Bookings',
    past_bookings: 'Past History',
  },
  hi: {
    live_fleet: 'सक्रिय नेटवर्क • लाइव फ्लीट',
    book_truck_title: 'आसानी से ट्रक बुक करें।',
    return_load: 'रिटर्न लोड लॉजिस्टिक्स',
    fast_dispatch: 'हाईवे पर तेज डिस्पैच, सुरक्षित भुगतान और सभी प्रमुख भारतीय मार्गों पर पारदर्शी दरें।',
    get_started: 'शुरू करें • आगे बढ़ें',
    listen_audio: 'बोलकर सुनें (ऑडियो गाइड)',
    tap_hear: 'ऐप का संक्षिप्त विवरण सुनें',
    zero_deadhead: 'शून्य खाली फेरा',
    active: 'सक्रिय',
    corridor_ai: 'एनएच कॉरिडोर एआई लाइव',
    trucks_active: '1,420+ ट्रक गोल्डन क्वाड्रिलेटरल और NH-48 पर',
    helpline: '24/7 हेल्पलाइन: 1800-RELOAD',
    vahan_sync: 'फास्टैग और वाहन सिंक',
    choose_portal: 'अपना पोर्टल चुनें',
    shipper: 'ग्राहक / व्यापारी',
    driver: 'ड्राइवर पार्टनर',
    admin: 'संचालन व्यवस्थापक (Admin)',
    book: 'गाड़ी बुक करें',
    bookings: 'मेरी बुकिंग',
    support: 'मदद और सहायता',
    profile: 'प्रोफ़ाइल',
    track: 'लाइव ट्रैकिंग',
    accept: 'स्वीकार करें',
    decline: 'अस्वीकार करें',
    fare: 'तय भाड़ा',
    locked: 'लॉक किया गया किराया',
    confirm_pickup: 'माल उठाव पक्का करें',
    confirm_delivery: 'डिलीवरी पक्की करें',
    report_issue: 'समस्या दर्ज करें',
    pay_now: 'भुगतान करें',
    total_paid: 'कुल भुगतान',
    active_bookings: 'चालू बुकिंग',
    past_bookings: 'पुरानी बुकिंग',
  },
  mr: {
    live_fleet: 'थेट नेटवर्क • सक्रिय फ्लीट',
    book_truck_title: 'सहजतेने ट्रक बुक करा.',
    return_load: 'रिटर्न लोड लॉजिस्टिक्स',
    fast_dispatch: 'जलद महामार्ग डिस्पॅच, विश्वासार्ह देयके आणि पारदर्शक दर.',
    get_started: 'सुरू करा • पुढे चला',
    listen_audio: 'ऑडिओ मार्गदर्शक ऐका',
    tap_hear: 'अॅपची माहिती ऐका',
    zero_deadhead: 'शून्य रिकामी फेरी',
    active: 'सक्रिय',
    corridor_ai: 'महामार्ग एआय थेट सुरू',
    trucks_active: '१,४२०+ ट्रक NH-48 वर उपलब्ध',
    helpline: '२४/७ हेल्पलाईन: 1800-RELOAD',
    vahan_sync: 'फास्टॅग आणि वाहन सिंक',
    choose_portal: 'आपले पोर्टल निवडा',
    shipper: 'ग्राहक / व्यापारी',
    driver: 'चालक भागीदार (Driver)',
    admin: 'प्रशासक पोर्टल',
    book: 'गाडी बुक करा',
    bookings: 'माझी बुकिंग',
    support: 'मदत आणि तक्रार',
    profile: 'प्रोफाइल',
    track: 'थेट ट्रॅक',
    accept: 'स्वीकारा',
    decline: 'नाकारा',
    fare: 'निश्चित भाडे',
    locked: 'लॉक केलेले भाडे',
    confirm_pickup: 'माल उचल निश्चित करा',
    confirm_delivery: 'वितरण पूर्ण करा',
    report_issue: 'समस्या नोंदवा',
    pay_now: 'पैसे भरा',
    total_paid: 'एकूण भरले',
    active_bookings: 'सक्रिय बुकिंग',
    past_bookings: 'मागील इतिहास',
  },
  gu: {
    live_fleet: 'લાઈવ નેટવર્ક • સક્રિય ફ્લીટ',
    book_truck_title: 'સરળતાથી ટ્રક બુક કરો.',
    return_load: 'રિટર્ન લોડ લોજિસ્ટિક્સ',
    fast_dispatch: 'ઝડપી હાઇવે ડિસ્પેચ અને પારદર્શક વ્યાજબી દરો.',
    get_started: 'શરૂ કરો • આગળ વધો',
    listen_audio: 'ઓડિયો ગાઇડ સાંભળો',
    tap_hear: 'એપ ની વિગત સાંભળો',
    zero_deadhead: 'શૂન્ય ખાલી ફેરો',
    active: 'સક્રિય',
    corridor_ai: 'હાઇવે કોરિડોર AI લાઈવ',
    trucks_active: '૧,૪૨૦+ ટ્રક ઉપલબ્ધ NH-48 પર',
    helpline: '૨૪/૭ હેલ્પલાઇન: 1800-RELOAD',
    vahan_sync: 'ફાસ્ટેગ અને વાહન સિન્ક',
    choose_portal: 'તમારું પોર્ટલ પસંદ કરો',
    shipper: 'ગ્રાહક / વેપારી',
    driver: 'ડ્રાઈવર પાર્ટનર',
    admin: 'એડમિન પોર્ટલ',
    book: 'ટ્રક બુક કરો',
    bookings: 'મારી બુકિંગ્સ',
    support: 'મદદ અને સપોર્ટ',
    profile: 'પ્રોફાઇલ',
    track: 'લાઈવ ટ્રેકિંગ',
    accept: 'સ્વીકારો',
    decline: 'અસ્વીકાર',
    fare: 'ખાતરીપૂર્વકનું ભાડું',
    locked: 'લોક કરેલું ભાડું',
    confirm_pickup: 'માલ ઉપાડ કન્ફર્મ કરો',
    confirm_delivery: 'ડિલિવરી કન્ફર્મ કરો',
    report_issue: 'સમસ્યા જણાવો',
    pay_now: 'ચુકવણી કરો',
    total_paid: 'કુલ ચૂકવેલ',
    active_bookings: 'ચાલુ બુકિંગ',
    past_bookings: 'જૂનો ઇતિહાસ',
  },
  pa: {
    live_fleet: 'ਲਾਈਵ ਨੈੱਟਵਰਕ • ਸਰਗਰਮ ਫਲੀਟ',
    book_truck_title: 'ਸੌਖੇ ਤਰੀਕੇ ਨਾਲ ਟਰੱਕ ਬੁੱਕ ਕਰੋ।',
    return_load: 'ਰਿਟਰਨ ਲੋਡ ਲੌਜਿਸਟਿਕਸ',
    fast_dispatch: 'ਹਾਈਵੇ ਤੇ ਤੇਜ਼ ਡਿਸਪੈਚ, ਭਰੋਸੇਯੋਗ ਭੁਗਤਾਨ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਦਰਾਂ।',
    get_started: 'ਸ਼ੁਰੂ ਕਰੋ • ਅੱਗੇ ਵਧੋ',
    listen_audio: 'ਆਡੀਓ ਸੁਣੋ',
    tap_hear: 'ਐਪ ਬਾਰੇ ਸੁਣੋ',
    zero_deadhead: 'ਸਿਫਰ ਖਾਲੀ ਫੇਰਾ',
    active: 'ਸਰਗਰਮ',
    corridor_ai: 'NH ਕਾਰੀਡੋਰ AI ਲਾਈਵ',
    trucks_active: '੧,੪੨੦+ ਟਰੱਕ NH-48 ਤੇ ਤਿਆਰ',
    helpline: '੨੪/੭ ਹੈਲਪਲਾਈਨ: 1800-RELOAD',
    vahan_sync: 'ਫਾਸਟੈਗ ਅਤੇ ਵਾਹਨ ਸਿੰਕ',
    choose_portal: 'ਆਪਣਾ ਪੋਰਟਲ ਚੁਣੋ',
    shipper: 'ਗਾਹਕ / ਵਪਾਰੀ',
    driver: 'ਡਰਾਈਵਰ ਭਾਈਵਾਲ',
    admin: 'ਐਡਮਿਨ ਪੋਰਟਲ',
    book: 'ਟਰੱਕ ਬੁੱਕ ਕਰੋ',
    bookings: 'ਮੇਰੀਆਂ ਬੁਕਿੰਗਾਂ',
    support: 'ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    track: 'ਲਾਈਵ ਟ੍ਰੈਕਿੰਗ',
    accept: 'ਸਵੀਕਾਰ ਕਰੋ',
    decline: 'ਰੱਦ ਕਰੋ',
    fare: 'ਤੈਅ ਕਿਰਾਇਆ',
    locked: 'ਲਾਕ ਕੀਤਾ ਕਿਰਾਇਆ',
    confirm_pickup: 'ਮਾਲ ਚੁੱਕਣਾ ਪੱਕਾ ਕਰੋ',
    confirm_delivery: 'ਡਿਲੀਵਰੀ ਪੱਕੀ ਕਰੋ',
    report_issue: 'ਮੁਸ਼ਕਿਲ ਦਰਜ ਕਰੋ',
    pay_now: 'ਭੁਗਤਾਨ ਕਰੋ',
    total_paid: 'ਕੁੱਲ ਭੁਗਤਾਨ',
    active_bookings: 'ਚਾਲੂ ਬੁਕਿੰਗਾਂ',
    past_bookings: 'ਪੁਰਾਣੀਆਂ ਬੁਕਿੰਗਾਂ',
  },
  te: {
    live_fleet: 'లైవ్ నెట్‌వర్క్ • యాక్టివ్ ఫ్లీట్',
    book_truck_title: 'సులభంగా ట్రక్కును బుక్ చేయండి.',
    return_load: 'రిటర్న్ లోడ్ లాజిస్టిక్స్',
    fast_dispatch: 'వేగవంతమైన హైవే డిస్పాచ్ మరియు నమ్మకమైన రేట్లు.',
    get_started: 'ప్రారంభించండి',
    listen_audio: 'ఆడియో వినండి',
    tap_hear: 'యాప్ వివరాలు వినండి',
    zero_deadhead: 'జీరో ఖాళీ ట్రిప్',
    active: 'యాక్టివ్',
    corridor_ai: 'హైవే AI లైవ్',
    trucks_active: '1,420+ ట్రక్కులు అందుబాటులో ఉన్నాయి',
    helpline: '24/7 హెల్ప్‌లైన్: 1800-RELOAD',
    vahan_sync: 'ఫాస్టాగ్ సింక్',
    choose_portal: 'మీ పోర్టల్ ఎంచుకోండి',
    shipper: 'కస్టమర్ / వ్యాపారి',
    driver: 'డ్రైవర్ భాగస్వామి',
    admin: 'అడ్మిన్ పోర్టల్',
    book: 'ట్రక్ బుక్ చేయండి',
    bookings: 'నా బుకింగ్స్',
    support: 'సహాయం',
    profile: 'ప్రొఫైల్',
    track: 'లైవ్ ట్రాక్',
    accept: 'అంగీకరించు',
    decline: 'తిరస్కరించు',
    fare: 'హామీ ధర',
    locked: 'లాక్ చేసిన ధర',
    confirm_pickup: 'పికప్ నిర్ధారించండి',
    confirm_delivery: 'డెలివరీ నిర్ధారించండి',
    report_issue: 'సమస్యను నివేదించండి',
    pay_now: 'చెల్లించండి',
    total_paid: 'మొత్తం చెల్లించినది',
    active_bookings: 'యాక్టివ్ బుకింగ్స్',
    past_bookings: 'గత చరిత్ర',
  },
  ta: {
    live_fleet: 'நேரடி நெட்வொர்க் • செயலில் உள்ள வாகனங்கள்',
    book_truck_title: 'எளிதாக லாரியை பதிவு செய்யுங்கள்.',
    return_load: 'ரிட்டர்ன் லோடு லாஜிஸ்டிக்ஸ்',
    fast_dispatch: 'விரைவான நெடுஞ்சாலை சேவை மற்றும் நம்பகமான கட்டணம்.',
    get_started: 'தொடங்குங்கள்',
    listen_audio: 'ஆடியோ கேளுங்கள்',
    tap_hear: 'செயலி விவரங்களை கேட்கவும்',
    zero_deadhead: 'வெற்று பயணம் இல்லை',
    active: 'செயலில்',
    corridor_ai: 'ஹைவே AI லைவ்',
    trucks_active: '1,420+ லாரிகள் தயார்',
    helpline: '24/7 உதவி எண்: 1800-RELOAD',
    vahan_sync: 'பாஸ்டேக் & வாகன் இணைப்பு',
    choose_portal: 'உங்கள் போர்ட்டலைத் தேர்வுசெய்க',
    shipper: 'வாடிக்கையாளர் / வர்த்தகர்',
    driver: 'ஓட்டுநர் கூட்டாளர்',
    admin: 'நிர்வாக போர்டல்',
    book: 'லாரி புக் செய்',
    bookings: 'எனது முன்பதிவுகள்',
    support: 'உதவி',
    profile: 'சுயவிவரம்',
    track: 'நேரடி கண்காணிப்பு',
    accept: 'ஏற்றுக்கொள்',
    decline: 'நிராகரி',
    fare: 'உறுதிசெய்யப்பட்ட கட்டணம்',
    locked: 'பூட்டப்பட்ட கட்டணம்',
    confirm_pickup: 'ஏற்றுதலை உறுதிசெய்',
    confirm_delivery: 'விநியோகத்தை உறுதிசெய்',
    report_issue: 'புகார் அளிக்கவும்',
    pay_now: 'செலுத்துங்கள்',
    total_paid: 'மொத்தம் செலுத்தியது',
    active_bookings: 'செயலில் உள்ளவை',
    past_bookings: 'முந்தைய வரலாறு',
  },
  kn: {
    live_fleet: 'ಲೈವ್ ನೆಟ್‌ವರ್ಕ್ • ಸಕ್ರಿಯ ಫ್ಲೀಟ್',
    book_truck_title: 'ಸುಲಭವಾಗಿ ಟ್ರಕ್ ಬುಕ್ ಮಾಡಿ.',
    return_load: 'ರಿಟರ್ನ್ ಲೋಡ್ ಲಾಜಿಸ್ಟಿಕ್ಸ್',
    fast_dispatch: 'ವೇಗದ ಹೆದ್ದಾರಿ ರವಾನೆ ಮತ್ತು ಪಾರದರ್ಶಕ ದರಗಳು.',
    get_started: 'ಪ್ರಾರಂಭಿಸಿ',
    listen_audio: 'ಆಡಿಯೋ ಆಲಿಸಿ',
    tap_hear: 'ಆ್ಯಪ್ ಮಾಹಿತಿ ಆಲಿಸಿ',
    zero_deadhead: 'ಶೂನ್ಯ ಖಾಲಿ ಟ್ರಿಪ್',
    active: 'ಸಕ್ರಿಯ',
    corridor_ai: 'ಹೈವೇ AI ಲೈವ್',
    trucks_active: '1,420+ ಟ್ರಕ್‌ಗಳು ಸಿದ್ಧ',
    helpline: '24/7 ಸಹಾಯವಾಣಿ: 1800-RELOAD',
    vahan_sync: 'ಫಾಸ್ಟ್ಯಾಗ್ ಸಿಂಕ್',
    choose_portal: 'ನಿಮ್ಮ ಪೋರ್ಟಲ್ ಆಯ್ಕೆಮಾಡಿ',
    shipper: 'ಗ್ರಾಹಕ / ವ್ಯಾಪಾರಿ',
    driver: 'ಚಾಲಕ ಪಾಲುದಾರ',
    admin: 'ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್',
    book: 'ಟ್ರಕ್ ಬುಕ್ ಮಾಡಿ',
    bookings: 'ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು',
    support: 'ಸಹಾಯ',
    profile: 'ಪ್ರೊಫೈಲ್',
    track: 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    accept: 'ಸ್ವೀಕರಿಸಿ',
    decline: 'ತಿರಸ್ಕರಿಸಿ',
    fare: 'ಖಾತರಿಪಡಿಸಿದ ಬಾಡಿಗೆ',
    locked: 'ಲಾಕ್ ಮಾಡಿದ ದರ',
    confirm_pickup: 'ಪಿಕಪ್ ದೃಢೀಕರಿಸಿ',
    confirm_delivery: 'ವಿತರಣೆ ದೃಢೀಕರಿಸಿ',
    report_issue: 'ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ',
    pay_now: 'ಪಾವತಿಸಿ',
    total_paid: 'ಒಟ್ಟು ಪಾವತಿಸಲಾಗಿದೆ',
    active_bookings: 'ಸಕ್ರಿಯ ಬುಕಿಂಗ್‌ಗಳು',
    past_bookings: 'ಹಿಂದಿನ ಇತಿಹಾಸ',
  },
};

export interface LanguageContextType {
  currentLang: LanguageCode;
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  langModalOpen: boolean;
  setLangModalOpen: (open: boolean) => void;
  getLangObj: () => LanguageOption;
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: 'en',
  currentLanguage: 'en',
  setLanguage: () => {},
  langModalOpen: false,
  setLangModalOpen: () => {},
  getLangObj: () => LANGUAGES[0],
  t: (k, d) => d || k,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [langModalOpen, setLangModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('reload_lang') as LanguageCode;
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        setCurrentLang(saved);
      }
    } catch {
      // ignore SSR or restricted storage
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLang(lang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('reload_lang', lang);
      }
    } catch {
      // ignore
    }
    setLangModalOpen(false);
  };

  const getLangObj = () => {
    return LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  };

  const t = (key: string, defaultText?: string) => {
    const langDict = TRANSLATIONS[currentLang];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        currentLanguage: currentLang,
        setLanguage,
        langModalOpen,
        setLangModalOpen,
        getLangObj,
        t,
      }}
    >
      {children}
      {/* Global Multi-Language Selection Dialog */}
      {langModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setLangModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-200 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4"></div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <h2 className="font-display text-base font-bold text-[#16212E]">
                  Select Language • भाषा चुनें
                </h2>
              </div>
              <button
                onClick={() => setLangModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="py-3 divide-y divide-slate-100 space-y-1 max-h-72 overflow-y-auto">
              {LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full flex items-center justify-between py-3 px-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-[#E6F4F1] border border-[#0F6E56]/30 text-[#0F6E56] font-bold'
                        : 'hover:bg-slate-50 text-[#16212E]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{lang.flag}</span>
                      <div className="text-left">
                        <span className="block font-display text-sm font-semibold">{lang.native}</span>
                        <span className="block text-xs text-slate-500 font-normal">{lang.label}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[#0F6E56] text-xl font-bold">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

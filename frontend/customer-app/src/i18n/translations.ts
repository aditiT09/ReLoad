import { SupportedLanguage, LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
];

export interface TranslationDictionary {
  appName: string;
  login: {
    title: string;
    subtitle: string;
    phoneLabel: string;
    phonePlaceholder: string;
    sendCode: string;
    transmitting: string;
    termsNotice: string;
  };
  otp: {
    title: string;
    subtitle: string;
    sentTo: string;
    editNumber: string;
    verifyButton: string;
    verifying: string;
    resendIn: string;
    resendNow: string;
  };
  booking: {
    title: string;
    pickupLabel: string;
    dropoffLabel: string;
    categoryTitle: string;
    regulatedNotice: string;
    routeDetails: string;
    continueButton: string;
    general: string;
    coldChain: string;
    pharma: string;
    dairy: string;
    other: string;
  };
  vehicles: {
    title: string;
    regulatedFilterNotice: string;
    fareLockedTitle: string;
    fareLockedSubtitle: string;
    confirmBooking: string;
    dispatching: string;
    payloadCapacity: string;
    tempGuaranteed: string;
    verifiedBadge: string;
  };
  activeTrip: {
    consignment: string;
    stages: {
      requested: string;
      accepted: string;
      pickup_confirmed: string;
      in_transit: string;
      delivered: string;
    };
    telematics: string;
    speed: string;
    temperature: string;
    driverInfo: string;
    callDriver: string;
    openChat: string;
    lockedFarePill: string;
    simulateStage: string;
    fileReport: string;
    handoffRequired: string;
  };
  surcharge: {
    modalTitle: string;
    modalSubtitle: string;
    reasonLabel: string;
    lockedFare: string;
    additionalAmount: string;
    newTotal: string;
    confirmButton: string;
    declineButton: string;
    tollInfo: string;
  };
  handoff: {
    pickupTitle: string;
    dropoffTitle: string;
    sealNumber: string;
    sealVerified: string;
    inspectionChecklist: string;
    signatureLabel: string;
    confirmPickup: string;
    confirmDropoff: string;
    escrowNote: string;
  };
  report: {
    title: string;
    empathyNotice: string;
    targetSection: string;
    categorySection: string;
    descriptionPlaceholder: string;
    uploadLabel: string;
    submitButton: string;
    statusTitle: string;
    escrowProtectedNotice: string;
  };
  payment: {
    title: string;
    settlementNotice: string;
    fareBreakdown: string;
    baseFare: string;
    surcharge: string;
    taxes: string;
    totalAmount: string;
    payWithUpi: string;
    payWithCard: string;
    completePayment: string;
    processing: string;
  };
  history: {
    title: string;
    totalConsignments: string;
    activeEscrow: string;
    filterAll: string;
    filterInTransit: string;
    filterDelivered: string;
    filterDisputed: string;
  };
  profile: {
    title: string;
    verifiedConsignor: string;
    languageHeading: string;
    escrowAccount: string;
    trustScore: string;
    signOut: string;
  };
  nav: {
    book: string;
    trips: string;
    chat: string;
    profile: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'Reload',
    login: {
      title: 'Welcome to Reload',
      subtitle: 'Book cargo vehicles with a guaranteed locked fare.',
      phoneLabel: 'Mobile Number',
      phonePlaceholder: 'Enter 10-digit mobile number',
      sendCode: 'Send Code',
      transmitting: 'Sending code...',
      termsNotice: 'By continuing, you agree to Reload terms of service.',
    },
    otp: {
      title: 'Enter Verification Code',
      subtitle: 'Enter the 6-digit code sent to your phone.',
      sentTo: 'Sent to',
      editNumber: 'Change number',
      verifyButton: 'Verify & Continue',
      verifying: 'Verifying code...',
      resendIn: 'Resend code in',
      resendNow: 'Resend Code',
    },
    booking: {
      title: 'Book a Cargo Vehicle',
      pickupLabel: 'Pickup Address',
      dropoffLabel: 'Delivery Address',
      categoryTitle: 'What are you transporting?',
      regulatedNotice: 'Medicines, cold-chain, and dairy require verified temperature-controlled vehicles.',
      routeDetails: 'Route: Highway 48 (842 km) • Tolls included',
      continueButton: 'Choose Vehicle',
      general: 'General Goods',
      coldChain: 'Cold Chain / Refrigerated',
      pharma: 'Medicines / Pharma',
      dairy: 'Perishables / Dairy',
      other: 'Heavy / Other Goods',
    },
    vehicles: {
      title: 'Choose a Vehicle',
      regulatedFilterNotice: 'Showing only verified temperature-controlled vehicles for your cargo.',
      fareLockedTitle: 'Locked Fare Guarantee',
      fareLockedSubtitle: 'This price is locked. It will never increase unless you approve an extra fee (like an unexpected toll).',
      confirmBooking: 'Confirm & Lock Fare',
      dispatching: 'Confirming your booking...',
      payloadCapacity: 'Capacity',
      tempGuaranteed: 'Temperature Monitored',
      verifiedBadge: 'Verified Truck',
    },
    activeTrip: {
      consignment: 'Booking',
      stages: {
        requested: 'Booking Requested',
        accepted: 'Driver Assigned',
        pickup_confirmed: 'Picked Up',
        in_transit: 'On the Way',
        delivered: 'Delivered',
      },
      telematics: 'Live Tracking',
      speed: 'Speed',
      temperature: 'Truck Temp',
      driverInfo: 'Your Driver',
      callDriver: 'Call Driver',
      openChat: 'Chat with Driver',
      lockedFarePill: 'Locked Fare',
      simulateStage: 'Next Stage',
      fileReport: 'Report a Problem',
      handoffRequired: 'Confirmation Needed',
    },
    surcharge: {
      modalTitle: 'Driver Requested an Extra Fee',
      modalSubtitle: 'Your driver requested an extra fee due to route conditions.',
      reasonLabel: 'Reason & Location',
      lockedFare: 'Original Locked Fare',
      additionalAmount: 'Extra Fee',
      newTotal: 'New Total',
      confirmButton: 'Approve',
      declineButton: 'Decline',
      tollInfo: 'Your fare only changes if you tap Approve.',
    },
    handoff: {
      pickupTitle: 'Confirm Cargo Loaded',
      dropoffTitle: 'Confirm Delivery',
      sealNumber: 'Security Seal Code',
      sealVerified: 'Seal Code Matches',
      inspectionChecklist: 'Quick Checklist',
      signatureLabel: 'Receiver Name',
      confirmPickup: 'Confirm Cargo Loaded',
      confirmDropoff: 'Confirm Delivery',
      escrowNote: 'Payment will only be released after you confirm delivery.',
    },
    report: {
      title: 'Report a Problem',
      empathyNotice: "We're here to help. Your payment is held safely until this is resolved.",
      targetSection: 'What is this regarding?',
      categorySection: "What's the problem?",
      descriptionPlaceholder: 'Tell us what happened...',
      uploadLabel: 'Add photo (optional)',
      submitButton: 'Submit Report',
      statusTitle: 'Problem Report Status',
      escrowProtectedNotice: "We're looking into this. Your payment is held safely until resolved. Our support team is reviewing your report.",
    },
    payment: {
      title: 'Trip Receipt & Payment',
      settlementNotice: 'Delivery confirmed. Review your receipt and complete payment.',
      fareBreakdown: 'Receipt Summary',
      baseFare: 'Base Locked Fare',
      surcharge: 'Approved Extras',
      taxes: 'Taxes (5%)',
      totalAmount: 'Total',
      payWithUpi: 'UPI (GPay, PhonePe, Paytm)',
      payWithCard: 'Debit / Credit Card',
      completePayment: 'Pay',
      processing: 'Processing payment...',
    },
    history: {
      title: 'Trip History',
      totalConsignments: 'Total Trips',
      activeEscrow: 'Active Fare Guarantee',
      filterAll: 'All',
      filterInTransit: 'Active',
      filterDelivered: 'Completed',
      filterDisputed: 'Issues',
    },
    profile: {
      title: 'My Account',
      verifiedConsignor: 'Verified Customer',
      languageHeading: 'App Language',
      escrowAccount: 'Fare Guarantee Account',
      trustScore: 'Customer Rating',
      signOut: 'Sign Out',
    },
    nav: {
      book: 'Book',
      trips: 'Trips',
      chat: 'Chat',
      profile: 'Profile',
    },
  },

  hi: {
    appName: 'Reload',
    login: {
      title: 'Reload में आपका स्वागत है',
      subtitle: 'गारंटीकृत फिक्स्ड किराए के साथ मालवाहक वाहन बुक करें।',
      phoneLabel: 'मोबाइल नंबर',
      phonePlaceholder: '10 अंकों का मोबाइल नंबर दर्ज करें',
      sendCode: 'ओटीपी भेजें',
      transmitting: 'ओटीपी भेजा जा रहा है...',
      termsNotice: 'जारी रखकर, आप Reload की सेवा शर्तों से सहमत हैं।',
    },
    otp: {
      title: 'ओटीपी दर्ज करें',
      subtitle: 'आपके मोबाइल पर भेजा गया 6 अंकों का कोड दर्ज करें।',
      sentTo: 'भेजा गया',
      editNumber: 'नंबर बदलें',
      verifyButton: 'सत्यापित करें और आगे बढ़ें',
      verifying: 'जाँच की जा रही है...',
      resendIn: 'पुनः कोड भेजें',
      resendNow: 'ओटीपी पुनः भेजें',
    },
    booking: {
      title: 'गाड़ी बुक करें',
      pickupLabel: 'पिकअप पता',
      dropoffLabel: 'डिलीवरी पता',
      categoryTitle: 'आप क्या सामान भेज रहे हैं?',
      regulatedNotice: 'दवाओं, कोल्ड-चेन और डेयरी के लिए तापमान नियंत्रित वाहनों की आवश्यकता होती है।',
      routeDetails: 'रूट: हाईवे 48 (842 किमी) • टोल शामिल',
      continueButton: 'गाड़ी चुनें',
      general: 'सामान्य सामान',
      coldChain: 'कोल्ड चेन / प्रशीतित',
      pharma: 'दवाइयां / फार्मा',
      dairy: 'डेयरी व खाद्य सामग्री',
      other: 'भारी या अन्य सामान',
    },
    vehicles: {
      title: 'वाहन चुनें',
      regulatedFilterNotice: 'आपके सामान के लिए केवल सत्यापित तापमान-नियंत्रित वाहन दिखाए जा रहे हैं।',
      fareLockedTitle: 'फिक्स्ड किराए की गारंटी',
      fareLockedSubtitle: 'यह किराया लॉक है। जब तक आप किसी अतिरिक्त शुल्क (जैसे टोल) को मंज़ूरी नहीं देते, यह नहीं बढ़ेगा।',
      confirmBooking: 'पुष्टि करें और किराया लॉक करें',
      dispatching: 'आपकी बुकिंग की पुष्टि हो रही है...',
      payloadCapacity: 'क्षमता',
      tempGuaranteed: 'तापमान निगरानी',
      verifiedBadge: 'सत्यापित ट्रक',
    },
    activeTrip: {
      consignment: 'बुकिंग',
      stages: {
        requested: 'बुकिंग अनुरोध',
        accepted: 'ड्राइवर तय हुआ',
        pickup_confirmed: 'सामान लोड हुआ',
        in_transit: 'रास्ते में है',
        delivered: 'डिलीवर हुआ',
      },
      telematics: 'लाइव ट्रैकिंग',
      speed: 'गति',
      temperature: 'ट्रक तापमान',
      driverInfo: 'आपके ड्राइवर',
      callDriver: 'ड्राइवर को कॉल करें',
      openChat: 'ड्राइवर से चैट करें',
      lockedFarePill: 'फिक्स्ड किराया',
      simulateStage: 'अगला चरण',
      fileReport: 'समस्या बताएं',
      handoffRequired: 'पुष्टि आवश्यक',
    },
    surcharge: {
      modalTitle: 'ड्राइवर ने अतिरिक्त शुल्क का अनुरोध किया',
      modalSubtitle: 'सड़क की स्थिति या टोल के कारण अतिरिक्त शुल्क का अनुरोध किया गया है।',
      reasonLabel: 'कारण और स्थान',
      lockedFare: 'मूल लॉक किया गया किराया',
      additionalAmount: 'अतिरिक्त शुल्क',
      newTotal: 'नया कुल किराया',
      confirmButton: 'स्वीकार करें',
      declineButton: 'अस्वीकार करें',
      tollInfo: 'आपका किराया केवल तभी बदलेगा जब आप स्वीकार करेंगे।',
    },
    handoff: {
      pickupTitle: 'सामान लोड होने की पुष्टि करें',
      dropoffTitle: 'डिलीवरी की पुष्टि करें',
      sealNumber: 'सुरक्षा सील कोड',
      sealVerified: 'सील कोड सही है',
      inspectionChecklist: 'त्वरित चेकलिस्ट',
      signatureLabel: 'प्राप्तकर्ता का नाम',
      confirmPickup: 'सामान लोड होने की पुष्टि करें',
      confirmDropoff: 'डिलीवरी की पुष्टि करें',
      escrowNote: 'डिलीवरी की पुष्टि के बाद ही ड्राइवर को भुगतान जारी किया जाएगा।',
    },
    report: {
      title: 'समस्या दर्ज करें',
      empathyNotice: 'हम आपकी सहायता के लिए हैं। समस्या का समाधान होने तक भुगतान सुरक्षित रूप से रोका जाएगा।',
      targetSection: 'समस्या किससे संबंधित है?',
      categorySection: 'समस्या का प्रकार',
      descriptionPlaceholder: 'कृपया विस्तार से बताएं कि क्या हुआ...',
      uploadLabel: 'फ़ोटो जोड़ें (वैकल्पिक)',
      submitButton: 'रिपोर्ट भेजें',
      statusTitle: 'रिपोर्ट की स्थिति',
      escrowProtectedNotice: 'हम इसकी जाँच कर रहे हैं। आपका भुगतान सुरक्षित रूप से रोका गया है।',
    },
    payment: {
      title: 'रसीद और भुगतान',
      settlementNotice: 'डिलीवरी पूरी हो गई है। रसीद देखकर भुगतान पूरा करें।',
      fareBreakdown: 'बिल विवरण',
      baseFare: 'मूल फिक्स्ड किराया',
      surcharge: 'स्वीकृत अतिरिक्त शुल्क',
      taxes: 'टैक्स (5%)',
      totalAmount: 'कुल राशि',
      payWithUpi: 'UPI (GPay, PhonePe, Paytm)',
      payWithCard: 'डेबिट / क्रेडिट कार्ड',
      completePayment: 'भुगतान करें',
      processing: 'भुगतान प्रोसेस हो रहा है...',
    },
    history: {
      title: 'यात्रा इतिहास',
      totalConsignments: 'कुल यात्राएं',
      activeEscrow: 'सक्रिय सुरक्षित किराया',
      filterAll: 'सभी',
      filterInTransit: 'सक्रिय',
      filterDelivered: 'पूर्ण',
      filterDisputed: 'समस्याएं',
    },
    profile: {
      title: 'मेरा खाता',
      verifiedConsignor: 'सत्यापित ग्राहक',
      languageHeading: 'ऐप की भाषा',
      escrowAccount: 'किराया गारंटी खाता',
      trustScore: 'ग्राहक रेटिंग',
      signOut: 'लॉग आउट',
    },
    nav: {
      book: 'बुक करें',
      trips: 'यात्राएं',
      chat: 'चैट',
      profile: 'प्रोफ़ाइल',
    },
  },

  mr: {
    appName: 'Reload',
    login: {
      title: 'Reload मध्ये आपले स्वागत आहे',
      subtitle: 'हमीभाव असलेल्या फिक्स्ड दरात मालवाहू वाहने बुक करा.',
      phoneLabel: 'मोबाईल नंबर',
      phonePlaceholder: '१० अंकी मोबाईल नंबर टाका',
      sendCode: 'ओटीपी पाठवा',
      transmitting: 'ओटीपी पाठवत आहे...',
      termsNotice: 'पुढे जाऊन तुम्ही Reload च्या सेवा अटींशी सहमत आहात.',
    },
    otp: {
      title: 'ओटीपी टाका',
      subtitle: 'आपल्या मोबाईलवर आलेला ६ अंकी कोड टाका.',
      sentTo: 'पाठवला गेला',
      editNumber: 'नंबर बदला',
      verifyButton: 'सत्यापित करा आणि पुढे जा',
      verifying: 'तपासणी सुरू आहे...',
      resendIn: 'पुन्हा पाठवा',
      resendNow: 'ओटीपी पुन्हा पाठवा',
    },
    booking: {
      title: 'गाडी बुक करा',
      pickupLabel: 'पिकअप पत्ता',
      dropoffLabel: 'डिलिव्हरी पत्ता',
      categoryTitle: 'आपण काय माल पाठवत आहात?',
      regulatedNotice: 'औषधे, कोल्ड-चेन व दुग्धजन्य पदार्थांसाठी तापमान नियंत्रित वाहने आवश्यक आहेत.',
      routeDetails: 'मार्ग: हायवे ४८ (८४२ किमी) • टोल समाविष्ट',
      continueButton: 'वाहन निवडा',
      general: 'सामान्य माल',
      coldChain: 'कोल्ड चेन / शीतगृह',
      pharma: 'औषध निर्माण',
      dairy: 'दुग्ध व नाशवंत माल',
      other: 'जड किंवा इतर माल',
    },
    vehicles: {
      title: 'वाहन निवडा',
      regulatedFilterNotice: 'आपल्या मालासाठी केवळ तापमान नियंत्रित वाहने दाखवली जात आहेत.',
      fareLockedTitle: 'फिक्स्ड भाड्याची हमी',
      fareLockedSubtitle: 'हे भाडे लॉक आहे. आपण अतिरिक्त शुल्क मंजूर केल्याशिवाय ते कधीही वाढणार नाही.',
      confirmBooking: 'पुष्टी करा आणि भाडे लॉक करा',
      dispatching: 'बुकिंग निश्चित होत आहे...',
      payloadCapacity: 'क्षमता',
      tempGuaranteed: 'तापमान देखरेख',
      verifiedBadge: 'सत्यापित ट्रक',
    },
    activeTrip: {
      consignment: 'बुकिंग',
      stages: {
        requested: 'बुकिंग विनंती',
        accepted: 'ड्रायव्हर निश्चित',
        pickup_confirmed: 'माल भरला',
        in_transit: 'मार्गावर आहे',
        delivered: 'पोहोचले',
      },
      telematics: 'थेट ट्रॅकिंग',
      speed: 'वेग',
      temperature: 'ट्रक तापमान',
      driverInfo: 'आपले ड्रायव्हर',
      callDriver: 'ड्रायव्हरला कॉल करा',
      openChat: 'ड्रायव्हरशी चॅट करा',
      lockedFarePill: 'फिक्स्ड भाडे',
      simulateStage: 'पुढचा टप्पा',
      fileReport: 'तक्रार नोंदवा',
      handoffRequired: 'पुष्टी आवश्यक',
    },
    surcharge: {
      modalTitle: 'ड्रायव्हरने अतिरिक्त शुल्काची विनंती केली',
      modalSubtitle: 'मार्गातील परिस्थितीमुळे अतिरिक्त शुल्काची विनंती आली आहे.',
      reasonLabel: 'कारण व ठिकाण',
      lockedFare: 'मूळ लॉक केलेले भाडे',
      additionalAmount: 'अतिरिक्त शुल्क',
      newTotal: 'नवीन एकूण भाडे',
      confirmButton: 'मंजूर करा',
      declineButton: 'नाकारा',
      tollInfo: 'आपण मंजूर केल्याशिवाय भाडे बदलणार नाही.',
    },
    handoff: {
      pickupTitle: 'माल भरल्याची पुष्टी करा',
      dropoffTitle: 'डिलिव्हरीची पुष्टी करा',
      sealNumber: 'सुरक्षा सील कोड',
      sealVerified: 'सील कोड जुळत आहे',
      inspectionChecklist: 'तपासणी यादी',
      signatureLabel: 'स्वीकारणाऱ्याचे नाव',
      confirmPickup: 'माल भरल्याची पुष्टी करा',
      confirmDropoff: 'डिलिव्हरीची पुष्टी करा',
      escrowNote: 'आपण पुष्टी केल्यावरच पैसे दिले जातील.',
    },
    report: {
      title: 'समस्या नोंदवा',
      empathyNotice: 'आम्ही मदतीसाठी आहोत. प्रश्न सुटेपर्यंत पैसे सुरक्षित ठेवले जातील.',
      targetSection: 'तक्रार कोणाविरुद्ध?',
      categorySection: 'समस्येचा प्रकार',
      descriptionPlaceholder: 'काय घडले ते सांगा...',
      uploadLabel: 'फोटो जोडा (ऐच्छिक)',
      submitButton: 'तक्रार सबमिट करा',
      statusTitle: 'तक्रारीची स्थिती',
      escrowProtectedNotice: 'आम्ही चौकशी करत आहोत. आपले पैसे सुरक्षित आहेत.',
    },
    payment: {
      title: 'पावती आणि पेमेंट',
      settlementNotice: 'डिलिव्हरी पूर्ण झाली. पावती तपासा आणि पेमेंट पूर्ण करा.',
      fareBreakdown: 'बिल तपशील',
      baseFare: 'मूळ फिक्स्ड भाडे',
      surcharge: 'मंजूर अतिरिक्त शुल्क',
      taxes: 'कर (५%)',
      totalAmount: 'एकूण रक्कम',
      payWithUpi: 'UPI (GPay, PhonePe, Paytm)',
      payWithCard: 'डेबिट / क्रेडिट कार्ड',
      completePayment: 'पेमेंट करा',
      processing: 'पेमेंट प्रक्रिया सुरू आहे...',
    },
    history: {
      title: 'मागील फेऱ्या',
      totalConsignments: 'एकूण फेऱ्या',
      activeEscrow: 'सक्रिय सुरक्षित भाडे',
      filterAll: 'सर्व',
      filterInTransit: 'सक्रिय',
      filterDelivered: 'पूर्ण झाले',
      filterDisputed: 'समस्या',
    },
    profile: {
      title: 'माझे खाते',
      verifiedConsignor: 'सत्यापित ग्राहक',
      languageHeading: 'अ‍ॅपची भाषा',
      escrowAccount: 'भाडे हमी खाते',
      trustScore: 'ग्राहक रेटिंग',
      signOut: 'बाहेर पडा',
    },
    nav: {
      book: 'बुक करा',
      trips: 'फेऱ्या',
      chat: 'चॅट',
      profile: 'प्रोफाइल',
    },
  },

  gu: {
    appName: 'Reload',
    login: {
      title: 'Reload માં આપનું સ્વાગત છે',
      subtitle: 'ખાતરીપૂર્વકના ફિક્સ્ડ ભાડા સાથે કાર્ગો વાહનો બુક કરો.',
      phoneLabel: 'મોબાઇલ નંબર',
      phonePlaceholder: '10 અંકનો મોબાઇલ નંબર દાખલ કરો',
      sendCode: 'કોડ મોકલો',
      transmitting: 'કોડ મોકલી રહ્યા છીએ...',
      termsNotice: 'આગળ વધીને તમે Reload ની સેવાની શરતો સ્વીકારો છો.',
    },
    otp: {
      title: 'ઓટીપી દાખલ કરો',
      subtitle: 'તમારા ફોન પર મોકલેલો 6 અંકનો કોડ દાખલ કરો.',
      sentTo: 'મોકલેલ',
      editNumber: 'નંબર બદલો',
      verifyButton: 'ચકાસો અને આગળ વધો',
      verifying: 'ચકાસી રહ્યા છીએ...',
      resendIn: 'ફરી મોકલો',
      resendNow: 'ઓટીપી ફરી મોકલો',
    },
    booking: {
      title: 'વાહન બુક કરો',
      pickupLabel: 'પિકઅપ સરનામું',
      dropoffLabel: 'ડિલિવરી સરનામું',
      categoryTitle: 'તમે કયો સામાન મોકલી રહ્યા છો?',
      regulatedNotice: 'દવાઓ, કોલ્ડ-ચેઇન અને ડેરી માટે તાપમાન નિયંત્રિત વાહનો જરૂરી છે.',
      routeDetails: 'રૂટ: હાઇવે 48 (842 કિમી) • ટોલ સમાવિષ્ટ',
      continueButton: 'વાહન પસંદ કરો',
      general: 'સામાન્ય સામાન',
      coldChain: 'કોલ્ડ ચેઇન / રેફ્રિજરેટેડ',
      pharma: 'દવાઓ / ફાર્મા',
      dairy: 'ડેરી અને નાશવંત સામાન',
      other: 'ભારે અથવા અન્ય સામાન',
    },
    vehicles: {
      title: 'વાહન પસંદ કરો',
      regulatedFilterNotice: 'તમારા સામાન માટે ફક્ત માન્ય તાપમાન-નિયંત્રિત વાહનો બતાવવામાં આવ્યા છે.',
      fareLockedTitle: 'ફિક્સ્ડ ભાડાની ખાતરી',
      fareLockedSubtitle: 'આ ભાડું લોક છે. જ્યાં સુધી તમે વધારાનો ચાર્જ મંજૂર ન કરો ત્યાં સુધી તે ક્યારેય વધશે નહીં.',
      confirmBooking: 'ખાતરી કરો અને ભાડું લોક કરો',
      dispatching: 'બુકિંગ કન્ફર્મ થઈ રહ્યું છે...',
      payloadCapacity: 'ક્ષમતા',
      tempGuaranteed: 'તાપમાન દેખરેખ',
      verifiedBadge: 'માન્ય ટ્રક',
    },
    activeTrip: {
      consignment: 'બુકિંગ',
      stages: {
        requested: 'બુકિંગ વિનંતી',
        accepted: 'ડ્રાઇવર ફાળવ્યો',
        pickup_confirmed: 'સામાન લોડ થયો',
        in_transit: 'રસ્તામાં છે',
        delivered: 'પહોંચી ગયું',
      },
      telematics: 'લાઇવ ટ્રેકિંગ',
      speed: 'ઝડપ',
      temperature: 'ટ્રક તાપમાન',
      driverInfo: 'તમારા ડ્રાઇવર',
      callDriver: 'ડ્રાઇવરને કૉલ કરો',
      openChat: 'ડ્રાઇવર સાથે વાતચીત',
      lockedFarePill: 'ફિક્સ્ડ ભાડું',
      simulateStage: 'આગલું પગલું',
      fileReport: 'સમસ્યા જણાવો',
      handoffRequired: 'ખાતરી જરૂરી',
    },
    surcharge: {
      modalTitle: 'ડ્રાઇવરે વધારાના ચાર્જની વિનંતી કરી',
      modalSubtitle: 'રસ્તાની સ્થિતિને કારણે વધારાના ચાર્જની વિનંતી આવી છે.',
      reasonLabel: 'કારણ અને સ્થળ',
      lockedFare: 'મૂળ લોક કરેલ ભાડું',
      additionalAmount: 'વધારાનો ચાર્જ',
      newTotal: 'નવું કુલ ભાડું',
      confirmButton: 'મંજૂર કરો',
      declineButton: 'નકારો',
      tollInfo: 'તમે મંજૂર કરશો તો જ ભાડું બદલાશે.',
    },
    handoff: {
      pickupTitle: 'સામાન લોડ થયાની ખાતરી કરો',
      dropoffTitle: 'ડિલિવરીની ખાતરી કરો',
      sealNumber: 'સુરક્ષા સીલ કોડ',
      sealVerified: 'સીલ કોડ બરાબર છે',
      inspectionChecklist: 'તપાસ યાદી',
      signatureLabel: 'સ્વીકારનારનું નામ',
      confirmPickup: 'સામાન લોડ થયાની ખાતરી કરો',
      confirmDropoff: 'ડિલિવરીની ખાતરી કરો',
      escrowNote: 'તમે ડિલિવરીની ખાતરી આપશો પછી જ પેમેન્ટ રિલીઝ થશે.',
    },
    report: {
      title: 'સમસ્યા જણાવો',
      empathyNotice: 'અમે તમારી મદદ માટે છીએ. સમસ્યાનો ઉકેલ ન આવે ત્યાં સુધી પેમેન્ટ સુરક્ષિત રહેશે.',
      targetSection: 'સમસ્યા કોના વિશે છે?',
      categorySection: 'સમસ્યાનો પ્રકાર',
      descriptionPlaceholder: 'શું થયું તે વિગતવાર જણાવો...',
      uploadLabel: 'ફોટો ઉમેરો (વૈકલ્પિક)',
      submitButton: 'રિપોર્ટ સબમિટ કરો',
      statusTitle: 'રિપોર્ટની સ્થિતિ',
      escrowProtectedNotice: 'અમે આની તપાસ કરી રહ્યા છીએ. તમારું પેમેન્ટ સુરક્ષિત છે.',
    },
    payment: {
      title: 'રસીદ અને ચુકવણી',
      settlementNotice: 'ડિલિવરી પૂર્ણ થઈ છે. રસીદ જુઓ અને ચુકવણી પૂર્ણ કરો.',
      fareBreakdown: 'બિલ વિગતો',
      baseFare: 'મૂળ ફિક્સ્ડ ભાડું',
      surcharge: 'મંજૂર કરેલ વધારાનો ચાર્જ',
      taxes: 'કર (5%)',
      totalAmount: 'કુલ રકમ',
      payWithUpi: 'UPI (GPay, PhonePe, Paytm)',
      payWithCard: 'ડેબિટ / ક્રેડિટ કાર્ડ',
      completePayment: 'ચુકવણી કરો',
      processing: 'ચુકવણી પ્રોસેસ થઈ રહી છે...',
    },
    history: {
      title: 'ટ્રિપ હિસ્ટ્રી',
      totalConsignments: 'કુલ ટ્રિપ્સ',
      activeEscrow: 'સક્રિય ગેરંટી ભાડું',
      filterAll: 'બધું',
      filterInTransit: 'ચાલુ',
      filterDelivered: 'પૂર્ણ થયેલ',
      filterDisputed: 'સમસ્યાઓ',
    },
    profile: {
      title: 'મારું એકાઉન્ટ',
      verifiedConsignor: 'માન્ય ગ્રાહક',
      languageHeading: 'એપ્લિકેશન ભાષા',
      escrowAccount: 'ભાડા ગેરંટી એકાઉન્ટ',
      trustScore: 'ગ્રાહક રેટિંગ',
      signOut: 'સાઇન આઉટ',
    },
    nav: {
      book: 'બુકિંગ',
      trips: 'ટ્રિપ્સ',
      chat: 'ચેટ',
      profile: 'પ્રોફાઇલ',
    },
  },

  ta: {
    appName: 'Reload',
    login: {
      title: 'Reload-க்கு வரவேற்கிறோம்',
      subtitle: 'உறுதிசெய்யப்பட்ட நிலையான கட்டணத்தில் சரக்கு வாகனங்களை புக் செய்யுங்கள்.',
      phoneLabel: 'மொபைல் எண்',
      phonePlaceholder: '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்',
      sendCode: 'குறியீடு அனுப்புக',
      transmitting: 'குறியீடு அனுப்பப்படுகிறது...',
      termsNotice: 'தொடர்வதன் மூலம் Reload சேவை விதிமுறைகளை ஏற்கிறீர்கள்.',
    },
    otp: {
      title: 'OTP குறியீட்டை உள்ளிடவும்',
      subtitle: 'உங்கள் போனுக்கு அனுப்பப்பட்ட 6 இலக்கக் குறியீட்டை உள்ளிடவும்.',
      sentTo: 'அனுப்பப்பட்டது',
      editNumber: 'எண்ணை மாற்றுக',
      verifyButton: 'சரிபார்த்து தொடரவும்',
      verifying: 'சரிபார்க்கப்படுகிறது...',
      resendIn: 'மீண்டும் அனுப்ப',
      resendNow: 'மீண்டும் OTP அனுப்புக',
    },
    booking: {
      title: 'சரக்கு வாகனம் புக் செய்ய',
      pickupLabel: 'பிக்கப் முகவரி',
      dropoffLabel: 'டெலிவரி முகவரி',
      categoryTitle: 'நீங்கள் என்ன சரக்கு அனுப்புகிறீர்கள்?',
      regulatedNotice: 'மருந்துகள், குளிர்சாதனப் பொருட்கள் மற்றும் பால் பொருட்களுக்கு வெப்பநிலை கட்டுப்படுத்தப்பட்ட வாகனங்கள் தேவை.',
      routeDetails: 'வழித்தடம்: நெடுஞ்சாலை 48 (842 கி.மீ) • சுங்கக் கட்டணம் அடங்கும்',
      continueButton: 'வாகனத்தைத் தேர்ந்தெடுக்கவும்',
      general: 'பொதுவான பொருட்கள்',
      coldChain: 'குளிர்சாதனப் பொருட்கள்',
      pharma: 'மருந்துகள் / பார்மா',
      dairy: 'பால் மற்றும் அழுகும் பொருட்கள்',
      other: 'கனரக அல்லது பிற பொருட்கள்',
    },
    vehicles: {
      title: 'வாகனத்தைத் தேர்ந்தெடுக்கவும்',
      regulatedFilterNotice: 'உங்கள் சரக்கிற்கு ஏற்ற வெப்பநிலை கட்டுப்படுத்தப்பட்ட வாகனங்கள் மட்டுமே காட்டப்படுகின்றன.',
      fareLockedTitle: 'நிலையான கட்டண உத்தரவாதம்',
      fareLockedSubtitle: 'இந்தக் கட்டணம் மாற்றத்திற்கு உட்படாது. கூடுதல் கட்டணத்தை நீங்கள் அங்கீகரித்தால் மட்டுமே மாறும்.',
      confirmBooking: 'உறுதிசெய்து கட்டணத்தை லாக் செய்யவும்',
      dispatching: 'முன்பதிவு உறுதிசெய்யப்படுகிறது...',
      payloadCapacity: 'கொள்ளளவு',
      tempGuaranteed: 'வெப்பநிலை கண்காணிக்கப்படுகிறது',
      verifiedBadge: 'சரிபார்க்கப்பட்ட லாரி',
    },
    activeTrip: {
      consignment: 'முன்பதிவு',
      stages: {
        requested: 'முன்பதிவு கோரப்பட்டது',
        accepted: 'ஓட்டுநர் நியமிக்கப்பட்டார்',
        pickup_confirmed: 'சரக்கு ஏற்றப்பட்டது',
        in_transit: 'வழியில் உள்ளது',
        delivered: 'டெலிவரி செய்யப்பட்டது',
      },
      telematics: 'நேரடி கண்காணிப்பு',
      speed: 'வேகம்',
      temperature: 'வாகன வெப்பநிலை',
      driverInfo: 'உங்கள் ஓட்டுநர்',
      callDriver: 'ஓட்டுநரை அழைக்கவும்',
      openChat: 'ஓட்டுநருடன் அரட்டையடிக்கவும்',
      lockedFarePill: 'நிலையான கட்டணம்',
      simulateStage: 'அடுத்த நிலை',
      fileReport: 'சிக்கலைப் புகாரளிக்கவும்',
      handoffRequired: 'உறுதிப்படுத்தல் தேவை',
    },
    surcharge: {
      modalTitle: 'ஓட்டுநர் கூடுதல் கட்டணம் கோரியுள்ளார்',
      modalSubtitle: 'பயண சூழல் காரணமாக கூடுதல் கட்டணம் கோரப்பட்டுள்ளது.',
      reasonLabel: 'காரணம் மற்றும் இடம்',
      lockedFare: 'அசல் நிலையான கட்டணம்',
      additionalAmount: 'கூடுதல் கட்டணம்',
      newTotal: 'புதிய மொத்த கட்டணம்',
      confirmButton: 'அங்கீகரி',
      declineButton: 'நிராகரி',
      tollInfo: 'நீங்கள் அங்கீகரித்தால் மட்டுமே கட்டணம் மாறும்.',
    },
    handoff: {
      pickupTitle: 'சரக்கு ஏற்றப்பட்டதை உறுதிப்படுத்தவும்',
      dropoffTitle: 'டெலிவரியை உறுதிப்படுத்தவும்',
      sealNumber: 'பாதுகாப்பு முத்திரை குறியீடு',
      sealVerified: 'முத்திரை சரியாக உள்ளது',
      inspectionChecklist: 'விரைவு சரிபார்ப்பு பட்டியல்',
      signatureLabel: 'பெறுபவர் பெயர்',
      confirmPickup: 'சரக்கு ஏற்றப்பட்டதை உறுதிப்படுத்தவும்',
      confirmDropoff: 'டெலிவரியை உறுதிப்படுத்தவும்',
      escrowNote: 'நீங்கள் டெலிவரியை உறுதிப்படுத்திய பிறகே பணம் விடுவிக்கப்படும்.',
    },
    report: {
      title: 'சிக்கலைப் புகாரளிக்கவும்',
      empathyNotice: 'உங்களுக்கு உதவ நாங்கள் இருக்கிறோம். தீர்வு காணும் வரை உங்கள் பணம் பாதுகாப்பாக நிறுத்திவைக்கப்படும்.',
      targetSection: 'யாருக்கு எதிராக புகார்?',
      categorySection: 'சிக்கலின் வகை',
      descriptionPlaceholder: 'என்ன நடந்தது என்பதை விவரிக்கவும்...',
      uploadLabel: 'புகைப்படம் சேர்க்கவும் (விருப்பத்தேர்வு)',
      submitButton: 'புகாரைச் சமர்ப்பிக்கவும்',
      statusTitle: 'புகார் நிலை',
      escrowProtectedNotice: 'நாங்கள் இதை ஆய்வு செய்கிறோம். உங்கள் பணம் பாதுகாப்பாக உள்ளது.',
    },
    payment: {
      title: 'ரசீது மற்றும் பணம் செலுத்துதல்',
      settlementNotice: 'டெலிவரி முடிந்தது. ரசீதைச் சரிபார்த்து கட்டணத்தைச் செலுத்தவும்.',
      fareBreakdown: 'ரசீது விவரம்',
      baseFare: 'அடிப்படை நிலையான கட்டணம்',
      surcharge: 'அங்கீகரிக்கப்பட்ட கூடுதல் கட்டணம்',
      taxes: 'வரிகள் (5%)',
      totalAmount: 'மொத்தத் தொகை',
      payWithUpi: 'UPI (GPay, PhonePe, Paytm)',
      payWithCard: 'டெபிட் / கிரெடிட் கார்டு',
      completePayment: 'பணம் செலுத்தவும்',
      processing: 'பணம் செயலாக்கப்படுகிறது...',
    },
    history: {
      title: 'பயண வரலாறு',
      totalConsignments: 'மொத்தப் பயணங்கள்',
      activeEscrow: 'செயலில் உள்ள பாதுகாப்புக் கட்டணம்',
      filterAll: 'அனைத்தும்',
      filterInTransit: 'செயலில் உள்ளவை',
      filterDelivered: 'முடிந்தவை',
      filterDisputed: 'சிக்கல்கள்',
    },
    profile: {
      title: 'என் கணக்கு',
      verifiedConsignor: 'சரிபார்க்கப்பட்ட வாடிக்கையாளர்',
      languageHeading: 'பயன்பாட்டு மொழி',
      escrowAccount: 'கட்டண உத்தரவாத கணக்கு',
      trustScore: 'வாடிக்கையாளர் மதிப்பீடு',
      signOut: 'வெளியேறு',
    },
    nav: {
      book: 'முன்பதிவு',
      trips: 'பயணங்கள்',
      chat: 'அரட்டை',
      profile: 'சுயவிவரம்',
    },
  },

  te: {
    appName: 'Reload',
    login: {
      title: 'Reload కు స్వాగతం',
      subtitle: 'హామీ ఇచ్చిన స్థిరమైన ఛార్జీతో సరుకు రవాణా వాహనాలను బుక్ చేయండి.',
      phoneLabel: 'మొబైల్ నంబర్',
      phonePlaceholder: '10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి',
      sendCode: 'ఓటీపీ పంపండి',
      transmitting: 'ఓటీపీ పంపబడుతోంది...',
      termsNotice: 'కొనసాగడం ద్వారా మీరు Reload సేవా నిబంధనలను అంగీకరిస్తున్నారు.',
    },
    otp: {
      title: 'ఓటీపీ నమోదు చేయండి',
      subtitle: 'మీ ఫోన్‌కు పంపిన 6 అంకెల కోడ్‌ను నమోదు చేయండి.',
      sentTo: 'పంపబడింది',
      editNumber: 'నంబర్ మార్చండి',
      verifyButton: 'ధృవీకరించి కొనసాగండి',
      verifying: 'ధృవీకరిస్తోంది...',
      resendIn: 'మళ్లీ పంపడానికి',
      resendNow: 'ఓటీపీ మళ్లీ పంపండి',
    },
    booking: {
      title: 'వాహనం బుక్ చేయండి',
      pickupLabel: 'పికప్ చిరునామా',
      dropoffLabel: 'డెలివరీ చిరునామా',
      categoryTitle: 'మీరు ఏ సరుకు పంపుతున్నారు?',
      regulatedNotice: 'మందులు, కోల్డ్-చైన్ మరియు పాల ఉత్పత్తులకు ఉష్ణోగ్రత నియంత్రిత వాహనాలు అవసరం.',
      routeDetails: 'మార్గం: హైవే 48 (842 కి.మీ) • టోల్ ఛార్జీలు చేర్చబడ్డాయి',
      continueButton: 'వాహనాన్ని ఎంచుకోండి',
      general: 'సాధారణ సరుకులు',
      coldChain: 'కోల్డ్ చైన్ / శీతలీకరించిన',
      pharma: 'మందులు / ఫార్మా',
      dairy: 'పాల & పాడయ్యే పదార్థాలు',
      other: 'భారీ లేదా ఇతర సరుకులు',
    },
    vehicles: {
      title: 'వాహనాన్ని ఎంచుకోండి',
      regulatedFilterNotice: 'మీ సరుకు కోసం ఉష్ణోగ్రత నియంత్రణ ఉన్న వాహనాలు మాత్రమే చూపబడుతున్నాయి.',
      fareLockedTitle: 'స్థిర ఛార్జీ హామీ',
      fareLockedSubtitle: 'ఈ ఛార్జీ లాక్ చేయబడింది. మీరు అదనపు ఛార్జీని ఆమోదిస్తే తప్ప ఇది పెరగదు.',
      confirmBooking: 'ధృవీకరించి ఛార్జీని లాక్ చేయండి',
      dispatching: 'బుకింగ్ నిర్ధారించబడుతోంది...',
      payloadCapacity: 'సామర్థ్యం',
      tempGuaranteed: 'ఉష్ణోగ్రత పర్యవేక్షణ',
      verifiedBadge: 'ధృవీకరించిన ట్రక్కు',
    },
    activeTrip: {
      consignment: 'బుకింగ్',
      stages: {
        requested: 'బుకింగ్ అభ్యర్థన',
        accepted: 'డ్రైవర్ కేటాయించబడ్డారు',
        pickup_confirmed: 'సరుకు లోడ్ అయింది',
        in_transit: 'దారిలో ఉంది',
        delivered: 'డెలివరీ అయింది',
      },
      telematics: 'లైవ్ ట్రాకింగ్',
      speed: 'వేగం',
      temperature: 'ట్రక్కు ఉష్ణోగ్రత',
      driverInfo: 'మీ డ్రైవర్',
      callDriver: 'డ్రైవర్‌కు కాల్ చేయండి',
      openChat: 'డ్రైవర్‌తో చాట్ చేయండి',
      lockedFarePill: 'స్థిర ఛార్జీ',
      simulateStage: 'తదుపరి దశ',
      fileReport: 'సమస్యను తెలపండి',
      handoffRequired: 'ధృవీకరణ అవసరం',
    },
    surcharge: {
      modalTitle: 'డ్రైవర్ అదనపు రుసుమును కోరారు',
      modalSubtitle: 'రోడ్డు పరిస్థితుల కారణంగా అదనపు రుసుము అభ్యర్థన వచ్చింది.',
      reasonLabel: 'కారణం మరియు ప్రదేశం',
      lockedFare: 'అసలు లాక్ చేసిన ఛార్జీ',
      additionalAmount: 'అదనపు రుసుము',
      newTotal: 'కొత్త మొత్తం ఛార్జీ',
      confirmButton: 'ఆమోదించండి',
      declineButton: 'తిరస్కరించండి',
      tollInfo: 'మీరు ఆమోదిస్తేనే ఛార్జీ మారుతుంది.',
    },
    handoff: {
      pickupTitle: 'సరుకు లోడ్ అయినట్లు నిర్ధారించండి',
      dropoffTitle: 'డెలివరీని నిర్ధారించండి',
      sealNumber: 'సెక్యూరిటీ సీల్ కోడ్',
      sealVerified: 'సీల్ సరిగ్గా ఉంది',
      inspectionChecklist: 'త్వరిత తనిఖీ జాబితా',
      signatureLabel: 'స్వీకర్త పేరు',
      confirmPickup: 'సరుకు లోడ్ అయినట్లు నిర్ధారించండి',
      confirmDropoff: 'డెలివరీని నిర్ధారించండి',
      escrowNote: 'మీరు డెలివరీ నిర్ధారించిన తర్వాతే డ్రైవర్‌కు చెల్లింపు విడుదల చేయబడుతుంది.',
    },
    report: {
      title: 'సమస్యను తెలపండి',
      empathyNotice: 'సహాయం చేయడానికి మేము ఉన్నాము. సమస్య పరిష్కారమయ్యే వరకు మీ చెల్లింపు సురక్షితంగా నిలిపివేయబడుతుంది.',
      targetSection: 'సమస్య దేనికి సంబంధించింది?',
      categorySection: 'సమస్య రకం',
      descriptionPlaceholder: 'ఏమి జరిగిందో వివరంగా చెప్పండి...',
      uploadLabel: 'ఫోటో జోడించండి (ఐచ్ఛికం)',
      submitButton: 'నివేదికను సమర్పించండి',
      statusTitle: 'నివేదిక స్థితి',
      escrowProtectedNotice: 'మేము దీనిని పరిశీలిస్తున్నాము. మీ చెల్లింపు సురక్షితంగా ఉంది.',
    },
    payment: {
      title: 'రసీదు మరియు చెల్లింపు',
      settlementNotice: 'డెలివరీ పూర్తయింది. రసీదును పరిశీలించి చెల్లింపు పూర్తి చేయండి.',
      fareBreakdown: 'బిల్లు వివరాలు',
      baseFare: 'ప్రాథమిక స్థిర ఛార్జీ',
      surcharge: 'ఆమోదించిన అదనపు ఛార్జీలు',
      taxes: 'పన్నులు (5%)',
      totalAmount: 'మొత్తం మొత్తం',
      payWithUpi: 'UPI (GPay, PhonePe, Paytm)',
      payWithCard: 'డెబిట్ / క్రెడిట్ కార్డు',
      completePayment: 'చెల్లించండి',
      processing: 'చెల్లింపు ప్రక్రియలో ఉంది...',
    },
    history: {
      title: 'ట్రిప్ హిస్టరీ',
      totalConsignments: 'మొత్తం ట్రిప్పులు',
      activeEscrow: 'క్రియాశీల హామీ ఛార్జీ',
      filterAll: 'అన్నీ',
      filterInTransit: 'క్రియాశీలకంగా ఉన్నవి',
      filterDelivered: 'పూర్తయినవి',
      filterDisputed: 'సమస్యలు',
    },
    profile: {
      title: 'నా ఖాతా',
      verifiedConsignor: 'ధృవీకరించిన కస్టమర్',
      languageHeading: 'యాప్ భాష',
      escrowAccount: 'ఛార్జీ హామీ ఖాతా',
      trustScore: 'కస్టమర్ రేటింగ్',
      signOut: 'లాగ్ అవుట్',
    },
    nav: {
      book: 'బుక్ చేయండి',
      trips: 'ట్రిప్పులు',
      chat: 'చాట్',
      profile: 'ప్రొఫైల్',
    },
  },

  kn: {
    appName: 'Reload',
    login: {
      title: 'Reload ಗೆ ಸುಸ್ವಾಗತ',
      subtitle: 'ಖಾತರಿಯಾದ ನಿಶ್ಚಿತ ದರದಲ್ಲಿ ಸರಕು ವಾಹನಗಳನ್ನು ಬುಕ್ ಮಾಡಿ.',
      phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      phonePlaceholder: '10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
      sendCode: 'ಕೋಡ್ ಕಳುಹಿಸಿ',
      transmitting: 'ಕೋಡ್ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
      termsNotice: 'ಮುಂದುವರಿಯುವ ಮೂಲಕ ನೀವು Reload ನ ಸೇವಾ ನಿಯಮಗಳನ್ನು ಒಪ್ಪುತ್ತೀರಿ.',
    },
    otp: {
      title: 'OTP ಕೋಡ್ ನಮೂದಿಸಿ',
      subtitle: 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಕಳುಹಿಸಲಾದ 6 ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ.',
      sentTo: 'ಕಳುಹಿಸಲಾಗಿದೆ',
      editNumber: 'ಸಂಖ್ಯೆ ಬದಲಾಯಿಸಿ',
      verifyButton: 'ಪರಿಶೀಲಿಸಿ ಮುಂದುವರಿಯಿರಿ',
      verifying: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
      resendIn: 'ಮತ್ತೆ ಕಳುಹಿಸಲು',
      resendNow: 'OTP ಮತ್ತೆ ಕಳುಹಿಸಿ',
    },
    booking: {
      title: 'ಸರಕು ವಾಹನ ಬುಕ್ ಮಾಡಿ',
      pickupLabel: 'ಪಿಕಪ್ ವಿಳಾಸ',
      dropoffLabel: 'ಡೆಲಿವರಿ ವಿಳಾಸ',
      categoryTitle: 'ನೀವು ಯಾವ ಸರಕು ಕಳುಹಿಸುತ್ತಿದ್ದೀರಿ?',
      regulatedNotice: 'ಔಷಧಿಗಳು, ಕೋಲ್ಡ್-ಚೈನ್ ಮತ್ತು ಡೈರಿ ಉತ್ಪನ್ನಗಳಿಗೆ ತಾಪಮಾನ ನಿಯಂತ್ರಿತ ವಾಹನಗಳ ಅಗತ್ಯವಿದೆ.',
      routeDetails: 'ಮಾರ್ಗ: ಹೆದ್ದಾರಿ 48 (842 ಕಿ.ಮೀ) • ಟೋಲ್ ಸೇರಿದೆ',
      continueButton: 'ವಾಹನ ಆಯ್ಕೆಮಾಡಿ',
      general: 'ಸಾಮಾನ್ಯ ಸರಕು',
      coldChain: 'ಕೋಲ್ಡ್ ಚೈನ್ / ಶೀತಲೀಕೃತ',
      pharma: 'ಔಷಧಿಗಳು / ಫಾರ್ಮಾ',
      dairy: 'ಡೈರಿ ಮತ್ತು ಹಾಳಾಗುವ ಸರಕುಗಳು',
      other: 'ಭಾರೀ ಅಥವಾ ಇತರ ಸರಕುಗಳು',
    },
    vehicles: {
      title: 'ವಾಹನ ಆಯ್ಕೆಮಾಡಿ',
      regulatedFilterNotice: 'ನಿಮ್ಮ ಸರಕಿಗಾಗಿ ತಾಪಮಾನ ನಿಯಂತ್ರಣವಿರುವ ವಾಹನಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಲಾಗುತ್ತಿದೆ.',
      fareLockedTitle: 'ನಿಶ್ಚಿತ ದರದ ಖಾತರಿ',
      fareLockedSubtitle: 'ಈ ದರವು ಲಾಕ್ ಆಗಿದೆ. ನೀವು ಹೆಚ್ಚುವರಿ ಶುಲ್ಕವನ್ನು ಅನುಮೋದಿಸದ ಹೊರತು ಇದು ಹೆಚ್ಚಾಗುವುದಿಲ್ಲ.',
      confirmBooking: 'ಖಚಿತಪಡಿಸಿ ದರವನ್ನು ಲಾಕ್ ಮಾಡಿ',
      dispatching: 'ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಲಾಗುತ್ತಿದೆ...',
      payloadCapacity: 'ಸಾಮರ್ಥ್ಯ',
      tempGuaranteed: 'ತಾಪಮಾನ ಮೇಲ್ವಿಚಾರಣೆ',
      verifiedBadge: 'ಪರಿಶೀಲಿಸಿದ ಟ್ರಕ್',
    },
    activeTrip: {
      consignment: 'ಬುಕಿಂಗ್',
      stages: {
        requested: 'ಬುಕಿಂಗ್ ವಿನಂತಿ',
        accepted: 'ಚಾಲಕರನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ',
        pickup_confirmed: 'ಸರಕು ಲೋಡ್ ಮಾಡಲಾಗಿದೆ',
        in_transit: 'ದಾರಿಯಲ್ಲಿದೆ',
        delivered: 'ಡೆಲಿವರಿ ಆಗಿದೆ',
      },
      telematics: 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
      speed: 'ವೇಗ',
      temperature: 'ಟ್ರಕ್ ತಾಪಮಾನ',
      driverInfo: 'ನಿಮ್ಮ ಚಾಲಕರು',
      callDriver: 'ಚಾಲಕರಿಗೆ ಕರೆ ಮಾಡಿ',
      openChat: 'ಚಾಲಕರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ',
      lockedFarePill: 'ನಿಶ್ಚಿತ ದರ',
      simulateStage: 'ಮುಂದಿನ ಹಂತ',
      fileReport: 'ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ',
      handoffRequired: 'ದೃಢೀಕರಣ ಅಗತ್ಯವಿದೆ',
    },
    surcharge: {
      modalTitle: 'ಚಾಲಕರು ಹೆಚ್ಚುವರಿ ಶುಲ್ಕವನ್ನು ಕೋರಿದ್ದಾರೆ',
      modalSubtitle: 'ರಸ್ತೆ ಪರಿಸ್ಥಿತಿಗಳಿಂದಾಗಿ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕದ ವಿನಂತಿ ಬಂದಿದೆ.',
      reasonLabel: 'ಕಾರಣ ಮತ್ತು ಸ್ಥಳ',
      lockedFare: 'ಮೂಲ ಲಾಕ್ ಆದ ದರ',
      additionalAmount: 'ಹೆಚ್ಚುವರಿ ಶುಲ್ಕ',
      newTotal: 'ಹೊಸ ಒಟ್ಟು ದರ',
      confirmButton: 'ಅನುಮೋದಿಸಿ',
      declineButton: 'ತಿರಸ್ಕರಿಸಿ',
      tollInfo: 'ನೀವು ಅನುಮೋದಿಸಿದರೆ ಮಾತ್ರ ದರ ಬದಲಾಗುತ್ತದೆ.',
    },
    handoff: {
      pickupTitle: 'ಸರಕು ಲೋಡ್ ಆಗಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿ',
      dropoffTitle: 'ಡೆಲಿವರಿಯನ್ನು ಖಚಿತಪಡಿಸಿ',
      sealNumber: 'ಭದ್ರತಾ ಸೀಲ್ ಕೋಡ್',
      sealVerified: 'ಸೀಲ್ ಕೋಡ್ ಸರಿಯಾಗಿದೆ',
      inspectionChecklist: 'ತ್ವರಿತ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ',
      signatureLabel: 'ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು',
      confirmPickup: 'ಸರಕು ಲೋಡ್ ಆಗಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿ',
      confirmDropoff: 'ಡೆಲಿವರಿಯನ್ನು ಖಚಿತಪಡಿಸಿ',
      escrowNote: 'ನೀವು ಡೆಲಿವರಿಯನ್ನು ದೃಢಪಡಿಸಿದ ನಂತರವೇ ಚಾಲಕರಿಗೆ ಹಣ ಬಿಡುಗಡೆಯಾಗುತ್ತದೆ.',
    },
    report: {
      title: 'ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ',
      empathyNotice: 'ನಿಮ್ಮ ನೆರವಿಗೆ ನಾವಿದ್ದೇವೆ. ಸಮಸ್ಯೆ ಬಗೆಹರಿಯುವವರೆಗೆ ಹಣವನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ತಡೆಹಿಡಿಯಲಾಗುತ್ತದೆ.',
      targetSection: 'ಸಮಸ್ಯೆ ಯಾರ ಕುರಿತು?',
      categorySection: 'ಸಮಸ್ಯೆಯ ಪ್ರಕಾರ',
      descriptionPlaceholder: 'ಏನಾಯಿತು ಎಂಬುದನ್ನು ವಿವರಿಸಿ...',
      uploadLabel: 'ಫೋಟೋ ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)',
      submitButton: 'ವರದಿ ಸಲ್ಲಿಸಿ',
      statusTitle: 'ವರದಿ ಸ್ಥಿತಿ',
      escrowProtectedNotice: 'ನಾವು ಇದನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದೇವೆ. ನಿಮ್ಮ ಹಣ ಸುರಕ್ಷಿತವಾಗಿದೆ.',
    },
    payment: {
      title: 'ರಶೀದಿ ಮತ್ತು ಪಾವತಿ',
      settlementNotice: 'ಡೆಲಿವರಿ ಪೂರ್ಣಗೊಂಡಿದೆ. ರಶೀದಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಪಾವತಿ ಪೂರ್ಣಗೊಳಿಸಿ.',
      fareBreakdown: 'ಬಿಲ್ ವಿವರಗಳು',
      baseFare: 'ಮೂಲ ನಿಶ್ಚಿತ ದರ',
      surcharge: 'ಅನುಮೋದಿತ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕ',
      taxes: 'ತೆರಿಗೆಗಳು (5%)',
      totalAmount: 'ಒಟ್ಟು ಮೊತ್ತ',
      payWithUpi: 'UPI (GPay, PhonePe, Paytm)',
      payWithCard: 'ಡೆಬಿಟ್ / ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್',
      completePayment: 'ಪಾವತಿಸಿ',
      processing: 'ಪಾವತಿ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...',
    },
    history: {
      title: 'ಟ್ರಿಪ್ ಇತಿಹಾಸ',
      totalConsignments: 'ಒಟ್ಟು ಟ್ರಿಪ್‌ಗಳು',
      activeEscrow: 'ಸಕ್ರಿಯ ಖಾತರಿ ದರ',
      filterAll: 'ಎಲ್ಲಾ',
      filterInTransit: 'ಸಕ್ರಿಯ',
      filterDelivered: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
      filterDisputed: 'ಸಮಸ್ಯೆಗಳು',
    },
    profile: {
      title: 'ನನ್ನ ಖಾತೆ',
      verifiedConsignor: 'ಪರಿಶೀಲಿಸಿದ ಗ್ರಾಹಕರು',
      languageHeading: 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ',
      escrowAccount: 'ದರ ಖಾತರಿ ಖಾತೆ',
      trustScore: 'ಗ್ರಾಹಕರ ರೇಟಿಂಗ್',
      signOut: 'ಸೈನ್ ಔಟ್',
    },
    nav: {
      book: 'ಬುಕ್ ಮಾಡಿ',
      trips: 'ಟ್ರಿಪ್‌ಗಳು',
      chat: 'ಚಾಟ್',
      profile: 'ಪ್ರೊಫೈಲ್',
    },
  },
};

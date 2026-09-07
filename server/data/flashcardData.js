const FLASHCARD_DATA = {
  animals: [
    { id: "animal-1", emoji: "🐄", hindi: "गाय" },
    { id: "animal-2", emoji: "🐕", hindi: "कुत्ता" },
    { id: "animal-3", emoji: "🐈", hindi: "बिल्ली" },
    { id: "animal-4", emoji: "🐘", hindi: "हाथी" },
    { id: "animal-5", emoji: "🐎", hindi: "घोड़ा" },
    { id: "animal-6", emoji: "🐐", hindi: "बकरी" },
    { id: "animal-7", emoji: "🦁", hindi: "शेर" },
    { id: "animal-8", emoji: "🐒", hindi: "बंदर" },
  ],

  fruits: [
    { id: "fruit-1", emoji: "🍎", hindi: "सेब" },
    { id: "fruit-2", emoji: "🍌", hindi: "केला" },
    { id: "fruit-3", emoji: "🥭", hindi: "आम" },
    { id: "fruit-4", emoji: "🍊", hindi: "संतरा" },
    { id: "fruit-5", emoji: "🍇", hindi: "अंगूर" },
    { id: "fruit-6", emoji: "🍉", hindi: "तरबूज" },
    { id: "fruit-7", emoji: "🍍", hindi: "अनानास" },
    { id: "fruit-8", emoji: "🍓", hindi: "स्ट्रॉबेरी" },
  ],

  vegetables: [
    { id: "veg-1", emoji: "🥕", hindi: "गाजर" },
    { id: "veg-2", emoji: "🥔", hindi: "आलू" },
    { id: "veg-3", emoji: "🍅", hindi: "टमाटर" },
    { id: "veg-4", emoji: "🌽", hindi: "मक्का" },
    { id: "veg-5", emoji: "🥒", hindi: "खीरा" },
    { id: "veg-6", emoji: "🧅", hindi: "प्याज" },
    { id: "veg-7", emoji: "🥬", hindi: "पालक" },
    { id: "veg-8", emoji: "🍆", hindi: "बैंगन" },
  ],

  colors: [
    { id: "color-1", emoji: "🔴", hindi: "लाल" },
    { id: "color-2", emoji: "🔵", hindi: "नीला" },
    { id: "color-3", emoji: "🟢", hindi: "हरा" },
    { id: "color-4", emoji: "🟡", hindi: "पीला" },
    { id: "color-5", emoji: "🟠", hindi: "नारंगी" },
    { id: "color-6", emoji: "🟣", hindi: "बैंगनी" },
    { id: "color-7", emoji: "⚫", hindi: "काला" },
    { id: "color-8", emoji: "⚪", hindi: "सफेद" },
  ],

  shapes: [
    { id: "shape-1", emoji: "⚪", hindi: "वृत्त" },
    { id: "shape-2", emoji: "⬜", hindi: "वर्ग" },
    { id: "shape-3", emoji: "🔺", hindi: "त्रिभुज" },
    { id: "shape-4", emoji: "⭐", hindi: "तारा" },
    { id: "shape-5", emoji: "🔶", hindi: "हीरा" },
    { id: "shape-6", emoji: "❤️", hindi: "हृदय" },
    { id: "shape-7", emoji: "🟩", hindi: "आयत" },
    { id: "shape-8", emoji: "🌙", hindi: "चंद्रमा" }
  ],

  numbers: [
    { id: "number-1", emoji: "1️⃣", hindi: "एक" },
    { id: "number-2", emoji: "2️⃣", hindi: "दो" },
    { id: "number-3", emoji: "3️⃣", hindi: "तीन" },
    { id: "number-4", emoji: "4️⃣", hindi: "चार" },
    { id: "number-5", emoji: "5️⃣", hindi: "पाँच" },
    { id: "number-6", emoji: "6️⃣", hindi: "छह" },
    { id: "number-7", emoji: "7️⃣", hindi: "सात" },
    { id: "number-8", emoji: "8️⃣", hindi: "आठ" },
  ],

  bodyParts: [
    { id: "body-1", emoji: "👁️", hindi: "आँख" },
    { id: "body-2", emoji: "👂", hindi: "कान" },
    { id: "body-3", emoji: "👃", hindi: "नाक" },
    { id: "body-4", emoji: "👄", hindi: "मुँह" },
    { id: "body-5", emoji: "✋", hindi: "हाथ" },
    { id: "body-6", emoji: "🦶", hindi: "पैर" },
    { id: "body-7", emoji: "🧠", hindi: "मस्तिष्क" },
    { id: "body-8", emoji: "❤️", hindi: "हृदय" },
  ],

  schoolObjects: [
    { id: "school-1", emoji: "📚", hindi: "किताब" },
    { id: "school-2", emoji: "✏️", hindi: "पेंसिल" },
    { id: "school-3", emoji: "📓", hindi: "कॉपी" },
    { id: "school-4", emoji: "🖊️", hindi: "कलम" },
    { id: "school-5", emoji: "📏", hindi: "पैमाना" },
    { id: "school-6", emoji: "🎒", hindi: "स्कूल बैग" },
    { id: "school-7", emoji: "🪑", hindi: "कुर्सी" },
    { id: "school-8", emoji: "🖍️", hindi: "रंगीन पेंसिल" },
  ],

  vehicles: [
    { id: "vehicle-1", emoji: "🚗", hindi: "कार" },
    { id: "vehicle-2", emoji: "🚌", hindi: "बस" },
    { id: "vehicle-3", emoji: "🚲", hindi: "साइकिल" },
    { id: "vehicle-4", emoji: "🚆", hindi: "रेलगाड़ी" },
    { id: "vehicle-5", emoji: "✈️", hindi: "हवाई जहाज" },
    { id: "vehicle-6", emoji: "🚢", hindi: "जहाज" },
    { id: "vehicle-7", emoji: "🏍️", hindi: "मोटरसाइकिल" },
    { id: "vehicle-8", emoji: "🚜", hindi: "ट्रैक्टर" },
  ],

  family: [
    { id: "family-1", emoji: "👨", hindi: "पिता" },
    { id: "family-2", emoji: "👩", hindi: "माता" },
    { id: "family-3", emoji: "👦", hindi: "भाई" },
    { id: "family-4", emoji: "👧", hindi: "बहन" },
    { id: "family-5", emoji: "👴", hindi: "दादा" },
    { id: "family-6", emoji: "👵", hindi: "दादी" },
    { id: "family-7", emoji: "👶", hindi: "शिशु" },
    { id: "family-8", emoji: "🧒", hindi: "बच्चा" },
  ],
};

export function getFlashcardData(topic, count) {
  return FLASHCARD_DATA[topic].slice(0, count) || [];
}

export function getAvailableTopics() {
  return Object.keys(FLASHCARD_DATA);
}
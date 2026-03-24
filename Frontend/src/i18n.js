// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // Existing translations...
        recommended_doctors: "Recommended Doctors & Hospitals",
        stage: "Your PD Stage",
        back: "Back",
        loading: "Loading...",
        no_doctors: "No doctors found nearby",
        distance: "Distance",
        cost: "Cost",
        phone: "Phone",
        languages: "Languages",
        services: "Services",
        call: "Call Now",
        navigate: "Navigate",
        view_score: "View Score Details",
        location: "Location (30%)",
        expertise: "PD Expert (25%)",
        stage_match: "Stage Match (20%)",
        rating: "Rating (10%)",
        error_fetch: "Failed to load recommendations",

        // Navbar
        home: "Home",
        diagnostic: "Diagnostic",
        about: "About",
        contact: "Contact",
        
        // NEW: Spiral Test
        spiral_test: "Spiral Test",
        draw_spiral_instruction: "Draw a spiral from mouse or touchpad pen or otherwise upload drawn image.",
        clear: "Clear",
        check_result: "Check Result",
        analyzing: "Analyzing with AI...",
        result_healthy: "Spiral looks normal and smooth.",
        result_parkinson: "Spiral shows signs of tremor. Please consult a neurologist.",
        confidence: "Confidence",

        // NEW: Voice Analysis (added)
        voice_analysis: "Voice Analysis",
        voice_instruction: "Speak clearly for 15 seconds. Our AI will analyze your voice for Parkinson's indicators.",
        voice_result_healthy: "Voice pattern appears normal and steady.",
        voice_result_parkinson: "Voice analysis shows indicators of vocal tremor. Please consult a specialist."
      }
    },

    si: {
      translation: {
        // Existing Sinhala translations...
        recommended_doctors: "නිර්දේශිත වෛද්‍යවරුන් සහ රෝහල්",
        stage: "ඔබගේ PD අදියර",
        back: "ආපසු",
        loading: "පූරණය වෙමින්...",
        no_doctors: "ආසන්නයේ වෛද්‍යවරුන් නොමැත",
        distance: "දුර",
        cost: "වියදම",
        phone: "දුරකථන",
        languages: "භාෂා",
        services: "සේවා",
        call: "දැන් ඇමතුම් කරන්න",
        navigate: "මංපෙන්වන්න",
        view_score: "ලකුණු විස්තර බලන්න",
        location: "ස්ථානය (30%)",
        expertise: "PD විශේෂඥ (25%)",
        stage_match: "අදියර ගැලපීම (20%)",
        rating: "ශ්‍රේණිගත කිරීම (10%)",

        home: "මුල් පිටුව",
        diagnostic: "රෝග විනිශ්චය",
        about: "අප ගැන",
        contact: "සම්බන්ධතා",

        // NEW: Spiral Test in Sinhala
        spiral_test: "සර්පිල පරීක්ෂණය",
        draw_spiral_instruction: "මූසිකයෙන් හෝ ටච්පෑඩ් පෑනෙන් සර්පිලයක් අඳින්න නැතහොත් ඇඳූ රූපය උඩුගත කරන්න.",
        clear: "මකන්න",
        check_result: "ප්‍රතිඵල පරීක්ෂා කරන්න",
        analyzing: "AI මගින් විශ්ලේෂණය කරමින්...",
        result_healthy: "සර්පිලය සුමටයි. කිසිදු ගැටලුවක් නොපෙන්වයි.",
        result_parkinson: "සර්පිලයේ කම්පන ලක්ෂණ පෙන්වයි. කරුණාකර ස්නායු රෝග විශේෂඥවරයෙකු හමුවන්න.",
        confidence: "විශ්වාසනීයත්වය",

        // NEW: Voice Analysis in Sinhala (added)
        voice_analysis: "හඬ විශ්ලේෂණය",
        voice_instruction: "තත්පර 15 ක් පැහැදිලිව කතා කරන්න. අපගේ AI මගින් පාකින්සන් රෝග ලක්ෂණ සඳහා ඔබේ කටහඬ විශ්ලේෂණය කරනු ඇත.",
        voice_result_healthy: "හඬ රටාව සාමාන්‍ය සහ ස්ථාවර බව පෙනේ.",
        voice_result_parkinson: "හඬ විශ්ලේෂණයේදී කටහඬේ කම්පන ලක්ෂණ පෙන්වයි. කරුණාකර විශේෂඥවරයෙකු හමුවන්න."
      }
    },

    ta: {
      translation: {
        // Existing Tamil translations...
        recommended_doctors: "பரிந்துரைக்கப்பட்ட மருத்துவர்கள் & மருத்துவமனைகள்",
        stage: "உங்கள் PD நிலை",
        back: "பின்",
        loading: "ஏற்றுகிறது...",
        no_doctors: "அருகில் மருத்துவர்கள் இல்லை",
        distance: "தூரம்",
        cost: "செலவு",
        phone: "தொலைபேசி",
        languages: "மொழிகள்",
        services: "சேவைகள்",
        call: "இப்போது அழைக்கவும்",
        navigate: "வழி காட்டு",
        view_score: "மதிப்பெண் விவரங்களைப் பார்க்கவும்",
        location: "இருப்பிடம் (30%)",
        expertise: "PD நிபுணர் (25%)",
        stage_match: "நிலை பொருத்தம் (20%)",
        rating: "மதிப்பீடு (10%)",

        home: "முகப்பு",
        diagnostic: "நோயறிதல்",
        about: "எங்களைப் பற்றி",
        contact: "தொடர்பு",

        // NEW: Spiral Test in Tamil
        spiral_test: "சுருள் சோதனை",
        draw_spiral_instruction: "மவுஸ் அல்லது டச்பேட் பேனால் அல்லது விரலால் சுருள் வரையவும் அல்லது வரைந்த படத்தை பதிவேற்றவும்.",
        clear: "அழி",
        check_result: "முடிவை சரிபார்",
        analyzing: "AI உதவியுடன் ஆய்வு செய்யப்படுகிறது...",
        result_healthy: "சுருள் சீராக உள்ளது. எந்த அறிகுறியும் இல்லை.",
        result_parkinson: "சுருளில் நடுக்கம் தெரிகிறது. தயவு செய்து நரம்பியல் மருத்துவரை சந்திக்கவும்.",
        confidence: "நம்பிக்கை அளவு",

        // NEW: Voice Analysis in Tamil (added)
        voice_analysis: "குரல் பகுப்பாய்வு",
        voice_instruction: "15 விநாடிகளுக்கு தெளிவாகப் பேசுங்கள். எங்கள் AI பார்கின்சன் அறிகுறிகளுக்காக உங்கள் குரலை பகுப்பாய்வு செய்யும்.",
        voice_result_healthy: "குரல் அமைப்பு சாதாரணமாகவும் சீராகவும் உள்ளது.",
        voice_result_parkinson: "குரல் பகுப்பாய்வு குரலில் நடுக்கத்தின் அறிகுறிகளைக் காட்டுகிறது. தயவுசெய்து ஒரு நிபுணரை அணுகவும்."
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
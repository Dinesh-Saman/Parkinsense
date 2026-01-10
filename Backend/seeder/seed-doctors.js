// backend/seeder/seed-doctors.js
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');   // <-- correct relative path
require('dotenv').config({ path: '../.env' }); // <-- force load .env

// ---------- 1. Validate URI ----------
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('ERROR: MONGODB_URI is missing in .env');
  process.exit(1);
}
console.log('Connecting to:', uri);

// ---------- 2. Connect ----------
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ---------- 3. Doctor Data ----------
const doctors = [
  {
    name: "Dr. Bimsara Senanayake",
    hospital: "National Hospital of Sri Lanka (NHSL)",
    specialty: ["PD", "Movement Disorders", "DBS"],
    services: ["DBS", "Botox", "Physio", "Speech Therapy"],
    location: { type: "Point", coordinates: [79.8739, 6.9271] },
    address: "Institute of Neurology, Ward 55, NHSL, Colombo 10",
    phone: "+94 11 269 1111 Ext. 255",
    costLevel: "Low",
    rating: 4.7,
    languages: ["Sinhala", "Tamil", "English"]
  },
  {
    name: "Dr. Prashanth LK",
    hospital: "Asiri Central Hospital",
    specialty: ["PD", "Movement Disorders"],
    services: ["DBS", "Botox", "Levodopa Pump"],
    location: { type: "Point", coordinates: [79.8588, 6.9194] },
    address: "No. 114, Norris Canal Road, Colombo 10",
    phone: "+94 11 269 3711",
    costLevel: "High",
    rating: 4.5,
    languages: ["English", "Sinhala"]
  },
  {
    name: "Dr. Ranjith Gunawardena",
    hospital: "Nawaloka Hospital",
    specialty: ["PD", "Neurology"],
    services: ["Botox", "Physio", "Sleep Studies"],
    location: { type: "Point", coordinates: [79.8590, 6.9190] },
    address: "No. 23, Deshamanya H. K. Dharmadasa Mawatha, Colombo 02",
    phone: "+94 11 557 7111",
    costLevel: "High",
    rating: 4.4,
    languages: ["Sinhala", "English"]
  },
  {
    name: "Dr. Jithangi Wanigasinghe",
    hospital: "Lady Ridgeway Hospital for Children",
    specialty: ["Pediatric PD", "Movement Disorders"],
    services: ["Genetic Testing", "Physio"],
    location: { type: "Point", coordinates: [79.8648, 6.9201] },
    address: "Dr. Danister De Silva Mawatha, Colombo 08",
    phone: "+94 11 269 3711",
    costLevel: "Low",
    rating: 4.6,
    languages: ["Sinhala", "Tamil", "English"]
  },
  {
    name: "Dr. Sunethra Senanayake",
    hospital: "Teaching Hospital Kandy",
    specialty: ["PD", "Neurology"],
    services: ["Botox", "Physio", "OPD Clinic"],
    location: { type: "Point", coordinates: [80.6337, 7.2906] },
    address: "Neurology Unit, Teaching Hospital, Kandy",
    phone: "+94 81 223 3335",
    costLevel: "Low",
    rating: 4.3,
    languages: ["Sinhala", "English"]
  },
  {
    name: "Dr. Nimali Fernando",
    hospital: "Asiri Hospital Kandy",
    specialty: ["PD", "Movement Disorders"],
    services: ["Botox", "Physio"],
    location: { type: "Point", coordinates: [80.6421, 7.2871] },
    address: "No. 907, Peradeniya Road, Kandy",
    phone: "+94 81 452 8800",
    costLevel: "Medium",
    rating: 4.4,
    languages: ["Sinhala", "English"]
  },
  {
    name: "Dr. Gamini Pathirana",
    hospital: "Karapitiya Teaching Hospital",
    specialty: ["PD", "Neurology"],
    services: ["Botox", "Physio", "Free Clinic"],
    location: { type: "Point", coordinates: [80.2144, 6.0535] },
    address: "Neurology OPD, Karapitiya, Galle",
    phone: "+94 91 223 2260",
    costLevel: "Low",
    rating: 4.2,
    languages: ["Sinhala", "English"]
  },
  {
    name: "Dr. Anusha Perera",
    hospital: "Hemas Hospital Galle",
    specialty: ["PD", "General Neurology"],
    services: ["Physio", "Counseling"],
    location: { type: "Point", coordinates: [80.2190, 6.0320] },
    address: "No. 94, Wakwella Road, Galle",
    phone: "+94 91 464 0640",
    costLevel: "Medium",
    rating: 4.3,
    languages: ["Sinhala", "English"]
  },
  {
    name: "Dr. S. Sivapalan",
    hospital: "Teaching Hospital Jaffna",
    specialty: ["PD", "Neurology"],
    services: ["Botox", "Physio", "Tamil OPD"],
    location: { type: "Point", coordinates: [80.0074, 9.6615] },
    address: "Neurology Clinic, Jaffna Hospital",
    phone: "+94 21 222 2261",
    costLevel: "Low",
    rating: 4.1,
    languages: ["Tamil", "English"]
  },
  {
    name: "Dr. K. Thayaparan",
    hospital: "Jaffna Private Clinic",
    specialty: ["PD"],
    services: ["Home Visits", "Telemedicine"],
    location: { type: "Point", coordinates: [80.0100, 9.6620] },
    address: "No. 45, Stanley Road, Jaffna",
    phone: "+94 77 123 4567",
    costLevel: "Medium",
    rating: 4.0,
    languages: ["Tamil", "English"]
  },
  {
    name: "Dr. Ruwani Dissanayake",
    hospital: "TelePD Sri Lanka (Online)",
    specialty: ["PD", "Telemedicine"],
    services: ["Zoom Consult", "Prescription Delivery"],
    location: { type: "Point", coordinates: [80.7718, 7.8731] },
    address: "Online Only – Nationwide",
    phone: "+94 77 987 6543",
    costLevel: "Medium",
    rating: 4.6,
    languages: ["Sinhala", "Tamil", "English"]
  },
  {
    name: "Dr. Nimal Gamage",
    hospital: "Lanka Princess Ayurveda Resort",
    specialty: ["Ayurveda", "PD Support"],
    services: ["Panchakarma", "Herbal Therapy", "Yoga"],
    location: { type: "Point", coordinates: [79.8490, 6.9250] },
    address: "Beruwala, Western Province",
    phone: "+94 34 227 6789",
    costLevel: "High",
    rating: 4.5,
    languages: ["Sinhala", "English", "German"]
  }
];

// ---------- 4. Seed ----------
const seed = async () => {
  try {
    await Doctor.deleteMany({});
    console.log('Old doctors cleared');

    const inserted = await Doctor.insertMany(doctors);
    console.log(`Seeded ${inserted.length} doctors successfully!`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

// Run only after connection is ready
mongoose.connection.once('open', seed);
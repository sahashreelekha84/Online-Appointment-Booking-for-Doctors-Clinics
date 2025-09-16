const Specialization = require("../model/specializationmodel");

const createSpecializations = async () => {
  const specializations = [
    { name: "Cardiologist", description: "Heart and blood vessel specialist" },
    { name: "Dermatologist", description: "Skin, hair, and nails specialist" },
    { name: "Neurologist", description: "Brain and nervous system specialist" },
    { name: "Psychiatrist", description: "Mental health specialist" },
    { name: "Pediatrician", description: "Children's health specialist" },
    { name: "Gynecologist", description: "Female reproductive health specialist" },
    { name: "Orthopedic", description: "Bones, joints, and muscles specialist" },
    { name: "ENT Specialist", description: "Ear, Nose, Throat specialist" },
    { name: "Ophthalmologist", description: "Eye and vision care specialist" },
    { name: "Dentist", description: "Teeth and oral health specialist" },
    { name: "General Physician", description: "Primary care doctor" },
    { name: "Oncologist", description: "Cancer treatment specialist" },
    { name: "Urologist", description: "Urinary tract and male reproductive system" },
    { name: "Nephrologist", description: "Kidney specialist" },
    { name: "Endocrinologist", description: "Hormone and gland specialist" },
    { name: "Gastroenterologist", description: "Digestive system specialist" },
    { name: "Pulmonologist", description: "Lungs and respiratory system" },
    { name: "Rheumatologist", description: "Autoimmune and joint diseases" },
    { name: "Surgeon", description: "Performs surgical operations" },
    { name: "Radiologist", description: "Medical imaging specialist" },
    { name: "Pathologist", description: "Disease diagnosis through lab tests" },
    { name: "Anesthesiologist", description: "Anesthesia and pain management" },
    { name: "Hematologist", description: "Blood-related disorders specialist" },
  ];

  for (const specialization of specializations) {
    const exists = await Specialization.findOne({ name: specialization.name });
    if (!exists) {
      await Specialization.create(specialization);
     // console.log(`Specialization ${specialization.name} created`);
    } else {
      //console.log(`Specialization ${specialization.name} already exists`);
    }
  }

  //console.log(" All specializations seeded successfully!");
};

module.exports = createSpecializations;

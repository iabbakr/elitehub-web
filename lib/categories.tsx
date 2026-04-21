// ============================================================
// constants.ts — Web (mirrors mobile Categories.ts + location.ts)
// ============================================================

// ── SELLER CATEGORIES (PRODUCTS) ────────────────────────────────────────────

export const SELLER_CATEGORIES = [
  {
    name: "Phones_Tablets",
    label: "Phones & Tablets",
    icon: "📱",
    subcategories: [
      "Smartphones", "Feature_Phones", "Refurbished_Phones", "Tablets",
      "Phone_Cases", "Screen_Protectors", "Phone_Stands", "Earphones_Headphones",
      "Bluetooth_Earbuds", "Smart_Watches", "Smart_Speakers", "Wearable_Technology",
      "Chargers_Cables", "Power_Banks", "Phone_Accessories", "Other",
    ],
  },
  {
    name: "Laptops_Computers",
    label: "Laptops & Computers",
    icon: "💻",
    subcategories: [
      "Laptops", "Desktops", "All_in_One_Computers", "Mini_PCs",
      "Gaming_Laptops", "Gaming_Desktops", "Monitors", "Keyboards_Mice",
      "Webcams", "Printers", "Scanners", "Fax_Machines",
      "Storage_Devices", "Networking_Equipment", "Software", "Computer_Accessories", "Other",
    ],
  },
  {
    name: "TV_Audio_Gaming",
    label: "TV, Audio & Gaming",
    icon: "📺",
    subcategories: [
      "Televisions", "Streaming_Devices", "Set_Top_Box", "Blu_ray_Players",
      "Soundbars", "Home_Theater", "Speakers", "Headphones",
      "Projectors", "Gaming_Consoles", "Video_Games", "Gaming_Accessories",
      "VR_Headsets", "TV_Accessories", "Other",
    ],
  },
  {
    name: "Cameras_Optics",
    label: "Cameras & Optics",
    icon: "📷",
    subcategories: [
      "DSLR_Cameras", "Mirrorless_Cameras", "Action_Cameras", "Camcorders",
      "Drones", "Security_Cameras_CCTV", "Dashcams", "Camera_Lenses",
      "Lens_Filters", "Tripods_Monopods", "Gimbals_Stabilizers", "Camera_Bags",
      "Lighting_Equipment", "Backdrops_Green_Screens", "Camera_Monitors",
      "Binoculars_Monoculars", "Photography_Accessories", "Other",
    ],
  },
  {
    name: "Womens_Fashion",
    label: "Women's Fashion",
    icon: "👗",
    subcategories: [
      "Dresses", "Tops_Blouses", "Sweaters_Cardigans", "Coats_Jackets",
      "Hoodies_Sweatshirts", "Skirts", "Trousers_Jeans", "Jumpsuits_Playsuits",
      "Shorts", "Leggings_Tights", "Lingerie_Underwear", "Sleepwear",
      "Swimwear", "Activewear", "Native_Ankara", "Hijabs", "Veils",
      "Abayas_Jilbabs", "Kimonos", "Shoes_Heels", "Sneakers_Flats",
      "Sandals_Slippers", "Handbags_Clutches", "Backpacks", "Jewelry",
      "Watches", "Belts_Scarves", "Sunglasses", "Hair_Accessories", "Other",
    ],
  },
  {
    name: "Mens_Fashion",
    label: "Men's Fashion",
    icon: "👔",
    subcategories: [
      "Shirts", "T_Shirts_Polos", "Hoodies_Sweatshirts", "Trousers_Chinos",
      "Jeans", "Shorts", "Suits_Blazers", "Native_Wear",
      "Underwear_Socks", "Sleepwear", "Activewear", "Sneakers",
      "Loafers_Oxford", "Boots_Sandals", "Caps_Hats", "Watches",
      "Bags_Backpacks", "Belts_Wallets", "Ties_Bow_Ties", "Sunglasses", "Other",
    ],
  },
  {
    name: "Babies_Kids",
    label: "Babies & Kids",
    icon: "🍼",
    subcategories: [
      "Baby_Clothing", "Kids_Clothing", "Baby_Shoes", "Kids_Shoes",
      "Baby_Toys", "Kids_Toys", "Educational_Toys", "Kids_Books",
      "Prams_Strollers", "Baby_Carriers", "Car_Seats", "Diapers_Nappies",
      "Baby_Food_Formula", "Feeding_Accessories", "Nursery_Furniture",
      "Baby_Monitors", "Bath_Safety", "Other",
    ],
  },
  {
    name: "Beauty_Personal_Care",
    label: "Beauty & Personal Care",
    icon: "💄",
    subcategories: [
      "Skincare", "Face_Serums_Treatments", "Moisturizers_Sunscreen",
      "Body_Lotions_Oils", "Hair_Care_Products", "Wigs_Hair_Extensions",
      "Hair_Tools_Styling", "Makeup_Foundation", "Makeup_Lips_Eyes",
      "Nail_Care", "Fragrances_Perfumes", "Deodorants", "Oral_Care",
      "Shaving_Grooming", "Bath_Body", "Hair_Removal", "Feminine_Care",
      "Beauty_Tools_Devices", "Other",
    ],
  },
  {
    name: "Vehicles_Cars",
    label: "Vehicles & Cars",
    icon: "🚗",
    subcategories: [
      "Sedans", "SUVs", "Crossovers", "MPVs_Minivans", "Hatchbacks",
      "Station_Wagons", "Coupe_Convertibles", "Luxury_Cars", "Sports_Cars",
      "Electric_Hybrid_Cars", "Classic_Vintage_Cars", "Tokunbo_Foreign_Used",
      "Nigerian_Used", "Brand_New",
    ],
  },
  {
    name: "Commercial_Heavy_Duty",
    label: "Commercial & Heavy Duty",
    icon: "🚛",
    subcategories: [
      "Pickup_Trucks", "Box_Trucks", "Flatbed_Trucks", "Tippers_Dump_Trucks",
      "Reefer_Trucks", "Tankers", "Vans", "Mini_Buses", "Micro_Buses",
      "Coaches_Buses", "Trailers", "Tractors_Farm_Machinery", "Forklifts",
      "Construction_Vehicles", "Cranes_Heavy_Lifting", "Generators_Industrial",
    ],
  },
  {
    name: "Motorcycles_Powersports",
    label: "Motorcycles",
    icon: "🏍️",
    subcategories: [
      "Motorbikes", "Scooters_Mopeds", "Electric_Bikes", "Bicycles",
      "Tricycles_Keke_Napep", "ATVs_Quad_Bikes", "Dirt_Bikes",
      "Go_Karts_Buggies", "Boats_Jet_Skis", "Motorcycle_Accessories",
      "Helmets_Riding_Gear",
    ],
  },
  {
    name: "Auto_Parts_Care",
    label: "Auto Parts & Care",
    icon: "🔧",
    subcategories: [
      "Engine_Parts", "Transmission_Gearbox", "Suspension_Steering",
      "Braking_System", "Exhaust_System", "Tyres_Rims", "Batteries",
      "Electrical_Ignition", "Cooling_System", "Fuel_System",
      "Oils_Fluids_Filters", "Clutch_Drivetrain", "Body_Panels_Bumpers",
      "Lighting_Bulbs", "Car_Audio_GPS", "Interior_Accessories",
      "Exterior_Accessories", "Wiper_Blades", "Car_Care_Cleaning", "Other",
    ],
  },
  {
    name: "Home_Appliances",
    label: "Home Appliances",
    icon: "🏠",
    subcategories: [
      "Refrigerators", "Freezers", "Washing_Machines", "Dryers",
      "Dishwashers", "Air_Conditioners", "Fans_Air_Coolers", "Heaters",
      "Air_Purifiers", "Humidifiers_Dehumidifiers", "Microwaves",
      "Ovens_Cookers", "Air_Fryers", "Generators", "Inverters_UPS",
      "Solar_Panels_Systems", "Vacuum_Cleaners", "Steam_Cleaners",
      "Water_Heaters_Boilers", "Other",
    ],
  },
  {
    name: "Furniture",
    label: "Furniture",
    icon: "🛋️",
    subcategories: [
      "Sofas_Armchairs", "Beds_Mattresses", "Wardrobes_Closets",
      "Dressers_Vanities", "Dining_Sets", "Coffee_Side_Tables",
      "Console_Accent_Tables", "TV_Stands", "Bookshelves", "Office_Desks",
      "Office_Chairs", "Bar_Counter_Stools", "Outdoor_Furniture",
      "Ottomans_Poufs", "Kids_Furniture", "Other",
    ],
  },
  {
    name: "Home_Decor",
    label: "Home Decor",
    icon: "🖼️",
    subcategories: [
      "Curtains_Blinds", "Rugs_Carpets", "Throw_Pillows_Blankets",
      "Wall_Art_Paintings", "Mirrors", "Indoor_Lighting", "Decorative_Vases",
      "Artificial_Plants_Flowers", "Picture_Frames", "Clocks",
      "Beddings_Duvet_Sets", "Candles_Diffusers", "Other",
    ],
  },
  {
    name: "Kitchen_Dining",
    label: "Kitchen & Dining",
    icon: "🍳",
    subcategories: [
      "Pots_Pans_Cookware", "Knives_Cutlery", "Dinnerware_Plates",
      "Glassware_Cups", "Kitchen_Appliances", "Kitchen_Tools_Gadgets",
      "Food_Storage", "Water_Dispensers", "Trays_Serving",
      "Baking_Equipment", "Kitchen_Textiles", "Kitchen_Organisation", "Other",
    ],
  },
  {
    name: "Fruits_Vegetables",
    label: "Fruits & Vegetables",
    icon: "🥦",
    subcategories: [
      "Fresh_Fruits", "Dried_Fruits", "Frozen_Fruits", "Fresh_Vegetables",
      "Frozen_Vegetables", "Fresh_Herbs_Seasonings", "Dried_Herbs_Spices",
      "Organic_Produce", "Exotic_Produce", "Other",
    ],
  },
  {
    name: "Meat_Fish_Poultry",
    label: "Meat, Fish & Poultry",
    icon: "🥩",
    subcategories: [
      "Fresh_Chicken", "Turkey_Duck_Poultry", "Beef_Veal", "Lamb_Mutton",
      "Goat_Meat", "Pork", "Fresh_Fish", "Frozen_Fish", "Dried_Smoked_Fish",
      "Seafood_Shellfish", "Snail", "Game_Meat_Exotic", "Deli_Processed_Meat",
      "Frozen_Meals",
    ],
  },
  {
    name: "Rice_Beans_Grains",
    label: "Rice, Beans & Grains",
    icon: "🌾",
    subcategories: [
      "Local_Rice", "Imported_Foreign_Rice", "Brown_Wild_Rice", "Beans_Lentils",
      "Chickpeas_Peas", "Garri", "Cassava_Flour", "Semovita_Semolina",
      "Wheat_Flour", "Oats_Barley", "Millet_Sorghum", "Quinoa",
      "Corn_Maize", "Yam_Tubers", "Sweet_Potatoes", "Plantain_Cocoyam", "Other",
    ],
  },
  {
    name: "Beverages",
    label: "Beverages",
    icon: "🥤",
    subcategories: [
      "Soft_Drinks", "Energy_Sports_Drinks", "Fruit_Juices", "Smoothies_Blends",
      "Bottled_Water", "Tea", "Coffee", "Milk_Dairy_Drinks", "Malt_Drinks",
      "Wine", "Beer_Stout", "Spirits_Whiskey", "Zobo_Local_Drinks",
      "Fura_Kunu", "Protein_Shakes", "Other",
    ],
  },
  {
    name: "Packaged_Snacks_Condiments",
    label: "Snacks & Condiments",
    icon: "🍪",
    subcategories: [
      "Snacks_Chips", "Biscuits_Cookies", "Chocolates_Candy", "Bread_Pastries",
      "Cereals_Granola", "Pasta_Noodles", "Canned_Foods", "Sauces_Ketchup",
      "Spices_Seasonings", "Cooking_Oils", "Honey_Jams_Spreads", "Sugar_Salt",
      "Tomato_Paste", "Dairy_Eggs", "Frozen_Snacks", "Other",
    ],
  },
  {
    name: "Health_Medical",
    label: "Health & Medical",
    icon: "💊",
    subcategories: [
      "Supplements_Vitamins", "Protein_Fitness_Nutrition", "Herbal_Natural_Remedies",
      "Blood_Pressure_Monitors", "Blood_Glucose_Monitors", "Thermometers",
      "Pulse_Oximeters", "Weighing_Scales", "Pregnancy_Fertility",
      "First_Aid_Kits", "Wound_Care", "Medical_Furniture_Beds",
      "Wheelchairs_Mobility_Aids", "Crutches_Walking_Aids", "Hearing_Aids",
      "Eye_Care_Glasses", "Dental_Products", "Face_Masks_PPE",
      "Sanitizers_Disinfectants", "Baby_Health_Products", "Other",
    ],
  },
  {
    name: "Real_Estate",
    label: "Real Estate",
    icon: "🏢",
    subcategories: [
      "For_Rent", "For_Sale", "For_Sharing", "Short_Let",
      "Serviced_Apartments", "Vacation_Rentals", "Lands_Plots",
      "Office_Space", "Co_Working_Spaces", "Meeting_Event_Spaces",
      "Shops_Retail_Space", "Warehouses", "Parking_Spaces",
    ],
  },
  {
    name: "Industrial_Business",
    label: "Industrial & Business",
    icon: "🏭",
    subcategories: [
      "Medical_Equipment", "Office_Equipment", "POS_Cash_Registers",
      "Restaurant_Kitchen_Equipment", "Bar_Equipment", "Bakery_Equipment",
      "Printing_Packaging", "Manufacturing_Equipment", "Agricultural_Equipment",
      "Construction_Equipment", "Mining_Equipment", "Retail_Shop_Fittings",
      "Safety_Fire_Equipment", "PPE_Protective_Gear", "Cleaning_Industrial", "Other",
    ],
  },
  {
    name: "Sports_Hobbies",
    label: "Sports & Hobbies",
    icon: "⚽",
    subcategories: [
      "Gym_Fitness_Equipment", "Yoga_Pilates", "Cycling",
      "Swimming_Water_Sports", "Football_Team_Sports", "Racket_Sports",
      "Martial_Arts", "Outdoor_Camping", "Hunting_Fishing",
      "Board_Games_Puzzles", "Musical_Instruments", "Art_Craft_Supplies",
      "Photography_Videography", "Collectibles_Memorabilia", "Other",
    ],
  },
  {
    name: "Garden_Outdoor",
    label: "Garden & Outdoor",
    icon: "🌿",
    subcategories: [
      "Seeds_Seedlings", "Fertilizers_Soil", "Garden_Tools", "Lawn_Mowers",
      "Irrigation_Systems", "Planters_Pots", "Outdoor_Furniture",
      "BBQ_Grills", "Garden_Decor", "Pest_Control", "Composting", "Other",
    ],
  },
  {
    name: "Pets_Animals",
    label: "Pets & Animals",
    icon: "🐾",
    subcategories: [
      "Dog_Food_Treats", "Cat_Food_Treats", "Bird_Food", "Fish_Aquarium",
      "Pet_Accessories_Collars", "Pet_Toys", "Pet_Grooming",
      "Pet_Health_Medication", "Cages_Kennels", "Poultry_Livestock_Feed",
      "Farm_Animals", "Live_Birds_Pets", "Aquatic_Animals", "Other",
    ],
  },
  {
    name: "Other",
    label: "Other",
    icon: "📦",
    subcategories: [
      "Books_Textbooks", "Comics_Graphic_Novels", "Manga_Anime",
      "Stationery_Office_Supplies", "Gift_Items_Hampers", "Religious_Items",
      "Traditional_Cultural_Items", "Event_Party_Supplies",
      "Seasonal_Holiday_Items", "DIY_Tools", "Sewing_Embroidery",
      "Knitting_Crochet", "Painting_Drawing", "Other",
    ],
  },
] as const;

// ── SERVICE PROVIDER CATEGORIES (SERVICES) ──────────────────────────────────

export const SERVICE_CATEGORIES = [
  {
    name: "Home_Repair_Maintenance",
    label: "Home Repair",
    icon: "🔧",
    subcategories: [
      "Plumbing", "Electrical_Works", "AC_Repair", "Carpentry",
      "Painting", "Tiling", "Roofing", "Solar_Setup",
      "Pest_Control", "Generator_Repair", "Home_Automation",
    ],
  },
  {
    name: "Cleaning_Services",
    label: "Cleaning",
    icon: "🧹",
    subcategories: [
      "House_Cleaning", "Office_Cleaning", "Fumigation",
      "Sofa_Carpet_Cleaning", "Laundry_Dry_Cleaning",
      "Pool_Cleaning", "Post_Construction_Cleaning",
    ],
  },
  {
    name: "Logistics_Transport",
    label: "Logistics & Transport",
    icon: "🚚",
    subcategories: [
      "Bike_Delivery", "Motor_Park_Agents", "Airport_Pickup_Agents",
      "Logistics_Company", "Moving_Relocation", "Truck_Haulage",
      "Private_Driver", "Airport_Pickup", "Area_Errands",
    ],
  },
  {
    name: "Events_Entertainment",
    label: "Events & Entertainment",
    icon: "🎉",
    subcategories: [
      "Event_Planner", "DJ_MC", "Photographer", "Videographer",
      "Caterer", "Ushers", "Cake_Baker", "Makeup_Artist",
      "Security_Bouncers", "Live_Band", "Ushering_Services",
      "Event_Cleaning_Services",
    ],
  },
  {
    name: "Tech_Gadgets_Repair",
    label: "Tech & Gadget Repair",
    icon: "💻",
    subcategories: [
      "Phone_Repair", "Laptop_Repair", "TV_Repair",
      "Printer_Repair", "DSTV_GOTV_Installation",
    ],
  },
  {
    name: "Automotive_Services",
    label: "Automotive",
    icon: "🚗",
    subcategories: [
      "Mechanic", "Auto_Electrician", "Panel_Beating",
      "Car_Wash", "Towing_Services", "Car_Tracking_Installation",
      "Vehicle_Documentation",
    ],
  },
  {
    name: "Education_Lessons",
    label: "Tutors & Lessons",
    icon: "📚",
    subcategories: [
      "Home_Tutors", "Music_Lessons", "Driving_School", "Coding_Tech",
      "Language_Lessons", "Skill_Acquisition", "JAMB_WAEC_Lessons",
      "NECO_Lessons", "Post_UTME_Lessons", "Common_Entrance_Lessons",
      "Adult_Literacy_Lessons", "Special_Needs_Education",
      "Early_Childhood_Education",
    ],
  },
  {
    name: "Health_Wellness",
    label: "Health & Wellness",
    icon: "💪",
    subcategories: [
      "Fitness_Trainer", "Massage_Therapist", "Home_Nurse",
      "Yoga_Instructor", "Nutritionist", "Physiotherapist",
      "Mental_Health_Counselor", "Occupational_Therapist", "Speech_Therapist",
    ],
  },
  {
    name: "Business_Professional",
    label: "Business & Legal",
    icon: "💼",
    subcategories: [
      "Graphic_Design", "Web_Development", "Digital_Marketing",
      "Legal_Services", "Accounting", "Architecture", "Interior_Design",
      "Visa_Travel_Consultant", "Business_Consulting", "Financial_Advising",
      "Project_Management", "Real_Estate_Agent",
    ],
  },
  {
    name: "Personal_Services",
    label: "Beauty & Personal",
    icon: "✂️",
    subcategories: [
      "Tailoring", "Fashion_Design", "Jewelry_Design", "Barbering",
      "Hair_Styling", "Manicure_Pedicure", "Nail_Technician",
      "Lashes_Brows", "Makeup_Artist", "Beauty_Salon", "Spa_Services",
    ],
  },
  {
    name: "Real_Estate_Services",
    label: "Real Estate",
    icon: "🏢",
    subcategories: [
      "Real_Estate_Agent", "Property_Sales_Leasing", "Facility_Management",
      "Land_Surveying", "Legal_Documentation", "Property_Valuation",
      "Short_Let_Apartments",
    ],
  },
  {
    name: "Construction_Fabrication",
    label: "Construction",
    icon: "🏗️",
    subcategories: [
      "Welding_Iron_Work", "Wood_Work", "Metal_Fabrication", "Glass_Work",
      "Ceramic_Tiling", "Bricklaying", "Aluminum_Work", "POP_Ceiling",
      "Gate_Fence_Fabrication", "Plastic_Work",
    ],
  },
] as const;

// ── Type exports ─────────────────────────────────────────────────────────────

export type SellerCategoryName  = (typeof SELLER_CATEGORIES)[number]["name"];
export type ServiceCategoryName = (typeof SERVICE_CATEGORIES)[number]["name"];

// ── Helpers ──────────────────────────────────────────────────────────────────

export const getSellerSubcategories = (categoryName: string): string[] => {
  const cat = SELLER_CATEGORIES.find((c) => c.name === categoryName);
  return cat ? [...cat.subcategories] : [];
};

export const getServiceSubcategories = (categoryName: string): string[] => {
  const cat = SERVICE_CATEGORIES.find((c) => c.name === categoryName);
  return cat ? [...cat.subcategories] : [];
};

// ── NIGERIAN LOCATIONS (State → City → Areas) ────────────────────────────────
// Mirrors mobile location.ts exactly

export const NIGERIAN_LOCATIONS: Record<string, Record<string, string[]>> = {
  Abia: {
    Umuahia: ["Isi Gate", "Amuzukwu", "Afara", "Ohiya", "World Bank", "Ubaka", "Okpara Square", "Tower Area", "Umuahia Main"],
    Aba: ["Ariaria", "Osusu", "Ogbor Hill", "Eziukwu", "Asa", "Port Harcourt Road", "Faulks Road", "Ngwa Road", "Aba-Owerri Road", "Asa Road", "Ehere", "Umuocham", "Ohanku"],
    Arochukwu: ["Amasu", "Amangwu", "Isu", "Ututu", "Amuvi", "Obinkita", "Ibom"],
    Ohafia: ["Ebem", "Okon", "Amaekpu", "Asaga", "Isiama", "Elu Ohafia", "Amaekpu Ohafia"],
    Bende: ["Igbere", "Uzuakoli", "Item", "Ezeukwu", "Ozuitem", "Alayi", "Nkpa"],
  },
  Adamawa: {
    Yola: ["Jimeta", "Doubeli", "Makama", "Nasarawo", "Bole", "Wuro Hausa", "Demsawo", "Bekaji", "Karewa", "Alhaji Liman"],
    Mubi: ["Lokuwa", "Digil", "Sabon Gari", "Burha", "Lamorde", "Kolere", "Gela", "Mubi Town"],
    Numan: ["Nasarawo", "Sabon Pegi", "Bare", "Gweda", "Dowaya"],
    Ganye: ["Sugu", "Gamu", "Yebbi", "Toungo"],
    Jimeta: ["Jambutu", "Police Roundabout", "Damilu", "Doubeli"],
  },
  "Akwa Ibom": {
    Uyo: ["Itam", "Ewet Housing", "Shelter Afrique", "Ikot Ekpene Road", "Oron Road", "Iboko", "Use Offot", "Udo Udoma", "Nsukara Offot", "Akpan Andem Market", "Abak Road", "Ikpa Road"],
    Eket: ["Abuja Road", "Ikot Ekpene", "Idua", "Afaha", "Okon", "Esit Eket", "Marina Road"],
    "Ikot Ekpene": ["Nsasak", "Ikot Inyang", "Itam", "Ikot Osurua", "Abak Road", "Uyo Road"],
    Oron: ["Eyo Abasi", "Iquita", "Oron Beach", "Udung Uko", "Mbo"],
    Abak: ["Midim", "Atai", "Abak Road"],
  },
  Anambra: {
    Awka: ["Aroma", "Amawbia", "Okpuno", "Nibo", "Nnamdi Azikiwe Road", "Zik Avenue", "Temp Site", "UNIZIK", "Ifite", "Agu Awka"],
    Onitsha: ["Woliwo", "Fegge", "Odoakpu", "Omoba", "Awada", "Main Market", "Bridge Head", "Upper Iweka", "Vienna", "Ochanja", "Iba Pope", "3-3", "Harbour Industrial"],
    Nnewi: ["Otolo", "Uruagu", "Umudim", "Nnewi North", "Nnewi South", "Nkwo Nnewi", "Okpuno", "Edoji"],
    Ekwulobia: ["Ula", "Okpo", "Agba", "Amesi", "Umuchiana"],
    Ihiala: ["Mbosi", "Orlu Road", "Uli", "Okija", "Ubulu"],
  },
  Bauchi: {
    Bauchi: ["Ibrahim Bako", "Kofar Ran", "Gwallaga"],
    Azare: ["Idi", "Nasarawa", "Katagum"],
    Misau: ["Hardawa", "Akuyam"],
    "Jama'are": ["Hadejia Road", "Gumel"],
    Ningi: ["Burra", "Kafin Madaki"],
  },
  Bayelsa: {
    Yenagoa: ["Opolo", "Akenfa", "Okaka", "Ovom", "Kpansia"],
    Brass: ["Twon", "Okpoama"],
    Sagbama: ["Osekwenike", "Agbere"],
    Ogbia: ["Otuoke", "Kolo", "Anyama"],
    Ekeremor: ["Aleibiri", "Oporoma"],
  },
  Benue: {
    Makurdi: ["High Level", "Wurukum", "North Bank", "Modern Market"],
    Gboko: ["Tom Anyo", "Adekaa"],
    Otukpo: ["Ogobia", "Upu"],
    "Katsina-Ala": ["Abaji", "Gbajimba"],
    Vandeikya: ["Mbadede", "Tse Mker"],
  },
  Borno: {
    Maiduguri: ["Baga Road", "Giwa Barracks", "Custom", "GRA"],
    Bama: ["Kasugula", "Shehuri"],
    Biu: ["Dutsen", "Galtimari"],
    Dikwa: ["Central", "Fadagui"],
    Gubio: ["Shuwari", "Gubio Central"],
  },
  "Cross River": {
    Calabar: ["Mariaba", "Ika Ika Oqua", "Goldie", "Summit Hills"],
    Ikom: ["Four Corners", "Nkarasi"],
    Ogoja: ["Ishibori", "Igoli"],
    Obudu: ["Utugwang", "Beggi"],
    Ugep: ["Ikpakapit", "Ibom"],
  },
  Delta: {
    Asaba: ["Okpanam Road", "GRA", "Ibusa Road", "Summit Junction", "Anwai Road", "Jesus Saves", "Directorate Road"],
    Warri: ["Ekpan", "Jakpa", "Airport Road", "Enerhen", "Effurun", "PTI Road", "Refinery Road", "NPA", "Ogunu"],
    Sapele: ["Amukpe", "Okirighwre"],
    Ughelli: ["Otovwodo", "Eruemukohwarien"],
    Agbor: ["Owa", "Ika South"],
  },
  Ebonyi: {
    Abakaliki: ["Presco", "Onuebonyi", "Spera-In-Deo"],
    Afikpo: ["Ndibe", "Ezera"],
    Onueke: ["Ezza North", "Ezza South"],
    Ezza: ["Umuezeoka", "Ezzagu"],
    Ishielu: ["Ezillo", "Ntezi"],
  },
  Edo: {
    "Benin City": ["GRA", "Ugbowo", "Sapele Road", "Uselu", "Ikpoba Hill", "New Benin", "Ring Road", "Ekenwan", "Siluko", "Upper Sakponba", "Adesuwa", "Boundary Road", "Airport Road"],
    Auchi: ["Jattu", "Ughiole"],
    Ekpoma: ["Uke", "Iruekpen"],
    Uromi: ["Evia", "Amedokhian"],
    Igarra: ["Akoko Road", "Etuno"],
  },
  Ekiti: {
    "Ado-Ekiti": ["Oke-Ila", "Oke-Iyinmi", "Fajuyi", "Igbole"],
    Ikere: ["Odo", "Uro"],
    "Efon-Alaaye": ["Efon Central"],
    Ijero: ["Ikoro", "Epe"],
    Ikole: ["Egbe", "Ara"],
  },
  Enugu: {
    Enugu: ["Independence Layout", "New Haven", "Uwani", "GRA", "Achara Layout", "Abakpa", "Emene", "Ogui", "Asata", "Coal Camp", "Ogbete", "Trans Ekulu", "Thinkers Corner", "Presco", "Gariki", "Artisan", "Zik Avenue", "Okpara Avenue", "Presidential Road"],
    Nsukka: ["Orba", "Opi", "University Road", "Onuiyi", "Ibagwa", "Obukpa"],
    "Oji River": ["Achi", "Inyi"],
    Agbani: ["Ugwuaji", "Obe"],
    Udi: ["Amokwe", "Eke"],
  },
  FCT: {
    Abuja: ["Maitama", "Asokoro", "Wuse", "Wuse 2", "Garki", "Garki 2", "Central Area", "Utako", "Jabi", "Guzape", "Katampe", "Life Camp", "Kado", "Durumi", "Gudu", "Apo", "Lokogoma", "Galadimawa", "Dawaki", "Kubwa", "Dutse", "Bwari", "Gwagwalada", "Lugbe", "Karu", "Nyanya", "Mararaba", "Jikwoyi", "Kurudu", "Kuje", "Kwali", "Abaji", "Gwarinpa", "Karmo", "Idu", "Dakibiyu", "Dei-Dei", "Zuba", "Suleja", "Madalla"],
    Gwagwalada: ["Kutunku", "Angwan Dodo"],
    Kuje: ["Chibiri", "Gaube"],
    Bwari: ["Kawu", "Kogo"],
    Kwali: ["Yangoji", "Kilankwa"],
  },
  Gombe: {
    Gombe: ["Nasarawo", "Pantami", "Federal Low Cost"],
    Kumo: ["Liji", "Kalshingi"],
    Deba: ["Kunji", "Lano"],
    Billiri: ["Bare", "Tudu"],
    Kaltungo: ["Awachie", "Boji"],
  },
  Imo: {
    Owerri: ["Ikenegbu", "World Bank", "Orji", "Amakohia", "New Owerri", "Egbu Road", "Douglas Road", "Wetheral", "Okigwe Road", "MCC Road", "Tetlow", "Aladinma"],
    Orlu: ["Umuowa", "Okporo"],
    Okigwe: ["Ubah", "Anara"],
    Mbaise: ["Ahiara", "Eke Nguru"],
    Nkwerre: ["Amaigbo", "Umudi"],
  },
  Jigawa: {
    Dutse: ["Sabon Gari", "Danfodio"],
    Hadejia: ["Kofar Arewa", "Yamma"],
    Gumel: ["Central", "Garin Alhaji"],
    Kazaure: ["Badawa", "Kofar Kudu"],
    Ringim: ["Chai-Chai", "Sankara"],
  },
  Kaduna: {
    Kaduna: ["Barnawa", "Ungwan Rimi", "Kaduna South", "Kakuri", "Sabon Tasha", "Television", "Malali", "Ungwan Dosa", "Narayi", "Gonigora", "Kawo", "Mando", "Rigasa", "Tudun Wada", "Badiko", "Kudenda"],
    Zaria: ["Sabon Gari", "Samuru", "Tudun Wada Zaria", "PZ", "Angwan Liman"],
    Kafanchan: ["Kagoro", "Fadan Kaje"],
    Kagoro: ["Gidan Waya", "Kaura"],
    Kachia: ["Sabon Sarki", "Awon"],
  },
  Kano: {
    Kano: ["Fagge", "Tarauni", "Gwale", "Nassarawa", "Dala", "Kumbotso", "Ungogo", "Kano Municipal", "Sabon Gari", "Farm Centre", "Hotoro", "Dorayi", "Zango", "Sharada", "Challawa", "Dawakin Tofa", "Gwarzo Road", "Zaria Road", "Hadejia Road", "Bompai", "Nomansland"],
    Wudil: ["Lajawa", "Dankaza"],
    Gwarzo: ["Kutama", "Sabon Gari"],
    Bichi: ["Dawaki", "Bagwai"],
    Rano: ["Zango", "Lausu"],
  },
  Katsina: {
    Katsina: ["Kofar Soro", "Kofar Kaura", "GRA"],
    Daura: ["Kanti", "Dungu"],
    Funtua: ["Sabon Gari", "Galadima"],
    Malumfashi: ["Dagura", "Galadanci"],
    Kankia: ["Kofar Yandaka", "Kuraye"],
  },
  Kebbi: {
    "Birnin Kebbi": ["Makera", "GRA", "Kola"],
    Argungu: ["Tudun Wada", "Lailaba"],
    Yauri: ["Shanga", "Ungu"],
    Zuru: ["Isgogo", "Rafin Zuru"],
    Kalgo: ["Sirdi", "Danko"],
  },
  Kogi: {
    Lokoja: ["Ganaja", "Adankolo", "Zone 8"],
    Okene: ["Iruvucheba", "Otutu"],
    Kabba: ["Gbeleko", "Zango"],
    Idah: ["Sabon Gari", "Ukwokolo"],
    Ankpa: ["Enjema", "Angwa"],
  },
  Kwara: {
    Ilorin: ["Geri Alimi", "Tanke", "Challenge", "Sabo Oke"],
    Offa: ["Ijesha", "Owode"],
    Jebba: ["Kainji Road", "Moshalashi"],
    Lafiagi: ["Shonga", "Gwasoro"],
    Pategi: ["Kpada", "Lade"],
  },
  Lagos: {
    Ikeja: ["Alausa", "Opebi", "Allen Avenue", "Maryland", "GRA Ikeja", "Ogba", "Omole", "Magodo", "Ojodu Berger", "Adeniyi Jones", "Awolowo Way", "Kudirat Abiola Way", "Aromire", "Adekunle Fajuyi", "Airport Road"],
    "Lagos Island": ["Obalende", "CMS", "Idumota", "Balogun", "Isale Eko", "Broad Street", "Marina", "Victoria Island", "Ikoyi", "Bourdillon", "Banana Island", "Dolphin Estate", "Oniru", "Osborne", "Parkview"],
    Lekki: ["Lekki Phase 1", "Lekki Phase 2", "Chevron", "Ikate", "Elegushi", "VGC", "Ikota", "Ajah", "Sangotedo", "Awoyaya", "Epe Expressway", "Abraham Adesanya", "Ogombo", "Victory Island"],
    Ikorodu: ["Igbogbo", "Ebute", "Imota", "Ijede", "Odonguyan", "Maya", "Ibeshe", "Igbopa", "Ikorodu Garage"],
    Surulere: ["Aguda", "Ijesha", "Bode Thomas", "Lawanson", "Adelabu", "Masha", "Ogunlana Drive", "Western Avenue"],
    Yaba: ["Sabo", "Tejuosho", "Alagomeji", "Adekunle", "Akoka", "Onike", "Fadeyi", "Jibowu", "Ebute Metta"],
    Festac: ["Festac Town", "Amuwo Odofin", "Satellite Town", "Ago Palace Way", "Okota", "Isolo", "Oshodi", "Mafoluku"],
    Epe: ["Ita Opo", "Popo Oba"],
    Badagry: ["Ajara", "Ibereko"],
  },
  Nasarawa: {
    Lafia: ["Kwandere", "Agyaragu"],
    Keffi: ["Angwan Lambu", "Angwan Tiv"],
    Akwanga: ["Nunkai", "Andaha"],
    Nasarawa: ["Loko", "Udeni"],
    Doma: ["Alagye", "Rutu"],
  },
  Niger: {
    Minna: ["Chanchaga", "Tunga", "Bosso"],
    Bida: ["Bariki", "Masaba"],
    Kontagora: ["Maikujeri", "Tunga", "Usubu", "GRA", "GRA Phase 2", "Federal Low Cost"],
    Suleja: ["Madalla", "Maje"],
    Lapai: ["Evuti", "Gulu"],
  },
  Ogun: {
    Abeokuta: ["Asero", "Adigbe", "Oke-Ilewo"],
    "Ijebu Ode": ["Molipa", "Itantebo"],
    Sagamu: ["Makun", "Ode Lemo"],
    Ota: ["Sango", "Owode"],
    Ilaro: ["Oke Odan", "Sabo"],
  },
  Ondo: {
    Akure: ["Alagbaka", "Ijapo", "Oke Aro"],
    Ondo: ["Yaba", "Enuowa"],
    Owo: ["Isuada", "Ipele"],
    Ikare: ["Okoja", "Okorun"],
    Ore: ["Odunwo", "Mobolorunduro"],
  },
  Osun: {
    Osogbo: ["Oke Fia", "Oke Baale", "Testing Ground"],
    "Ile-Ife": ["Lagere", "Oduduwa College"],
    Ilesa: ["Owa Obokun", "Imo"],
    Ede: ["Sekona", "Oke Gada"],
    Iwo: ["Oke-Adan", "Agbowo"],
  },
  Oyo: {
    Ibadan: ["Bodija", "Challenge", "Jericho", "Dugbe", "Molete", "Ring Road", "Oke Ado", "Agodi", "Gate", "Oje", "Oja Oba", "Mapo", "Beere", "Ojoo", "Sango", "UI", "Agbowo", "Bashorun", "Akobo", "Oluyole", "Elebu", "Akala Express", "New Garage", "Monatan", "Alakia", "Egbeda", "Olorunda", "Apata", "Elewura"],
    Ogbomoso: ["Takie", "Aroje", "Oke Anu", "Sabokoro", "Oja Igbo"],
    Oyo: ["Akesan", "Fasola", "Isale Oyo"],
    Iseyin: ["Oke Ola", "Oja Oba"],
    Saki: ["Irekere", "Okere"],
  },
  Plateau: {
    Jos: ["Rayfield", "Tudun Wada", "Terminus"],
    Bukuru: ["Kuru", "Gyel"],
    Pankshin: ["Chip", "Bwall"],
    Shendam: ["Poeship", "Kalong"],
    Langtang: ["Gazum", "Kuffen"],
  },
  Rivers: {
    "Port Harcourt": ["GRA Phase 1", "GRA Phase 2", "GRA Phase 3", "Trans Amadi", "D-Line", "Rumuokoro", "Rumuola", "Rumuigbo", "Rumuomasi", "Woji", "Rumuodara", "Eliozu", "Rukpokwu", "Rumuokwuta", "Ada George", "Rumuolumeni", "Eneka", "Rumuagholu", "Ozuoba", "Rumuibekwe", "Elelenwo", "Rumuepirikom", "Rumuokwurusi", "Diobu", "Mile 1", "Mile 2", "Mile 3", "Mile 4", "Borikiri", "Old GRA", "Town"],
    "Obio-Akpor": ["Rumuodumaya", "Rumuokoro", "Rumuigbo", "Elimgbu", "Mgbuoba"],
    Eleme: ["Alesa", "Aleto", "Onne", "Ogale"],
    Okrika: ["Ogoloma", "Ibaka"],
    Bonny: ["Finima", "Iwoama"],
  },
  Sokoto: {
    Sokoto: ["Gawon Nama", "Runjin Sambo"],
    Gwadabawa: ["Gidanje", "Illela Road"],
    Bodinga: ["Dingyadi", "Sifawa"],
    Wurno: ["Achida", "Magarya"],
    Goronyo: ["Takakume", "Shinaka"],
  },
  Taraba: {
    Jalingo: ["Sabon Gari", "Mile Six"],
    Wukari: ["Hospital Road", "Avyi"],
    Ibi: ["Ibi Central", "Sabon Pegi"],
    Bali: ["Maihula", "Tikari"],
    Gembu: ["Kabri", "Gembu Town"],
  },
  Yobe: {
    Damaturu: ["Nayinawa", "Maisandari"],
    Potiskum: ["Mamudo", "NPN"],
    Gashua: ["Garun Gawa", "Abuja Quarters"],
    Nguru: ["Bulabulin", "Bajoga"],
    Geidam: ["Hausari", "Shekau"],
  },
  Zamfara: {
    Gusau: ["Sabon Gari", "Tudun Wada"],
    "Kaura Namoda": ["Galadima", "Kura"],
    "Talata Mafara": ["Bata", "Birnin Magaji"],
    Anka: ["Dan Galadima", "Sabon Gari"],
    Bungudu: ["Kwatar Kwashi", "Sakkida"],
  },
};

// ── Location helpers (mirrors mobile) ────────────────────────────────────────

export const getAllStates = (): string[] =>
  Object.keys(NIGERIAN_LOCATIONS).sort();

export const getCitiesByState = (state: string): string[] =>
  state && NIGERIAN_LOCATIONS[state]
    ? Object.keys(NIGERIAN_LOCATIONS[state]).sort()
    : [];

export const getAreasByCity = (state: string, city: string): string[] => {
  if (!state || !city) return [];
  return NIGERIAN_LOCATIONS[state]?.[city] ?? [];
};

/** Flat state → first-level cities list (for simple dropdowns) */
export const NIGERIAN_STATES: Record<string, string[]> = Object.fromEntries(
  Object.entries(NIGERIAN_LOCATIONS).map(([state, cities]) => [
    state,
    Object.keys(cities).sort(),
  ])
);

export const NIGERIAN_STATE_NAMES = getAllStates();
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, X, Image as ImageIcon, ChevronDown, Check,
  RefreshCw, AlertTriangle, Info, Package, Truck,
  Shield, ArrowRight, Loader2, Upload,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// ─── Constants ─────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://elitehub-backend.onrender.com/api/v1";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
const MAX_IMAGES = 6;

const WARRANTY_OPTIONS = [
  { label: "No Warranty", value: "none" },
  { label: "24 Hours after delivery", value: "24hours" },
  { label: "1 Week after delivery", value: "1week" },
  { label: "1 Month after delivery", value: "1month" },
  { label: "1 Year Warranty", value: "1year" },
];

// ─── Category Group Types (ported from mobile DynamicFields.tsx) ──────────────

type CategoryGroup =
  | "automobile" | "real_estate"
  | "fashion_women" | "fashion_men" | "fashion_kids"
  | "beauty" | "phones" | "computers" | "tv_audio_gaming" | "cameras"
  | "home_appliances" | "furniture" | "home_decor" | "kitchen"
  | "fruits_veg" | "meat_fish" | "grains" | "beverages" | "packaged_snacks"
  | "health_medical" | "garden_outdoor" | "pets_animals"
  | "industrial" | "sports_hobbies" | "internet" | "preciousMetals"
  | "agriculture" | "general";

const CAT_KEY_TO_GROUP: Record<string, CategoryGroup> = {
  vehicles_cars: "automobile", commercial_heavy_duty: "automobile",
  motorcycles_powersports: "automobile", auto_parts_care: "automobile",
  real_estate: "real_estate", real_estate_listings: "real_estate",
  phones_tablets: "phones", laptops_computers: "computers",
  tv_audio_gaming: "tv_audio_gaming", cameras_optics: "cameras",
  womens_fashion: "fashion_women", mens_fashion: "fashion_men",
  babies_kids: "fashion_kids", beauty_personal_care: "beauty",
  home_appliances: "home_appliances", furniture: "furniture",
  home_decor: "home_decor", kitchen_dining: "kitchen",
  fruits_vegetables: "fruits_veg", meat_fish_poultry: "meat_fish",
  rice_beans_grains: "grains", beverages: "beverages",
  packaged_snacks_condiments: "packaged_snacks",
  health_medical: "health_medical", garden_outdoor: "garden_outdoor",
  pets_animals: "pets_animals", industrial_business: "industrial",
  sports_hobbies: "sports_hobbies", precious_metals: "preciousMetals",
  internet_network: "internet", other: "general",
};

function toCatKey(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function getCategoryGroup(cat: string | null): CategoryGroup {
  if (!cat) return "general";
  const key = toCatKey(cat);
  if (CAT_KEY_TO_GROUP[key]) return CAT_KEY_TO_GROUP[key];
  const c = cat.toLowerCase();
  if (/vehicle|automobile|motorbike|motorcycle/.test(c)) return "automobile";
  if (/real.?estate/.test(c)) return "real_estate";
  if (/phone|tablet/.test(c)) return "phones";
  if (/laptop|computer/.test(c)) return "computers";
  if (/tv|audio|gaming/.test(c)) return "tv_audio_gaming";
  if (/camera|optic/.test(c)) return "cameras";
  if (/women|ladies/.test(c)) return "fashion_women";
  if (/men|gent/.test(c)) return "fashion_men";
  if (/bab|kid|child/.test(c)) return "fashion_kids";
  if (/beauty|cosmetic|personal.?care/.test(c)) return "beauty";
  if (/home.?appliance|appliance/.test(c)) return "home_appliances";
  if (/furniture/.test(c)) return "furniture";
  if (/home.?decor|decor/.test(c)) return "home_decor";
  if (/kitchen/.test(c)) return "kitchen";
  if (/fruit|vegetable/.test(c)) return "fruits_veg";
  if (/meat|fish|poultry/.test(c)) return "meat_fish";
  if (/rice|bean|grain|cereal/.test(c)) return "grains";
  if (/beverage|drink/.test(c)) return "beverages";
  if (/snack|condiment/.test(c)) return "packaged_snacks";
  if (/health|medical/.test(c)) return "health_medical";
  if (/garden|outdoor/.test(c)) return "garden_outdoor";
  if (/pet|animal/.test(c)) return "pets_animals";
  if (/industrial|business.?equip/.test(c)) return "industrial";
  if (/sport|hobb/.test(c)) return "sports_hobbies";
  if (/internet|network/.test(c)) return "internet";
  if (/precious|metal|gold|silver/.test(c)) return "preciousMetals";
  if (/agric|farm/.test(c)) return "agriculture";
  return "general";
}

// ─── Form State ────────────────────────────────────────────────────────────────

interface FormState {
  // Basic
  name: string; description: string; price: string; stock: string;
  discount: string; brand: string; weight: string; expiryDate: string;
  colorsText: string; warranty: string;
  condition: "Brand New" | "Used" | "Thrift" | null;
  // Category
  selectedCategory: string | null; subcategory: string | null;
  // Delivery
  withinStateFee: string; outsideStateFee: string;
  allowsPickup: boolean; withinStateDays: string; outsideStateDays: string;
  // Automobile
  autoMake: string; autoModel: string; autoYear: string; autoMileage: string;
  autoTransmission: string; autoFuelType: string; autoEngineCC: string;
  autoDoors: string; autoSeats: string; autoColor: string; autoVIN: string;
  autoRegistered: boolean;
  // Property
  propertyType: string; propertyAddress: string; propertyState: string;
  propertySize: string; propertyBedrooms: string; propertyBathrooms: string;
  propertyFurnished: string;
  // Fashion
  fashionSize: string; fashionType: string; fashionMaterial: string;
  fashionPattern: string; fashionGender: string;
  // Tech
  ram: string; storage: string; screenInches: string; processorType: string;
  generation: string; dedicatedGpu: string; displayType: string;
  connectivity: string; operatingSystem: string; batteryCapacity: string;
  refreshRate: string; phoneModel: string; networkGen: string;
  resolution: string; gamingPlatform: string;
  // Appliances
  powerSource: string; capacity: string; energyRating: string;
  material: string; wattage: string;
  // Beauty / Food
  skinType: string; ingredients: string; volume: string;
  productType: string; sourceOrigin: string; isOrganic: boolean;
  // Precious metals / Internet
  preciousType: string; purity: string; metalForm: string;
  pricePerGram: string; hasAssayCert: boolean; serialNumber: string;
  network: string; speed: string; dataValidity: string;
  // Sports / General
  itemType: string; dimensions: string;
  // Wholesale
  wholesaleEnabled: boolean; wholesaleMinQty: string; wholesalePrice: string;
}

const EMPTY_FORM: FormState = {
  name: "", description: "", price: "", stock: "", discount: "",
  brand: "", weight: "", expiryDate: "", colorsText: "", warranty: "none",
  condition: null, selectedCategory: null, subcategory: null,
  withinStateFee: "", outsideStateFee: "",
  allowsPickup: true, withinStateDays: "1-2 days", outsideStateDays: "3-5 days",
  autoMake: "", autoModel: "", autoYear: "", autoMileage: "",
  autoTransmission: "", autoFuelType: "", autoEngineCC: "",
  autoDoors: "", autoSeats: "", autoColor: "", autoVIN: "", autoRegistered: false,
  propertyType: "", propertyAddress: "", propertyState: "",
  propertySize: "", propertyBedrooms: "", propertyBathrooms: "", propertyFurnished: "",
  fashionSize: "", fashionType: "", fashionMaterial: "", fashionPattern: "", fashionGender: "",
  ram: "", storage: "", screenInches: "", processorType: "",
  generation: "", dedicatedGpu: "", displayType: "",
  connectivity: "", operatingSystem: "", batteryCapacity: "", refreshRate: "",
  phoneModel: "", networkGen: "", resolution: "", gamingPlatform: "",
  powerSource: "", capacity: "", energyRating: "", material: "", wattage: "",
  skinType: "", ingredients: "", volume: "",
  productType: "", sourceOrigin: "", isOrganic: false,
  preciousType: "", purity: "", metalForm: "",
  pricePerGram: "", hasAssayCert: false, serialNumber: "",
  network: "", speed: "", dataValidity: "",
  itemType: "", dimensions: "",
  wholesaleEnabled: false, wholesaleMinQty: "", wholesalePrice: "",
};

// ─── Reusable Form Primitives ──────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder = "", type = "text",
  maxLength, className = "", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; maxLength?: number;
  className?: string; required?: boolean;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-navy-DEFAULT/60 uppercase tracking-wide mb-1.5 font-body">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength}
        className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(11,46,51,0.15)] bg-white text-navy-DEFAULT text-sm font-body placeholder-navy-DEFAULT/30 focus:outline-none focus:border-gold-DEFAULT focus:ring-2 focus:ring-[rgba(201,168,76,0.15)] transition-all"
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, placeholder = "", maxLength, required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy-DEFAULT/60 uppercase tracking-wide mb-1.5 font-body">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength} rows={3}
        className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(11,46,51,0.15)] bg-white text-navy-DEFAULT text-sm font-body placeholder-navy-DEFAULT/30 focus:outline-none focus:border-gold-DEFAULT focus:ring-2 focus:ring-[rgba(201,168,76,0.15)] transition-all resize-none"
      />
      {maxLength && (
        <p className="text-right text-[11px] text-navy-DEFAULT/30 font-body mt-0.5">{value.length}/{maxLength}</p>
      )}
    </div>
  );
}

function ChipGroup({
  label, options, selected, onSelect, required = false,
}: {
  label: string; options: string[]; selected: string;
  onSelect: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy-DEFAULT/60 uppercase tracking-wide mb-2 font-body">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt} type="button"
            onClick={() => onSelect(opt)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-bold font-body border transition-all",
              selected === opt
                ? "bg-[#0B2E33] border-[#0B2E33] text-gold-DEFAULT"
                : "bg-white border-[rgba(11,46,51,0.15)] text-navy-DEFAULT/60 hover:border-gold-DEFAULT hover:text-gold-DEFAULT"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SwitchRow({ label, value, onChange, sub }: { label: string; value: boolean; onChange: (v: boolean) => void; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[rgba(11,46,51,0.06)] last:border-0">
      <div>
        <p className="text-sm font-semibold text-navy-DEFAULT font-body">{label}</p>
        {sub && <p className="text-xs text-navy-DEFAULT/40 font-body mt-0.5">{sub}</p>}
      </div>
      <button
        type="button" onClick={() => onChange(!value)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-all shrink-0",
          value ? "bg-[#0B2E33]" : "bg-gray-200"
        )}
      >
        <span className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
          value ? "right-1" : "left-1"
        )} />
      </button>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mt-8 mb-4">
      <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
      <h3 className="font-display font-bold text-navy-DEFAULT text-sm">{title}</h3>
    </div>
  );
}

// ─── Dynamic Fields Component ──────────────────────────────────────────────────

function DynamicFields({
  group, form, set,
}: {
  group: CategoryGroup;
  form: FormState;
  set: (key: keyof FormState, value: any) => void;
}) {
  if (group === "automobile") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Make *" value={form.autoMake} onChange={v => set("autoMake", v)} placeholder="e.g. Toyota" required />
          <Field label="Model *" value={form.autoModel} onChange={v => set("autoModel", v)} placeholder="e.g. Camry" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Year *" value={form.autoYear} onChange={v => set("autoYear", v.replace(/\D/g, ""))} placeholder="e.g. 2020" required />
          <Field label="Mileage (km)" value={form.autoMileage} onChange={v => set("autoMileage", v.replace(/\D/g, ""))} placeholder="e.g. 50000" />
        </div>
        <ChipGroup label="Transmission *" options={["Automatic", "Manual", "CVT"]} selected={form.autoTransmission} onSelect={v => set("autoTransmission", v)} required />
        <ChipGroup label="Fuel Type *" options={["Petrol", "Diesel", "Electric", "Hybrid", "Gas"]} selected={form.autoFuelType} onSelect={v => set("autoFuelType", v)} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Engine CC" value={form.autoEngineCC} onChange={v => set("autoEngineCC", v)} placeholder="e.g. 2000" />
          <Field label="Exterior Colour *" value={form.autoColor} onChange={v => set("autoColor", v)} placeholder="e.g. Silver" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Doors" value={form.autoDoors} onChange={v => set("autoDoors", v.replace(/\D/g, ""))} placeholder="e.g. 4" />
          <Field label="Seats" value={form.autoSeats} onChange={v => set("autoSeats", v.replace(/\D/g, ""))} placeholder="e.g. 5" />
        </div>
        <Field label="VIN / Chassis No." value={form.autoVIN} onChange={v => set("autoVIN", v)} placeholder="e.g. 1HGBH41JXMN109186" />
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
        <SwitchRow label="Registered & Documented?" value={form.autoRegistered} onChange={v => set("autoRegistered", v)} />
      </div>
    );
  }

  if (group === "real_estate") {
    return (
      <div className="space-y-4">
        <Field label="Property Type *" value={form.propertyType} onChange={v => set("propertyType", v)} placeholder="e.g. 3-Bedroom Flat, Duplex" required />
        <Field label="Full Address *" value={form.propertyAddress} onChange={v => set("propertyAddress", v)} placeholder="5 Admiralty Way, Lekki Phase 1" required />
        <Field label="State *" value={form.propertyState} onChange={v => set("propertyState", v)} placeholder="e.g. Lagos" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Bedrooms" value={form.propertyBedrooms} onChange={v => set("propertyBedrooms", v.replace(/\D/g, ""))} placeholder="e.g. 3" />
          <Field label="Bathrooms" value={form.propertyBathrooms} onChange={v => set("propertyBathrooms", v.replace(/\D/g, ""))} placeholder="e.g. 2" />
        </div>
        <Field label="Size" value={form.propertySize} onChange={v => set("propertySize", v)} placeholder="e.g. 120 sqm" />
        <ChipGroup label="Furnishing" options={["Fully Furnished", "Semi Furnished", "Unfurnished"]} selected={form.propertyFurnished} onSelect={v => set("propertyFurnished", v)} />
      </div>
    );
  }

  if (group === "phones") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Apple, Samsung" required />
          <Field label="Model *" value={form.phoneModel} onChange={v => set("phoneModel", v)} placeholder="e.g. iPhone 15 Pro" required />
        </div>
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Storage *" value={form.storage} onChange={v => set("storage", v)} placeholder="e.g. 256GB" required />
          <Field label="RAM" value={form.ram} onChange={v => set("ram", v)} placeholder="e.g. 8GB" />
        </div>
        <ChipGroup label="Network" options={["5G", "4G LTE", "3G", "2G"]} selected={form.networkGen} onSelect={v => set("networkGen", v)} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Screen Size (in)" value={form.screenInches} onChange={v => set("screenInches", v)} placeholder="e.g. 6.7" />
          <Field label="Battery Health" value={form.batteryCapacity} onChange={v => set("batteryCapacity", v)} placeholder="e.g. 98%" />
        </div>
        <Field label="Available Colours *" value={form.colorsText} onChange={v => set("colorsText", v)} placeholder="e.g. Titanium Blue, Black" required />
      </div>
    );
  }

  if (group === "computers") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Apple, HP, Dell" required />
          <Field label="Model" value={form.phoneModel} onChange={v => set("phoneModel", v)} placeholder="e.g. MacBook Pro 14" />
        </div>
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="RAM *" value={form.ram} onChange={v => set("ram", v)} placeholder="e.g. 16GB" required />
          <Field label="Storage *" value={form.storage} onChange={v => set("storage", v)} placeholder="e.g. 512GB SSD" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Processor *" value={form.processorType} onChange={v => set("processorType", v)} placeholder="e.g. Intel i7, M3 Pro" required />
          <Field label="Generation" value={form.generation} onChange={v => set("generation", v)} placeholder="e.g. 13th Gen" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Screen Size (in)" value={form.screenInches} onChange={v => set("screenInches", v)} placeholder="e.g. 15.6" />
          <Field label="GPU" value={form.dedicatedGpu} onChange={v => set("dedicatedGpu", v)} placeholder="e.g. RTX 4060" />
        </div>
        <ChipGroup label="OS" options={["Windows 11", "Windows 10", "macOS", "Linux", "No OS"]} selected={form.operatingSystem} onSelect={v => set("operatingSystem", v)} />
      </div>
    );
  }

  if (group === "tv_audio_gaming") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Samsung, LG, Sony" required />
          <Field label="Model" value={form.phoneModel} onChange={v => set("phoneModel", v)} placeholder="e.g. QN85B" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Screen Size (in)" value={form.screenInches} onChange={v => set("screenInches", v)} placeholder="e.g. 65" />
          <Field label="Resolution" value={form.resolution} onChange={v => set("resolution", v)} placeholder="e.g. 4K UHD" />
        </div>
        <ChipGroup label="Type" options={["TV", "Soundbar", "Gaming Console", "Projector", "Speaker"]} selected={form.itemType} onSelect={v => set("itemType", v)} />
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
        <Field label="Available Colours" value={form.colorsText} onChange={v => set("colorsText", v)} placeholder="e.g. Black, White" />
      </div>
    );
  }

  if (group === "cameras") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Canon, Sony, Nikon" required />
          <Field label="Model *" value={form.phoneModel} onChange={v => set("phoneModel", v)} placeholder="e.g. A7 IV" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Megapixels" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. 33MP" />
          <Field label="Max Resolution" value={form.resolution} onChange={v => set("resolution", v)} placeholder="e.g. 4K, 8K" />
        </div>
        <ChipGroup label="Type" options={["DSLR", "Mirrorless", "Action", "Camcorder", "CCTV / Security", "Drone"]} selected={form.productType} onSelect={v => set("productType", v)} />
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
      </div>
    );
  }

  if (group === "fashion_women" || group === "fashion_men") {
    return (
      <div className="space-y-4">
        <Field label="Type *" value={form.fashionType} onChange={v => set("fashionType", v)} placeholder="e.g. Gown, Suit, Blouse, Agbada" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Size *" value={form.fashionSize} onChange={v => set("fashionSize", v)} placeholder="e.g. S, M, L, XL, 42" required />
          <Field label="Brand" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Nike, Zara" />
        </div>
        <Field label="Available Colours *" value={form.colorsText} onChange={v => set("colorsText", v)} placeholder="e.g. Red, Blue, Black" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Material" value={form.fashionMaterial} onChange={v => set("fashionMaterial", v)} placeholder="e.g. Cotton, Ankara" />
          <Field label="Pattern" value={form.fashionPattern} onChange={v => set("fashionPattern", v)} placeholder="e.g. Floral, Plain" />
        </div>
        <ChipGroup label="Condition *" options={["Brand New", "Thrift"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
      </div>
    );
  }

  if (group === "fashion_kids") {
    return (
      <div className="space-y-4">
        <Field label="Type *" value={form.fashionType} onChange={v => set("fashionType", v)} placeholder="e.g. Baby Bodysuit, Kids Dress, Toy" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Age / Size *" value={form.fashionSize} onChange={v => set("fashionSize", v)} placeholder="e.g. 3-4 yrs, 24M" required />
          <Field label="Brand" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Carter's, Graco" />
        </div>
        <Field label="Available Colours" value={form.colorsText} onChange={v => set("colorsText", v)} placeholder="e.g. Pink, Blue, Yellow" />
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
      </div>
    );
  }

  if (group === "beauty") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. MAC, Dove, Fenty" required />
          <Field label="Product Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Moisturiser, Wig, Perfume" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Volume / Size" value={form.volume} onChange={v => set("volume", v)} placeholder="e.g. 250ml, 100g" />
          <Field label="Skin Type" value={form.skinType} onChange={v => set("skinType", v)} placeholder="e.g. Oily, Dry, All" />
        </div>
        <Field label="Key Ingredients" value={form.ingredients} onChange={v => set("ingredients", v)} placeholder="e.g. Hyaluronic Acid, SPF 50" />
      </div>
    );
  }

  if (group === "home_appliances") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. LG, Samsung, Haier" required />
          <Field label="Model" value={form.phoneModel} onChange={v => set("phoneModel", v)} placeholder="e.g. LG S4-W12" />
        </div>
        <ChipGroup label="Type" options={["AC", "Fridge", "Washing Machine", "Generator", "Fan", "Microwave", "Oven"]} selected={form.itemType} onSelect={v => set("itemType", v)} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Capacity / Power" value={form.capacity} onChange={v => set("capacity", v)} placeholder="e.g. 300L, 1.5 HP, 3.5 KVA" />
          <Field label="Energy Rating" value={form.energyRating} onChange={v => set("energyRating", v)} placeholder="e.g. A++, 5 Star" />
        </div>
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
      </div>
    );
  }

  if (group === "furniture") {
    return (
      <div className="space-y-4">
        <Field label="Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. 3-Seater Sofa, King Bed, Wardrobe" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Size / Dimensions" value={form.fashionSize} onChange={v => set("fashionSize", v)} placeholder="e.g. 6×6ft, 3-Seater" />
          <Field label="Material" value={form.material} onChange={v => set("material", v)} placeholder="e.g. Leather, Solid Wood" />
        </div>
        <Field label="Available Colours *" value={form.colorsText} onChange={v => set("colorsText", v)} placeholder="e.g. Brown, Dark Grey, Walnut" required />
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
      </div>
    );
  }

  if (group === "home_decor") {
    return (
      <div className="space-y-4">
        <Field label="Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Curtain, Rug, Wall Art, Mirror" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Size" value={form.fashionSize} onChange={v => set("fashionSize", v)} placeholder="e.g. 5×7ft, 120×60cm" />
          <Field label="Material" value={form.material} onChange={v => set("material", v)} placeholder="e.g. Cotton, Glass, Canvas" />
        </div>
        <Field label="Available Colours *" value={form.colorsText} onChange={v => set("colorsText", v)} placeholder="e.g. Ivory, Teal, Beige" required />
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
      </div>
    );
  }

  if (group === "kitchen") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Tefal, Kenwood" />
          <Field label="Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Blender, Pot Set, Toaster" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Material" value={form.material} onChange={v => set("material", v)} placeholder="e.g. Stainless Steel, Ceramic" />
          <Field label="Capacity" value={form.capacity} onChange={v => set("capacity", v)} placeholder="e.g. 1.5L, 6-piece" />
        </div>
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
      </div>
    );
  }

  if (group === "fruits_veg") {
    return (
      <div className="space-y-4">
        <Field label="Produce Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Tomatoes, Watermelon, Ugu Leaf" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Quantity / Weight *" value={form.weight} onChange={v => set("weight", v)} placeholder="e.g. 1 kg, 50 pieces" required />
          <Field label="Origin" value={form.sourceOrigin} onChange={v => set("sourceOrigin", v)} placeholder="e.g. Jos, Kogi Farm" />
        </div>
        <Field label="Expiry / Best Before" value={form.expiryDate} onChange={v => set("expiryDate", v)} placeholder="e.g. 2025-12-01" />
        <SwitchRow label="Organic / Pesticide-free?" value={form.isOrganic} onChange={v => set("isOrganic", v)} />
      </div>
    );
  }

  if (group === "meat_fish") {
    return (
      <div className="space-y-4">
        <Field label="Product Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Fresh Chicken, Smoked Fish, Goat Meat" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Quantity / Weight *" value={form.weight} onChange={v => set("weight", v)} placeholder="e.g. 1 kg, 5 pieces" required />
          <Field label="Cut / Form" value={form.productType} onChange={v => set("productType", v)} placeholder="e.g. Whole, Boneless, Smoked" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Best Before / Date" value={form.expiryDate} onChange={v => set("expiryDate", v)} placeholder="e.g. 2025-12-01" />
          <Field label="Storage" value={form.fashionType} onChange={v => set("fashionType", v)} placeholder="e.g. Fresh, Frozen, Dried" />
        </div>
        <SwitchRow label="Halal / NAFDAC Certified?" value={form.isOrganic} onChange={v => set("isOrganic", v)} />
      </div>
    );
  }

  if (group === "grains") {
    return (
      <div className="space-y-4">
        <Field label="Product Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Basmati Rice, Black-eye Beans, Garri" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Royal Stallion, Honeywell" />
          <Field label="Pack Size / Weight *" value={form.weight} onChange={v => set("weight", v)} placeholder="e.g. 5 kg, 25 kg" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Origin" value={form.sourceOrigin} onChange={v => set("sourceOrigin", v)} placeholder="e.g. Thailand, Nigeria" />
          <Field label="Expiry Date" value={form.expiryDate} onChange={v => set("expiryDate", v)} placeholder="e.g. 2026-06-30" />
        </div>
        <SwitchRow label="Organic / Natural?" value={form.isOrganic} onChange={v => set("isOrganic", v)} />
      </div>
    );
  }

  if (group === "beverages" || group === "packaged_snacks") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Coca-Cola, Indomie" required />
          <Field label="Product Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Soft Drink, Noodles, Chips" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Volume / Pack Size *" value={form.volume || form.weight} onChange={v => set("volume", v)} placeholder="e.g. 500ml, 70g, 24-pack" required />
          <Field label="Flavour / Variant" value={form.fashionType} onChange={v => set("fashionType", v)} placeholder="e.g. Chicken, Original" />
        </div>
        <Field label="Expiry Date *" value={form.expiryDate} onChange={v => set("expiryDate", v)} placeholder="e.g. 2026-09-01" required />
      </div>
    );
  }

  if (group === "health_medical") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Omron, CeraVe, Moov" required />
          <Field label="Product Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Blood Pressure Monitor, Vitamin C" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Size / Quantity *" value={form.weight} onChange={v => set("weight", v)} placeholder="e.g. 30 caps, 100ml" required />
          <Field label="Expiry Date *" value={form.expiryDate} onChange={v => set("expiryDate", v)} placeholder="e.g. 2026-12-01" required />
        </div>
        <SwitchRow label="NAFDAC / FDA Registered?" value={form.isOrganic} onChange={v => set("isOrganic", v)} />
      </div>
    );
  }

  if (group === "preciousMetals") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Metal / Gem Type *" value={form.preciousType} onChange={v => set("preciousType", v)} placeholder="e.g. Gold, Silver, Diamond" required />
          <Field label="Form *" value={form.metalForm} onChange={v => set("metalForm", v)} placeholder="e.g. Bar, Coin, Ring" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Weight / Carat *" value={form.weight} onChange={v => set("weight", v)} placeholder="e.g. 1 oz, 10g, 0.5 ct" required />
          <Field label="Purity / Grade *" value={form.purity} onChange={v => set("purity", v)} placeholder="e.g. 24K, 999.9, VVS1" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price Per Gram (₦)" value={form.pricePerGram} onChange={v => set("pricePerGram", v.replace(/\D/g, ""))} placeholder="e.g. 72000" />
          <Field label="Serial / Cert No." value={form.serialNumber} onChange={v => set("serialNumber", v)} placeholder="e.g. XAU-2024-00182" />
        </div>
        <Field label="Source / Origin *" value={form.sourceOrigin} onChange={v => set("sourceOrigin", v)} placeholder="e.g. CBN Certified, UAE Import" required />
        <SwitchRow label="Has Assay Certificate?" value={form.hasAssayCert} onChange={v => set("hasAssayCert", v)} />
      </div>
    );
  }

  if (group === "internet") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Provider / Network *" value={form.network} onChange={v => set("network", v)} placeholder="e.g. MTN, Airtel, Spectranet" required />
          <Field label="Plan Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Monthly Data, SIM Bundle" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data Volume *" value={form.storage} onChange={v => set("storage", v)} placeholder="e.g. 20GB, Unlimited" required />
          <Field label="Speed" value={form.speed} onChange={v => set("speed", v)} placeholder="e.g. 10 Mbps, 4G LTE" />
        </div>
        <Field label="Validity *" value={form.dataValidity} onChange={v => set("dataValidity", v)} placeholder="e.g. 30 days, 3 months" required />
      </div>
    );
  }

  if (group === "industrial") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. HP, Epson, Caterpillar" required />
          <Field label="Equipment Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. POS Terminal, Commercial Oven" required />
        </div>
        <Field label="Model / Spec" value={form.phoneModel} onChange={v => set("phoneModel", v)} placeholder="e.g. TM-T88V, 20HP Diesel Compressor" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Power / Capacity" value={form.wattage} onChange={v => set("wattage", v)} placeholder="e.g. 380V, 5 Tons, 15HP" />
          <Field label="Origin / Made In" value={form.sourceOrigin} onChange={v => set("sourceOrigin", v)} placeholder="e.g. China, Germany" />
        </div>
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
      </div>
    );
  }

  if (group === "sports_hobbies") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Nike, Yamaha, LEGO" required />
          <Field label="Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Football, Acoustic Guitar, Tent" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Size / Spec" value={form.fashionSize} onChange={v => set("fashionSize", v)} placeholder="e.g. Size 5, 1000-piece, 4-person" />
          <Field label="Colour" value={form.colorsText} onChange={v => set("colorsText", v)} placeholder="e.g. Black/White" />
        </div>
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
      </div>
    );
  }

  if (group === "garden_outdoor" || group === "pets_animals") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Royal Canin, Gardena" />
          <Field label="Type *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Dog Food, Garden Hoe, Dog Collar" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Size / Spec" value={form.fashionSize} onChange={v => set("fashionSize", v)} placeholder="e.g. 10 kg, Medium, Large" />
          <Field label="Colour" value={form.colorsText} onChange={v => set("colorsText", v)} placeholder="e.g. Green, Black" />
        </div>
        <ChipGroup label="Condition *" options={["Brand New", "Used"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
      </div>
    );
  }

  // General fallback
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Brand *" value={form.brand} onChange={v => set("brand", v)} placeholder="e.g. Brand name" required />
        <Field label="Type / Model *" value={form.itemType} onChange={v => set("itemType", v)} placeholder="e.g. Item type or model" required />
      </div>
      <Field label="Dimensions / Size" value={form.dimensions} onChange={v => set("dimensions", v)} placeholder="e.g. 30×20×10 cm" />
      <Field label="Available Colours *" value={form.colorsText} onChange={v => set("colorsText", v)} placeholder="e.g. Black, White, Red" required />
      <ChipGroup label="Condition *" options={["Brand New", "Used", "Thrift"]} selected={form.condition ?? ""} onSelect={v => set("condition", v)} required />
    </div>
  );
}

// ─── Image Upload Grid ─────────────────────────────────────────────────────────

function ImageGrid({
  images, onAdd, onRemove, uploading,
}: {
  images: string[]; onAdd: (file: File) => void; onRemove: (i: number) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
        {Array.from({ length: MAX_IMAGES }).map((_, i) => (
          <div key={i} className="relative aspect-square">
            {images[i] ? (
              <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-gold-DEFAULT">
                <img src={images[i]} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500 transition-all"
                >
                  <X size={10} className="text-white" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded-full font-body">Main</span>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading || images.length >= MAX_IMAGES}
                className="w-full h-full rounded-xl border-2 border-dashed border-[rgba(11,46,51,0.2)] bg-[rgba(11,46,51,0.02)] flex flex-col items-center justify-center gap-1 hover:border-gold-DEFAULT hover:bg-gold-faint transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {uploading && i === images.length ? (
                  <Loader2 size={16} className="text-gold-DEFAULT animate-spin" />
                ) : (
                  <>
                    <ImageIcon size={16} className="text-navy-DEFAULT/30" />
                    <span className="text-[9px] text-navy-DEFAULT/30 font-body">
                      {i === 0 ? "Main *" : `${i + 1}`}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
      <input
        ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { if (e.target.files?.[0]) { onAdd(e.target.files[0]); e.target.value = ""; } }}
      />
      <p className="text-[11px] text-navy-DEFAULT/40 font-body">{images.length}/{MAX_IMAGES} images selected</p>
    </div>
  );
}

// ─── Wholesale Section ─────────────────────────────────────────────────────────

function WholesaleSection({ form, set }: { form: FormState; set: (k: keyof FormState, v: any) => void }) {
  const regularPrice = parseFloat((form.price || "").replace(/,/g, "")) || 0;
  const wholesalePrice = parseFloat((form.wholesalePrice || "").replace(/,/g, "")) || 0;
  const savingsPct = regularPrice > 0 && wholesalePrice > 0 && wholesalePrice < regularPrice
    ? Math.round(((regularPrice - wholesalePrice) / regularPrice) * 100) : 0;

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden",
      form.wholesaleEnabled ? "border-[rgba(201,168,76,0.4)]" : "border-[rgba(11,46,51,0.08)]"
    )}>
      <div className="flex items-center gap-4 p-4 bg-white">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          form.wholesaleEnabled ? "bg-[rgba(201,168,76,0.15)]" : "bg-[rgba(11,46,51,0.04)]"
        )}>
          <Package size={14} className={form.wholesaleEnabled ? "text-gold-DEFAULT" : "text-navy-DEFAULT/40"} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-navy-DEFAULT font-body">Wholesale Pricing</p>
          <p className="text-xs text-navy-DEFAULT/45 font-body">Offer bulk-buy discounts to buyers</p>
        </div>
        <button
          type="button"
          onClick={() => set("wholesaleEnabled", !form.wholesaleEnabled)}
          className={cn(
            "relative w-11 h-6 rounded-full transition-all shrink-0",
            form.wholesaleEnabled ? "bg-[#0B2E33]" : "bg-gray-200"
          )}
        >
          <span className={cn(
            "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
            form.wholesaleEnabled ? "right-1" : "left-1"
          )} />
        </button>
      </div>

      {form.wholesaleEnabled && (
        <div className="px-4 pb-4 bg-white border-t border-[rgba(11,46,51,0.06)] space-y-3">
          <div className="mt-3 px-3 py-2 rounded-lg bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)]">
            <p className="text-[11px] text-gold-DEFAULT font-semibold font-body">
              💡 Buyers who add {form.wholesaleMinQty || "N"} or more units get the wholesale price automatically.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Field label="Min. Qty for Wholesale *" value={form.wholesaleMinQty}
              onChange={v => set("wholesaleMinQty", v.replace(/\D/g, ""))}
              placeholder="e.g. 10" required />
            <Field label="Wholesale Price (₦) *" value={form.wholesalePrice}
              onChange={v => set("wholesalePrice", v.replace(/[^0-9.]/g, ""))}
              placeholder="e.g. 8000" required />
          </div>
          {savingsPct > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check size={10} className="text-emerald-600" />
              </div>
              <p className="text-xs text-emerald-700 font-semibold font-body">
                Buyers save {savingsPct}% — ₦{(regularPrice - wholesalePrice).toLocaleString()} off per unit when ordering {form.wholesaleMinQty}+
              </p>
            </div>
          )}
          {wholesalePrice > 0 && regularPrice > 0 && wholesalePrice >= regularPrice && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle size={12} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-600 font-semibold font-body">
                Wholesale price must be lower than the regular price (₦{regularPrice.toLocaleString()})
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Delivery Section ──────────────────────────────────────────────────────────

function DeliverySection({ form, set }: { form: FormState; set: (k: keyof FormState, v: any) => void }) {
  const withinChips = ["Same day", "1-2 days", "2-3 days", "3-5 days"];
  const outsideChips = ["Same day", "1-2 days", "3-5 days", "5-7 days", "1-2 weeks", "2-3 weeks"];

  return (
    <div className="space-y-4">
      {/* Within State */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.08)]">
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-sm text-navy-DEFAULT font-body">Within State Delivery</p>
          {form.withinStateFee === "0" && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold font-body">FREE</span>
          )}
        </div>
        <p className="text-xs text-navy-DEFAULT/45 font-body mb-3">Buyers in your state</p>
        <Field label="Delivery Fee (₦) — Enter 0 for Free"
          value={form.withinStateFee}
          onChange={v => set("withinStateFee", v.replace(/\D/g, ""))}
          placeholder="e.g. 1500" />
        <p className="text-xs font-bold text-navy-DEFAULT/50 uppercase tracking-wide mb-2 mt-3 font-body">Estimated Duration</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {withinChips.map(opt => (
            <button key={opt} type="button"
              onClick={() => set("withinStateDays", opt)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold border transition-all font-body",
                form.withinStateDays === opt
                  ? "bg-[#0B2E33] border-[#0B2E33] text-gold-DEFAULT"
                  : "bg-white border-[rgba(11,46,51,0.15)] text-navy-DEFAULT/60 hover:border-gold-DEFAULT"
              )}
            >{opt}</button>
          ))}
        </div>
        <input
          value={form.withinStateDays}
          onChange={e => set("withinStateDays", e.target.value)}
          placeholder='Or type custom e.g. "Within 24 hours"'
          maxLength={40}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(11,46,51,0.15)] bg-white text-navy-DEFAULT text-sm font-body placeholder-navy-DEFAULT/30 focus:outline-none focus:border-gold-DEFAULT focus:ring-2 focus:ring-[rgba(201,168,76,0.15)] transition-all"
        />
      </div>

      {/* Outside State */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.08)]">
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-sm text-navy-DEFAULT font-body">Outside State Delivery</p>
          {form.outsideStateFee === "0" && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold font-body">FREE</span>
          )}
        </div>
        <p className="text-xs text-navy-DEFAULT/45 font-body mb-3">Buyers in other states</p>
        <Field label="Delivery Fee (₦) — Enter 0 for Free"
          value={form.outsideStateFee}
          onChange={v => set("outsideStateFee", v.replace(/\D/g, ""))}
          placeholder="e.g. 5000" />
        <p className="text-xs font-bold text-navy-DEFAULT/50 uppercase tracking-wide mb-2 mt-3 font-body">Estimated Duration</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {outsideChips.map(opt => (
            <button key={opt} type="button"
              onClick={() => set("outsideStateDays", opt)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold border transition-all font-body",
                form.outsideStateDays === opt
                  ? "bg-[#0B2E33] border-[#0B2E33] text-gold-DEFAULT"
                  : "bg-white border-[rgba(11,46,51,0.15)] text-navy-DEFAULT/60 hover:border-gold-DEFAULT"
              )}
            >{opt}</button>
          ))}
        </div>
        <input
          value={form.outsideStateDays}
          onChange={e => set("outsideStateDays", e.target.value)}
          placeholder='Or type custom e.g. "Within 1 week"'
          maxLength={40}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(11,46,51,0.15)] bg-white text-navy-DEFAULT text-sm font-body placeholder-navy-DEFAULT/30 focus:outline-none focus:border-gold-DEFAULT focus:ring-2 focus:ring-[rgba(201,168,76,0.15)] transition-all"
        />
      </div>

      {/* Pickup */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.08)]">
        <SwitchRow
          label="Allow Store Pickup"
          value={form.allowsPickup}
          onChange={v => set("allowsPickup", v)}
          sub="Buyers can pick up from your store address"
        />
      </div>
    </div>
  );
}

// ─── Category Picker Modal ─────────────────────────────────────────────────────

function CategoryModal({
  categories, selected, onSelect, onClose,
}: {
  categories: { name: string; subcategories: readonly string[] }[];
  selected: { category: string | null; subcategory: string | null };
  onSelect: (cat: string, sub: string) => void;
  onClose: () => void;
}) {
  const [expandedCat, setExpandedCat] = useState<string | null>(selected.category);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(11,46,51,0.06)]">
          <h3 className="font-display font-bold text-navy-DEFAULT text-base">Select Category</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-[rgba(11,46,51,0.06)] flex items-center justify-center hover:bg-[rgba(11,46,51,0.1)] transition-all">
            <X size={16} className="text-navy-DEFAULT" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-3 py-3">
          {categories.map(cat => {
            const isOpen = expandedCat === cat.name;
            return (
              <div key={cat.name} className="mb-1">
                <button
                  type="button"
                  onClick={() => setExpandedCat(isOpen ? null : cat.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all",
                    isOpen ? "bg-[rgba(201,168,76,0.1)] text-gold-DEFAULT" : "hover:bg-[rgba(11,46,51,0.04)] text-navy-DEFAULT"
                  )}
                >
                  <span className="text-sm font-semibold font-body">{cat.name}</span>
                  <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="mt-1 ml-3 space-y-0.5">
                    {cat.subcategories.map(sub => (
                      <button
                        key={sub} type="button"
                        onClick={() => { onSelect(cat.name, sub); onClose(); }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all",
                          selected.category === cat.name && selected.subcategory === sub
                            ? "bg-[rgba(201,168,76,0.15)] text-gold-DEFAULT"
                            : "hover:bg-[rgba(11,46,51,0.04)] text-navy-DEFAULT/70"
                        )}
                      >
                        <span className="text-xs font-body">{sub}</span>
                        {selected.category === cat.name && selected.subcategory === sub && (
                          <Check size={12} className="text-gold-DEFAULT" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AddProductPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getToken } = useAuth();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showWarrantyDropdown, setShowWarrantyDropdown] = useState(false);
  const [categories, setCategories] = useState<{ name: string; subcategories: readonly string[] }[]>([]);

  // Auth guard
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== "seller"))) {
      router.replace("/profile");
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Subscription check
  const subscriptionActive = user && (user as any).subscriptionExpiresAt > Date.now();
  const profileComplete = (user as any)?.hasCompletedBusinessProfile;

  // Fetch categories
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/system/config`, { headers: { Authorization: `Bearer ${token ?? ""}` } });
        const data = await res.json();
        if (data.success && data.data?.sellerCategories) {
          // Only show categories the seller is approved for
          const sellerCats = (user as any)?.sellerCategories as string[] | undefined;
          const all = data.data.sellerCategories as { name: string; subcategories: readonly string[] }[];
          setCategories(sellerCats?.length ? all.filter(c => sellerCats.includes(c.name)) : all);
        }
      } catch { /* use empty */ }
    };
    if (user) fetchConfig();
  }, [user, getToken]);

  const set = useCallback((key: keyof FormState, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  // Image upload to Cloudinary
  const handleAddImage = useCallback(async (file: File) => {
    if (images.length >= MAX_IMAGES) { setError(`Maximum ${MAX_IMAGES} images allowed`); return; }
    setUploadingImage(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      fd.append("folder", "products");
      fd.append("quality", "auto:eco");
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      setImages(prev => [...prev, data.secure_url]);
      setImageFiles(prev => [...prev, file]);
    } catch (e: any) {
      setError(e.message || "Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  }, [images.length]);

  const handleRemoveImage = useCallback((i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setImageFiles(prev => prev.filter((_, idx) => idx !== i));
  }, []);

  const categoryGroup = getCategoryGroup(form.selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.selectedCategory || !form.subcategory) { setError("Please select a category and subcategory"); return; }
    if (images.length === 0) { setError("Please upload at least 1 product image"); return; }
    if (!form.name.trim()) { setError("Please enter a product name"); return; }
    if (!form.description.trim()) { setError("Please enter a product description"); return; }

    const priceNum = parseFloat((form.price || "").replace(/,/g, ""));
    if (isNaN(priceNum) || priceNum <= 0) { setError("Please enter a valid price"); return; }

    const stockNum = parseInt((form.stock || "").replace(/,/g, ""), 10);
    if (isNaN(stockNum) || stockNum < 0) { setError("Please enter a valid stock quantity"); return; }

    if (form.wholesaleEnabled) {
      const wsQty = parseInt(form.wholesaleMinQty, 10);
      const wsPrice = parseFloat(form.wholesalePrice.replace(/,/g, ""));
      if (isNaN(wsQty) || wsQty < 2) { setError("Wholesale minimum quantity must be at least 2"); return; }
      if (isNaN(wsPrice) || wsPrice <= 0) { setError("Please enter a valid wholesale price"); return; }
      if (wsPrice >= priceNum) { setError("Wholesale price must be lower than the regular price"); return; }
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      const colors = form.colorsText.split(/[\n,]/).map(c => c.trim()).filter(Boolean);

      const payload: any = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: priceNum,
        stock: stockNum,
        category: form.selectedCategory,
        subcategory: form.subcategory,
        imageUrls: images,
        brand: form.brand.trim() || undefined,
        weight: form.weight.trim() || undefined,
        discount: parseFloat(form.discount) || 0,
        expiryDate: form.expiryDate.trim() || undefined,
        condition: form.condition === "Thrift" ? "Used" : form.condition || undefined,
        colors: colors.length > 0 ? colors : undefined,
        warranty: form.warranty,
        wholesale: form.wholesaleEnabled && form.wholesaleMinQty && form.wholesalePrice
          ? { enabled: true, minQty: parseInt(form.wholesaleMinQty, 10), price: parseFloat(form.wholesalePrice.replace(/,/g, "")) }
          : { enabled: false },
        deliveryOptions: {
          withinState: parseFloat(form.withinStateFee) || 0,
          outsideState: parseFloat(form.outsideStateFee) || 0,
          allowsPickup: form.allowsPickup,
          estimatedDays: { withinState: form.withinStateDays || "1-2 days", outsideState: form.outsideStateDays || "3-5 days" },
        },
        // Automobile
        ...(form.autoMake && { autoMake: form.autoMake.trim() }),
        ...(form.autoModel && { autoModel: form.autoModel.trim() }),
        ...(form.autoYear && { autoYear: form.autoYear.trim() }),
        ...(form.autoMileage && { autoMileage: form.autoMileage.trim() }),
        ...(form.autoTransmission && { autoTransmission: form.autoTransmission }),
        ...(form.autoFuelType && { autoFuelType: form.autoFuelType }),
        ...(form.autoColor && { autoColor: form.autoColor.trim() }),
        ...(form.autoVIN && { autoVIN: form.autoVIN.trim() }),
        autoRegistered: form.autoRegistered || undefined,
        // Property
        ...(form.propertyAddress && { propertyAddress: form.propertyAddress.trim() }),
        ...(form.propertyState && { propertyState: form.propertyState.trim() }),
        ...(form.propertyBedrooms && { propertyBedrooms: form.propertyBedrooms }),
        ...(form.propertyBathrooms && { propertyBathrooms: form.propertyBathrooms }),
        ...(form.propertySize && { propertySize: form.propertySize }),
        ...(form.propertyFurnished && { propertyFurnished: form.propertyFurnished }),
        ...(form.propertyType && { propertyType: form.propertyType }),
        // Fashion
        ...(form.fashionType && { fashionType: form.fashionType.trim() }),
        ...(form.fashionSize && { fashionSize: form.fashionSize.trim() }),
        ...(form.fashionMaterial && { fashionMaterial: form.fashionMaterial.trim() }),
        ...(form.fashionPattern && { fashionPattern: form.fashionPattern.trim() }),
        // Tech
        ...(form.ram && { ram: form.ram }),
        ...(form.storage && { storage: form.storage }),
        ...(form.processorType && { processorType: form.processorType }),
        ...(form.generation && { generation: form.generation }),
        ...(form.dedicatedGpu && { dedicatedGpu: form.dedicatedGpu }),
        ...(form.operatingSystem && { operatingSystem: form.operatingSystem }),
        ...(form.screenInches && { screenInches: form.screenInches }),
        ...(form.batteryCapacity && { batteryCapacity: form.batteryCapacity }),
        ...(form.phoneModel && { phoneModel: form.phoneModel }),
        ...(form.networkGen && { networkGen: form.networkGen }),
        ...(form.resolution && { resolution: form.resolution }),
        ...(form.refreshRate && { refreshRate: form.refreshRate }),
        // Other fields
        ...(form.capacity && { capacity: form.capacity }),
        ...(form.energyRating && { energyRating: form.energyRating }),
        ...(form.material && { material: form.material }),
        ...(form.powerSource && { powerSource: form.powerSource }),
        ...(form.wattage && { wattage: form.wattage }),
        ...(form.skinType && { skinType: form.skinType }),
        ...(form.ingredients && { ingredients: form.ingredients }),
        ...(form.volume && { volume: form.volume }),
        ...(form.sourceOrigin && { sourceOrigin: form.sourceOrigin }),
        ...(form.productType && { productType: form.productType }),
        isOrganic: form.isOrganic || undefined,
        ...(form.preciousType && { preciousType: form.preciousType }),
        ...(form.purity && { purity: form.purity }),
        ...(form.metalForm && { metalForm: form.metalForm }),
        ...(form.pricePerGram && { pricePerGram: form.pricePerGram }),
        hasAssayCert: form.hasAssayCert || undefined,
        ...(form.serialNumber && { serialNumber: form.serialNumber }),
        ...(form.network && { network: form.network }),
        ...(form.speed && { speed: form.speed }),
        ...(form.dataValidity && { dataValidity: form.dataValidity }),
        ...(form.itemType && { itemType: form.itemType }),
        ...(form.dimensions && { dimensions: form.dimensions }),
      };

      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to submit product");

      // Success — redirect to product status page
      router.push("/seller-dashboard?submitted=true");
    } catch (e: any) {
      setError(e.message || "Failed to submit product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Blocked state — incomplete profile or expired subscription
  if (!profileComplete || !subscriptionActive) {
    return (
      <div className="min-h-screen bg-[#F8F7F4]">
        <div className="bg-[#0B2E33]">
          <div className="section py-10">
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-6 font-body">
              <Link href="/" className="hover:text-gold-DEFAULT transition-colors">Home</Link>
              <span>/</span>
              <Link href="/seller-dashboard" className="hover:text-gold-DEFAULT transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="text-white/70">Add Product</span>
            </nav>
            <h1 className="font-display text-2xl font-bold text-white">Add New Product</h1>
          </div>
        </div>
        <div className="section py-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-amber-500" />
          </div>
          <h2 className="font-display font-bold text-navy-DEFAULT text-xl mb-2">
            {!profileComplete ? "Complete Your Business Profile First" : "Subscription Required"}
          </h2>
          <p className="text-navy-DEFAULT/55 text-sm font-body max-w-md">
            {!profileComplete
              ? "Please complete your business profile on your seller dashboard before you can add products."
              : "Your platform subscription has expired. Please renew via the EliteHub NG mobile app to continue adding products."}
          </p>
          <Link
            href="/seller-dashboard"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2E33] text-gold-DEFAULT font-bold text-sm font-body hover:opacity-90 transition-all"
          >
            Go to Dashboard <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <div className="bg-[#0B2E33]">
        <div className="section py-10">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6 font-body">
            <Link href="/" className="hover:text-gold-DEFAULT transition-colors">Home</Link>
            <span>/</span>
            <Link href="/seller-dashboard" className="hover:text-gold-DEFAULT transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-white/70">Add Product</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
              <Plus size={18} className="text-gold-DEFAULT" />
            </div>
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest font-body mb-0.5">Seller Dashboard</p>
              <h1 className="font-display text-2xl font-bold text-white">Add New Product</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="section py-8 pb-16 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Review info banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.2)]">
            <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-blue-700 text-xs font-semibold font-body leading-relaxed">
              Products are reviewed before going live. Our team checks images, category, and product info within 24 hours.
            </p>
          </div>

          {/* ─── Category & Subcategory ─── */}
          <SectionHeader title="Category & Subcategory" />
          <button
            type="button"
            onClick={() => setShowCatModal(true)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left",
              form.subcategory
                ? "border-gold-DEFAULT bg-[rgba(201,168,76,0.08)] text-gold-DEFAULT"
                : "border-[rgba(11,46,51,0.15)] bg-white text-navy-DEFAULT/40 hover:border-gold-DEFAULT"
            )}
          >
            <span className="text-sm font-semibold font-body">
              {form.subcategory && form.selectedCategory
                ? `${form.selectedCategory} › ${form.subcategory}`
                : "Select category and subcategory..."}
            </span>
            <ChevronDown size={16} className="shrink-0" />
          </button>

          {/* ─── Product Images ─── */}
          <SectionHeader title={`Product Images (1–${MAX_IMAGES})`} />
          <ImageGrid images={images} onAdd={handleAddImage} onRemove={handleRemoveImage} uploading={uploadingImage} />

          {/* ─── Basic Info ─── */}
          <SectionHeader title="Basic Info" />
          <div className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.07)] space-y-4">
            <Field label="Product Name" value={form.name} onChange={v => set("name", v)} placeholder="Enter product name" maxLength={120} required />
            <TextArea label="Description" value={form.description} onChange={v => set("description", v)} placeholder="Describe the product's features, materials, condition, etc." maxLength={500} required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₦)" value={form.price} onChange={v => set("price", v.replace(/[^0-9.]/g, ""))} placeholder="e.g. 15000" required />
              <Field label="Stock Quantity" value={form.stock} onChange={v => set("stock", v.replace(/\D/g, ""))} placeholder="e.g. 10" required />
            </div>
          </div>

          {/* ─── Category-Specific Dynamic Fields ─── */}
          {form.selectedCategory && (
            <>
              <SectionHeader title={`${form.selectedCategory} Details`} />
              <div className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.07)]">
                <DynamicFields group={categoryGroup} form={form} set={set} />
              </div>
            </>
          )}

          {/* ─── Wholesale Pricing ─── */}
          <SectionHeader title="Pricing Options" />
          <WholesaleSection form={form} set={set} />

          {/* ─── Additional Details ─── */}
          <SectionHeader title="Additional Details" />
          <div className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.07)] space-y-4">
            <Field label="Discount %" value={form.discount} onChange={v => set("discount", v.replace(/\D/g, ""))} placeholder="e.g. 10 (optional)" maxLength={3} />

            {/* Warranty */}
            <div className="relative">
              <label className="block text-xs font-bold text-navy-DEFAULT/60 uppercase tracking-wide mb-1.5 font-body">Product Warranty</label>
              <button
                type="button"
                onClick={() => setShowWarrantyDropdown(v => !v)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[rgba(11,46,51,0.15)] bg-white text-navy-DEFAULT text-sm font-body hover:border-gold-DEFAULT transition-all"
              >
                <span>{WARRANTY_OPTIONS.find(o => o.value === form.warranty)?.label || "No Warranty"}</span>
                <ChevronDown size={14} className={cn("transition-transform", showWarrantyDropdown && "rotate-180")} />
              </button>
              {showWarrantyDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[rgba(11,46,51,0.1)] shadow-lg z-10 overflow-hidden">
                  {WARRANTY_OPTIONS.map(opt => (
                    <button
                      key={opt.value} type="button"
                      onClick={() => { set("warranty", opt.value); setShowWarrantyDropdown(false); }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 text-sm font-body hover:bg-gold-faint transition-all border-b border-[rgba(11,46,51,0.04)] last:border-0",
                        form.warranty === opt.value ? "text-gold-DEFAULT font-bold" : "text-navy-DEFAULT"
                      )}
                    >
                      {opt.label}
                      {form.warranty === opt.value && <Check size={14} className="text-gold-DEFAULT" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── Delivery Details ─── */}
          <SectionHeader title="🚚 Delivery Details" />
          <DeliverySection form={form} set={set} />

          {/* ─── Error Banner ─── */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
              <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm font-body">{error}</p>
            </div>
          )}

          {/* ─── Submit Button ─── */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || uploadingImage || images.length === 0}
              className={cn(
                "w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm font-body transition-all",
                submitting || uploadingImage || images.length === 0
                  ? "bg-[rgba(11,46,51,0.3)] text-white/50 cursor-not-allowed"
                  : "bg-[#0B2E33] text-gold-DEFAULT hover:opacity-90 active:scale-[0.98]"
              )}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting for Review…
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Submit for Review
                </>
              )}
            </button>
            <p className="text-center text-navy-DEFAULT/30 text-xs font-body mt-3">
              Your product will be reviewed by our team within 24 hours
            </p>
          </div>
        </form>
      </div>

      {/* Category Modal */}
      {showCatModal && (
        <CategoryModal
          categories={categories}
          selected={{ category: form.selectedCategory, subcategory: form.subcategory }}
          onSelect={(cat, sub) => { set("selectedCategory", cat); set("subcategory", sub); }}
          onClose={() => setShowCatModal(false)}
        />
      )}
    </div>
  );
}
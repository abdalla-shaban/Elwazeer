export const BASE_URL = "http://127.0.0.1:8000";
// process.env.NODE_ENV === "production"
//   ? "https://api.wazeerstore.com"
//   : "http://127.0.0.1:8000";

export const categories = ["عباية"];
export const fabric = ["قطن"];
export const seasons = ["Winter", "Summer"];
export const colors = [
  // Core Neutrals
  {
    name: "أسود كلاسيكي",
    en_name: "Classic Black",
    hexCode: "#0B0B0B",
    style: "bg-[#0B0B0B]! text-white",
  },
  {
    name: "أسود فحمي",
    en_name: "Charcoal Black",
    hexCode: "#1A1A1A",
    style: "bg-[#1A1A1A]! text-white",
  },
  {
    name: "أبيض عاجي",
    en_name: "Soft Ivory",
    hexCode: "#F6F3EE",
    style: "bg-[#F6F3EE]! text-black",
  },

  // Elegant Feminine Tones
  {
    name: "وردي باهت",
    en_name: "Dusty Rose",
    hexCode: "#C8A2A6",
    style: "bg-[#C8A2A6]! text-black",
  },
  {
    name: "زهري موف",
    en_name: "Mauve Blush",
    hexCode: "#B784A7",
    style: "bg-[#B784A7]! text-white",
  },
  {
    name: "بيج فاتح",
    en_name: "Soft Taupe",
    hexCode: "#A89F94",
    style: "bg-[#A89F94]! text-black",
  },

  // Premium Earthy Colors
  {
    name: "أخضر زيتي",
    en_name: "Olive Mist",
    hexCode: "#7A846E",
    style: "bg-[#7A846E]! text-white",
  },
  {
    name: "رملي دافئ",
    en_name: "Warm Sand",
    hexCode: "#D8CFC4",
    style: "bg-[#D8CFC4]! text-black",
  },
  {
    name: "بني موكا",
    en_name: "Mocha Brown",
    hexCode: "#5C4033",
    style: "bg-[#5C4033]! text-white",
  },

  // Luxury Accent Colors
  {
    name: "ذهبي شمبانيا",
    en_name: "Champagne Gold",
    hexCode: "#D4AF37",
    style: "bg-[#D4AF37]! text-black",
  },
  {
    name: "برونزي فاتح",
    en_name: "Soft Bronze",
    hexCode: "#B08D57",
    style: "bg-[#B08D57]! text-white",
  },
  {
    name: "خوخي عميق",
    en_name: "Deep Plum",
    hexCode: "#4B2C3F",
    style: "bg-[#4B2C3F]! text-white",
  },
];

export const sizes = [
  {
    size: "1",
    range: "تلبيس من 55 ل 80 كيلو",
    _id: "69486faf4cfb3aa871539353",
  },
  {
    size: "2",
    range: "تلبيس من 85 ل 125 كيلو",
    _id: "69486faf4cfb3aa871539354",
  },
  {
    size: "فري سايز",
    range: "تلبيس من 50 كيلو ل 95 كيلو",
    _id: "69486faf4cfb3aa871539355",
  },
  {
    size: "فري سايز",
    range: "تلبيس من 60 ل 120",
    _id: "69486faf4cfb3aa871539356",
  },
];

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

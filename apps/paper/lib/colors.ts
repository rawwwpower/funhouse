export type RisoColor = {
  name: string
  hex: string
}

export const RISO_COLORS: RisoColor[] = [
  { name: "Black",            hex: "#000000" },
  { name: "Burgundy",         hex: "#914E72" },
  { name: "Blue",             hex: "#0078BF" },
  { name: "Green",            hex: "#00A95C" },
  { name: "Teal",             hex: "#00838A" },
  { name: "Fluorescent Pink", hex: "#FF48B0" },
  { name: "Orange",           hex: "#FF6C2F" },
  { name: "Yellow",           hex: "#FFE800" },
  { name: "Gold",             hex: "#BB8B41" },
  { name: "Red",              hex: "#FF665E" },
  { name: "Purple",           hex: "#765BA7" },
  { name: "Mint",             hex: "#82D8D5" },
  { name: "Coral",            hex: "#FF8E8E" },
]

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export function isValidHex(hex: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(hex)
}

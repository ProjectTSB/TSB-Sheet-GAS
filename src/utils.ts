const cache = (() => {
  class Cache {
    private cache: Record<number, string> = {}

    public getOrSet(n: number, f: () => string): string {
      this.cache[n] = this.cache[n] ?? f()
      return this.cache[n]
    }
  }
  return new Cache()
})()

function convertColNumberToLetter(colIdx: number): string {
  const ALPHABETS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  return cache.getOrSet(colIdx, () => {
    if (colIdx < 27) {
      return ALPHABETS[colIdx - 1]
    }

    const res = colIdx % 26
    const div = Math.floor(colIdx / 26)
    return res === 0
      ? convertColNumberToLetter(div - 1) + ALPHABETS[25]
      : convertColNumberToLetter(div) + ALPHABETS[res - 1]
  })
}

function convertColLetterToNumber(col: string): number {
  const ALPHABETS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  return col.split("")
    .map(c => ALPHABETS.indexOf(c) + 1)
    .reduceRight((sum, idx) => sum * ALPHABETS.length + idx, 0)
}

function convertC1R1toA1(originCol: number | undefined, originRow: number | undefined, col: number, row: number): string {
  return convertColNumberToLetter(originCol ? originCol + col : col) + (originRow ? originRow + row : row)
}

type Color = { r: number, g: number, b: number, multiply: (multiplier: number) => Color, toHex: () => string }
function Color(r: number, g: number, b: number): Color {
  return {
    r, g, b,

    multiply(multiplier: number): Color {
      return multiplier === 1 ? this : Color(this.r * multiplier, this.g * multiplier, this.b * multiplier)
    },
    toHex(): string {
      return `#${[this.r, this.g, this.b].map(c => `0${c.toString(16).toUpperCase()}`.slice(-2)).join("")}`
    },
  }
}

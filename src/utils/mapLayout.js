/** Harita düğümü dikey aralığı (px) */
export const MAP_NODE_SPACING = 88

export const MAP_PADDING_TOP = 72
export const MAP_PADDING_BOTTOM = 80

/** Ünite başlığı için ekstra boşluk (ilk ünite hariç) */
export const MAP_UNIT_HEADER_HEIGHT = 40

/** Zigzag yatay konumlar (%) */
export const MAP_X_CYCLE = [22, 78, 30, 70, 50]

/**
 * Konulara piksel tabanlı harita konumu atar; çok level olduğunda üst üste binmez.
 * @returns {{ positions: Record<string, { x: number, topPx: number, unitHeader?: string }>, trackHeight: number }}
 */
export function assignMapPositions(topics) {
  const sorted = [...topics].sort((a, b) => a.order - b.order)
  let topPx = MAP_PADDING_TOP
  let lastUnit = null
  let nodeIndex = 0
  const positions = {}

  for (const t of sorted) {
    const unitChanged = t.unitTitle != null && t.unitTitle !== lastUnit
    if (unitChanged && lastUnit !== null) {
      topPx += MAP_UNIT_HEADER_HEIGHT
    }
    lastUnit = t.unitTitle ?? lastUnit

    positions[t.id] = {
      x: MAP_X_CYCLE[nodeIndex % MAP_X_CYCLE.length],
      topPx,
      ...(unitChanged && t.unitTitle ? { unitHeader: t.unitTitle } : {}),
    }
    topPx += MAP_NODE_SPACING
    nodeIndex += 1
  }

  return {
    positions,
    trackHeight: topPx + MAP_PADDING_BOTTOM,
  }
}

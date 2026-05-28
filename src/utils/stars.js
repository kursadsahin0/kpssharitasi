/** PLAN: %60 = 1★, %80 = 2★, %95+ = 3★ */
export function scoreToStars(percent) {
  if (percent >= 95) return 3
  if (percent >= 80) return 2
  if (percent >= 60) return 1
  return 0
}

export function starsLabel(stars) {
  if (stars === 3) return 'Mükemmel'
  if (stars === 2) return 'İyi'
  if (stars === 1) return 'Geçer'
  return 'Tekrar dene'
}

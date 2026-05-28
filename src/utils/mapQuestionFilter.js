/** Kitapta harita, diyagram veya numaralı şekil olmadan çözülemeyen soruları ayıklar. */
const MAP_QUESTION_PATTERN =
  /haritasında|harita üzerinde|numaralı yer|numaralı merkez|işaretli yer|daire içine|şekil verilen|şekilde verilen|yukarıdaki şekil|aşağıdaki harita|ok yönünde ilerler|gösterilmiş olan|taralı yerlerden/i

export function isMapDependentQuestion(question) {
  const text = question?.text ?? ''
  return MAP_QUESTION_PATTERN.test(text)
}

export function withoutMapQuestions(questions) {
  return questions.filter((q) => !isMapDependentQuestion(q))
}

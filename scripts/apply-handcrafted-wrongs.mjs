import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = dirname(fileURLToPath(import.meta.url))
const dataDir = join(root, '../src/assets/data')

const HANDCRAFTED = {
  'questions-batch1.js': {
    't6': ["Bizans", "Sasaniler", "Akhunlar"],
    't7': ["Sasani İmparatorluğu", "Çin İmparatorluğu", "Roma İmparatorluğu"],
    't8': ["İbn-i Batuta", "Rubruck", "Priskos"],
    't9': ["Aral Gölü", "Baykal Gölü", "Balkaş Gölü"],
    't10': ["Afanesyevo", "Andronova", "Karasuk"],
    't12': ["Tagar Kültürü", "Karasuk Kültürü", "Anav Kültürü"],
    't13': ["Andronova Kültürü", "Tagar Kültürü", "Afanesyevo Kültürü"],
    't14': ["Karasuk Kültürü", "Anav Kültürü", "Andronova Kültürü"],
    't15': ["Sasaniler, Bizans ve Akhunlar", "Franklar, Avarlar ve Bulgarlar", "Roma, Kartaca ve Persler"],
    't16': ["Türklerin tamamı tek bir dini benimsemiştir.", "Orta Asya'da Türk nüfusu tamamen sona ermiştir.", "Türkler asimile olarak tarih sahnesinden çekilmiştir."],
    't18': ["Manas", "Oğuz Kağan", "Balamir"],
    't19': ["I. Göktürk Devleti", "Uygur Devleti", "Kutluk Devleti"],
    't20': ["Mete Han", "Balamir", "Ki-ok"],
    't21': ["Teoman", "Ki-ok", "Balamir"],
    't22': ["Teoman", "Bögü Kağan", "Bilge Kağan"],
    't23': ["Balasagun", "Karabalgasun", "Ordubaşık"],
    't24': ["Kağan", "Yabgu", "Şad"],
    't25': ["Teoman", "Ki-ok", "Attila"],
    't26': ["Göktürk Devleti", "Uygur Devleti", "Avar Devleti"],
    't27': ["Kürk Yolu'nu ele geçirmek", "Çin tahtını ele geçirmek", "Yerleşik yaşama geçmek"],
    't28': ["Ekonomik gücü yetmediği için", "Çin iklimi sert olduğu için", "Çin ordusundan çekindiği için"],
    't29': ["Teoman", "Uldız", "Attila"],
    't30': ["Hümanizm", "Rasyonalizm", "Pozitivizm"],
    't31': ["Vassal", "Serf", "Burjuva"],
    't32': ["Senyör", "Serf", "Burjuva"],
    't33': ["Senyörler", "Vassallar", "Burjuvalar"],
    't34': ["Balamir", "Attila", "Karaton"],
    't35': ["Hohanyeh", "Teoman", "Uldız"],
    't36': ["Edirne ve İstanbul Antlaşmaları", "Bükreş ve Atina Antlaşmaları", "Londra ve Atina Antlaşmaları"],
    't37': ["Balamir", "Uldız", "Rua"],
    't38': ["Bizans İmparatorluğu", "Frank Krallığı", "Akhun Devleti"],
    't39': ["Cesur Kavimlerin Efendisi", "Afrasyab", "Manevi Baba"],
    't40': ["Bumin Kağan", "Bilge Kağan", "Teoman"],
    't42': ["Aparlar", "Eftalitler", "Hiung-nu"],
    't43': ["Bizanslılar", "Peçenekler", "Bulgarlar"],
    't44': ["Bizans İmparatorluğu", "Roma İmparatorluğu", "Sasani Devleti"],
    't45': ["Bulgarlar", "Peçenekler", "Hazar Devleti"],
    't47': ["İbn-i Batuta", "El-Biruni", "Evliya Çelebi"],
    't48': ["Boris Han", "Bayan Han", "Kutluk Kağan"],
    't49': ["Karahanlı Devleti", "Gazneli Devleti", "Tuna Bulgarları"],
    't50': ["Almış Han", "Bayan Han", "Asparuh Han"]
  },
  'questions-vatandaslik-batch1.js': {
    'v1': ["Anayasa, kanun, kararname ve yönetmelikler", "Kişi hakları, ödevler ve siyasi kurallar", "Yargı, yürütme ve yasama kuralları"],
    'v2': ["Din kuralları", "Ahlak kuralları", "Görgü kuralları"],
    'v3': ["Hukuk kuralları", "Din kuralları", "Ahlak kuralları"],
    'v4': ["Hukuk kuralları", "Din kuralları", "Görgü kuralları"],
    'v5': ["Yazılı ve yazısız ahlak kuralları", "Maddi ve manevi ahlak kuralları", "Bireysel ve toplumsal ahlak kuralları"],
    'v6': ["Subjektif ahlak kuralları", "Mutlak ahlak kuralları", "Göreceli ahlak kuralları"],
    'v9': ["Manevi yaptırım, özel ve geçici olma", "Sadece yazılı olma ve kişiye özel uygulanma", "Yazısız olma, esneklik ve değişkenlik"],
    'v22': ["Resmi Gazete'de yayınlanmaz, tavsiye niteliğindedir, Danıştay GBK", "Resmi Gazete, bağlayıcı değildir, Yerel Mahkeme kararıdır", "Resmi Gazete, sadece Danıştay'ı bağlar, Yargıtay GBK"],
    'v25': ["Yönetmelik, genelge, anayasa, kararname", "Kararname, anayasa, genelge, yönetmelik", "Anayasa, kararname, yönetmelik, genelge"],
    'v27': ["Jean Bodin", "John Locke", "Montesquieu"],
    'v44': ["Ceza, anayasa ve idare hukuku", "Medeni, ticaret ve borçlar hukuku", "Devletler genel ve ceza hukuku"],
    'v70': ["Alıcı, satıcı ve sözleşme", "Davacı, davalı ve mahkeme", "Mülk sahibi, kiracı ve kira"],
    'v81': ["Anayasa, idare, ceza ve vergi hukuku", "Borçlar, ticaret ve devletler özel hukuku", "Tazminat, cebri icra, iptal ve ceza hukuku"]
  }
}

const ANSWER_RE = /answer:\s*(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/

function setWrongOptionsInFile(content, questionId, wrongs) {
  const opts = JSON.stringify(wrongs)
  const marker = `id: '${questionId}'`
  const start = content.indexOf(marker)
  if (start === -1) return content

  const windowEnd = Math.min(content.length, start + 4000)
  const chunk = content.slice(start, windowEnd)
  const answerMatch = chunk.match(ANSWER_RE)
  if (!answerMatch) return content

  const answerStart = start + answerMatch.index
  const answerEnd = answerStart + answerMatch[0].length

  let rest = content.slice(answerEnd)
  while (/^\s*,?\s*(?:\n\s*)?wrongOptions:\s*\[[^\]]*\],?/.test(rest)) {
    rest = rest.replace(/^\s*,?\s*(?:\n\s*)?wrongOptions:\s*\[[^\]]*\],?/, '')
  }
  const insert = /^\s*,\s*\}/.test(rest)
    ? `, wrongOptions: ${opts}`
    : `,\n    wrongOptions: ${opts},`
  return content.slice(0, answerEnd) + insert + rest
}

function cleanContent(content) {
  let prev
  do {
    prev = content
    content = content.replace(
      /(\n\s*wrongOptions:\s*\[[^\]]*\],?)\s*\n\s*wrongOptions:\s*(\[[^\]]*\],?)/g,
      '\n    wrongOptions: $2',
    )
  } while (content !== prev)
  content = content.replace(/(answer:[^\n]+)\n(\s*wrongOptions:)/g, '$1,\n$2')
  content = content.replace(/,,+/g, ',')
  content = content.replace(
    /wrongOptions: (\[[^\]]+\]),\s*,\s*(\})/g,
    'wrongOptions: $1, $2',
  )
  return content
}

for (const [file, questionsMap] of Object.entries(HANDCRAFTED)) {
  const filePath = join(dataDir, file)
  let content = readFileSync(filePath, 'utf8')
  for (const [id, wrongs] of Object.entries(questionsMap)) {
    content = setWrongOptionsInFile(content, id, wrongs)
  }
  content = cleanContent(content)
  writeFileSync(filePath, content, 'utf8')
  console.log(`Updated ${file}`)
}

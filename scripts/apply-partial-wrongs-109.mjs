import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

/** 4 şık (3 yanlış) için eksik sorular — el ile üretilmiş çeldiriciler */
const FIXES = {
  'questions-batch9.js': {
    t1062: ['Almanya, Avusturya-Macaristan', 'İtalya, ABD, Japonya', 'Osmanlı, Bulgaristan, Romanya'],
    t1074: ['Galiçya, Makedonya ve Romanya cepheleri', 'Kanal, İtalya ve Balkan cepheleri', 'Suriye, Filistin ve Irak cepheleri'],
    t1076: ['Çanakkale, Irak ve Hicaz cepheleri', 'Kanal, Suriye ve Filistin cepheleri', 'Balkan, İtalya ve Kanal cepheleri'],
    t1080: ['Kars, Ardahan ve Batum', 'Doğu Trakya, İstanbul ve Boğazlar', 'Musul, Kerkük ve Süleymaniye'],
    t1192: ['Ankara, İzmir, Bursa, Adana', 'İstanbul, Edirne, Tekirdağ, Kocaeli', 'Konya, Kayseri, Malatya, Diyarbakır'],
    t1202: ['İstanbul, İzmir, Bursa, Trabzon', 'Edirne, Kocaeli, Tekirdağ, Balıkesir', 'Konya, Kayseri, Malatya, Maraş'],
    t1219: ['Ankara, Konya, İzmir, Bursa', 'İstanbul, Edirne, Tekirdağ, Adana', 'Diyarbakır, Elazığ, Mardin, Urfa'],
    t1220: ['Ankara, Sivas, Erzurum, Van', 'İstanbul, İzmir, Bursa, Trabzon', 'Konya, Kayseri, Malatya, Maraş'],
    t1231: ['Sivas, Balıkesir ve Alaşehir kongreleri', 'İstanbul, İzmir ve Bursa kongreleri', 'Amasya, Balıkesir ve Pozantı kongreleri'],
    t1235: ['İstanbul, İzmir ve Bursa kongreleri', 'Balıkesir, Alaşehir ve Erzurum kongreleri', 'Amasya, İstanbul ve İzmir kongreleri'],
    t1236: ['Sevr Antlaşmasının kabulü', 'İstanbul Hükümetinin güçlenmesi', 'Saltanatın yeniden ilanı'],
    t1264: ['İstanbul, İzmir ve Bursa kongreleri', 'Balıkesir, Alaşehir ve Amasya kongreleri', 'Sivas, İstanbul ve İzmir kongreleri'],
  },
  'questions-batch10.js': {
    t1273: ['Çerkez-Ethem ve çetesi', 'Kuvâ-yi Milliye birlikleri', 'Mustafa Kemal ve Temsil Heyeti'],
    t1297: ['Hakimiyet-i Milliye, İrade-i Milliye', 'Vakit, İkdam, Tercüman', 'Ceride-i Resmiye, Yeni Dünya'],
    t1298: ['Peyam-ı Sabah, İstanbul, Alemdar', 'Hakimiyet-i Milliye, İrade-i Milliye', 'Ceride-i Resmiye, Yeni Dünya'],
    t1301: ['Çanakkale, Biga ve Gelibolu', 'Kastamonu, Sinop ve Çorum', 'Maraş, Antep ve Urfa'],
    t1312: ['Mondros, Brest-Litovsk', 'Lozan, Gümrü', 'Kars, Ankara'],
    t1411: ['Rusya, İngiltere, Fransa', 'Almanya, Avusturya, İtalya', 'Osmanlı, Bulgaristan, Yunanistan'],
    t1430: ['Batı Anadolu, Güneydoğu Anadolu', 'Doğu Anadolu, Güneydoğu Anadolu', 'İzmir, Antalya ve Adana'],
    t1433: ['Kazım Karabekir, Fevzi Çakmak', 'Rauf Orbay, Ali Fuat Cebesoy', 'Mustafa Kemal, Fahrettin Altay'],
    t1508: ['Türk Tarih Kurumu (1931)', 'Türk Ocakları (1912)', 'Halkevleri (1932)'],
    t1512: ['İstanbul Üniversitesi Hukuk Fakültesi', 'Darülfünun Edebiyat Fakültesi', 'Gazi Eğitim Enstitüsü'],
    t1526: ['Cumhurbaşkanı, bakanlar ve milletvekilleri', 'Hâkimler, savcılar ve askerler', 'Öğretmenler, doktorlar ve mühendisler'],
  },
  'questions-batch11.js': {
    t1549: ['1934 milletvekili, 1930 belediye, 1933 muhtarlık', '1933 muhtarlık, 1934 milletvekili, 1930 belediye', '1930 milletvekili, 1933 belediye, 1934 muhtarlık'],
    t1575: ['Ankara, İzmir, Bursa, Konya, Samsun', 'İstanbul, Edirne, Tekirdağ, Kocaeli, Balıkesir', 'Erzurum, Van, Trabzon, Sivas, Malatya'],
    t1614: ['Yurtta sulh, cihanda sulh', 'Egemenlik kayıtsız şartsız milletindir', 'Milletin bağımsızlığını koruyacak güç'],
    t1647: ['Türkiye, Yunanistan, Yugoslavya', 'Türkiye, Bulgaristan, Romanya', 'İran, Irak, Suriye, Lübnan'],
    t1673: ['Ekmek, adalet ve özgürlük', 'Barış, özgürlük ve eşitlik', 'Toprak, barış ve adalet'],
    t1711: ['ABD, Fransa, İngiltere', 'SSCB, Almanya, Japonya', 'İtalya, Türkiye, Yunanistan'],
    t1718: ['Yalta (1945), Potsdam (1945)', 'Tehran (1943), Casablanca (1943)', 'San Francisco (1945), Bretton Woods (1944)'],
  },
  'questions-batch12.js': {
    t1729: ['Stalin, Roosevelt, Churchill', 'Truman, Attlee, Stalin', 'Roosevelt, Truman, Churchill'],
    t1763: ['Türkiye, Romanya, Bulgaristan', 'Türkiye, Yunanistan, Romanya', 'Yugoslavya, Bulgaristan, Arnavutluk'],
    t1870: ['Türkiye, Pakistan, Hindistan', 'ABD, İngiltere, Fransa', 'Japonya, Güney Kore, Tayvan'],
  },
  'questions-batch5.js': {
    t464: ['İltizam', 'Mukataa', 'Tımar'],
    t511: ['Bizans, Sasani ve Franklar', 'Roma, Kartaca ve Persler', 'Moğol, Kıpçak ve Peçenek'],
  },
  'questions-cografya-batch4.js': {
    c441: ['Yavuz Sultan Selim Köprüsü', 'Fatih Sultan Mehmet Köprüsü', '15 Temmuz Şehitler Köprüsü'],
    c442: ['Osman Gazi Köprüsü', 'Fatih Sultan Mehmet Köprüsü', 'Nissibi Köprüsü'],
  },
  'questions-vatandaslik-batch2.js': {
    v113: ['Geçici akıl hastalığı, uykusuzluk ve öfke', 'Küçük yaş, kısıtlılık ve vesayet', 'Bilinçsizlik, sarhoşluk ve uyuşturucu'],
    v119: ['Yaş küçüklüğü, sarhoşluk ve uykusuzluk', 'Akıl zayıflığı, vesayet ve küçük yaş', 'Geçici akıl hastalığı, öfke ve bilinçsizlik'],
    v129: ['Nişan, evlilik ve boşanma', 'Miras, velayet ve vesayet', 'Evlilik, nişan ve kayın hısımlığı'],
    v140: ['25 yaş, 3 yıl evlilik ve 16 yaş farkı', '28 yaş, 10 yıl evlilik ve 20 yaş farkı', '30 yaş, evlilik şartı olmadan ve 18 yaş farkı'],
    v147: ['Kayın hısımları, mirasçı olmayan eş', 'Vasiyet lehtarları, mirasçı olmayanlar', 'Altsoy, üstsoy ve yansıma hısımları'],
    v163: ['Rehin, ipotek ve intifa', 'Zilyetlik, tapu ve rehin', 'Nafaka, oturma ve intifa'],
    v183: ['Hükümet, yönetim ve idare', 'Millet, hükümet ve yönetim', 'Ülke, hükümet ve millet'],
    v184: ['Teokrasi, monarşi ve cumhuriyet', 'Oligarşi, demokrasi ve monarşi', 'Cumhuriyet, teokrasi ve oligarsi'],
  },
  'questions-vatandaslik-batch3.js': {
    v224: ['Hukuk devleti', 'Sosyal devlet', 'Laik devlet'],
    v225: ['Sosyal devlet', 'Hukuk devleti', 'Polis devleti'],
    v233: ['Yalnız I', 'Yalnız II', 'Yalnız III'],
    v242: ['Egemenlik kayıtsız şartsız milletindir', 'Devletin şekli cumhuriyettir', 'Türkiye Devleti bir cumhuriyettir'],
    v251: ['Yalnız I', 'Yalnız II', 'Yalnız III'],
    v256: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v267: ['HSK, OHAL ve YSK', 'MGK, TSK ve YÖK', 'AYM, Danıştay ve Yargıtay'],
    v275: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v279: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v281: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v283: ['Açık oy, genel oy ve eşit oy', 'Gizli oy, açık oy ve serbest oy', 'Eşit oy, açık oy ve genel oy'],
    v295: ['Yalnız I ve II', 'Yalnız III ve IV', 'Yalnız I, II ve III'],
    v302: ['Kuvvetler ayrılığı', 'Egemenlik kayıtsız şartsız milletindir', 'Sosyal devlet ilkesi'],
    v313: ['Seçme, seçilme ve siyasi parti kurma', 'Dilekçe, bilgi edinme ve toplantı', 'Dernek kurma, sendika ve grev'],
    v325: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
  },
  'questions-vatandaslik-batch4.js': {
    v347: ['Rüşvet, irtikap ve zimmet', 'Hırsızlık, dolandırıcılık ve yağma', 'İrtikap, rüşvet ve hırsızlık'],
    v348: ['Ortaokul, 25 yaş ve askerlik', 'Lise, 21 yaş ve askerlik', 'İlkokul, 30 yaş ve askerlik'],
    v350: ['Bakanlar, valiler ve kaymakamlar', 'Üniversite rektörleri, dekanlar', 'Belediye başkanları, muhtarlar'],
    v352: ['Yağma, gasp ve tehdit', 'Hırsızlık, dolandırıcılık ve zimmet', 'Rüşvet, irtikap ve hırsızlık'],
    v363: ['Yalnız I', 'Yalnız III', 'Yalnız I ve II'],
    v378: ['Seçim sonuçlarını ilan etme', 'Seçim propaganda süresini belirleme', 'Milletvekili adaylarını onaylama'],
    v391: ['Milletvekilliğinin düşmesi, yargılanma', 'İstifa, dokunulmazlık kaldırma', 'Görevden uzaklaştırma, istifa'],
    v397: ['Evet, sona erdirir', 'Kısmen sona erdirir', 'Sadece yargılanmayı sağlar'],
    v405: ['Yalnız I ve II', 'Yalnız III ve IV', 'Yalnız I, II ve III'],
    v437: ['Siyasi, askeri ve sınır', 'Askeri, siyasi ve ekonomik', 'Sınır, askeri ve siyasi'],
    v454: ['Görevden alınma, istifa ve ölüm', 'Hastalık, görevden alınma ve istifa', 'Ölüm, görevden alınma ve hastalık'],
    v462: ['Bütçe kabulü, milletvekili seçimi', 'Anayasa değişikliği, bütçe kabulü', 'Kabine kurma, bakan atama'],
  },
  'questions-vatandaslik-batch5.js': {
    v506: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v507: ['Kanun çıkarma, bütçe onayı', 'Yasama yetkisi, yürütme yetkisi', 'Seçim yenileme, savaş ilanı'],
    v508: ['Vali, kaymakam ve müfettiş', 'Hâkim, savcı ve Yargıtay üyesi', 'Rektör, dekan ve profesör'],
    v548: ['TBMM, bakanlar ve valiler', 'Hâkimler, savcılar ve noterler', 'Belediye meclisi, il genel meclisi'],
    v565: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v567: ['Seçim erteleme, bütçe onayı', 'Kanun çıkarma, anayasa değişikliği', 'Bakan atama, kabine kurma'],
    v572: ['Kara Kuvvetleri Komutanı', 'Deniz Kuvvetleri Komutanı', 'Hava Kuvvetleri Komutanı'],
    v601: ['İstinaf, temyiz ve itiraz', 'Temyiz, itiraz ve istinaf', 'İtiraz, temyiz ve istinaf'],
    v603: ['Dava, icra ve iflas', 'Ceza, hukuk ve idare', 'Yargı, yürütme ve yasama'],
  },
  'questions-vatandaslik-batch6.js': {
    v629: ['Anayasa iptali, bireysel başvuru', 'Seçim iptali, siyasi parti kapatma', 'Yasama denetimi, yürütme denetimi'],
    v635: ['Anayasa denetimi, seçim denetimi', 'Yasama denetimi, yürütme denetimi', 'Bireysel başvuru, seçim iptali'],
    v637: ['Kara Kuvvetleri Komutanı', 'Deniz Kuvvetleri Komutanı', 'Hava Kuvvetleri Komutanı'],
    v643: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v655: ['Milletvekili seçimi, bütçe kabulü', 'Anayasa değişikliği, kabine kurma', 'Bakan atama, seçim yenileme'],
    v657: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v694: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v710: ['Kamu yararı, acele kamulaştırma', 'Özel mülkiyet, kamu hizmeti', 'Ecrimisil, işgal tazminatı'],
    v723: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v732: ['TBMM, bakanlar ve valiler', 'Hâkimler, savcılar ve Yargıtay', 'Belediye başkanı, meclis ve encümen'],
    v737: ['Vali, kaymakam ve müfettiş', 'Muhtar, ihtiyar heyeti ve köy derneği', 'Cumhurbaşkanı, bakan ve milletvekili'],
    v761: ['İl özel idaresi, köy ve belde', 'Köy, belde ve il özel idaresi', 'Belde belediyesi, köy ve il'],
    v767: ["100'den fazla, 1500'den az", "200'den fazla, 3000'den az", "50'den fazla, 1000'den az"],
    v772: ['Muhtar, köy derneği ve ihtiyar heyeti', 'İhtiyar heyeti, muhtar ve köy derneği', 'Köy derneği, ihtiyar heyeti ve muhtar'],
    v773: ['Yalnız I', 'Yalnız II', 'Yalnız IV'],
    v778: ['Yetki, şekil, konu ve sebep', 'Amaç, konu, yetki ve şekil', 'Sebep, amaç, şekil ve yetki'],
    v794: ['Eşitlik, liyakat ve kariyer', 'Serbestlik, kariyer ve sınıflandırma', 'Liyakat, eşitlik ve sınıflandırma'],
    v797: ['Kariyer, liyakat ve sınıflandırma', 'Sınıflandırma, kariyer ve eşitlik', 'Liyakat, sınıflandırma ve kariyer'],
    v812: ['Vali, kaymakam ve nüfus müdürü', 'Kaymakam, vali ve belediye başkanı', 'Muhtar, vali ve kaymakam'],
    v822: ['6 aydan az, 1 yıldan çok olamaz', '2 yıldan az, 3 yıldan çok olamaz', '3 aydan az, 6 aydan çok olamaz'],
    v823: ['Atamaya yetkili amir teklifi, disiplin amiri onayı', 'Disiplin amiri teklifi, atamaya yetkili amir onayı', 'Vali teklifi, kaymakam onayı'],
    v827: ['Disiplin, ödül ve ceza', 'Atanma, terfi ve emeklilik', 'Sınav, atanma ve terfi'],
    v828: ['Tebliğden 10 gün, yol süresi hariç', 'Tebliğden 30 gün, yol süresi dahil', 'Tebliğden 7 gün, yol süresi dahil'],
    v834: ['Resmi kurumda 5 yıl, uluslararası kuruluşta 15 yıl', 'Resmi kurumda 15 yıl, uluslararası kuruluşta 10 yıl', 'Resmi kurumda 21 yıl, uluslararası kuruluşta 10 yıl'],
    v854: ['1,5 saat ve 3 saat', '2 saat ve 1 saat', '3 saat ve 2 saat'],
    v866: ['En az 2, en çok 5 yıl', 'En az 6 ay, en çok 2 yıl', 'En az 3, en çok 6 yıl'],
  },
  'questions-vatandaslik-batch7.js': {
    v891: ['15 gün itiraz, 60 gün karar', '30 gün itiraz, 7 gün karar', '7 gün itiraz, 15 gün karar'],
    v893: ['Vali, kaymakam ve müfettiş', 'Atamaya yetkili amir, müfettiş, vali', 'Müfettiş, vali ve kaymakam'],
  },
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

const root = dirname(fileURLToPath(import.meta.url))
const dataDir = join(root, '../src/assets/data')

for (const [file, questionsMap] of Object.entries(FIXES)) {
  const filePath = join(dataDir, file)
  let content = readFileSync(filePath, 'utf8')
  for (const [id, wrongs] of Object.entries(questionsMap)) {
    content = setWrongOptionsInFile(content, id, wrongs)
  }
  content = cleanContent(content)
  writeFileSync(filePath, content, 'utf8')
  console.log(`Updated ${file} (${Object.keys(questionsMap).length} soru)`)
}

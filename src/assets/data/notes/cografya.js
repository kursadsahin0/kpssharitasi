// Coğrafya konuları topics.js'te tek ünite ("Türkiye Coğrafyası") altında; rehberdeki ünite
// bağlantısı ilk anlatıma gider, diğerleri sırayla birbirine bağlanır.
export const cografyaNotes = [
  {
    slug: 'turkiyenin-cografi-konumu',
    subjectId: 'cografya',
    units: ['Türkiye Coğrafyası'],
    title: 'Türkiye’nin Coğrafi Konumu Konu Anlatımı',
    description:
      'Türkiye’nin matematik ve özel konumu, enlem ve boylamın sonuçları, yerel saat farkları.',
    intro:
      'Coğrafi konum, bir yerin Dünya üzerindeki yerini ifade eder ve iki şekilde incelenir: matematik (mutlak) konum ve özel (göreceli) konum. KPSS’de bu konunun sonuçlarını yorumlamak, ezberden daha önemlidir.',
    sections: [
      {
        heading: 'Matematik konum',
        paragraphs: [
          'Türkiye, yaklaşık 36°–42° kuzey enlemleri ile 26°–45° doğu boylamları arasında yer alır. Kuzey Yarım Küre’de ve orta kuşakta bulunması; dört mevsimin belirgin yaşanmasına, güneş ışınlarının yıl boyunca dik açıyla gelmemesine ve güneyden kuzeye gidildikçe sıcaklığın genel olarak azalmasına neden olur. Gölgelerin öğle vakti her zaman kuzeye düşmesi de bu konumun sonucudur.',
          'Türkiye’nin doğusu ile batısı arasında yaklaşık 19 boylam farkı bulunur. Her boylam arasında 4 dakikalık zaman farkı olduğundan, en doğu ile en batı arasındaki yerel saat farkı yaklaşık 76 dakikadır. Güneş, Türkiye’de önce doğuda doğar ve önce doğuda batar. Ülke genelinde ortak saat kullanılması, bu yerel saat farklarının günlük hayatı etkilememesi için tercih edilmiştir.',
        ],
      },
      {
        heading: 'Özel konum',
        paragraphs: [
          'Özel konum; bir yerin denizlere, kıtalara, yer şekillerine ve önemli ulaşım yollarına göre durumunu ifade eder. Türkiye, Asya ve Avrupa kıtalarını birbirine bağlar ve Afrika’ya yakındır. Üç tarafının denizlerle çevrili olması, kıyı uzunluğunun fazla olmasını ve denizel etkinin kıyılarda belirgin hissedilmesini sağlar.',
          'Türkiye’nin ortalama yükseltisinin fazla olması ve yükseltinin batıdan doğuya doğru artması, aynı enlemdeki yerler arasında bile büyük sıcaklık farklarına yol açar. Boğazların varlığı, Karadeniz ile Akdeniz arasındaki tek deniz geçidini Türkiye’nin denetiminde tutar. Zengin enerji kaynaklarına sahip bölgelere yakınlık ve enerji nakil hatlarının geçiş noktasında bulunmak, Türkiye’nin jeopolitik önemini artırır.',
        ],
      },
    ],
    keyPoints: [
      'Matematik konum: enlem ve boylamla belirlenir; özel konum: çevresiyle ilişkiyle.',
      'Bir boylam farkı = 4 dakika; Türkiye’de doğu-batı arası yaklaşık 76 dakika.',
      'Öğle vakti gölgeler her zaman kuzeye düşer.',
      'Aynı enlemde farklı sıcaklıklar: özel konumun (yükselti, denizellik) sonucudur.',
    ],
  },
  {
    slug: 'turkiyenin-yer-sekilleri',
    subjectId: 'cografya',
    units: [],
    title: 'Türkiye’nin Yer Şekilleri Konu Anlatımı',
    description:
      'Türkiye’de dağların oluşumu, platolar, ovalar, karstik şekiller ve kıyı tipleri.',
    intro:
      'Türkiye, Alp-Himalaya kıvrım kuşağı üzerinde yer alan, genç ve engebeli bir ülkedir. Yer şekilleri; iç ve dış kuvvetlerin birlikte etkisiyle oluşmuştur ve iklimden tarıma kadar pek çok konuyla bağlantılıdır.',
    sections: [
      {
        heading: 'Dağlar',
        paragraphs: [
          'Kıvrım dağları, tortul tabakaların yan basınçla kıvrılmasıyla oluşur. Kuzey Anadolu Dağları ve Toros Dağları bu türün en önemli örnekleridir ve genel olarak doğu-batı doğrultusunda uzanır. Bu uzanış, kıyı ile iç kesimler arasındaki ulaşımı zorlaştırır ve denizel etkinin iç kesimlere ulaşmasını engeller.',
          'Kırıklı (faylı) dağlar, sert tabakaların kırılmasıyla oluşur; Ege Bölgesi’ndeki horst ve graben yapısı bunun tipik örneğidir. Dağların denize dik uzanması, Ege’de denizel etkinin iç kesimlere sokulmasını kolaylaştırır. Volkanik dağlar ise magmanın yeryüzüne çıkmasıyla oluşmuştur; Ağrı, Erciyes, Hasan ve Nemrut bu türün örnekleridir.',
        ],
      },
      {
        heading: 'Plato ve ovalar',
        paragraphs: [
          'Platolar, akarsularla derince yarılmış, yüksek ve geniş düzlüklerdir. Erzurum-Kars, Ardahan, Haymana, Cihanbeyli, Obruk ve Taşeli platoları sık sorulan örneklerdir. Platolar genellikle büyükbaş ve küçükbaş hayvancılık ile tahıl tarımı için kullanılır.',
          'Ovalar oluşumlarına göre sınıflandırılır: delta ovaları (Bafra, Çarşamba, Çukurova, Silifke), tektonik ovalar (Gediz, Büyük ve Küçük Menderes grabenleri) ve karstik ovalar (polye) gibi. Ovalar tarım, yerleşme ve ulaşım açısından en elverişli alanlardır.',
        ],
      },
      {
        heading: 'Dış kuvvetlerin oluşturduğu şekiller ve kıyılar',
        paragraphs: [
          'Karstik şekiller, kalker gibi kolay eriyen kayaçların bulunduğu yerlerde oluşur. Lapya, dolin, uvala, polye, mağara, sarkıt, dikit ve traverten başlıca karstik şekillerdir. Pamukkale travertenleri ve Teke-Taşeli yöresindeki karstik alanlar bilinen örneklerdir. Rüzgâr aşındırmasıyla oluşan peribacaları ise Nevşehir çevresinde görülür.',
          'Kıyı tipleri, dağların kıyıya uzanış doğrultusuna göre şekillenir. Ege’de enine kıyı (girintili-çıkıntılı) tipi görülürken, Karadeniz ve Akdeniz’de boyuna kıyı tipi hâkimdir. Akarsu vadilerinin deniz suları altında kalmasıyla oluşan ria kıyılara en bilinen örnek, İstanbul’daki Haliç’tir.',
        ],
      },
    ],
    keyPoints: [
      'Kıvrım dağları kıyıya paralel → denizel etki iç kesimlere ulaşamaz.',
      'Ege’de horst-graben → dağlar kıyıya dik → enine kıyı.',
      'Delta ovaları: Bafra, Çarşamba, Çukurova, Silifke.',
      'Karstik şekiller kalkerli arazide; travertene örnek Pamukkale.',
    ],
  },
  {
    slug: 'iklim-su-bitki-ve-toprak',
    subjectId: 'cografya',
    units: [],
    title: 'Türkiye’nin İklimi, Suları, Bitki Örtüsü ve Toprakları',
    description:
      'Türkiye’deki iklim tipleri, akarsu rejimleri, göl çeşitleri, bitki örtüsü ve toprak tipleri.',
    intro:
      'Türkiye, matematik ve özel konumunun etkisiyle farklı iklim tiplerinin görüldüğü bir ülkedir. İklim; akarsuların rejimini, bitki örtüsünü ve toprak oluşumunu doğrudan etkilediği için bu konular birlikte çalışılmalıdır.',
    sections: [
      {
        heading: 'İklim tipleri',
        paragraphs: [
          'Akdeniz iklimi; yazları sıcak ve kurak, kışları ılık ve yağışlı bir iklimdir. Doğal bitki örtüsü makidir. Karadeniz iklimi her mevsim yağışlıdır, en fazla yağış sonbaharda düşer; doğal bitki örtüsü ormandır. Karasal iklimde ise yazlar sıcak ve kurak, kışlar soğuk ve kar yağışlıdır; yıllık sıcaklık farkı fazladır ve doğal bitki örtüsü bozkırdır.',
          'Türkiye’de yağış genellikle cephe ve yamaç (orografik) yağışı şeklinde görülür. Kıyıdan iç kesimlere gidildikçe yağış miktarı azalır. Türkiye’nin en az yağış alan yerleri arasında Tuz Gölü çevresi bulunur. Rüzgârlar açısından poyraz, lodos, karayel ve keşişleme gibi yerel rüzgâr adları da sorulabilir.',
        ],
      },
      {
        heading: 'Akarsular ve göller',
        paragraphs: [
          'Türkiye akarsuları genellikle düzensiz rejimlidir, yatak eğimleri fazladır ve bu nedenle ulaşıma elverişli değildir; ancak hidroelektrik potansiyelleri yüksektir. Kızılırmak, Türkiye sınırları içinde doğup denize dökülen en uzun akarsudur. Fırat ve Dicle, sınır ötesine akan ve enerji üretimi açısından en önemli akarsulardır.',
          'Göller oluşumlarına göre tektonik (Burdur, Acıgöl, Tuz Gölü), volkanik (Nemrut krater gölü, Meke), karstik (Salda, Avlan), set gölleri (Tortum, Sera) ve heyelan set gölleri gibi gruplara ayrılır. Van Gölü, volkanik set gölü olarak sınıflandırılır ve Türkiye’nin en büyük gölüdür.',
        ],
      },
      {
        heading: 'Bitki örtüsü ve topraklar',
        paragraphs: [
          'Ormanlar en çok Karadeniz kıyılarında yayılış gösterir. Maki, Akdeniz ikliminin tahrip edilen ormanlarının yerini alan, kuraklığa dayanıklı çalı topluluğudur. Bozkırlar, ilkbahar yağışlarıyla yeşeren ve yazın kuruyan ot topluluklarıdır; İç Anadolu ve Doğu Anadolu’da yaygındır.',
          'Toprak tipleri iklim ve bitki örtüsüne bağlı olarak değişir. Terra rossa (kırmızı Akdeniz toprağı), kalkerli arazide Akdeniz ikliminde oluşur. Podzol topraklar nemli ve serin ormanlık alanlarda, kahverengi bozkır toprakları ise karasal iklimde görülür. Alüvyal topraklar akarsuların taşıdığı malzemeyle oluşur ve tarım açısından en verimli topraklardır.',
        ],
      },
    ],
    keyPoints: [
      'Akdeniz: maki; Karadeniz: orman; karasal: bozkır.',
      'Karadeniz ikliminde en çok yağış sonbaharda.',
      'Türkiye akarsuları: düzensiz rejim, yüksek hidroelektrik potansiyeli.',
      'Terra rossa: Akdeniz, kalker; alüvyal: en verimli toprak.',
    ],
  },
  {
    slug: 'nufus-ve-yerlesme',
    subjectId: 'cografya',
    units: [],
    title: 'Türkiye’de Nüfus ve Yerleşme Konu Anlatımı',
    description:
      'Nüfusun dağılışını etkileyen faktörler, nüfus sayımları, göç türleri ve kır yerleşmeleri.',
    intro:
      'Nüfus ve yerleşme konusu, beşeri coğrafyanın temelini oluşturur. Sorular genellikle nüfusun neden belirli yerlerde yoğunlaştığını, göçün nedenlerini ve sonuçlarını yorumlamaya dayanır.',
    sections: [
      {
        heading: 'Nüfusun dağılışı',
        paragraphs: [
          'Türkiye’de nüfus kıyılarda ve ovalarda yoğun, yüksek ve engebeli iç kesimlerde seyrektir. Nüfusun dağılışını iklim, yer şekilleri, su kaynakları ve toprak verimliliği gibi doğal faktörler ile sanayi, ticaret, turizm, ulaşım ve tarım olanakları gibi beşeri faktörler belirler. Marmara Bölgesi, sanayi ve ticaret olanakları nedeniyle en kalabalık bölgedir.',
          'Aritmetik nüfus yoğunluğu, toplam nüfusun yüzölçümüne bölünmesiyle bulunur. Tarımsal nüfus yoğunluğu ise tarımla geçinen nüfusun tarım alanına bölünmesiyle hesaplanır ve tarımda makineleşmenin ve verimliliğin göstergesidir.',
        ],
      },
      {
        heading: 'Nüfus özellikleri ve göç',
        paragraphs: [
          'Cumhuriyetin ilk yıllarında savaşların etkisiyle nüfus artışı teşvik edilmiştir. İlk nüfus sayımı 1927’de yapılmıştır. Günümüzde nüfus sayımları adrese dayalı kayıt sistemiyle yapılmaktadır. Doğum oranlarının düşmesi ve ortalama yaşam süresinin uzaması, nüfusun yaşlanma eğilimine girmesine neden olmaktadır.',
          'Göçler iç göç ve dış göç olarak ayrılır. Türkiye’de 1950’lerden sonra tarımda makineleşme, kentlerde iş olanaklarının artması ve eğitim-sağlık hizmetlerine erişim isteği, kırdan kente göçü hızlandırmıştır. Bu durum kentlerde altyapı sorunlarına ve düzensiz yapılaşmaya yol açmıştır. 1960’lardan itibaren Almanya başta olmak üzere Avrupa’ya işçi göçü yaşanmıştır.',
        ],
      },
      {
        heading: 'Yerleşme',
        paragraphs: [
          'Kır yerleşmeleri köy ve köy altı yerleşmeler olarak ikiye ayrılır. Köy altı yerleşmeler arasında yayla (yaz aylarında hayvancılık için), mezra (tarım alanlarına yakın geçici yerleşme), oba (göçebe çadır yerleşmesi), çiftlik ve dalyan sayılabilir. Toplu ve dağınık yerleşme dokusu; su kaynakları, arazi yapısı ve tarım alanlarının dağılışıyla ilişkilidir. Karadeniz kıyılarında dağınık, İç Anadolu’da toplu yerleşme yaygındır.',
        ],
      },
    ],
    keyPoints: [
      'En kalabalık bölge: Marmara; nüfus kıyı ve ovalarda yoğun.',
      'Tarımsal nüfus yoğunluğu: tarımsal verimliliğin göstergesi.',
      'İlk nüfus sayımı: 1927.',
      'Karadeniz’de dağınık, İç Anadolu’da toplu yerleşme.',
    ],
  },
  {
    slug: 'tarim-hayvancilik-ve-kalkinma-projeleri',
    subjectId: 'cografya',
    units: [],
    title: 'Tarım, Hayvancılık ve Kalkınma Projeleri',
    description:
      'Türkiye’de tarım ürünlerinin yetişme koşulları, hayvancılık türleri ve GAP, DAP, DOKAP gibi bölgesel projeler.',
    intro:
      'Türkiye, farklı iklim ve toprak özellikleri sayesinde çok çeşitli tarım ürünlerinin yetiştirildiği bir ülkedir. KPSS’de bir ürünün yetişme koşullarını bilmek, o ürünün hangi bölgede yoğunlaştığını mantıkla bulmanızı sağlar.',
    sections: [
      {
        heading: 'Tarım ürünleri',
        paragraphs: [
          'Buğday, kuraklığa dayanıklı bir tahıldır ve en çok İç Anadolu’da yetiştirilir. Pamuk, sıcak ve sulanabilir ovalarda yetişir; Güneydoğu Anadolu (özellikle Harran Ovası), Çukurova ve Ege ovaları başlıca üretim alanlarıdır. Çay, bol yağış ve asitli toprak ister; yalnızca Doğu Karadeniz kıyılarında yetiştirilir. Fındık Karadeniz kıyılarında, zeytin ve incir ise Ege ve Akdeniz’de öne çıkar.',
          'Turunçgiller don olayına karşı hassas olduğundan Akdeniz kıyılarında yetiştirilir. Şeker pancarı, sulamalı alanlarda ve İç Anadolu’da yaygındır; şeker fabrikaları hammaddeye yakın kurulur. Tütün, haşhaş ve çay gibi ürünlerin üretimi devlet denetimine tabidir.',
        ],
      },
      {
        heading: 'Hayvancılık',
        paragraphs: [
          'Büyükbaş hayvancılık, gür otların yetiştiği nemli alanlarda ve yaylalarda gelişmiştir; Doğu Anadolu’nun Erzurum-Kars yöresi mera hayvancılığıyla bilinir. Küçükbaş hayvancılıkta koyun bozkır alanlarında, kıl keçisi ise Akdeniz’in makilik alanlarında yaygındır. Ankara keçisi (tiftik keçisi) İç Anadolu’ya özgüdür. Kümes hayvancılığı ve arıcılık da gelir getiren önemli faaliyetlerdir; ipek böcekçiliği Bursa çevresinde öne çıkar.',
        ],
      },
      {
        heading: 'Bölgesel kalkınma projeleri',
        paragraphs: [
          'GAP (Güneydoğu Anadolu Projesi), Fırat ve Dicle üzerindeki barajlarla enerji üretimini ve sulamalı tarımı amaçlayan çok sektörlü bir kalkınma projesidir. Atatürk Barajı ve Şanlıurfa Tünelleri ile Harran Ovası sulanmış, pamuk üretimi önemli ölçüde artmıştır.',
          'DAP (Doğu Anadolu Projesi) hayvancılığın geliştirilmesine, DOKAP (Doğu Karadeniz Projesi) tarımda verimlilik, turizm ve ulaşım altyapısına, KOP (Konya Ovası Projesi) ise su kaynaklarının etkin kullanımı ve sulamaya odaklanır. Bu projelerin ortak amacı bölgeler arası gelişmişlik farkını azaltmaktır.',
        ],
      },
    ],
    keyPoints: [
      'Çay: yalnız Doğu Karadeniz; turunçgiller: Akdeniz (dona hassas).',
      'Pamuk: sıcak ve sulanan ovalar; Harran Ovası GAP ile öne çıktı.',
      'Tiftik keçisi: İç Anadolu; kıl keçisi: Akdeniz makilikleri.',
      'GAP: enerji + sulama; DAP: hayvancılık; DOKAP: Doğu Karadeniz.',
    ],
  },
  {
    slug: 'madenler-enerji-sanayi-ve-ticaret',
    subjectId: 'cografya',
    units: [],
    title: 'Madenler, Enerji, Sanayi, Ulaşım, Ticaret ve Turizm',
    description:
      'Türkiye’deki madenler ve enerji kaynakları, sanayi tesislerinin kuruluş yerleri, ulaşım, dış ticaret ve turizm.',
    intro:
      'Ekonomik coğrafyanın bu bölümünde Türkiye’nin yer altı kaynakları, enerji üretimi, sanayi tesislerinin dağılışı ve hizmet sektörü ele alınır. Bir tesisin neden belirli bir yerde kurulduğunu yorumlamak sık sorulan bir beceridir.',
    sections: [
      {
        heading: 'Madenler ve enerji kaynakları',
        paragraphs: [
          'Bor mineralleri Türkiye’nin en önemli maden zenginliklerinden biridir; dünya rezervlerinin büyük bölümü Türkiye’dedir ve Eskişehir, Kütahya, Balıkesir ve Bursa çevresinde çıkarılır. Krom Elazığ (Guleman) ve Muğla çevresinde, bakır Artvin ve Kastamonu çevresinde, demir ise Sivas (Divriği) ve Malatya (Hekimhan) çevresinde bulunur.',
          'Taş kömürü yalnızca Zonguldak çevresinde çıkarılır. Linyit ülkenin pek çok yerinde bulunur ve termik santrallerde kullanılır; Afşin-Elbistan bu alanda öne çıkar. Petrol üretimi sınırlıdır ve çoğunlukla Batman ve Adıyaman çevresindedir. Yenilenebilir kaynaklar arasında hidroelektrik, rüzgâr (özellikle Ege ve Marmara), güneş ve jeotermal enerji (Denizli, Aydın) giderek önem kazanmaktadır.',
        ],
      },
      {
        heading: 'Sanayi',
        paragraphs: [
          'Sanayi tesislerinin kuruluş yerini hammadde, enerji, iş gücü, sermaye, ulaşım ve pazar gibi faktörler belirler. Şeker, çay ve mısır işleme fabrikaları gibi hammaddesi çabuk bozulan veya ağırlığı fazla olan ürünleri işleyen tesisler hammaddeye yakın kurulur. Karabük, Ereğli ve İskenderun demir-çelik fabrikaları, kömür ve demir cevherine ulaşım kolaylığı dikkate alınarak kurulmuştur.',
          'Sanayi en çok Marmara Bölgesi’nde gelişmiştir; İstanbul, Kocaeli, Bursa ve Tekirdağ önde gelen sanayi merkezleridir. Organize sanayi bölgeleri, altyapı maliyetlerini azaltmak ve sanayiyi planlı biçimde yaymak amacıyla kurulmuştur.',
        ],
      },
      {
        heading: 'Ulaşım, ticaret ve turizm',
        paragraphs: [
          'Türkiye’de yük ve yolcu taşımacılığında kara yolu en büyük paya sahiptir. Demir yolu, deniz yolu ve boru hatları ise maliyet açısından avantajlıdır. Bakü-Tiflis-Ceyhan boru hattı, Türkiye’nin enerji koridoru olma rolünü güçlendirmiştir.',
          'Dış ticarette en çok sanayi ürünleri ihraç edilmektedir; motorlu taşıtlar, tekstil ve makine öne çıkan ürünlerdir. İthalatta enerji kaynakları önemli bir paya sahiptir. Turizmde deniz-kum-güneş turizmi Akdeniz ve Ege kıyılarında yoğunlaşırken; kültür, inanç, kış, yayla ve termal turizm de çeşitlenen alanlardır. Kapadokya, Pamukkale, Efes ve Göreme gibi yerler UNESCO Dünya Mirası Listesi’ndedir.',
        ],
      },
    ],
    keyPoints: [
      'Bor: dünya rezervlerinin büyük bölümü Türkiye’de.',
      'Taş kömürü yalnız Zonguldak; linyit termik santrallerde.',
      'Hammaddesi çabuk bozulan ürünlerin fabrikaları hammaddeye yakın kurulur.',
      'Taşımacılıkta en büyük pay kara yolunda.',
    ],
  },
]

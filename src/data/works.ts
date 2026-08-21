export interface Work {
  id: string;
  slug: string;
  name: string;
  title: string;
  keyword: string;
  descriptionKo: string;
  descriptionEn: string;
  contact?: string;
  link?: string;
  thumbnail: string;
  detailImages: string[];
}

interface WorkInput {
  name: string;
  title: string;
  // short "what are there 100 of" tag shown behind the card on hover —
  // draft copy, meant to be edited
  keyword: string;
  descriptionKo: string;
  descriptionEn: string;
  contact?: string;
  link?: string;
  // unified identifier — also the folder name under assets/img/detailimg/detail/<slug>/
  slug: string;
}

// src/assets/img/detailimg/thumbnail/<slug>.webp
const thumbnailModules = import.meta.glob<string>('../assets/img/detailimg/thumbnail/*', {
  eager: true,
  import: 'default',
});

// src/assets/img/detailimg/detail/<slug>/*  — drop extra case-study images
// straight into a work's folder and they'll show up automatically
const detailModules = import.meta.glob<string>('../assets/img/detailimg/detail/*/*', {
  eager: true,
  import: 'default',
});

function resolveThumbnail(slug: string): string {
  const match = Object.entries(thumbnailModules).find(([path]) => path.includes(`/${slug}.`));
  if (!match) {
    throw new Error(`Missing thumbnail asset for slug: ${slug}`);
  }
  return match[1];
}

function resolveDetailImages(slug: string): string[] {
  return Object.entries(detailModules)
    .filter(([path]) => path.includes(`/detail/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);
}

const rawWorks: WorkInput[] = [
  {
    name: '박장호',
    title: 'TRI-AXIS OF RULES',
    slug: 'parkjangho',
    keyword: '110 Rules',
    descriptionKo:
      '〈TRI-AXIS OF RULES〉는 세상에 존재하고 존재했던 수많은 규칙을 한자리에 모아, X·Y·Z 세 축으로 이루어진 좌표 위에 정렬해 볼 수 있는 웹사이트다.\n규칙은 보편성과 특수성 사이에서, 또 통제된 질서와 예기치 못한 우연 사이에서 끊임없이 모양을 바꾼다. 지금 이 웹 공간에는 이러한 맥락 속에서 특징적인 규칙 110개가 올라와 있지만 이 분류 방식이 110개라는 숫자에 묶여 있는 건 아니다. 세 축의 좌표는 이론상 세상의 그 어떤 규칙이든 대입해 자리를 매길 수 있도록 설계되었다. 이러한 무한한 확장성을 바탕으로, 이 작업은 눈에 보이지 않는 삶의 규칙들을 새로운 ‘알고리즘적 규칙’으로 재정의하고 매긴다. 규칙에 대한 규칙을 통해, 아침을 깨우는 알람이나 식탁 위의 예절부터 우주를 움직이는 물리 법칙까지, 세상의 온갖 규칙들을 좌표 공간으로 끌어올려 그 숨은 성질을 들여다보고자 한다.\n사용자들이 이 가상의 삼차원 공간을 탐색하면서, 자신을 둘러싼 규칙을 그저 구속이 아니라 세상을 받쳐주는 유연한 질서로, 혹은 깨어가며 유희를 탐할 수 있는 대상으로 다시 바라보기를 기대해본다.',
    descriptionEn:
      '〈TRI-AXIS OF RULES〉 is a website that gathers countless rules from the past and present, mapping them onto a 3D coordinate system of X, Y, and Z axes.\nRules constantly shift between universality and specificity, and between order and chance. While this web space currently hosts 110 distinctive rules, the system has infinite scalability to accommodate any rule in existence. By redefining the invisible rules of daily life into new “algorithmic rules,” this project examines the hidden qualities of everything from morning alarms and dining etiquette to the laws of physics.\nAs users explore this virtual space, I hope they will view the rules around them not as mere constraints, but as a flexible order that supports our world or as a playful system to be broken and enjoyed.',
    contact: '@j.ho.wrks',
    link: 'https://tri-axis-of-rules.vercel.app',
  },
  {
    name: '김지원',
    title: 'THE NEW CORE PROJECT',
    slug: 'kimjiwon',
    keyword: '100 Cores',
    descriptionKo:
      '인터넷 시대의 이미지는 끊임없이 생산되고 복제되며 사라진다. 사람들은 개별 이미지를 소비하기보다 특정 색감, 분위기, 오브제, 장소, 감정을 하나의 감각으로 묶어 이해하고 공유하며, 이러한 현상은 오늘날 인터넷 슬랭인 ‘-core’로 나타난다. THE NEW CORE PROJECT는 디지털 공간에서 발견한 100개의 코어를 수집·정리한 시각 아카이브로, 반복되는 이미지와 시각적 요소들이 하나의 이름 아래 새로운 미감과 정체성을 형성하는 과정을 기록한다. 출처를 잃은 채 복제와 재조합을 거듭하며 떠도는 인터넷 이미지를 활용하고, 중첩되고 부유하는 레이아웃을 통해 디지털 환경의 특성을 시각화함으로써, 코어를 단순한 유행이 아닌 인터넷 시대가 이미지를 이해하고 감각을 조직하는 하나의 방식으로 제안한다.',
    descriptionEn:
      'In the age of the internet, images are constantly created, replicated, and forgotten. Rather than consuming them individually, people group recurring colors, moods, objects, places, and emotions into shared aesthetic categories—an emerging visual language commonly expressed through the suffix “-core.” THE NEW CORE PROJECT is a visual archive of 100 cores collected from digital culture, documenting how repeated images and visual patterns evolve into recognizable aesthetics and identities through collective perception. Most of the images originate from anonymous internet circulation, endlessly copied, remixed, and detached from their original sources. By embracing layered, overlapping layouts that reflect the chaotic flow of digital media, the project presents “core” not simply as an internet trend, but as a contemporary system for organizing visual experience and understanding how aesthetics are formed in the age of endless reproduction.',
    contact: '@march_g2',
  },
  {
    name: '이세민',
    title: '선물을 고민하며 수집하는 100개의 단서',
    slug: 'leesemin',
    keyword: '100 Clues',
    descriptionKo:
      '『선물을 고민하며 수집하는 100개의 단서』는 선물을 고르는 과정에서 발견할 수 있는 100개의 관찰 단서를 아카이브한 작업이다. 갖고 싶다고 말한 물건, 반복적으로 방문하는 장소, 오래 사용한 소지품, 버리지 못한 물건처럼 일상 속 흔적들을 선물을 위한 정보로 재구성하였다. 원래는 사소한 습관이나 기억으로 존재하던 단서들이 이 작업 안에서는 상대를 이해하기 위한 관찰의 증거이자 선물 설계의 출발점으로 기능한다. 이 작업은 좋은 선물의 정답을 제시하기보다, 선물이 물건의 선택 이전에 상대를 바라보는 방식에서 시작된다는 점에 주목한다. 단순히 선물을 추천하는 책이 아니라, 누군가를 이해하기 위해 무엇을 관찰할 수 있는지에 대한 기록이다.',
    descriptionEn:
      '‘Gift Profiling Evidence’ is an archive of 100 observational clues discoverable in the process of choosing a gift. It reframes everyday traces—things someone has said they want, places they visit repeatedly, belongings they’ve used for a long time, objects they can’t bring themselves to throw away—as information for gift-giving. Clues that originally existed as trivial habits or memories function, within this work, as evidence of observation for understanding another person and as a starting point for gift design. Rather than offering a correct answer for what makes a good gift, this work draws attention to the idea that a gift begins not with the choice of an object, but with the way one looks at the other person. It is not simply a book of gift recommendations, but a record of what can be observed in order to understand someone.',
    contact: '@23min.kr',
  },
  {
    name: '김규빈',
    title: '전부 밤티로 만들기..\nBamtify Everything..',
    slug: 'kimgyubeen',
    keyword: '100 Bamti Designs',
    descriptionKo:
      '우리가 어떤 디자인을 보고 못생겼다고, ‘밤티’라고 느낄 때, 그 안에는 과한 색상, 어긋난 정렬, 낯선 비율, 불균형한 정보 배치처럼 제도권 디자인 교육이 가르친 ‘세련됨’의 규칙을 벗어난 특정한 조형적 문법이 숨어 있으며, 오히려 그 규칙을 모조리 어겼기에 정제된 디자인에서는 찾기 힘든 생명력과 해방감을 지닌다. 《Bamtify Everything..》은 주변에서 발견한 아마추어적이고 어딘가 어긋난 이미지를 수집해 그 조형적 특징을 추출하고, 이를 정제된 하이엔드 디자인에 역으로 적용하는 리디자인 프로젝트이다. 4년간 시각디자인을 배운 공간이자 헬베티카와 국제주의 타이포그래피의 질서로 설계된 홍문관 7층을 ‘밤티’로 만듦으로써, 디자인 교육 안에서 내면화한 미감과 판단의 기준을 가볍게 배신해 본다.',
    descriptionEn:
      'When we look at a design and feel it is “ugly” or “Bamti (off-beat/tacky),” a specific visual grammar lies hidden within it — excessive colors, misalignments, unfamiliar proportions, unbalanced information — all deviating from the rules of “sophistication” taught in formal design education, and it is precisely by breaking every one of those rules that this grammar carries a vitality and sense of liberation rarely found in refined, polished design. Bamtify Everything.. is a redesign project that collects amateurish, slightly off-kilter images found in everyday surroundings, extracts their formal characteristics, and applies them in reverse to refined, high-end design — Bamtifying the 7th floor of Hongmun Hall, the very space where we studied visual communication design for four years and which was itself designed on the order of Helvetica and International Typographic Style, thereby playfully betraying the aesthetic standards and judgments we internalized through our design education.',
    contact: '@streetpessimist',
    link: 'https://streetpessimist.github.io/bamtify/',
  },
  {
    name: '정우현',
    title: '형태를 설득하는 방법',
    slug: 'jungwoohyun',
    keyword: '100 Prsuasions',
    descriptionKo:
      '형태 자체에 근거가 깃드는 것은 디자이너가 더 나은 방식으로 소통하고 있다는 증거다. 형태의 도출 이유를 논리적으로 설명할 수 있기에 단순한 주관적 감각을 넘어선 신뢰를 심어준다. ｢형태를 설득하는 방법｣에서는 형태에 설득력을 부여하는 다양한 길들을 사유해 본다. 책에 기록한 내용들은 정답이 아니며, 지극히 개인적 판단일 뿐이다. 완벽한 형태란 이데아와 같다. 비록 그 본질에 닿을 수는 없더라도 끊임없이 가까워지고 싶은 열망과 갈증은 유효하다.',
    descriptionEn:
      'When a form inherently embodies its own rationale, it serves as proof that the designer is communicating on a deeper level. The ability to logically articulate the reasoning behind a form builds a sense of trust that transcends mere subjective intuition. Here, I reflect upon the paths that lend persuasiveness to form.\nThe thoughts recorded in this book are not absolute answers, but rather deeply personal perspectives. The perfect form is akin to a Platonic ideal. Although we may never reach its absolute essence, the relentless thirst and yearning to draw ever closer to it remain profoundly valid.',
    contact: '@faux_hyun',
  },
  {
    name: '이린',
    title: '100개의 현재 (100 presents)',
    slug: 'leelynn',
    keyword: '100 Presents',
    descriptionKo:
      '사라져버릴 현재를 어떻게 붙잡을 수 있는가. 우리는 언제나 현재를 살아가지만, 현재를 의식하는 순간 그것은 이미 지나간 시간이 된다. 『100개의 현재』는 사라져버릴 현재를 어떻게 붙잡을 수 있는가라는 질문에서 시작된 웹 아카이브 프로젝트이다.',
    descriptionEn:
      'How can we hold on to the present that will disappear? We always live in the present, but the moment we are conscious of the present, it becomes a time that has already passed. 『100 Present』 is a web archive project that started with the question of how to capture the present that will disappear.',
    contact: '@llnnnyl / llynnn19@gmail.com',
    link: 'https://100-presents.vercel.app/',
  },
  {
    name: '조서영',
    title: '제1회 조랭이픽처스 상영회 \nThe 1st Joreng Pictures Screening',
    slug: 'choseoyoung',
    keyword: '100 Checklist Items',
    descriptionKo:
      '제1회 조랭이픽처스 상영회는 2026년 6월 24일 수요일 오후 8시, 서늘한 폐교에서 열렸다. 약 1시간 반 동안 40명의 관객과 함께 이토 타카시, 한옥희, 래리 조던, 노먼 맥라렌, 렌 라이, 수잔 피트, 조르주 멜리에스의 아름답고 기이하며 심령적이고 신비로운 단편들을 보았다. 운영자 조서영(조랭)은 DIY 상영회 기획과 진행에 필요한 다양한 사례와 시나리오를 리서치하여 99가지 체크리스트를 추린 후, 행사에 필요한 것들을 직접 기획하고 디자인하였다.',
    descriptionEn:
      'The 1st Joreng Pictures Screening was held on Wednesday, June 24, 2026, at 8 PM, In a building that evokes the chill of an abandoned school. Over about an hour and a half, beautiful, uncanny, spectral, and mysterious short films by Ito Takashi, Han Ok-hee, Larry Jordan, Norman McLaren, Len Lye, Suzan Pitt, Georges Méliès were watched together with an audience of 40. Organizer Cho Seoyoung Cho (Joreng) researched the various cases and scenarios needed for planning and running a DIY screening, distilled them into a 99-item checklist, and then directly planned and designed everything the event required.',
    contact: '@choseoyoungcho / csynema@gmail.com',
  },
  {
    name: '김성재',
    title: '음악하는 사람 People in Music',
    slug: 'kimseongjae',
    keyword: '100 Minutes',
    descriptionKo:
      '보통 ‘음악하는 사람’ 하면 음악을 만들거나 부르고, 연주하는 사람을 떠올린다. 하지만 음악이 청취자의 귀에 닿기까지, 그 여정에 관여하는 모두가 음악‘하는’ 사람 아닐까? 음악은 혼자 완성되지 않는다. 곡을 찾고, 보여줄 방식을 고민하고, 뮤직비디오를 촬영하고, 앨범을 디자인하고, 평론을 쓰고, 공연에 올린다. 각자의 방식으로 음악에 개입하는 이들. 그들의 선택에 따라 전혀 다른 맥락이, 이야기가, 음악이 만들어진다. 크레딧은 보이지만 읽히지 않는다. 이 작업은 그 이름들로부터 시작한다. 음악이 만들어지고 유통·소비되기까지의 흐름 안에서 각자의 자리를 지키는 열 명을 만난다. 100분 동안, 음악 이야기만 한다. 본 작업은 음악 산업의 구조 분석이 아닌 ‘음악하는 사람’들을 들여다보고, 조명하는 데 초점을 둔다. 이 일을 왜 하는지, 어떻게 하는지, 도대체 음악이 무엇인지, 산업 안에서 자신의 자리를 어떻게 이해하는지. 그 이야기들을 한데 모아 음악이 어떠한 집합적 실천으로 탄생하는지를 보여주고자 한다.(추후 출판 예정)',
    descriptionEn:
      'When we think of “people who make music,” we usually picture those who compose, sing, or perform it. But could everyone involved in bringing music to the listener’s ears also be considered someone who makes music? Music is never completed alone. People discover songs, consider how they should be presented, direct music videos, design albums, write criticism, and bring performances to the stage. Each intervenes in music in their own way. Through their decisions, entirely different contexts, narratives, and forms of music emerge. The credits are visible, yet rarely read. This project begins with those names. It introduces ten people who each occupy a distinct position within the process through which music is created, distributed, and consumed. For one hundred minutes, they speak about nothing but music. Rather than analysing the structure of the music industry, this project focuses on the people who take part in making music and brings their work into view. Why do they do what they do? How do they do it? What is music to them? How do they understand their own position within the industry? By bringing their stories together, the project seeks to show how music comes into being as a collective practice.(A publication based on the project is forthcoming.)',
    contact: '@infth',
  },
  {
    name: 'XU NING',
    title: 'It’s Time to Go to Bed',
    slug: 'xuning',
    keyword: '100 Beds',
    descriptionKo:
      '《It’s Time to Go to Bed》는 100개의 침대를 관찰하며 신체, 공간, 휴식, 취약성의 관계를 탐구한다. 다양한 형태의 침대와 불안정한 휴식 조건을 통해 “이것은 침대인가요?”라는 질문을 반복하며, 침대의 정의를 흐리고 휴식을 권리이자 현실적 상태로 제시한다. 침대는 개인이 머무는 시공간과 돌봄의 가능성을 비추는 거울이 된다.',
    descriptionEn:
      'It’s Time to Go to Bed observes 100 beds, exploring the relationship between the body, space, rest, and vulnerability. Through various forms of beds and unstable conditions of rest, it repeatedly poses the question, “Is this a bed?”—blurring the definition of a bed and presenting rest as both a right and a real-life condition. The bed becomes a mirror that reflects the time and space an individual occupies and the possibility of care.',
    contact: '@lola1o1a',
  },
  {
    name: '오성건',
    title: 'Sneak Peek',
    slug: 'ohseongkeon',
    keyword: '100 Images',
    descriptionKo:
      '본 작업은 금서(禁書)의 개념에서 출발한다. 소유하는 것만으로도 불온해지는 책, 공공장소에서 펼쳐 보일 수 없는 책. 그 가능성에 대한 욕망이 이 프로젝트의 기원이다. 인터넷에서 수집한 약 150장의 이미지들—출처가 불분명하고 의도가 모호한—을 지면 위에 배치하고 중첩하는 과정을 통해, 이미지들 사이에 새로운 내러티브가 발생한다. 도발과 폭력의 뉘앙스를 품은 푸티지들은 단독으로 존재할 때와 다른 맥락을 획득하며, 책이라는 형식 안에서 또 다른 불온함을 구성한다.',
    descriptionEn:
      'The work begins with the concept of a banned book—a book that becomes subversive by mere possession, one that cannot be opened in public. The desire for that possibility is the origin of this project. Through the process of arranging and layering approximately 150 images collected from the internet—images of unclear origin and ambiguous intent—onto the page, a new narrative emerges between them. Footage carrying nuances of provocation and violence acquires a different context than when it exists in isolation, constructing yet another form of subversiveness within the format of the book.',
    contact: '@goshitomi',
  },
  {
    name: '정지은',
    title: '예민한 비둘기, Sensitive Pigeon',
    slug: 'jeongjieun',
    keyword: '100 Sensitivities',
    descriptionKo:
      '〈예민한 비둘기〉는 도시에서 흔하게 마주치지만 환영받지 못하는 비둘기를 자신과 겹쳐 보며 시작한 작업이다. 비둘기는 둔하고 무심해 보이지만, 도시 안에서는 작은 움직임에도 계속 반응하며 자리를 옮긴다.\n이 작업은 비둘기의 위치에서 도시를 바라보고, 일상에서 반복적으로 마주치는 장면들을 관찰문으로 기록한다. 핸드폰만 보며 걷는 사람들, 빠르게 닫히는 문, 거리의 광고 문구, 스쳐 지나가는 시선처럼 그냥 지나칠 수 있는 순간들을 하나씩 붙잡아, 도시 안에서 쌓이는 100가지의 예민함으로 수집한다.',
    descriptionEn:
      'Sensitive Pigeon began with the artist identifying with pigeons—creatures commonly encountered in the city, yet rarely welcomed. Although pigeons may appear dull and indifferent, they are constantly reacting to the smallest movements around them, shifting from one place to another in order to navigate the urban environment.\nThis project observes the city from the position of a pigeon and records recurring scenes from everyday life as short observational texts. People walking while staring at their phones, doors closing too quickly, advertising slogans filling the streets, and glances that briefly sweep across the body—moments that might otherwise pass unnoticed are captured one by one and collected as one hundred urban sensitivities.',
    contact: '@stopsilevr02',
    link: 'https://dovesensitive.neocities.org/',
  },
  {
    name: '강다현',
    title: 'Kawaii Anatomy',
    slug: 'kangdahyun',
    keyword: '100 Characters',
    descriptionKo:
      '귀여움이란 무엇일까? 우리는 여러 대상에게서 자연스럽게 귀여움을 느끼지만 그 감각이 어떤 요소와 구조를 통해 형성되는지는 명확하게 설명하기 어렵다. 《Kawaii Anatomy》는 사회적으로 귀엽다고 인식되는 약 100개의 캐릭터를 수집하고, 이를 시각적 최소 단위까지 해부·분류하여 하나의 데이터베이스를 구축한다. 이 과정은 귀여움을 보다 객관적인 시선으로 관찰하기 위한 시도이다. 익숙한 감각의 구조를 다시 바라보며, 귀여움에 대한 새로운 관점과 해석의 가능성을 탐색한다.',
    descriptionEn:
      'What is cuteness? We naturally perceive many things as cute, yet it is difficult to clearly explain which elements and structures give rise to that perception. Kawaii Anatomy collects approximately 100 characters that are widely recognized as cute and deconstructs them into their smallest visual units, classifying them to build a database. This process is an attempt to observe cuteness from a more objective perspective. By reconsidering an intuitive perception as a structure, the project explores new perspectives and interpretations of cuteness.',
    contact: '@true1xver',
  },
  {
    name: '이지희',
    title: 'BORN ARCHIVE 100',
    slug: 'leejihee',
    keyword: '100 Bones',
    descriptionKo:
      '도나 해러웨이의 「사이보그 선언」(1985)을 시작으로 인체 골격 모델을 해체해 수집한 100개의 뼈 기록이다. 이 과정은 단순한 해부학적 분류를 넘어 새로운 몸, 새로운 존재를 재구성하는 시도다. ‘Bone Archive(뼈의 기록)’이자 새로운 몸이 탄생하는 기록인 ‘Born Archive’를 지향하며, 100개의 해체된 조각들을 통해 완결된 신체 대신 무한한 몸의 가능성을 예고한다.\n성인의 뼈 206개 중 임의로 선택된 100개의 조각은 분류라는 형식 자체의 임의성을 폭로한다. 검은 잉크처럼 추상화된 도판에는 정보가 거부된 채 오직 번호만이 남으며, 도판 사이에는 도나 해러웨이와 민디 서의 이론적 텍스트를 배치해 사유의 좌표를 더했다. 본 작업은 해체-재조립-착용의 세 단계 중 첫 번째인 ‘해체’의 기록이다. 분해된 뼈들이 아카이브를 벗어나 신체 위로 재조립되고 착용되기 직전, 그 고요한 마지막 상태를 붙잡아 둔다.',
    descriptionEn:
      'Starting from Donna Haraway’s A Cyborg Manifesto (1985), this project is an archive of 100 bones collected by deconstructing human skeletal models. This process is not a mere anatomical categorization, but an attempt to reconstruct a new body and a new existence. Exploring the double meaning of a ‘Bone Archive’ (a record of bones) and a ‘Born Archive’ (a record of a body being reborn), the 100 dismantled fragments foreshadow the possibilities of a new body rather than reproducing a complete one.\nSelecting exactly 100 pieces out of the 206 bones in an adult skeleton exposes the inherent arbitrariness of categorization. The plates, abstracted like black ink, are stripped of anatomical information, leaving only numbers behind. Between these plates, theoretical texts by Donna Haraway and Mindy Seu are positioned to establish conceptual coordinates. This book documents ‘deconstruction’—the first stage of a three-part process: deconstruction, reassembly, and wearing. It captures the final, quiet state of the dismantled bones just before they escape the archive to be reassembled back onto the body.',
    contact: '@lee.zhixi',
  },
  {
    name: '현지우',
    title: 'Operational Body: 50 Phatom Bodies\n작동적 신체: 50개의 유령이 된 몸',
    // best-effort match against assets/img/thumbnail — confirm this is 현지우's file
    slug: 'jiuhyun',
    keyword: '100 Bodies',
    descriptionKo:
      '우리의 몸은 더 이상 피부 안에만 머물지 않는다.\n얼굴과 목소리, 손가락의 움직임, 걸음과 위치, 시선과 몸짓은 데이터와 이미지, 좌표와 파형이 되어 기계 속에 남는다. 한때 몸에서 비롯되었지만, 이제는 몸을 떠나 다른 시스템을 작동시키는 또 하나의 신체가 된다.\n이 책은 이러한 몸을 ‘유령이 된 몸’이라 부른다.\n하룬 파로키의 ‘작동적 이미지’ 개념에서 출발해, 인간의 몸이 기계에 의해 읽히고 기록되며 사용되는 50가지 사례를 모았다. 모션캡처, 생체 인식, 행동 추적과 같은 장면 속에서 몸은 더 이상 바라보는 대상에 머물지 않는다. 기계의 작동을 위해 준비된 데이터가 된다.\n『작동적 신체』는 기계 안에 흩어져 살아가는 또 다른 몸들의 사전이다.',
    descriptionEn:
      'Our bodies no longer remain within the boundaries of the skin.\nOur faces and voices, the movements of our fingers, our footsteps, locations, gazes, and gestures are transformed into data, images, coordinates, and waveforms that persist within machines. Once produced by the body, they now leave it behind and become another kind of body—one that enables other systems to operate.\nThis book calls these traces “ghost bodies.”\nDrawing on Harun Farocki’s concept of the “operational image,” this book brings together fifty cases in which the human body is read, recorded, and used by machines. In motion capture, biometric recognition, and behavioral tracking, the body is no longer merely something to be seen. It becomes data prepared for mechanical operation.\nThe Operative Body is a dictionary of the other bodies that remain scattered across machines.',
    contact: '@youngcha.xyz',
  },
  {
    name: '양정원',
    title: '100 Flights',
    slug: 'yangjungwon',
    keyword: '100 Flights',
    descriptionKo:
      '인간은 오래전부터 하늘을 날고 싶어 했다. 새를 관찰하고, 날개를 만들고, 비행기를 발명했으며, 오늘날에도 다양한 방식으로 비행을 시도한다. 시대와 기술은 달라졌지만 하늘을 향한 인간의 욕망은 여전히 이어지고 있다.\n〈100명의 비행〉은 이러한 욕망을 그래픽 디자인의 방식으로 실현해 보고자 한 프로젝트이다. 하늘을 날고 싶은 사람들을 모집해 전신 사진과 비행의 이유를 수집했다. 참여자들은 자유로워지고 싶어서, 더 멀리 나아가고 싶어서, 높은 곳에서 세상을 내려다보고 싶어서, 혹은 지금 있는 곳을 잠시 벗어나고 싶어서 비행을 꿈꿨다.\n수집된 사진은 그래픽 과정을 거쳐 새로운 이미지로 재구성되었다. 개인의 기록은 천에 인쇄된 비행의 이미지가 되어 바람을 타고 공중을 떠다닌다. 함께 제작한 100페이지의 제본 없는 사진집은 이러한 비행의 순간들을 기록한 아카이브이다.',
    descriptionEn:
      'Humans have long dreamed of flying. From observing birds and building wings to inventing airplanes, and more recently experimenting with paragliding, wingsuits, and personal flying devices, the methods have changed, but the desire to take to the sky has remained.\n〈100 Flights〉 is a graphic design project that explores this enduring desire through the language of images. I invited people who wanted to fly and collected full-body portraits alongside their personal reasons for wanting to take flight. Some longed for freedom, others to go farther, to see the world from above, or simply to escape where they were, if only for a moment.\nThe collected photographs were transformed through graphic processes into new visual forms. Once personal records, the images were printed onto fabric, where they catch the wind and drift through the air as imagined flights. Accompanying the installation is an unbound, 100-page photo book that serves as an archive of these fleeting moments of flight.',
    contact: '@moeraek',
  },
  {
    name: '김시현',
    title: '10 Strangers 100 Stories',
    slug: 'kimsihyun',
    keyword: '100 Stories',
    descriptionKo:
      '10 Strangers 100 Stories는 서로 다른 장소와 언어, 문화 사이를 이동하며 살아가는 이방인들의 이야기를 수집한 웹 아카이브 프로젝트이다. 세계 여러 도시의 이방인들에게 각자의 삶을 보여줄 수 있는 10개의 데이터를 요청했다. 데이터는 현재 머무는 도시, 집, 자주 들고 다니는 물건, 고향을 떠올리게 하는 사물, 음식, 언어, 미래에 살고 싶은 장소 등에 관한 사진, 영상, 오디오, 텍스트로 구성된다. 이후 이방인이 직접 보내준 데이터를 함께 열어보며 이야기를 나눴다. 하나의 이미지, 짧은 영상, 사물의 기록은 대화의 출발점이 되었고, 그 안에서 고향, 이동, 언어, 소속감, 외로움, 익숙함과 낯섦에 관한 이야기가 자연스럽게 이어진다. 이 작업은 이방인의 삶을 하나의 정체성으로 고정하지 않는다. 대신 그들이 선택한 사적인 데이터들을 통해, 한 사람이 여러 장소와 언어 사이에서 어떻게 자신만의 집과 감각을 만들어가는지 들여다본다.',
    descriptionEn:
      '10 Strangers 100 Stories is a web archive that collects the stories of people living between different places, languages, and cultures. I invited strangers living in cities around the world to share ten pieces of personal data that reflect their everyday lives. These included photographs, videos, audio recordings, and texts related to where they live now, their homes, the things they carry, objects that remind them of where they come from, food, language, and places they might want to live in the future. We then went through the material together and talked about the stories behind it. A single image, a short video, or an everyday object often became the starting point for conversations about home, migration, language, belonging, loneliness, familiarity, and estrangement. Rather than defining the experience of being a stranger through a single identity, the project looks closely at the personal traces each participant chose to share. Through them, it explores how people living across multiple places and languages gradually create their own sense of home and ways of relating to the world around them.',
    contact: '@sihyunnkim',
    link: 'https://siihyunkim.github.io/10_Strangers/',
  },
  {
    name: '백단하',
    title: '[1]개의 제목, [252]권의 책: 『Le Roman de la Rose』 필사본 크기 기록',
    slug: 'baekdanha',
    keyword: '100 Manuscripts',
    descriptionKo:
      '인쇄술 발명 이후 책은 반복적으로 생산 가능한 상품이 되었고, 우리는 하나의 작품이 동일한 형식으로 존재하는 것을 당연하게 여기게 되었다. 그러나 인쇄술 없이 제작되었던 필사본은 같은 텍스트를 담고 있더라도 동일한 책이 아니었다. 이 프로젝트는 『Le Roman de la Rose』라는 하나의 제목에 속하는 필사본들이 서로 다른 책이라는 점에서 출발한다. 각 필사본의 크기를 단서로 삼아, 인쇄문화에 익숙한 시선이 지워버린 책의 비균질성을 다시 조명한다.',
    descriptionEn:
      'Since the invention of printing, books have become commodities that can be repeatedly produced, and we have come to take it for granted that a single work exists in an identical form. However, manuscripts produced without printing were not identical books, even when they contained the same text. This project begins with the fact that the manuscripts belonging to a single title, Le Roman de la Rose, are different books from one another. Using the size of each manuscript as a clue, it reexamines the heterogeneity of books that has been erased by a perspective accustomed to print culture.',
    contact: '@badookdol',
    link: 'https://youtu.be/aG9IigGDPnk',
  },

  {
    name: '강민서',
    title: 'How to Build a Norma',
    slug: 'baekdanha',
    keyword: '100 Averages',
    descriptionKo:
      '《How to Build a Norma》는 평균이 객관적이고 합리적인 기준이라는 믿음에 질문을 던진다. 의류 사이즈, BMI, 얼굴 비율 등 사회의 많은 기준은 서로 다른 몸을 하나의 표준에 맞추도록 작동한다. 이 작업은 한 사람의 신체가 100개의 평균값에 따라 변화하는 과정을 통해, 평균이 인간을 설명하는 수치가 아니라 인간을 특정한 시스템에 맞추는 장치가 될 수 있음을 보여준다.\n‘노르마(Norma)’는 1940년대 미국의 인체 측정 연구에서 탄생한 평균적인 여성의 이름이다. 조각가 에이브럼 벨스키와 의학자 로버트 라투 디킨슨은 수천 명의 여성 신체 데이터를 평균 내어 ‘가장 평균적인 여성’의 조각상을 제작했다. 그러나 여러 평균값을 동시에 만족하는 실제 여성은 거의 존재하지 않았고, 이는 ‘평균적인 인간’이라는 개념의 모순을 드러냈다.\n이 작업은 이러한 사례를 뒤집어 제작자인 나의 몸을 100개의 평균값에 맞춰 수정한다. 포스터는 모든 평균이 적용된 최종 ‘노르마’를 실물 크기로 제시하고, 영상은 그 변화 과정을 기록한다. 이를 통해 평균이 개인의 몸에 적용될 때 무엇이 수정되고 사라지는지를 탐구한다.',
    descriptionEn:
      '《How to Build a Norma》 questions the belief that averages provide objective and rational standards. Social standards such as clothing sizes, BMI, and facial proportions often work to fit different bodies into a single norm. By showing one body transformed according to 100 averages, the project reveals how averages can function not as descriptions of people, but as devices for fitting them into a particular system.\n“Norma” was the name given to an average woman created through anthropometric research in 1940s America. Sculptor Abram Belskie and physician Robert Latou Dickinson produced a statue of the “average woman” by combining the body measurements of thousands of women. Yet almost no real woman matched multiple averages at once, exposing the contradiction within the idea of an “average person.”\nReversing this historical case, the project modifies my own body according to 100 averages. The poster presents the completed “Norma” at life size, while the video documents the process of transformation. Through these works, the project explores what is altered and what disappears when averages are applied to an individual body.',
    contact: '@minseo.kr',
    link: '',
  },
  {
    name: '김세은',
    title: 'BOOKISHNESS',
    slug: 'kimseeun',
    keyword: '100 Thoughts',
    descriptionKo:
      'BOOKISHNESS는 ‘책다움’ 혹은 ‘책처럼 느껴지는 성질’을 뜻하며, 스크린에서 가능한 읽기의 방식을 탐구하는 인터랙티브 웹 작업이다. 여기서 책다움은 단순히 종이책의 외형과 읽기 방식을 모방하는 것이 아니라, 책을 읽을 때 발생하는 감각과 행위가 스크린 환경 안에서 다시 구성되는 상태를 의미한다. 박스 안의 오브제들은 각각 다른 읽기 방식으로 연결되고, 감상자는 이를 선택하고 조작하며 텍스트에 도달하는 과정을 수행한다. 오브제와 지시문을 통해 관객의 참여를 유도했던 Fluxbox의 방식을 빌려, 웹이라는 매체를 통해 더 쉽게 연결되고 유포될 수 있는 형태로 확장된다.',
    descriptionEn:
      'BOOKISHNESS is an interactive web-based work that explores possible ways of reading on screen. The title suggests the quality of feeling like a book, not by imitating the appearance or reading conventions of printed books, but by reconfiguring the sensations and actions involved in reading within the screen environment. The objects inside the box are each connected to a different mode of reading, and the user performs the process of reaching the text by selecting and manipulating them. Borrowing from the structure of Fluxbox, which encouraged audience participation through objects and instructions, this work extends that approach into a form that can be more easily connected and distributed through the medium of the web.',
    contact: '@kimseeunse',
    link: 'https://kimseeunse.github.io/BOOKISHNESS/',
  },
  {
    name: '양의열',
    title: 'Interstice',
    slug: 'yangeuiyeol',
    keyword: '100 Gaps',
    descriptionKo:
      '서사는 추상으로 존재하며 우리 곁에서 여러가지 방식으로 존재한다. 세상에 없는 이야기, 혹은 어딘가는 존재하더라도 누군가는 경험해보지 못했을 이야기를 타인에게 전달하기 위해 우리는 목소리, 텍스트, 그리고 이미지를 동원한다. 이와같은 서사 전달방식의 발전은 우리가 전달하고 싶은 이야기를 더욱 효과적으로 전달하길 바라는 욕망의 결과라고 볼 수 있다. 이번 작업은 텍스트 혹은 이미지로 나타난 서사의 공백을 짚어가며 우리가 서사를 다루는데에 있어 서사를 수용자가 아닌 생산자 혹은 전달자의 시점으로 생각할 수 있는 기회를 제공하며, 효과적이고 다층적인 서사전달을 위한 고민의 흔적들을 되짚어본다.',
    descriptionEn:
      'Narratives exist as abstractions, manifesting around us in various forms. To convey stories that do not exist in the real world—or those that may exist somewhere yet remain unexperienced by others—we mobilize voices, texts, and images. The evolution of these modes of narrative delivery can be seen as the result of our desire to convey the stories we wish to share more effectively.\nThis work points to the gaps within narratives rendered in text or image, offering an opportunity to consider story handling from the perspective of a producer or transmitter rather than a passive recipient. Through this, it traces the deliberations behind achieving effective and multi-layered narrative delivery.',
    contact: '@eui.10',
  },
  {
    name: '배유진',
    title: '100개의 주관적인 장소',
    slug: 'baeyujin',
    keyword: '100 Places',
    descriptionKo:
      '《100개의 주관적인 장소》는 사람들이 실제로 사용한 지도 화면과 장소에 대한 이야기를 수집하고, 이를 여러 형식의 시각 작업으로 재구성한 프로젝트이다.\n사람들은 같은 지도 앱을 사용하더라도 서로 다른 정보를 남긴다. 누군가는 맛집이나 카페를 저장하고, 누군가는 여행지와 숙소, 자주 이용하는 경로나 기억하고 싶은 장소를 기록한다. 지도 안에 남겨진 핀과 저장 장소, 길찾기 기록, 캡처 화면에는 각자의 생활 방식과 관심이 드러난다.\n이 작업은 참여자들의 지도 사용 방식과 장소를 선택하는 기준을 살펴보는 데서 시작했다. 인터뷰와 구글폼을 통해 지도 화면과 장소 이야기를 수집하고, 이를 바탕으로 각 지도의 특징을 분류하고 키워드를 정리하였다. 일부 지도는 아카이브 책, 포스터, 패턴, 게임 형식의 지도 등으로 다시 제작하였다.\n《100개의 주관적인 장소》는 지도를 개인의 이동과 경험, 기억이 남는 기록으로 바라보고, 서로 다른 공간 인식을 시각적으로 정리하는 작업이다.',
    descriptionEn:
      '《100 Subjective Places》 is a project that collects map screens people have actually used and their stories about places, reconstructing them in various visual formats.\nEven when using the same map application, people leave different kinds of information. Some save restaurants or cafés, while others record travel destinations, accommodations, frequently used routes, or places they want to remember. Pins, saved places, navigation histories, and captured screens reveal each person’s lifestyle and interests.\nThe project began by examining how participants use maps and the criteria by which they select places. The collected maps and stories were analyzed to identify the characteristics of each map and organize them into keywords. Selected maps were then recreated as an archive book, posters, patterns, and game-like maps.\n《100 Subjective Places》 views the map as a record of personal movement, experience, and memory, and visually presents different ways of perceiving places.',
    contact: '@bae_yj_art',
  },
  {
    name: '여단아',
    title: 'War Propaganda: An Emotion Archive',
    slug: 'yeodana',
    keyword: '100 Propagandas',
    descriptionKo:
      '전쟁이 지속되기 위해서는 막대한 자원의 전용과 국민적 지지가 필수적이다. 국가는 병력을 보충하고 자금을 모으기 위해, 대중의 사기를 진작하거나 적국의 야만성을 강조하는 등 다방면의 선전 활동을 전개했다. 그렇다면 평범한 사람들은 어떻게 한 장의 이미지를 보고 목숨을 무릅쓰고 전장에 나가거나, 기꺼이 자신의 자산을 내어놓게 되었을까? 이 질문에서 출발한 프로젝트는 전쟁 프로파간다 아트워크가 대중의 행동을 이끌어내기 위해 사용한 감정의 시각적 설계를 추적하고 분류하는 아카이브 작업이다.',
    descriptionEn:
      'The continuation of war depends on the large-scale mobilization of resources and sustained public support. To replenish military forces and secure funding, states employed a wide range of propaganda strategies, from boosting public morale to emphasizing the perceived brutality and barbarity of the enemy. But how could a single image persuade ordinary people to risk their lives on the battlefield or willingly surrender their personal wealth?\nThis project begins with that question. It is an archival study that traces and categorizes the visual strategies of emotion employed in wartime propaganda artworks to influence and mobilize public action.',
    contact: '@yeo_dana',
  },
  {
    name: '황지원',
    title: 'sjuzhet',
    slug: 'hwangjiwon',
    keyword: '100 Plots',
    descriptionKo:
      '영화는 이야기를 순서대로 보여주지 않는다. 사건의 순서를 뒤집고, 수십 년을 한 번에 건너뛰고, 어떤 시간은 조용히 잘라내기도 한다. 그 재배열의 시간 구조를 측정하고 시각화하는 것이 이 프로젝트의 출발점이다.',
    descriptionEn:
      'Cinema does not present narratives in a linear sequence. It inverts the order of events, leaps across decades in an instant, and quietly excises certain spans of time. This project begins with the measurement and visualization of this rearranged temporal structure.',
    // NOTE: the source cell for this contact got cut off mid-paste ("@now_iz_") — confirm the full handle
    contact: '@now_iz_',
  },
];

export const works: Work[] = rawWorks
  .map((work, index) => ({
    ...work,
    id: `work-${String(index + 1).padStart(2, '0')}`,
    thumbnail: resolveThumbnail(work.slug),
    detailImages: resolveDetailImages(work.slug),
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'ko'));

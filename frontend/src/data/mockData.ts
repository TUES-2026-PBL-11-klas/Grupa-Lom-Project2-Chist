export const CURRENT_USER = {
  id:"usr_002", name:"GreenSofia", avatar:"GS",
  points:3670, streak:7, level:"МАСТЪР", levelIcon:"gem",
  nextLevelPts:5000, verified:false, cleanings:31, reports:18, joined:"Октомври 2024",
};

export const REPORTS = [
  { id:1, title:"Замърсен парк — Борисова", location:"Борисова градина, Вход 3", district:"Оборище", lat:42.678, lng:23.357, status:"open", severity:"high", img:"tree-pine", points:120, reporter:"EcoHero99", reporterAvatar:"EH", time:"преди 2ч", description:"Голямо количество отпадъци са изхвърлени близо до детската площадка. Видими са найлонови торби, бутилки и стара мебел.", volunteers:0, confirmedBy:[], aiVerified:false, gps:{lat:42.6783,lng:23.3571} },
  { id:2, title:"Отпадъци до контейнер", location:"ж.к. Люлин 5, бл. 514", district:"Люлин", lat:42.712, lng:23.269, status:"in-progress", severity:"medium", img:"trash", points:80, reporter:"GreenSofia", reporterAvatar:"GS", time:"преди 5ч", description:"Контейнерът е препълнен и отпадъците са разхвърляни около него на радиус 3-4 метра.", volunteers:1, confirmedBy:[], aiVerified:true, claimedBy:"GreenSofia", gps:{lat:42.7123,lng:23.2694} },
  { id:3, title:"Нелегално сметище", location:"бул. Витоша, зад магазините", district:"Триадица", lat:42.653, lng:23.321, status:"open", severity:"critical", img:"alert-triangle", points:200, reporter:"CleanCity", reporterAvatar:"CC", time:"преди 1д", description:"Голямо нелегално сметище с електроуреди, строителни материали и смесени битови отпадъци. Необходими са минимум 4 доброволци.", volunteers:0, confirmedBy:[], aiVerified:true, gps:{lat:42.6534,lng:23.3213} },
  { id:4, title:"Стъкло на тротоара", location:"Студентски град, бл. 12", district:"Студентски", lat:42.657, lng:23.395, status:"done", severity:"low", img:"sparkles", points:40, reporter:"UniVolunteer", reporterAvatar:"UV", time:"преди 2д", description:"Счупена бутилка на пешеходната пътека до спирката.", volunteers:1, confirmedBy:["EcoHero99","GreenSofia"], aiVerified:true, cleanedBy:"UniVolunteer", gps:{lat:42.6573,lng:23.3952} },
  { id:5, title:"Изоставени мебели", location:"ж.к. Надежда, ул. 205", district:"Надежда", lat:42.735, lng:23.302, status:"open", severity:"medium", img:"armchair", points:100, reporter:"NadezhDA", reporterAvatar:"ND", time:"преди 3д", description:"Изоставен диван, матрак и маса блокират тротоара в жилищния квартал.", volunteers:0, confirmedBy:[], aiVerified:false, gps:{lat:42.7354,lng:23.3022} },
  { id:6, title:"Фасове около фонтана", location:"пл. България, около фонтана", district:"Красно село", lat:42.690, lng:23.319, status:"open", severity:"low", img:"cigarette", points:35, reporter:"SofiaClean", reporterAvatar:"SC", time:"преди 4ч", description:"Множество фасове и хартиени отпадъци около централния фонтан.", volunteers:0, confirmedBy:[], aiVerified:false, gps:{lat:42.6902,lng:23.3191} },
  { id:7, title:"Строителни отпадъци", location:"ж.к. Младост 1, до бл. 37", district:"Младост", lat:42.656, lng:23.378, status:"open", severity:"critical", img:"hard-hat", points:180, reporter:"EcoHero99", reporterAvatar:"EH", time:"преди 6ч", description:"Строителни отпадъци — бетон, тухли и арматура — изхвърлени на зелената площ до блока.", volunteers:0, confirmedBy:["CleanCity"], aiVerified:true, gps:{lat:42.6562,lng:23.3781} },
  { id:8, title:"Пластмаса в реката", location:"р. Перловска, до бул. Сливница", district:"Илинден", lat:42.709, lng:23.305, status:"in-progress", severity:"high", img:"waves", points:150, reporter:"CleanCity", reporterAvatar:"CC", time:"преди 8ч", description:"Пластмасови бутилки и найлони замърсяват коритото на реката. Нужна е координирана акция.", volunteers:2, confirmedBy:["EcoHero99"], aiVerified:true, claimedBy:"NadezhDA", gps:{lat:42.7091,lng:23.3053} },
  { id:9, title:"Графити и боклук", location:"Подлез НДК", district:"Триадица", lat:42.685, lng:23.318, status:"done", severity:"medium", img:"palette", points:60, reporter:"BorisovaKing", reporterAvatar:"BK", time:"преди 1д", description:"Натрупани отпадъци и графити в подлеза. Почистването включва и пребоядисване.", volunteers:1, confirmedBy:["GreenSofia","EcoHero99"], aiVerified:true, cleanedBy:"SofiaClean", gps:{lat:42.6852,lng:23.3182} },
  { id:10, title:"Опасни отпадъци — батерии", location:"ж.к. Дружба 2, до училище", district:"Искър", lat:42.667, lng:23.398, status:"open", severity:"critical", img:"battery-warning", points:250, reporter:"UniVolunteer", reporterAvatar:"UV", time:"преди 12ч", description:"Изхвърлени батерии и електронни компоненти в непосредствена близост до училищен двор. Спешно!", volunteers:0, confirmedBy:[], aiVerified:false, gps:{lat:42.6672,lng:23.3983} },
];

export const LEADERBOARD = [
  { rank:1, id:"usr_001", name:"EcoHero99",    points:4820, streak:14, level:"ЛЕГЕНДА",  levelIcon:"trophy", avatar:"EH", cleanings:54, verified:true  },
  { rank:2, id:"usr_002", name:"GreenSofia",   points:3670, streak:7,  level:"МАСТЪР",   levelIcon:"gem", avatar:"GS", cleanings:31, verified:false },
  { rank:3, id:"usr_003", name:"CleanCity",    points:2910, streak:21, level:"МАСТЪР",   levelIcon:"gem", avatar:"CC", cleanings:28, verified:true  },
  { rank:4, id:"usr_004", name:"UniVolunteer", points:1540, streak:3,  level:"ПРО",      levelIcon:"medal", avatar:"UV", cleanings:15, verified:false },
  { rank:5, id:"usr_005", name:"NadezhDA",     points:980,  streak:5,  level:"АКТИВЕН",  levelIcon:"award", avatar:"ND", cleanings:9,  verified:false },
  { rank:6, id:"usr_006", name:"SofiaClean",   points:720,  streak:2,  level:"АКТИВЕН",  levelIcon:"award", avatar:"SC", cleanings:7,  verified:false },
  { rank:7, id:"usr_007", name:"BorisovaKing", points:480,  streak:0,  level:"НОВИЧ",    levelIcon:"sprout", avatar:"BK", cleanings:4,  verified:false },
];

export const ACTIVITY_FEED = [
  { id:1, user:"EcoHero99",    userAvatar:"EH", action:"почисти",       place:"Борисова градина", pts:"+120", time:"2мин",  type:"clean"   },
  { id:2, user:"GreenSofia",   userAvatar:"GS", action:"докладва",      place:"Люлин 5",          pts:"+15",  time:"8мин",  type:"report"  },
  { id:3, user:"CleanCity",    userAvatar:"CC", action:"потвърди",      place:"бул. Витоша",      pts:"+30",  time:"15мин", type:"confirm" },
  { id:4, user:"UniVolunteer", userAvatar:"UV", action:"почисти",       place:"Студентски град",  pts:"+40",  time:"1ч",    type:"clean"   },
  { id:5, user:"NadezhDA",     userAvatar:"ND", action:"докладва",      place:"ж.к. Надежда",     pts:"+15",  time:"3ч",    type:"report"  },
  { id:6, user:"EcoHero99",    userAvatar:"EH", action:"получи значка", place:"10 почиствания",   pts:"+50",  time:"5ч",    type:"badge"   },
];

export const BADGES = [
  { id:"first_report",  icon:"sprout", name:"Първи сигнал",     desc:"Докладва първото замърсяване",    earned:true,  pts:15   },
  { id:"first_clean",   icon:"paintbrush", name:"Първо почистване", desc:"Почисти първото замърсяване",     earned:true,  pts:40   },
  { id:"streak_7",      icon:"flame", name:"7-дневен стрийк",  desc:"Активен 7 последователни дни",    earned:true,  pts:100  },
  { id:"clean_10",      icon:"zap", name:"10 почиствания",   desc:"Завърши 10 успешни почиствания",  earned:false, pts:200  },
  { id:"verified",      icon:"badge-check", name:"Verified User",    desc:"Доказана активност и надеждност",  earned:false, pts:500  },
  { id:"eco_legend",    icon:"globe", name:"Еко легенда",      desc:"Достигни 5000 точки",             earned:false, pts:1000 },
  { id:"district_hero", icon:"building", name:"Герой на района",  desc:"Почисти 5 места в един район",    earned:false, pts:300  },
  { id:"team_player",   icon:"users", name:"Екипен играч",     desc:"Потвърди 20 задачи на другите",   earned:false, pts:250  },
];

export const SEVERITY_META = {
  critical: { label:"Критично", color:"#f43f5e", bg:"rgba(244,63,94,0.12)",  border:"rgba(244,63,94,0.3)"   },
  high:     { label:"Сериозно", color:"#fb923c", bg:"rgba(251,146,60,0.12)", border:"rgba(251,146,60,0.3)"  },
  medium:   { label:"Средно",   color:"#f59e0b", bg:"rgba(245,158,11,0.12)", border:"rgba(245,158,11,0.3)"  },
  low:      { label:"Леко",     color:"#34d399", bg:"rgba(52,211,153,0.12)", border:"rgba(52,211,153,0.3)"  },
};

export const STATUS_META = {
  open:          { label:"Отворен",  color:"#60a5fa", bg:"rgba(96,165,250,0.12)" },
  "in-progress": { label:"В процес", color:"#f59e0b", bg:"rgba(245,158,11,0.12)" },
  done:          { label:"Завършен", color:"#34d399", bg:"rgba(52,211,153,0.12)" },
};

export const LEVEL_THRESHOLDS = [
  { level:"НОВИЧ",   icon:"sprout", min:0,    max:499       },
  { level:"АКТИВЕН", icon:"award", min:500,  max:1499      },
  { level:"ПРО",     icon:"medal", min:1500, max:2999      },
  { level:"МАСТЪР",  icon:"gem", min:3000, max:4999      },
  { level:"ЛЕГЕНДА", icon:"trophy", min:5000, max:Infinity  },
];

export const STATS_GLOBAL = {
  totalCleaned:1247, activeVolunteers:83, pointsAwarded:98400,
  districtsActive:14, kgWasteRemoved:3820, co2Saved:94,
};

export const MAP_PINS = [
  {id:1,x:62,y:44},{id:2,x:28,y:30},{id:3,x:51,y:68},
  {id:4,x:74,y:58},{id:5,x:36,y:19},{id:6,x:50,y:48},
];

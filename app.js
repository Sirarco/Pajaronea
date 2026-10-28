/**
 * ============================================================================
 * PAJARONEA - LÓGICA DE APLICACIÓN Y ARQUITECTURA MODULAR
 * ============================================================================
 * Plataforma Profesional de Registro y Monitoreo Biológico · Aves de Chile
 * Firma: Code x VINI (marco.lara.vera@gmail.com)
 * ============================================================================
 */

// 1. ENDPOINT CLOUD VINCULADO
const _EP_KEY = 42;
// URL del Web App de Google Apps Script vinculada a Pajaronea_DB
const _SECURE_CLOUD_BLOB = "https://script.google.com/macros/s/AKfycbyavaJREb62By2cSbo7ViRjFu2MnL7qKmiX_iYa-DYAC8nVpv0I_lFSoq_aifi83UcH/exec";

function getCloudEndpoint() {
  const custom = localStorage.getItem("pajaronea_cloud_ep");
  if (custom && custom.trim().length > 10) return custom.trim();

  if (_SECURE_CLOUD_BLOB && (_SECURE_CLOUD_BLOB.startsWith("http://") || _SECURE_CLOUD_BLOB.startsWith("https://"))) {
    return _SECURE_CLOUD_BLOB.trim();
  }

  try {
    const raw = atob(_SECURE_CLOUD_BLOB);
    let decoded = "";
    for (let i = 0; i < raw.length; i++) {
      decoded += String.fromCharCode(raw.charCodeAt(i) ^ _EP_KEY);
    }
    return decoded;
  } catch (e) {
    return _SECURE_CLOUD_BLOB;
  }
}

// 2. BASE DE DATOS DIDÁCTICA DE 20 AVES DE CHILE
const DEMO_AVES_DB = [
  {
    id: "zorzal",
    nombreChileno: "Zorzal Patagónico",
    nombreCientifico: "Turdus falcklandii",
    nombreIngles: "Austral Thrush",
    zonas: ["Santiago / RM", "Centro", "Sur", "Austral"],
    zonaId: "santiago",
    dieta: "Lombrices de tierra, caracoles y frutitas del jardín 🪱🍇",
    dietaId: "invertebrados",
    tamano: "26 cm (Mediano)",
    tamanoId: "mediano",
    habitat: "Parques, plazas urbanas, jardines de casas y quebradas precordilleranas.",
    entornoId: "parque-urbano",
    datoCurioso: "Es el madrugador por excelencia de Santiago: canta con energía media hora antes de que salga el sol para defender su árbol regalón.",
    comoReconocerla: "Pico y patas de color amarillo anaranjado vivo, pecho pardo anteado y postura erguida sobre el césped buscando lombrices.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Turdus_falcklandii_-Chile-8.jpg/640px-Turdus_falcklandii_-Chile-8.jpg",
    cantoFreq: [650, 780, 920, 840, 720],
    colorPastel: "#FFEBF0"
  },
  {
    id: "chincol",
    nombreChileno: "Chincol",
    nombreCientifico: "Zonotrichia capensis",
    nombreIngles: "Rufous-collared Sparrow",
    zonas: ["Santiago / RM", "Norte", "Centro", "Sur"],
    zonaId: "santiago",
    dieta: "Semillitas del suelo, brotes tiernos y pequeños bichitos 🌾",
    dietaId: "semillas",
    tamano: "14 a 15 cm (Pequeño)",
    tamanoId: "pequeno",
    habitat: "Plazas de barrio, techos, balcones urbanos y laderas de cerros isla.",
    entornoId: "parque-urbano",
    datoCurioso: "Tiene una cresta eréctil y una 'bufanda' rufa (rojiza) en la nuca. Su melodioso silbido de 4 notas parece preguntar: '¿Has visto a mi tío Agustín?'.",
    comoReconocerla: "Corona gris con rayas negras, collar canela rojizo y canto alegre y constante en la ciudad.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Zonotrichia_capensis_chora_macho.jpg/640px-Zonotrichia_capensis_chora_macho.jpg",
    cantoFreq: [1400, 1600, 1850, 2100],
    colorPastel: "#FFF2D9"
  },
  {
    id: "picaflor-chico",
    nombreChileno: "Picaflor Chico (Pingirilo)",
    nombreCientifico: "Sephanoides sephaniodes",
    nombreIngles: "Green-backed Firecrown",
    zonas: ["Santiago / RM", "Centro", "Sur", "Austral"],
    zonaId: "santiago",
    dieta: "Néctar de flores nativas (quintaesencia, chagual) y pequeños mosquitos 🌸🦟",
    dietaId: "nectar-frutas",
    tamano: "9 a 10 cm (Muy pequeño)",
    tamanoId: "muy-pequeno",
    habitat: "Jardines con flores, cerros Santa Lucía y San Cristóbal, y quebradas nativas.",
    entornoId: "cerro-matorral",
    datoCurioso: "Aletea hasta 80 veces por segundo y puede volar hacia atrás o quedar suspendido en el aire como un helicóptero.",
    comoReconocerla: "Dorso verde tornasolado, corona rojiza brillante en machos (vista con luz) y vuelo hiperveloz.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Green-backed_firecrown_%28Sephanoides_sephaniodes%29_male.JPG/640px-Green-backed_firecrown_%28Sephanoides_sephaniodes%29_male.JPG",
    cantoFreq: [2400, 2800, 3100, 2600],
    colorPastel: "#E4FCEE"
  },
  {
    id: "tenca",
    nombreChileno: "Tenca (Endémica de Chile)",
    nombreCientifico: "Mimus thenca",
    nombreIngles: "Chilean Mockingbird",
    zonas: ["Santiago / RM", "Centro Norte", "Centro Sur"],
    zonaId: "santiago",
    dieta: "Insectos del follaje, arañas, bayas y néctar de chaguales 🐛🍇",
    dietaId: "invertebrados",
    tamano: "28 cm (Mediano)",
    tamanoId: "mediano",
    habitat: "Matorral esclerófilo de cerros isla, espinales y parques arbolados.",
    entornoId: "cerro-matorral",
    datoCurioso: "¡Es una imitadora virtuosa! Puede copiar cantos de otras aves, ladridos de perros y sonidos del entorno para marcar territorio.",
    comoReconocerla: "Cola larga que mantiene levantada, ceja blanca muy visible y una elegante línea negra que cruza el ojo.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Mimus_thenca_in_Santiago%2C_Chile.jpg/640px-Mimus_thenca_in_Santiago%2C_Chile.jpg",
    cantoFreq: [850, 1100, 950, 1300, 1050],
    colorPastel: "#F3EBFC"
  },
  {
    id: "queltehue",
    nombreChileno: "Queltehue (Treile)",
    nombreCientifico: "Vanellus chilensis",
    nombreIngles: "Southern Lapwing",
    zonas: ["Santiago / RM", "Norte", "Centro", "Sur", "Austral"],
    zonaId: "santiago",
    dieta: "Lombrices, larvas, grillos y pequeños escarabajos 🪱🦗",
    dietaId: "invertebrados",
    tamano: "35 a 37 cm (Grande)",
    tamanoId: "grande",
    habitat: "Canchas de fútbol, césped de parques, bordes del río Mapocho y humedales.",
    entornoId: "parque-urbano",
    datoCurioso: "Es el guardián más ruidoso de Chile. Si te acercas a sus polluelos en el pasto, volará en picada chillando con espolones rojos en sus alas.",
    comoReconocerla: "Copete largo y fino en la cabeza, antifaz y corbata negros, ojos rojos y vocalización metálica: '¡quel-teh-hue!'.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Vanellus_chilensis_chilensis_Costanera_Sur.JPG/640px-Vanellus_chilensis_chilensis_Costanera_Sur.JPG",
    cantoFreq: [1100, 1350, 1600, 1350],
    colorPastel: "#EBF3FC"
  },
  {
    id: "chercan",
    nombreChileno: "Chercán",
    nombreCientifico: "Troglodytes musculus",
    nombreIngles: "Southern House Wren",
    zonas: ["Santiago / RM", "Norte", "Centro", "Sur"],
    zonaId: "santiago",
    dieta: "Arañitas, orugas y polillas que saca de grietas 🕷️🐛",
    dietaId: "invertebrados",
    tamano: "11 cm (Muy pequeño)",
    tamanoId: "muy-pequeno",
    habitat: "Jardines domésticos, huecos de muros, aleros de casas y matorrales.",
    entornoId: "parque-urbano",
    datoCurioso: "A pesar de su diminuto tamaño, tiene una voz potente y trinada que llena todo el patio; suele construir nidos en buzones y maceteros.",
    comoReconocerla: "Cuerpo redondeado color canela con cola casi siempre apuntando verticalmente hacia arriba y movimientos muy inquietos.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/House_Wren_%28Troglodytes_aedon%29_-_Flickr_-_gregthebusker_%281%29.jpg/640px-House_Wren_%28Troglodytes_aedon%29_-_Flickr_-_gregthebusker_%281%29.jpg",
    cantoFreq: [1800, 2200, 1900, 2400, 2100],
    colorPastel: "#FFF4EB"
  },
  {
    id: "diuca",
    nombreChileno: "Diuca",
    nombreCientifico: "Diuca diuca",
    nombreIngles: "Common Diuca-finch",
    zonas: ["Santiago / RM", "Centro", "Sur"],
    zonaId: "santiago",
    dieta: "Semillas caídas en la tierra y pequeños brotes 🌾",
    dietaId: "semillas",
    tamano: "17 cm (Pequeño)",
    tamanoId: "pequeno",
    habitat: "Plazas de Santiago, caminos de tierra, parcelas y cerros con matorral.",
    entornoId: "parque-urbano",
    datoCurioso: "Su canto dulce al amanecer se asocia en el campo chileno con buen augurio y mañanas de sol.",
    comoReconocerla: "Plumaje gris azulado suave en el lomo, garganta y vientre blanco puro, y un suave tono canela bajo la cola.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Diuca_diuca_diuca.jpg/640px-Diuca_diuca_diuca.jpg",
    cantoFreq: [1200, 1450, 1300, 1550],
    colorPastel: "#F0F0FF"
  },
  {
    id: "loica",
    nombreChileno: "Loica",
    nombreCientifico: "Sturnella loyca",
    nombreIngles: "Long-tailed Meadowlark",
    zonas: ["Santiago / RM", "Norte Chico", "Centro", "Sur", "Austral"],
    zonaId: "santiago",
    dieta: "Semillas, insectos del suelo, larvas y escarabajos 🌾🐛",
    dietaId: "semillas",
    tamano: "25 cm (Mediano)",
    tamanoId: "mediano",
    habitat: "Pastizales abiertos, campos agrícolas y cumbres de cerros como el Manquehue.",
    entornoId: "cerro-matorral",
    datoCurioso: "La leyenda tradicional chilena dice que su pecho rojo encendido se tiñó con sangre al abrigar a un cazador herido.",
    comoReconocerla: "Pecho y garganta rojo escarlata brillante en los machos, ceja blanca sobre el ojo y pico largo y cónico.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Long-tailed_meadowlark_%28Sturnella_loyca_loyca%29_male.JPG/640px-Long-tailed_meadowlark_%28Sturnella_loyca_loyca%29_male.JPG",
    cantoFreq: [900, 1200, 1500, 1100],
    colorPastel: "#FFE8E8"
  },
  {
    id: "tiuque",
    nombreChileno: "Tiuque",
    nombreCientifico: "Milvago chimango",
    nombreIngles: "Chimango Caracara",
    zonas: ["Santiago / RM", "Norte Chico", "Centro", "Sur", "Austral"],
    zonaId: "santiago",
    dieta: "Carroña, roedores, palomas, gusanos y restos orgánicos 🥩🪱",
    dietaId: "rapaz-carnivoro",
    tamano: "38 a 42 cm (Grande/Rapaz)",
    tamanoId: "rapaz",
    habitat: "Postes de luz, autopistas, parques de Santiago, techos y campos abiertos.",
    entornoId: "parque-urbano",
    datoCurioso: "Es el halcón más adaptativo y astuto de la capital. Suele caminar por el pasto buscando bichos como si fuera una gallina.",
    comoReconocerla: "Tono café parduzco estriado, vuelo planeado ágil y una mancha clara visible en la punta de cada ala al volar.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Chimango_Caracara_%28Milvago_chimango%29_male_%2849887752671%29.jpg/640px-Chimango_Caracara_%28Milvago_chimango%29_male_%2849887752671%29.jpg",
    cantoFreq: [800, 950, 750, 600],
    colorPastel: "#FFF1E6"
  },
  {
    id: "cachudito",
    nombreChileno: "Cachudito",
    nombreCientifico: "Anairetes parulus",
    nombreIngles: "Tufted Tit-tyrant",
    zonas: ["Santiago / RM", "Norte", "Centro", "Sur", "Austral"],
    zonaId: "santiago",
    dieta: "Insectos diminutos, pulgones y pequeñas arañas 🦟",
    dietaId: "invertebrados",
    tamano: "11 cm (Muy pequeño)",
    tamanoId: "muy-pequeno",
    habitat: "Follaje alto de árboles nativos, espinos, jardines y quebradas de cerros.",
    entornoId: "cerro-matorral",
    datoCurioso: "Lleva dos plumitas negras curvadas sobre la cabeza que parecen dos 'cachitos', de donde viene su cariñoso nombre chileno.",
    comoReconocerla: "Copete bífido erguido, ojos blancos muy saltones, pecho finamente rayado y movimiento constante entre las hojas.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Tufted_Tit-tyrant_%28Anairetes_parulus_patagonicus%29_%2831863584852%29.jpg/640px-Tufted_Tit-tyrant_%28Anairetes_parulus_patagonicus%29_%2831863584852%29.jpg",
    cantoFreq: [2200, 2500, 2200, 2700],
    colorPastel: "#EEFAEE"
  },
  {
    id: "tortola",
    nombreChileno: "Tórtola Cordillerana / Común",
    nombreCientifico: "Zenaida auriculata",
    nombreIngles: "Eared Dove",
    zonas: ["Santiago / RM", "Norte", "Centro", "Sur"],
    zonaId: "santiago",
    dieta: "Granos caídos, semillas de malezas y migajas 🌾",
    dietaId: "semillas",
    tamano: "24 cm (Mediano)",
    tamanoId: "mediano",
    habitat: "Cables eléctricos, ramas de plátanos orientales, plazas y huertos.",
    entornoId: "parque-urbano",
    datoCurioso: "Su aleteo al despegar produce un silbido característico y su arrullo suave de dos notas es la banda sonora de las tardes santiaguinas.",
    comoReconocerla: "Tono café vináceo suave, dos rayitas negras detrás del ojo y manchitas negras en las alas.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Eared_Dove_%28Zenaida_auriculata_chrysauchenia%29.JPG/640px-Eared_Dove_%28Zenaida_auriculata_chrysauchenia%29.JPG",
    cantoFreq: [450, 400, 480, 420],
    colorPastel: "#FBF0EA"
  },
  {
    id: "chuncho",
    nombreChileno: "Chuncho",
    nombreCientifico: "Glaucidium nana",
    nombreIngles: "Austral Pygmy-owl",
    zonas: ["Santiago / RM", "Centro", "Sur", "Austral"],
    zonaId: "santiago",
    dieta: "Aves pequeñas, ratones de campo, lagartijas y polillas 🥩🦗",
    dietaId: "rapaz-carnivoro",
    tamano: "19 a 21 cm (Pequeño/Rapaz)",
    tamanoId: "pequeno",
    habitat: "Quebradas del Cajón del Maipo, cerro San Cristóbal y bosques nativos.",
    entornoId: "cerro-matorral",
    datoCurioso: "Tiene plumas en la nuca que simulan dos ojos falsos ('ocelos') para engañar a posibles atacantes por la espalda.",
    comoReconocerla: "Lechuza diminuta con ojos amarillos penetrantes y silueta rechoncha sin orejitas de plumas.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Austral_Pygmy_Owl_%28Glaucidium_nana%29_%2832049447477%29.jpg/640px-Austral_Pygmy_Owl_%28Glaucidium_nana%29_%2832049447477%29.jpg",
    cantoFreq: [720, 720, 720, 720],
    colorPastel: "#F8ECF8"
  },
  {
    id: "lechuza",
    nombreChileno: "Lechuza Blanca",
    nombreCientifico: "Tyto alba",
    nombreIngles: "Barn Owl",
    zonas: ["Santiago / RM", "Norte", "Centro", "Sur"],
    zonaId: "santiago",
    dieta: "Ratones, lauchas y polillas nocturnas 🐁 (controlador biológico clave)",
    dietaId: "rapaz-carnivoro",
    tamano: "36 cm (Grande/Rapaz)",
    tamanoId: "rapaz",
    habitat: "Campanarios de iglesias históricas, galpones rurales y palmeras altas de Santiago.",
    entornoId: "parque-urbano",
    datoCurioso: "Su disco facial en forma de corazón canaliza el sonido hacia sus oídos asimétricos, permitiéndole cazar ratones en total oscuridad.",
    comoReconocerla: "Cara blanca acorazonada, pecho blanco inmaculado y vuelo fantasmal absolutamente silencioso.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Tyto_alba_-British_Wildlife_Centre%2C_Surrey%2C_England-8a_%281%29.jpg/640px-Tyto_alba_-British_Wildlife_Centre%2C_Surrey%2C_England-8a_%281%29.jpg",
    cantoFreq: [1600, 1400, 1200, 900],
    colorPastel: "#FDF8F0"
  },
  {
    id: "peuco",
    nombreChileno: "Peuco",
    nombreCientifico: "Parabuteo unicinctus",
    nombreIngles: "Harris's Hawk",
    zonas: ["Santiago / RM", "Norte Chico", "Centro", "Sur"],
    zonaId: "santiago",
    dieta: "Palomas urbanas, conejos, roedores y reptiles 🥩",
    dietaId: "rapaz-carnivoro",
    tamano: "48 a 55 cm (Grande/Rapaz)",
    tamanoId: "rapaz",
    habitat: "Parque Metropolitano, Parque O'Higgins, cerro Manquehue y quebradas.",
    entornoId: "cerro-matorral",
    datoCurioso: "Se le conoce como 'los lobos del aire' porque es una de las poquísimas rapaces que caza cooperativamente en grupos familiares.",
    comoReconocerla: "Plumaje café oscuro con llamativos 'hombros' y muslos castaño rojizos, y base de la cola blanca brillante.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Parabuteo_unicinctus_-Sherman_Oaks%2C_California-8.jpg/640px-Parabuteo_unicinctus_-Sherman_Oaks%2C_California-8.jpg",
    cantoFreq: [950, 850, 750],
    colorPastel: "#F5EFEB"
  },
  {
    id: "sietecolores",
    nombreChileno: "Sietecolores",
    nombreCientifico: "Tachuris rubrigastra",
    nombreIngles: "Many-colored Rush-tyrant",
    zonas: ["Santiago / RM", "Norte", "Centro", "Sur"],
    zonaId: "santiago",
    dieta: "Insectos acuáticos, larvas de libélulas y mosquitos 🦟",
    dietaId: "invertebrados",
    tamano: "10 cm (Muy pequeño)",
    tamanoId: "muy-pequeno",
    habitat: "Totorares y juncos de humedales (Humedal de Batuco, Laguna Carén, Parque Bicentenario).",
    entornoId: "humedal-laguna",
    datoCurioso: "¡Fue la inspiración del pájaro Fiu! Su plumaje combina azul, amarillo, verde, blanco, negro, rojo y canela.",
    comoReconocerla: "Diminuto y acrobático en los juncos, con corona negra y azul con cresta roja semioculta, vientre amarillo brillante y antifaz.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Many-colored_Rush-tyrant_%28Tachuris_rubrigastra%29_%2833077755938%29.jpg/640px-Many-colored_Rush-tyrant_%28Tachuris_rubrigastra%29_%2833077755938%29.jpg",
    cantoFreq: [2100, 2400, 2700, 2300],
    colorPastel: "#FEFDE6"
  },
  {
    id: "martin-pescador",
    nombreChileno: "Martín Pescador",
    nombreCientifico: "Megaceryle torquata",
    nombreIngles: "Ringed Kingfisher",
    zonas: ["Santiago / RM", "Centro", "Sur", "Austral"],
    zonaId: "santiago",
    dieta: "Peces de agua dulce, ranas y crustáceos de río 🐟",
    dietaId: "rapaz-carnivoro",
    tamano: "40 a 44 cm (Grande)",
    tamanoId: "grande",
    habitat: "Ribera del río Mapocho en zonas altas, río Maipo y lagunas.",
    entornoId: "humedal-laguna",
    datoCurioso: "Se lanza en picada como un proyectil al agua cerrando una membrana especial en sus ojos para no encandilarse con los reflejos.",
    comoReconocerla: "Enorme pico negro como puñal, cresta alborotada azul pizarra y vientre canela rojizo intenso.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Ringed_kingfisher_%28Megaceryle_torquata_torquata%29_female.JPG/640px-Ringed_kingfisher_%28Megaceryle_torquata_torquata%29_female.JPG",
    cantoFreq: [1300, 1100, 1300, 1100],
    colorPastel: "#E5F2FF"
  },
  {
    id: "condor",
    nombreChileno: "Cóndor Andino",
    nombreCientifico: "Vultur gryphus",
    nombreIngles: "Andean Condor",
    zonas: ["Santiago / RM", "Cordillera de todo Chile"],
    zonaId: "santiago",
    dieta: "Carroña de guanacos, vacunos y animales de alta montaña 🥩",
    dietaId: "rapaz-carnivoro",
    tamano: "120 cm de alto y más de 3 metros de envergadura (Muy grande)",
    tamanoId: "rapaz",
    habitat: "Acantilados y riscos de la Cordillera de los Andes (Farellones, El Yeso, Valle Nevado).",
    entornoId: "cordillera",
    datoCurioso: "Es una de las aves voladoras más grandes del planeta. Puede recorrer más de 200 km al día aprovechando corrientes térmicas casi sin batir alas.",
    comoReconocerla: "Silueta colosal con plumas 'dedos' en la punta de las alas, collar blanco puro de plumón en la base del cuello y cabeza desnuda.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Vultur_gryphus_-Doue-la-Fontaine_Zoo%2C_Maine-et-Loire%2C_France_-male-8a.jpg/640px-Vultur_gryphus_-Doue-la-Fontaine_Zoo%2C_Maine-et-Loire%2C_France_-male-8a.jpg",
    cantoFreq: [300, 250, 200],
    colorPastel: "#F4F0FA"
  },
  {
    id: "carpinterito",
    nombreChileno: "Carpinterito",
    nombreCientifico: "Veniliornis lignarius",
    nombreIngles: "Striped Woodpecker",
    zonas: ["Santiago / RM", "Centro", "Sur"],
    zonaId: "santiago",
    dieta: "Larvas de escarabajos que perforan troncos nativos 🐛",
    dietaId: "invertebrados",
    tamano: "15 a 16 cm (Pequeño)",
    tamanoId: "pequeno",
    habitat: "Bosques de espinos, quebradas de la precordillera y cerros arbolados.",
    entornoId: "cerro-matorral",
    datoCurioso: "Golpetea los troncos a un ritmo vertiginoso; su cráneo tiene huesos esponjosos diseñados para amortiguar los golpes sin sufrir conmoción.",
    comoReconocerla: "Dorso listado de blanco y negro como un código de barras; los machos llevan una llamativa mancha roja en la nuca.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Striped_Woodpecker_%28Veniliornis_lignarius%29_%2810892702735%29.jpg/640px-Striped_Woodpecker_%28Veniliornis_lignarius%29_%2810892702735%29.jpg",
    cantoFreq: [1500, 1800, 2100, 1800],
    colorPastel: "#FFF5EB"
  },
  {
    id: "canastero",
    nombreChileno: "Canastero Común",
    nombreCientifico: "Pseudasthenes humicola",
    nombreIngles: "Dusky-tailed Canastero",
    zonas: ["Santiago / RM", "Centro Norte", "Centro Sur"],
    zonaId: "santiago",
    dieta: "Insectos y escarabajos del suelo y ramas bajas 🦗",
    dietaId: "invertebrados",
    tamano: "15 cm (Pequeño)",
    tamanoId: "pequeno",
    habitat: "Laderas áridas de cerros isla con chaguales, cactus y espinos.",
    entornoId: "cerro-matorral",
    datoCurioso: "Se llama canastero porque teje un impresionante nido globular de ramitas espinosas de hasta medio metro, con entrada lateral protegida.",
    comoReconocerla: "Garganta blanca moteada de negro, pecho estriado y cola oscura que sostiene tiesa mientras corretea entre piedras.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Dusky-tailed_Canastero_%28Pseudasthenes_humicola%29_%2849887232243%29.jpg/640px-Dusky-tailed_Canastero_%28Pseudasthenes_humicola%29_%2849887232243%29.jpg",
    cantoFreq: [1350, 1600, 1400, 1750],
    colorPastel: "#FBF3EC"
  },
  {
    id: "tagua",
    nombreChileno: "Tagua Común",
    nombreCientifico: "Fulica armillata",
    nombreIngles: "Red-gartered Coot",
    zonas: ["Santiago / RM", "Centro", "Sur", "Austral"],
    zonaId: "santiago",
    dieta: "Algas, plantas acuáticas sumergidas y pequeños invertebrados 🌿",
    dietaId: "semillas",
    tamano: "45 cm (Grande)",
    tamanoId: "grande",
    habitat: "Lagunas artificiales (Parque Araucano, O'Higgins, Quinta Normal) y tranques.",
    entornoId: "humedal-laguna",
    datoCurioso: "Aunque parece un pato, no tiene patas palmeadas, sino dedos con lóbulos membranosos que le permiten caminar sobre la vegetación flotante.",
    comoReconocerla: "Cuerpo totalmente negro apizarrado con escudo frontal amarillo con manchas rojas en la base y pico amarillo.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Red-gartered_Coot_%28Fulica_armillata%29_%2850754877793%29.jpg/640px-Red-gartered_Coot_%28Fulica_armillata%29_%2850754877793%29.jpg",
    cantoFreq: [650, 750, 600, 700],
    colorPastel: "#E8F0F8"
  }
];

// 3. ESTADO GLOBAL DE LA APLICACIÓN
const AppState = {
  viewMode: "landing", // "landing" | "demo" | "connected"
  currentUser: "Invitado",
  allBirds: [...DEMO_AVES_DB],
  sightingsMap: new Map(),
  activeFilters: {
    search: "",
    zone: "Todos",
    diet: "Todos",
    habitat: "Todos",
    size: "Todos",
    statusTab: "unseen"
  },
  isApiLoading: false,
  audioContext: null,
  activeAudioBirdId: null
};

// 4. INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  loadLocalDemoState();
  
  const savedUser = sessionStorage.getItem("pajaronea_logged_user");
  const savedMode = sessionStorage.getItem("pajaronea_mode");
  if (savedUser && savedMode) {
    AppState.currentUser = savedUser;
    AppState.viewMode = savedMode;
    if (savedMode === "connected") {
      fetchUserSightingsFromCloud(savedUser);
    }
  }

  renderNavigationState();
  bindGlobalEvents();
}

// 5. CAMBIO DE MODO Y CARGA AUTOMÁTICA DE API
function switchAppMode(mode, user = "Observador/a") {
  AppState.viewMode = mode;
  AppState.currentUser = user;
  sessionStorage.setItem("pajaronea_mode", mode);
  sessionStorage.setItem("pajaronea_logged_user", user);

  renderNavigationState();
  if (mode !== "landing") {
    renderFilters();
    renderBirdCards();
    updateDashboardCounters();

    // REQUERIMIENTO EXPLÍCITO: Carga automática de la API al entrar con clave o demo
    loadFullChileanBirdsApi();
  }
}

function renderNavigationState() {
  const landingSection = document.getElementById("landing-section");
  const mainAppSection = document.getElementById("main-app-section");
  const userGreetingElem = document.getElementById("user-greeting");
  const userGreetingMobile = document.getElementById("user-greeting-mobile");
  const modeBadgeElem = document.getElementById("mode-badge");

  if (AppState.viewMode === "landing") {
    landingSection.classList.remove("hidden");
    mainAppSection.classList.add("hidden");
  } else {
    landingSection.classList.add("hidden");
    mainAppSection.classList.remove("hidden");

    const greetingText = `Hola, ${AppState.currentUser} 👋`;
    if (userGreetingElem) userGreetingElem.textContent = greetingText;
    if (userGreetingMobile) userGreetingMobile.textContent = greetingText;

    if (modeBadgeElem) {
      if (AppState.viewMode === "demo") {
        modeBadgeElem.className = "px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1.5";
        modeBadgeElem.innerHTML = "<span>🎮</span><span>Modo Demostración</span>";
      } else {
        modeBadgeElem.className = "px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1.5";
        modeBadgeElem.innerHTML = "<span>☁️</span><span>Base de Datos Conectada</span>";
      }
    }
  }
}

function logoutToLanding() {
  AppState.viewMode = "landing";
  AppState.currentUser = "Invitado";
  sessionStorage.removeItem("pajaronea_logged_user");
  sessionStorage.removeItem("pajaronea_mode");
  renderNavigationState();
  showToast("Sesión finalizada 🍃", "Has vuelto a la pantalla principal.");
}

// 6. AUTENTICACIÓN NUMÉRICA
async function handleNumericPasswordLogin(event) {
  if (event) event.preventDefault();
  const passInput = document.getElementById("input-password");
  const password = passInput ? passInput.value.trim() : "";

  if (!password) {
    showToast("Clave requerida 🔑", "Por favor ingresa tu código numérico de acceso.");
    return;
  }

  // REQUERIMIENTO: La clave debe ser estrictamente numérica
  if (!/^\d+$/.test(password)) {
    showToast("Clave inválida ⚠️", "La contraseña debe ser exclusivamente numérica (ej. 2024).");
    return;
  }

  const btnLogin = document.getElementById("btn-login-submit");
  if (btnLogin) {
    btnLogin.disabled = true;
    btnLogin.innerHTML = `<span>⏳ Verificando credencial...</span>`;
  }

  const endpoint = getCloudEndpoint();

  // Validación local inmediata para credenciales de acceso rápido predeterminadas
  if (password === "2024" || password === "2026" || password === "1234") {
    const user = password === "2024" ? "Marco" : (password === "2026" ? "Pajarero RM" : "Observador General");
    showToast("¡Acceso verificado! 🌟", `Hola, ${user}`);
    switchAppMode("connected", user);
    if (endpoint) {
      fetchUserSightingsFromCloud(user);
    }
    if (btnLogin) {
      btnLogin.disabled = false;
      btnLogin.innerHTML = `<span>Ingresar a mi Bitácora</span><span>✨</span>`;
    }
    return;
  }

  // Si hay endpoint configurado, validar en el repositorio central
  if (endpoint) {
    try {
      const response = await fetch(`${endpoint}?action=login&password=${encodeURIComponent(password)}`, {
        method: "GET"
      });
      const result = await response.json();

      if (result && result.success) {
        showToast("¡Acceso concedido! 🐦", `Hola, ${result.user}`);
        switchAppMode("connected", result.user);
        fetchUserSightingsFromCloud(result.user);
      } else {
        showToast("Acceso denegado 🔒", result.error || "Código numérico no registrado.");
      }
    } catch (err) {
      console.warn("Fallo de conexión externa, verificando credenciales locales:", err);
      showToast("Acceso denegado 🔒", "Código numérico no reconocido.");
    } finally {
      if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.innerHTML = `<span>Ingresar a mi Bitácora</span><span>✨</span>`;
      }
    }
  } else {
    showToast("Código no válido ❌", "Prueba con la clave numérica autorizada 2024.");
    if (btnLogin) {
      btnLogin.disabled = false;
      btnLogin.innerHTML = `<span>Ingresar a mi Bitácora</span><span>✨</span>`;
    }
  }
}

// 7. CARGA AUTOMÁTICA DE LA API EXTENDIDA DE AVES DE CHILE
async function loadFullChileanBirdsApi() {
  if (AppState.isApiLoading) return;
  AppState.isApiLoading = true;

  try {
    const res = await fetch("https://aves.ninjas.cl/api/birds");
    if (!res.ok) throw new Error("Fallo al consultar la API de aves.");
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      // 1. Mapear aves de la API y crear un mapa por nombre científico normalizado
      const apiByLatin = new Map();
      const apiBySpanish = new Map();

      data.forEach((b, index) => {
        const latin = (b.name && b.name.latin ? b.name.latin : "").toLowerCase().trim();
        const spanish = (b.name && b.name.spanish ? b.name.spanish : "").toLowerCase().trim();
        const fotoUrl = (b.images && (b.images.main || b.images.full || b.images.thumb)) || "";
        if (latin) apiByLatin.set(latin, { b, fotoUrl });
        if (spanish) apiBySpanish.set(spanish, { b, fotoUrl });
      });

      // 2. Actualizar las 20 aves iniciales con las fotos auténticas de aves.ninjas.cl
      DEMO_AVES_DB.forEach(ave => {
        const latinKey = (ave.nombreCientifico || "").toLowerCase().trim();
        const spanishKey = (ave.nombreChileno || "").toLowerCase().trim();
        let match = apiByLatin.get(latinKey);
        if (!match) {
          // Búsqueda por coincidencia parcial de nombre
          for (let [spKey, val] of apiBySpanish.entries()) {
            if (spanishKey.includes(spKey) || spKey.includes(spanishKey.split(' ')[0])) {
              match = val;
              break;
            }
          }
        }
        if (match && match.fotoUrl) {
          ave.foto = match.fotoUrl;
        }
      });

      // 3. Crear lista de aves adicionales desde la API
      const mappedBirds = data.map((b, index) => {
        const nombreChileno = (b.name && b.name.spanish) ? b.name.spanish : (b.spanish_name || b.name || "Ave de Chile");
        const nombreCientifico = (b.name && b.name.latin) ? b.name.latin : "Especie nativa";
        const nombreIngles = (b.name && b.name.english) ? b.name.english : "";
        const fotoUrl = (b.images && (b.images.main || b.images.full || b.images.thumb)) || "";

        const isSantiago = isBirdCommonInSantiago(nombreChileno, nombreCientifico);
        const inferredDiet = inferDiet(nombreChileno, nombreCientifico);
        const inferredHabitat = inferHabitat(nombreChileno, isSantiago);
        const inferredSize = inferSize(nombreChileno);

        return {
          id: b.uid || `ninja-${index}`,
          nombreChileno: nombreChileno,
          nombreCientifico: nombreCientifico,
          nombreIngles: nombreIngles,
          zonas: isSantiago ? ["Santiago / RM", "Centro"] : ["Chile General"],
          zonaId: isSantiago ? "santiago" : "general",
          dieta: inferredDiet.label,
          dietaId: inferredDiet.id,
          tamano: inferredSize.label,
          tamanoId: inferredSize.id,
          habitat: inferredHabitat.label,
          entornoId: inferredHabitat.id,
          datoCurioso: `Ave nativa observada en ecosistemas chilenos. Ficha técnica integrada desde la API pública de Aves de Chile.`,
          comoReconocerla: `Identificable en campo por su morfología y distribución registrada en Buscaves.cl y aves.ninjas.cl.`,
          foto: fotoUrl,
          cantoFreq: [800, 1100, 1300, 950],
          colorPastel: "#F3EBFC"
        };
      });

      // Evitar duplicar las 20 aves iniciales
      const initialLatinSet = new Set(DEMO_AVES_DB.map(a => (a.nombreCientifico || "").toLowerCase().trim()));
      const newFromApi = mappedBirds.filter(b => !initialLatinSet.has((b.nombreCientifico || "").toLowerCase().trim()));

      AppState.allBirds = [...DEMO_AVES_DB, ...newFromApi];
      renderFilters();
      renderBirdCards();
      updateDashboardCounters();
    }
  } catch (err) {
    console.warn("API externa no disponible temporalmente, operando con catálogo nativo:", err);
  } finally {
    AppState.isApiLoading = false;
  }
}

function isBirdCommonInSantiago(nombre, latin) {
  const santiagoKeywords = ["zorzal", "chincol", "tenca", "queltehue", "chercan", "diuca", "loica", "tiuque", "cachudito", "tortola", "chuncho", "peuco", "sietecolores", "lechuza", "tagua", "condor", "carpinterito", "canastero", "picaflor", "paloma", "gorrion", "chirigue", "tordo", "garza", "jote", "aguilucho", "cernicalo"];
  const n = (nombre + " " + latin).toLowerCase();
  return santiagoKeywords.some(k => n.includes(k));
}

function inferDiet(nombre, latin) {
  const n = (nombre + " " + latin).toLowerCase();
  if (n.includes("picaflor")) return { id: "nectar-frutas", label: "Néctar de flores y pequeños mosquitos 🌸" };
  if (n.includes("halcon") || n.includes("aguila") || n.includes("peuco") || n.includes("tiuque") || n.includes("lechuza") || n.includes("chuncho") || n.includes("bubo") || n.includes("condor") || n.includes("jote")) {
    return { id: "rapaz-carnivoro", label: "Carroña, roedores y presas menores 🥩" };
  }
  if (n.includes("pescador") || n.includes("gaviota") || n.includes("pato") || n.includes("garza") || n.includes("cormoran") || n.includes("pingüino") || n.includes("albatros")) {
    return { id: "rapaz-carnivoro", label: "Peces, crustáceos y fauna acuática 🐟" };
  }
  if (n.includes("chincol") || n.includes("diuca") || n.includes("jilguero") || n.includes("chirigue") || n.includes("tortola") || n.includes("semillero")) {
    return { id: "semillas", label: "Semillas de campo, granos y brotes 🌾" };
  }
  return { id: "invertebrados", label: "Insectos, orugas, lombrices y larvas 🐛" };
}

function inferHabitat(nombre, isStgo) {
  const n = nombre.toLowerCase();
  if (n.includes("condor") || n.includes("cordillerano") || n.includes("dormilona")) {
    return { id: "cordillera", label: "Alta cordillera y quebradas andinas 🏔️" };
  }
  if (n.includes("pato") || n.includes("tagua") || n.includes("garza") || n.includes("gaviota") || n.includes("sietecolores") || n.includes("flamenco") || n.includes("cisne")) {
    return { id: "humedal-laguna", label: "Humedales, lagunas, ríos y costas 🦆" };
  }
  if (n.includes("chucao") || n.includes("hued") || n.includes("carpintero") || n.includes("rayadito")) {
    return { id: "bosque", label: "Bosque nativo templado y esclerófilo 🌲" };
  }
  if (isStgo) {
    return { id: "parque-urbano", label: "Plazas, jardines y parques de Santiago 🌳" };
  }
  return { id: "cerro-matorral", label: "Laderas de cerros isla y matorral nativo ⛰️" };
}

function inferSize(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes("condor") || n.includes("ñandu") || n.includes("albatros") || n.includes("cisne") || n.includes("flamenco")) {
    return { id: "rapaz", label: "Muy Grande (> 80 cm)" };
  }
  if (n.includes("peuco") || n.includes("aguila") || n.includes("tiuque") || n.includes("lechuza") || n.includes("queltehue") || n.includes("garza") || n.includes("pato") || n.includes("tagua")) {
    return { id: "grande", label: "Grande (35 a 70 cm)" };
  }
  if (n.includes("zorzal") || n.includes("tenca") || n.includes("loica") || n.includes("tortola") || n.includes("tordo") || n.includes("turca")) {
    return { id: "mediano", label: "Mediano (18 a 30 cm)" };
  }
  if (n.includes("picaflor") || n.includes("cachudito") || n.includes("chercan")) {
    return { id: "muy-pequeno", label: "Muy pequeño (8 a 12 cm)" };
  }
  return { id: "pequeno", label: "Pequeño (13 a 17 cm)" };
}

// 8. SINCRONIZACIÓN CON EL REPOSITORIO CENTRAL
async function fetchUserSightingsFromCloud(user) {
  const endpoint = getCloudEndpoint();
  if (!endpoint || !user) return;

  try {
    const res = await fetch(`${endpoint}?action=getSightings&user=${encodeURIComponent(user)}`);
    const data = await res.json();
    if (data && data.success && Array.isArray(data.sightings)) {
      AppState.sightingsMap.clear();
      data.sightings.forEach(s => {
        AppState.sightingsMap.set(s.idAve, {
          id: s.id,
          fechaHora: s.fechaHora,
          urlFotoDrive: s.urlFotoDrive,
          notas: s.notas
        });
      });
      renderBirdCards();
      updateDashboardCounters();
    }
  } catch (err) {
    console.error("Error sincronizando registros de campo:", err);
  }
}

async function syncSightingToCloud(birdId, isAdding, optionalBase64Image = null, notes = "") {
  const ave = AppState.allBirds.find(a => a.id === birdId);
  const birdName = ave ? ave.nombreChileno : birdId;
  const endpoint = getCloudEndpoint();

  if (AppState.viewMode === "demo" || !endpoint) {
    if (isAdding) {
      const now = new Date();
      const fechaHora = now.toLocaleDateString("es-CL") + " " + now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
      AppState.sightingsMap.set(birdId, {
        id: "LOCAL_" + Date.now(),
        fechaHora: fechaHora,
        urlFotoDrive: optionalBase64Image || (AppState.sightingsMap.get(birdId) ? AppState.sightingsMap.get(birdId).urlFotoDrive : ""),
        notas: notes || "Registro de campo en modo demostración"
      });
    } else {
      AppState.sightingsMap.delete(birdId);
    }
    saveLocalDemoState();
    renderBirdCards();
    updateDashboardCounters();
    return;
  }

  try {
    showToast("Sincronizando ☁️", isAdding ? "Guardando en la base de datos..." : "Actualizando registro...");
    const payload = {
      action: isAdding ? "addSighting" : "removeSighting",
      user: AppState.currentUser,
      birdId: birdId,
      birdName: birdName,
      notes: notes,
      imageBase64: optionalBase64Image
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data && data.success) {
      if (isAdding && data.sighting) {
        AppState.sightingsMap.set(birdId, {
          id: data.sighting.id,
          fechaHora: data.sighting.fechaHora,
          urlFotoDrive: data.sighting.urlFotoDrive,
          notas: data.sighting.notas
        });
      } else if (!isAdding) {
        AppState.sightingsMap.delete(birdId);
      }
      renderBirdCards();
      updateDashboardCounters();
      showToast(isAdding ? "¡Registrado con éxito! ⭐" : "Desmarcado correctamente 🍃", `${birdName} actualizado.`);
    } else {
      showToast("Aviso de sincronización ⚠️", data.error || "No fue posible actualizar el servidor.");
    }
  } catch (err) {
    console.error("Error al sincronizar con el servidor:", err);
    showToast("Almacenamiento local 📱", "Guardado de forma segura en tu dispositivo.");
    if (isAdding) {
      AppState.sightingsMap.set(birdId, {
        id: "TEMP_" + Date.now(),
        fechaHora: new Date().toLocaleString("es-CL"),
        urlFotoDrive: optionalBase64Image || "",
        notas: notes
      });
    } else {
      AppState.sightingsMap.delete(birdId);
    }
    renderBirdCards();
    updateDashboardCounters();
  }
}

// 9. MOTOR BIOACÚSTICO / REPRODUCCIÓN DEL CANTO DEL AVE
function playBirdSong(birdId) {
  const ave = AppState.allBirds.find(a => a.id === birdId);
  if (!ave) return;

  AppState.activeAudioBirdId = birdId;
  renderBirdCards();

  // 1. Inicializar contexto de audio si no existe
  if (!AppState.audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    AppState.audioContext = new AudioContextClass();
  }

  if (AppState.audioContext.state === "suspended") {
    AppState.audioContext.resume();
  }

  showToast("Reproduciendo canto 🎵", `Escuchando vocalización de ${ave.nombreChileno}...`);

  // Sintetizador acústico melódico calibrado para el ave
  const ctx = AppState.audioContext;
  const freqs = ave.cantoFreq || [1000, 1300, 1100, 1400];
  let time = ctx.currentTime + 0.05;

  freqs.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = idx % 2 === 0 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(f, time);
    osc.frequency.exponentialRampToValueAtTime(f * 1.15, time + 0.18);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.18, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.24);

    time += 0.26;
  });

  // Repetir estrofa una vez para naturalidad
  time += 0.15;
  freqs.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(f, time);
    osc.frequency.exponentialRampToValueAtTime(f * 1.08, time + 0.16);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.16, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.20);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.22);

    time += 0.24;
  });

  setTimeout(() => {
    if (AppState.activeAudioBirdId === birdId) {
      AppState.activeAudioBirdId = null;
      renderBirdCards();
    }
  }, (time - ctx.currentTime) * 1000 + 400);
}

// 10. RENDERIZADO DE FILTROS PEDAGÓGICOS
function renderFilters() {
  const container = document.getElementById("filters-container");
  if (!container) return;

  container.innerHTML = `
    <div class="relative w-full max-w-md mx-auto mb-3">
      <input 
        type="text" 
        id="search-input"
        value="${AppState.activeFilters.search}"
        placeholder="Buscar por nombre chileno, científico o apodo..."
        class="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border-2 border-pink-200 text-xs sm:text-sm focus:outline-none focus:border-pink-400 shadow-xs transition"
        oninput="handleSearchInput(this.value)"
      />
      <span class="absolute left-3.5 top-3 text-sm text-pink-400">🔍</span>
      ${AppState.activeFilters.search ? `
        <button onclick="clearSearch()" class="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center">✕</button>
      ` : ''}
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
      <div class="bg-white/80 p-2 rounded-2xl border border-pink-100 flex flex-col gap-1 shadow-2xs">
        <label class="font-extrabold text-[#7D6C85] flex items-center gap-1 text-[11px]">
          <span>📍</span> Zona:
        </label>
        <select 
          onchange="handleFilterChange('zone', this.value)"
          class="bg-pink-50/60 rounded-xl px-2 py-1.5 text-xs font-semibold text-[#48384E] border border-pink-200 focus:outline-none"
        >
          <option value="Todos" ${AppState.activeFilters.zone === 'Todos' ? 'selected' : ''}>Todas las zonas</option>
          <option value="santiago" ${AppState.activeFilters.zone === 'santiago' ? 'selected' : ''}>Santiago / RM 🏙️</option>
          <option value="centro" ${AppState.activeFilters.zone === 'centro' ? 'selected' : ''}>Zona Central 🍇</option>
          <option value="sur" ${AppState.activeFilters.zone === 'sur' ? 'selected' : ''}>Zona Sur 🌲</option>
          <option value="norte" ${AppState.activeFilters.zone === 'norte' ? 'selected' : ''}>Zona Norte 🏜️</option>
        </select>
      </div>

      <div class="bg-white/80 p-2 rounded-2xl border border-purple-100 flex flex-col gap-1 shadow-2xs">
        <label class="font-extrabold text-[#7D6C85] flex items-center gap-1 text-[11px]">
          <span>🍽️</span> Alimentación:
        </label>
        <select 
          onchange="handleFilterChange('diet', this.value)"
          class="bg-purple-50/60 rounded-xl px-2 py-1.5 text-xs font-semibold text-[#48384E] border border-purple-200 focus:outline-none"
        >
          <option value="Todos" ${AppState.activeFilters.diet === 'Todos' ? 'selected' : ''}>Cualquier dieta</option>
          <option value="semillas" ${AppState.activeFilters.diet === 'semillas' ? 'selected' : ''}>Semillas (Granívoro) 🌾</option>
          <option value="invertebrados" ${AppState.activeFilters.diet === 'invertebrados' ? 'selected' : ''}>Bichitos / Lombrices 🐛</option>
          <option value="nectar-frutas" ${AppState.activeFilters.diet === 'nectar-frutas' ? 'selected' : ''}>Néctar y Flores 🌸</option>
          <option value="rapaz-carnivoro" ${AppState.activeFilters.diet === 'rapaz-carnivoro' ? 'selected' : ''}>Rapaces y Carnívoros 🥩</option>
        </select>
      </div>

      <div class="bg-white/80 p-2 rounded-2xl border border-emerald-100 flex flex-col gap-1 shadow-2xs">
        <label class="font-extrabold text-[#7D6C85] flex items-center gap-1 text-[11px]">
          <span>🏡</span> Entorno / Hábitat:
        </label>
        <select 
          onchange="handleFilterChange('habitat', this.value)"
          class="bg-emerald-50/60 rounded-xl px-2 py-1.5 text-xs font-semibold text-[#48384E] border border-emerald-200 focus:outline-none"
        >
          <option value="Todos" ${AppState.activeFilters.habitat === 'Todos' ? 'selected' : ''}>Cualquier entorno</option>
          <option value="parque-urbano" ${AppState.activeFilters.habitat === 'parque-urbano' ? 'selected' : ''}>Parques de Santiago 🌳</option>
          <option value="cerro-matorral" ${AppState.activeFilters.habitat === 'cerro-matorral' ? 'selected' : ''}>Cerros isla y matorral ⛰️</option>
          <option value="humedal-laguna" ${AppState.activeFilters.habitat === 'humedal-laguna' ? 'selected' : ''}>Humedal / Laguna 🦆</option>
          <option value="cordillera" ${AppState.activeFilters.habitat === 'cordillera' ? 'selected' : ''}>Cordillera de los Andes 🏔️</option>
        </select>
      </div>

      <div class="bg-white/80 p-2 rounded-2xl border border-amber-100 flex flex-col gap-1 shadow-2xs">
        <label class="font-extrabold text-[#7D6C85] flex items-center gap-1 text-[11px]">
          <span>📏</span> Tamaño relativo:
        </label>
        <select 
          onchange="handleFilterChange('size', this.value)"
          class="bg-amber-50/60 rounded-xl px-2 py-1.5 text-xs font-semibold text-[#48384E] border border-amber-200 focus:outline-none"
        >
          <option value="Todos" ${AppState.activeFilters.size === 'Todos' ? 'selected' : ''}>Todos los tamaños</option>
          <option value="muy-pequeno" ${AppState.activeFilters.size === 'muy-pequeno' ? 'selected' : ''}>Muy pequeño (< 12 cm) 🐥</option>
          <option value="pequeno" ${AppState.activeFilters.size === 'pequeno' ? 'selected' : ''}>Pequeño (12-18 cm) 🐦</option>
          <option value="mediano" ${AppState.activeFilters.size === 'mediano' ? 'selected' : ''}>Mediano (18-30 cm) 🦅</option>
          <option value="grande" ${AppState.activeFilters.size === 'grande' ? 'selected' : ''}>Grande (> 30 cm) 🪶</option>
          <option value="rapaz" ${AppState.activeFilters.size === 'rapaz' ? 'selected' : ''}>Rapaces / Envergadura 🦉</option>
        </select>
      </div>
    </div>

    ${hasActiveFilters() ? `
      <div class="flex justify-center mt-2.5">
        <button 
          onclick="resetAllFilters()"
          class="text-[11px] font-bold text-pink-600 bg-pink-100/70 hover:bg-pink-200 px-3 py-1 rounded-full transition flex items-center gap-1"
        >
          <span>✕</span> Limpiar todos los filtros
        </button>
      </div>
    ` : ''}
  `;
}

function hasActiveFilters() {
  const f = AppState.activeFilters;
  return f.search !== "" || f.zone !== "Todos" || f.diet !== "Todos" || f.habitat !== "Todos" || f.size !== "Todos";
}

function handleSearchInput(val) {
  AppState.activeFilters.search = val;
  renderBirdCards();
}

function clearSearch() {
  AppState.activeFilters.search = "";
  renderFilters();
  renderBirdCards();
}

function handleFilterChange(filterKey, val) {
  AppState.activeFilters[filterKey] = val;
  renderFilters();
  renderBirdCards();
}

function resetAllFilters() {
  AppState.activeFilters.search = "";
  AppState.activeFilters.zone = "Todos";
  AppState.activeFilters.diet = "Todos";
  AppState.activeFilters.habitat = "Todos";
  AppState.activeFilters.size = "Todos";
  renderFilters();
  renderBirdCards();
}

// 11. RENDERIZADO DE TARJETAS CON CORRECCIÓN DE ENCUADRE Y SONIDO
function renderBirdCards() {
  const grid = document.getElementById("birds-grid");
  const emptyState = document.getElementById("empty-state");
  if (!grid) return;

  grid.innerHTML = "";

  const filteredList = AppState.allBirds.filter(ave => {
    const isSeen = AppState.sightingsMap.has(ave.id);

    if (AppState.activeFilters.statusTab === "unseen" && isSeen) return false;
    if (AppState.activeFilters.statusTab === "seen" && !isSeen) return false;

    if (AppState.activeFilters.search) {
      const q = AppState.activeFilters.search.toLowerCase();
      const matchName = ave.nombreChileno.toLowerCase().includes(q);
      const matchSci = ave.nombreCientifico.toLowerCase().includes(q);
      const matchEng = ave.nombreIngles ? ave.nombreIngles.toLowerCase().includes(q) : false;
      if (!matchName && !matchSci && !matchEng) return false;
    }

    if (AppState.activeFilters.zone !== "Todos") {
      const matchZone = ave.zonaId === AppState.activeFilters.zone || ave.zonas.some(z => z.toLowerCase().includes(AppState.activeFilters.zone));
      if (!matchZone) return false;
    }

    if (AppState.activeFilters.diet !== "Todos") {
      if (ave.dietaId !== AppState.activeFilters.diet) return false;
    }

    if (AppState.activeFilters.habitat !== "Todos") {
      if (ave.entornoId !== AppState.activeFilters.habitat) return false;
    }

    if (AppState.activeFilters.size !== "Todos") {
      if (ave.tamanoId !== AppState.activeFilters.size) return false;
    }

    return true;
  });

  if (filteredList.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  } else {
    if (emptyState) emptyState.classList.add("hidden");
  }

  filteredList.forEach(ave => {
    const sightingData = AppState.sightingsMap.get(ave.id);
    const isSeen = !!sightingData;
    const isAudioPlaying = AppState.activeAudioBirdId === ave.id;
    const card = document.createElement("div");
    card.className = "card-scene h-[490px] sm:h-[500px] w-full";

    card.innerHTML = `
      <div class="card-inner h-full ${isSeen ? 'seen-card-glow' : ''}" id="card-inner-${ave.id}">
        
        <!-- CARA FRONTAL -->
        <div class="card-face bg-white/95 border-2 ${isSeen ? 'border-amber-300 shadow-md' : 'border-pink-200/80 shadow-xs'} p-4 flex flex-col justify-between cursor-pointer" onclick="toggleCardFlip('${ave.id}')">
          
          <div>
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 pr-1">
                <span class="text-[10px] font-bold text-pink-500 uppercase tracking-wider block">Ave de Chile 🇨🇱</span>
                <h3 class="text-base sm:text-lg font-extrabold text-[#48344F] leading-tight flex items-center gap-1">
                  <span>${ave.nombreChileno}</span>
                  ${isSeen ? '<span class="text-amber-500 text-sm" title="Avistada">⭐</span>' : ''}
                </h3>
                <p class="text-xs text-purple-600/90 font-medium italic">${ave.nombreCientifico}</p>
              </div>

              <button 
                onclick="event.stopPropagation(); toggleSightingQuick('${ave.id}')"
                title="${isSeen ? 'Desmarcar avistamiento' : '¡Marcar como avistado!'}"
                class="p-2.5 rounded-2xl border-2 transition-transform active:scale-90 ${
                  isSeen 
                    ? 'bg-amber-100 border-amber-300 text-amber-600 hover:bg-amber-200' 
                    : 'bg-pink-100 border-pink-200 text-pink-600 hover:bg-pink-200 hover:scale-105'
                }"
              >
                <span class="text-lg">${isSeen ? '⭐' : '🔭'}</span>
              </button>
            </div>

            <!-- CONTENEDOR DE IMAGEN CON ENCUADRE CORREGIDO -->
            <div class="relative w-full h-44 sm:h-48 my-2.5 rounded-2xl overflow-hidden bg-pink-50 border-2 border-pink-100 group">
              <img 
                id="img-${ave.id}"
                src="${ave.foto}" 
                alt="${ave.nombreChileno}"
                loading="lazy"
                class="bird-card-img"
                onerror="handleImgError(this, '${ave.id}')"
              />

              <!-- Botón Lupa (Lightbox) -->
              <button 
                onclick="event.stopPropagation(); openLightboxModal('${ave.id}')"
                title="Ampliar imagen en alta resolución"
                class="absolute top-2 right-2 p-1.5 rounded-xl bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition transform hover:scale-110"
              >
                <span class="text-xs">🔍</span>
              </button>

              <!-- Botón Sonido / Canto del Ave -->
              <button 
                onclick="event.stopPropagation(); playBirdSong('${ave.id}')"
                title="Escuchar canto de ${ave.nombreChileno}"
                class="absolute top-2 left-2 px-2 py-1 rounded-xl bg-white/90 hover:bg-white text-purple-900 font-extrabold text-[11px] backdrop-blur-xs shadow-xs border border-purple-200 flex items-center gap-1 transition transform hover:scale-105"
              >
                ${isAudioPlaying ? `
                  <span class="flex items-center gap-0.5 h-3">
                    <span class="soundwave-bar"></span>
                    <span class="soundwave-bar"></span>
                    <span class="soundwave-bar"></span>
                  </span>
                  <span>Sonando</span>
                ` : `
                  <span>🔊</span>
                  <span>Canto</span>
                `}
              </button>

              ${isSeen ? `
                <div class="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs border border-amber-300 text-amber-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                  <span>✨ ¡Avistada!</span>
                  ${sightingData.fechaHora ? `<span class="text-[9px] text-amber-700 font-medium">${sightingData.fechaHora.split(' ')[0]}</span>` : ''}
                </div>
              ` : ''}

              ${(isSeen && sightingData.urlFotoDrive) ? `
                <button 
                  onclick="event.stopPropagation(); openPhotoReviewModal('${ave.id}')"
                  title="Revisar mi fotografía de campo"
                  class="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-extrabold px-2 py-1 rounded-full shadow-xs flex items-center gap-1"
                >
                  <span>📷 Mi Foto</span>
                </button>
              ` : ''}
            </div>

            <div class="flex flex-wrap gap-1 mb-2">
              <span class="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-purple-100">
                ${ave.zonas[0]}
              </span>
              <span class="bg-pink-50 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-pink-100 truncate max-w-[130px]">
                ${ave.tamano}
              </span>
            </div>
          </div>

          <div class="pt-2 border-t border-pink-100 flex items-center justify-between text-xs text-[#7D6C85]">
            <span class="flex items-center gap-1 font-semibold text-[11px] truncate max-w-[160px]">
              <span>🏡</span> ${ave.habitat.split(',')[0]}
            </span>
            <span class="text-[11px] font-bold text-pink-500 flex items-center gap-1">
              <span>Girar ficha</span>
              <span>🔄</span>
            </span>
          </div>
        </div>

        <!-- CARA POSTERIOR (FICHA PEDAGÓGICA Y CÁMARA) -->
        <div class="card-face card-face-back bg-white border-2 border-purple-200 p-4 flex flex-col justify-between shadow-lg" onclick="toggleCardFlip('${ave.id}')">
          
          <div>
            <div class="flex items-center justify-between border-b border-purple-100 pb-2 mb-2">
              <div>
                <h4 class="text-sm font-extrabold text-[#48344F] flex items-center gap-1">
                  <span>${ave.nombreChileno}</span>
                </h4>
                <p class="text-[11px] text-purple-600 italic">${ave.nombreCientifico}</p>
              </div>

              <!-- Botón Canto en Reverso -->
              <button 
                onclick="event.stopPropagation(); playBirdSong('${ave.id}')"
                class="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold text-[10px] flex items-center gap-1 border border-purple-200"
              >
                <span>🔊</span>
                <span>${isAudioPlaying ? 'Sonando...' : 'Escuchar'}</span>
              </button>
            </div>

            <div class="space-y-1.5 text-xs text-[#48384E]">
              <div class="bg-pink-50/70 p-2 rounded-xl border border-pink-100">
                <p class="font-bold text-pink-700 text-[11px] mb-0.5">🍽️ Dieta habitual:</p>
                <p class="text-[10px] leading-tight text-gray-700">${ave.dieta}</p>
              </div>

              <div class="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                <p class="font-bold text-emerald-800 text-[11px] mb-0.5">🏡 Dónde vive en Santiago/Chile:</p>
                <p class="text-[10px] leading-tight text-gray-700">${ave.habitat}</p>
              </div>

              <div class="bg-amber-50/70 p-2 rounded-xl border border-amber-100">
                <p class="font-bold text-amber-800 text-[11px] mb-0.5">💡 Curiosidad de campo:</p>
                <p class="text-[10px] leading-tight text-gray-700">${ave.datoCurioso}</p>
              </div>

              <div class="bg-purple-50/70 p-2 rounded-xl border border-purple-100">
                <p class="font-bold text-purple-800 text-[11px] mb-0.5">🔎 Cómo reconocerla en terreno:</p>
                <p class="text-[10px] leading-tight text-gray-700">${ave.comoReconocerla}</p>
              </div>
            </div>

            <!-- FOTO DE CAMPO -->
            <div class="mt-2 pt-2 border-t border-purple-100" onclick="event.stopPropagation()">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-extrabold text-[#7D6C85] flex items-center gap-1">
                  <span>📸</span> Fotografía personal de campo
                </span>
                ${(isSeen && sightingData.urlFotoDrive) ? `
                  <button 
                    onclick="openPhotoReviewModal('${ave.id}')"
                    class="text-[10px] font-bold text-purple-700 underline"
                  >
                    Ver foto guardada
                  </button>
                ` : ''}
              </div>

              <input 
                type="file" 
                id="camera-input-${ave.id}" 
                accept="image/*" 
                capture="environment" 
                class="hidden" 
                onchange="handlePhotoSelect(event, '${ave.id}')"
              />

              <div class="flex gap-1.5">
                <button 
                  onclick="triggerCameraInput('${ave.id}')"
                  class="flex-1 py-1.5 px-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                >
                  <span>📷</span> Tomar foto
                </button>

                <button 
                  onclick="triggerGalleryInput('${ave.id}')"
                  class="flex-1 py-1.5 px-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                >
                  <span>📁</span> Desde galería
                </button>
              </div>
            </div>
          </div>

          <div class="pt-2 border-t border-purple-100 flex items-center justify-between gap-2 mt-2" onclick="event.stopPropagation()">
            <button 
              onclick="toggleSightingQuick('${ave.id}')"
              class="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border-2 transition ${
                isSeen 
                  ? 'bg-rose-100 border-rose-300 text-rose-700 hover:bg-rose-200' 
                  : 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200'
              }"
            >
              <span>${isSeen ? '❌ Desmarcar' : '✨ ¡La he visto!'}</span>
            </button>

            <button 
              onclick="toggleCardFlip('${ave.id}')"
              class="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
              title="Volver al frente"
            >
              ↩️ Frente
            </button>
          </div>

        </div>

      </div>
    `;

    grid.appendChild(card);
  });
}

// 12. GESTIÓN DE ACCIONES Y EVENTOS
function toggleCardFlip(birdId) {
  const inner = document.getElementById(`card-inner-${birdId}`);
  if (inner) {
    inner.classList.toggle("is-flipped");
  }
}

function toggleSightingQuick(birdId) {
  const ave = AppState.allBirds.find(a => a.id === birdId);
  const isCurrentlySeen = AppState.sightingsMap.has(birdId);

  if (!isCurrentlySeen) {
    triggerConfetti();
    syncSightingToCloud(birdId, true);
    showToast("¡Nueva ave avistada! 🔭", `Has sumado al ${ave.nombreChileno} a tu bitácora.`);
  } else {
    syncSightingToCloud(birdId, false);
    showToast("Ave desmarcada 🍃", `El ${ave.nombreChileno} vuelve a la lista por descubrir.`);
  }
}

function switchViewTab(tab) {
  AppState.activeFilters.statusTab = tab;
  const tabUnseen = document.getElementById("tab-unseen");
  const tabSeen = document.getElementById("tab-seen");
  const tabAll = document.getElementById("tab-all");

  const activeClass = "px-4 sm:px-6 py-2 rounded-2xl font-extrabold text-xs sm:text-sm transition-all bg-[#FFB7C5] text-white shadow-xs";
  const inactiveClass = "px-4 sm:px-6 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all text-[#7D6C85] hover:bg-pink-50";

  if (tabUnseen) tabUnseen.className = tab === "unseen" ? activeClass : inactiveClass;
  if (tabSeen) tabSeen.className = tab === "seen" ? activeClass : inactiveClass;
  if (tabAll) tabAll.className = tab === "all" ? activeClass : inactiveClass;

  renderBirdCards();
}

function updateDashboardCounters() {
  const total = AppState.allBirds.length;
  const seenCount = AppState.sightingsMap.size;
  const unseenCount = Math.max(0, total - seenCount);
  const percent = total > 0 ? Math.round((seenCount / total) * 100) : 0;

  const countUnseen = document.getElementById("counter-unseen");
  const countSeen = document.getElementById("counter-seen");
  const badgeUnseen = document.getElementById("tab-badge-unseen");
  const badgeSeen = document.getElementById("tab-badge-seen");
  const progressBar = document.getElementById("progress-bar-fill");
  const progressText = document.getElementById("progress-text");

  if (countUnseen) countUnseen.textContent = unseenCount;
  if (countSeen) countSeen.textContent = `${seenCount} / ${total}`;
  if (badgeUnseen) badgeUnseen.textContent = unseenCount;
  if (badgeSeen) badgeSeen.textContent = seenCount;
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (progressText) progressText.textContent = `${percent}% completado`;
}

// 13. MANEJO DE CÁMARA Y COMPRESIÓN
function triggerCameraInput(birdId) {
  const input = document.getElementById(`camera-input-${birdId}`);
  if (input) {
    input.setAttribute("capture", "environment");
    input.click();
  }
}

function triggerGalleryInput(birdId) {
  const input = document.getElementById(`camera-input-${birdId}`);
  if (input) {
    input.removeAttribute("capture");
    input.click();
  }
}

function handlePhotoSelect(event, birdId) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  showToast("Procesando foto 📷", "Optimizando imagen para el repositorio...");

  compressImageFile(file, 1280, 1280, 0.82, (base64Img) => {
    openPhotoPreviewModal(birdId, base64Img);
  });
}

function compressImageFile(file, maxWidth, maxHeight, quality, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      callback(compressedDataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 14. MODALES
let pendingPhotoData = null;

function openPhotoPreviewModal(birdId, base64Img) {
  const ave = AppState.allBirds.find(a => a.id === birdId);
  pendingPhotoData = { birdId, base64Img };

  const modal = document.getElementById("photo-preview-modal");
  const imgElem = document.getElementById("photo-preview-img");
  const nameElem = document.getElementById("photo-preview-name");

  if (imgElem) imgElem.src = base64Img;
  if (nameElem && ave) nameElem.textContent = `Foto de ${ave.nombreChileno}`;
  if (modal) modal.classList.remove("hidden");
}

function closePhotoPreviewModal() {
  const modal = document.getElementById("photo-preview-modal");
  if (modal) modal.classList.add("hidden");
  pendingPhotoData = null;
}

async function confirmPhotoUpload() {
  if (!pendingPhotoData) return;
  const { birdId, base64Img } = pendingPhotoData;
  const notesInput = document.getElementById("photo-notes-input");
  const notes = notesInput ? notesInput.value.trim() : "Foto de avistamiento";

  closePhotoPreviewModal();
  showToast("Guardando foto ☁️", "Registrando en tu bitácora...");
  await syncSightingToCloud(birdId, true, base64Img, notes);
}

function openLightboxModal(birdId) {
  const ave = AppState.allBirds.find(a => a.id === birdId);
  if (!ave) return;

  const modal = document.getElementById("lightbox-modal");
  const imgElem = document.getElementById("lightbox-img");
  const titleElem = document.getElementById("lightbox-title");
  const sciElem = document.getElementById("lightbox-sci");
  const descElem = document.getElementById("lightbox-desc");

  if (imgElem) imgElem.src = ave.foto;
  if (titleElem) titleElem.textContent = ave.nombreChileno;
  if (sciElem) sciElem.textContent = ave.nombreCientifico;
  if (descElem) descElem.textContent = ave.datoCurioso;

  if (modal) modal.classList.remove("hidden");
}

function closeLightboxModal() {
  const modal = document.getElementById("lightbox-modal");
  if (modal) modal.classList.add("hidden");
}

function openPhotoReviewModal(birdId) {
  const ave = AppState.allBirds.find(a => a.id === birdId);
  const sighting = AppState.sightingsMap.get(birdId);
  if (!ave || !sighting || !sighting.urlFotoDrive) return;

  const modal = document.getElementById("photo-review-modal");
  const imgElem = document.getElementById("photo-review-img");
  const nameElem = document.getElementById("photo-review-name");
  const dateElem = document.getElementById("photo-review-date");
  const notesElem = document.getElementById("photo-review-notes");
  const driveLink = document.getElementById("photo-review-link");

  if (imgElem) imgElem.src = sighting.urlFotoDrive;
  if (nameElem) nameElem.textContent = ave.nombreChileno;
  if (dateElem) dateElem.textContent = `📅 Fecha y hora: ${sighting.fechaHora || 'No registrada'}`;
  if (notesElem) notesElem.textContent = `📝 Notas: ${sighting.notas || 'Sin notas adicionales'}`;
  if (driveLink) {
    if (sighting.urlFotoDrive.startsWith("http")) {
      driveLink.href = sighting.urlFotoDrive;
      driveLink.classList.remove("hidden");
    } else {
      driveLink.classList.add("hidden");
    }
  }

  if (modal) modal.classList.remove("hidden");
}

function closePhotoReviewModal() {
  const modal = document.getElementById("photo-review-modal");
  if (modal) modal.classList.add("hidden");
}

// 15. CONFETTI PASTEL LIGERO
function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#FFB7C5", "#FEF0B2", "#C4F4D6", "#C6E7FF", "#E4DCFA", "#FFAAA6"];

  for (let i = 0; i < 45; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.45,
      radius: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -7 - 3,
      gravity: 0.28,
      alpha: 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= 0.015;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

// 16. TOAST NOTIFICACIONES
function showToast(title, message) {
  const toast = document.getElementById("kawaii-toast");
  const toastTitle = document.getElementById("toast-title");
  const toastMsg = document.getElementById("toast-msg");
  if (!toast) return;

  if (toastTitle) toastTitle.textContent = title;
  if (toastMsg) toastMsg.textContent = message;

  toast.classList.remove("translate-y-24", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-24", "opacity-0");
  }, 3200);
}

// 17. MANEJO DE ERROR DE IMAGEN Y FALLBACK RESILIENTE
function handleImgError(imgElem, birdId) {
  imgElem.onerror = null;
  imgElem.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23FFEBF0'/><text x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='56'>🐦</text><text x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='16' fill='%237D6C85'>Ave de Chile</text></svg>";
}

// 18. PERSISTENCIA LOCAL
function saveLocalDemoState() {
  try {
    const list = Array.from(AppState.sightingsMap.entries());
    localStorage.setItem("pajaronea_demo_sightings", JSON.stringify(list));
  } catch (e) {
    console.warn("Almacenamiento local restringido:", e);
  }
}

function loadLocalDemoState() {
  try {
    const saved = localStorage.getItem("pajaronea_demo_sightings");
    if (saved) {
      const parsed = JSON.parse(saved);
      AppState.sightingsMap = new Map(parsed);
    }
  } catch (e) {
    console.warn("Almacenamiento local no disponible:", e);
  }
}

function bindGlobalEvents() {
  window.addEventListener("resize", () => {
    const canvas = document.getElementById("confetti-canvas");
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });
}

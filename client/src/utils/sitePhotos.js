// Homepage photos from Wikimedia Commons. Every photo is free-licensed and
// must keep its credit visible (shown on the page and on /credits).

function commons(path, { author, license, licenseUrl, source, width = 1280 }) {
  const name = path.split('/').pop()
  const base = `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}`
  return {
    url: `${base}/${width}px-${name}`,
    srcSet: `${base}/1280px-${name} 1280w, ${base}/1920px-${name} 1920w`,
    author,
    license,
    license_url: licenseUrl,
    source: `https://commons.wikimedia.org/wiki/File:${source}`,
  }
}

const BY_SA_4 = 'https://creativecommons.org/licenses/by-sa/4.0'

export const HERO_PHOTO = {
  ...commons('f/f3/The_Annapurna_range_from_Pokhara.jpg', {
    author: 'Jean-Marie Hullot',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    source: 'The_Annapurna_range_from_Pokhara.jpg',
    width: 1920,
  }),
  is_area_photo: false,
  area_caption: 'The Annapurna range above Phewa Lake, Pokhara',
  area_caption_np: 'पोखराको फेवा तालमाथि अन्नपूर्ण हिमशृङ्खला',
}

export const DESTINATION_PHOTOS = {
  kathmandu: commons('4/44/Boudha_Stupa_2018_04.jpg', {
    author: 'Nabin K. Sapkota',
    license: 'CC BY-SA 4.0',
    licenseUrl: BY_SA_4,
    source: 'Boudha_Stupa_2018_04.jpg',
  }),
  pokhara: commons('6/61/Phewa_lake_2604.jpg', {
    author: 'Bijay Chaurasia',
    license: 'CC BY-SA 4.0',
    licenseUrl: BY_SA_4,
    source: 'Phewa_lake_2604.jpg',
  }),
  everest: commons("a/a4/Mount_Everest%27s_west_shoulder%2C_Mt._Everest%2C_Mt._Nuptse_near_EBC%2C_Nepal.jpg", {
    author: 'Rohit Sharma',
    license: 'CC BY-SA 4.0',
    licenseUrl: BY_SA_4,
    source: 'Mount_Everest%27s_west_shoulder,_Mt._Everest,_Mt._Nuptse_near_EBC,_Nepal.jpg',
  }),
  chitwan: commons('0/05/Greater_one-horned_rhinoceros_at_Chitwan.jpg', {
    author: 'Aditya Pal',
    license: 'CC BY-SA 4.0',
    licenseUrl: BY_SA_4,
    source: 'Greater_one-horned_rhinoceros_at_Chitwan.jpg',
  }),
  mustang: commons('e/ef/Mustang-Lo_Manthang-14-Dachausflug-2015-gje.jpg', {
    author: 'Gerd Eichmann',
    license: 'CC BY-SA 4.0',
    licenseUrl: BY_SA_4,
    source: 'Mustang-Lo_Manthang-14-Dachausflug-2015-gje.jpg',
  }),
  nagarkot: commons('1/15/Le_Langtang_Lirung_%28Himalaya%2C_N%C3%A9pal%29_%288448200379%29.jpg', {
    author: 'Jean-Pierre Dalbéra',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'Le_Langtang_Lirung_(Himalaya,_N%C3%A9pal)_(8448200379).jpg',
  }),
}

export const SITE_PHOTOS = [HERO_PHOTO, ...Object.values(DESTINATION_PHOTOS)]

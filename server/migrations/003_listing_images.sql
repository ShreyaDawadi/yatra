-- 003_listing_images.sql
-- Adds photos from Wikimedia Commons to every listing, with credits.
-- All photos are free-licensed (CC BY, CC BY-SA). Credits must stay visible on the site.
-- Hotels use a photo of the AREA (area_caption), never a photo of the hotel itself.
--
-- Run once, from the server folder:
--   psql -U postgres -d yatra -v ON_ERROR_STOP=1 --single-transaction -f migrations/003_listing_images.sql

ALTER TABLE listings ADD COLUMN image_credits JSONB;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mount_Everest%27s_west_shoulder%2C_Mt._Everest%2C_Mt._Nuptse_near_EBC%2C_Nepal.jpg/1280px-Mount_Everest%27s_west_shoulder%2C_Mt._Everest%2C_Mt._Nuptse_near_EBC%2C_Nepal.jpg',
  gallery = ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Way_to_everest_base_camp.jpg/1280px-Way_to_everest_base_camp.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Working_yaks_in_Everest_region.jpg/1280px-Working_yaks_in_Everest_region.jpg']::text[],
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mount_Everest%27s_west_shoulder%2C_Mt._Everest%2C_Mt._Nuptse_near_EBC%2C_Nepal.jpg/1280px-Mount_Everest%27s_west_shoulder%2C_Mt._Everest%2C_Mt._Nuptse_near_EBC%2C_Nepal.jpg", "author": "Rohit Sharma", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Mount_Everest%27s_west_shoulder,_Mt._Everest,_Mt._Nuptse_near_EBC,_Nepal.jpg"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Way_to_everest_base_camp.jpg/1280px-Way_to_everest_base_camp.jpg", "author": "Babin Dulal", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Way_to_everest_base_camp.jpg"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Working_yaks_in_Everest_region.jpg/1280px-Working_yaks_in_Everest_region.jpg", "author": "TT4FT", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Working_yaks_in_Everest_region.jpg"}]'::jsonb
WHERE id = 1;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Mt._Moditse_as_seen_from_Annapurna_Base_Camp-5324.jpg/1280px-Mt._Moditse_as_seen_from_Annapurna_Base_Camp-5324.jpg',
  gallery = ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Annapurna_Base_Camp_%289%29.JPG/1280px-Annapurna_Base_Camp_%289%29.JPG']::text[],
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Mt._Moditse_as_seen_from_Annapurna_Base_Camp-5324.jpg/1280px-Mt._Moditse_as_seen_from_Annapurna_Base_Camp-5324.jpg", "author": "Bijay Chaurasia", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Mt._Moditse_as_seen_from_Annapurna_Base_Camp-5324.jpg"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Annapurna_Base_Camp_%289%29.JPG/1280px-Annapurna_Base_Camp_%289%29.JPG", "author": "Bijaya2043", "license": "CC BY-SA 3.0", "license_url": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:Annapurna_Base_Camp_(9).JPG"}]'::jsonb
WHERE id = 2;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Sunrise_from_Poon_Hill%2C_Ghorepani.jpg/1280px-Sunrise_from_Poon_Hill%2C_Ghorepani.jpg',
  gallery = ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Poon_hill_sunrise.jpg/1280px-Poon_hill_sunrise.jpg']::text[],
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Sunrise_from_Poon_Hill%2C_Ghorepani.jpg/1280px-Sunrise_from_Poon_Hill%2C_Ghorepani.jpg", "author": "Aditya Pal", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Sunrise_from_Poon_Hill,_Ghorepani.jpg"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Poon_hill_sunrise.jpg/1280px-Poon_hill_sunrise.jpg", "author": "Thapaliyashreeram", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Poon_hill_sunrise.jpg"}]'::jsonb
WHERE id = 3;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Phewa_Lake_of_Pokhara_city.jpg/1280px-Phewa_Lake_of_Pokhara_city.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Phewa_Lake_of_Pokhara_city.jpg/1280px-Phewa_Lake_of_Pokhara_city.jpg", "author": "Iamavinashk", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Phewa_Lake_of_Pokhara_city.jpg", "area_caption": "Phewa Lake, Pokhara", "area_caption_np": "फेवा ताल, पोखरा"}]'::jsonb
WHERE id = 4;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Taleju_temple%2C_Patan_Durbar_Square.jpg/1280px-Taleju_temple%2C_Patan_Durbar_Square.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Taleju_temple%2C_Patan_Durbar_Square.jpg/1280px-Taleju_temple%2C_Patan_Durbar_Square.jpg", "author": "Shadow Ayush", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Taleju_temple,_Patan_Durbar_Square.jpg", "area_caption": "Patan Durbar Square, Kathmandu Valley", "area_caption_np": "पाटन दरबार क्षेत्र, काठमाडौं उपत्यका"}]'::jsonb
WHERE id = 5;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Namche_Bazaar%2C_Mountains%2C_Nepal.jpg/1280px-Namche_Bazaar%2C_Mountains%2C_Nepal.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Namche_Bazaar%2C_Mountains%2C_Nepal.jpg/1280px-Namche_Bazaar%2C_Mountains%2C_Nepal.jpg", "author": "Vyacheslav Argenberg", "license": "CC BY 4.0", "license_url": "https://creativecommons.org/licenses/by/4.0", "source": "https://commons.wikimedia.org/wiki/File:Namche_Bazaar,_Mountains,_Nepal.jpg", "area_caption": "Namche Bazaar, Khumbu", "area_caption_np": "नाम्चे बजार, खुम्बु"}]'::jsonb
WHERE id = 6;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/The_Pashupatinath_Temple_27.jpg/1280px-The_Pashupatinath_Temple_27.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/The_Pashupatinath_Temple_27.jpg/1280px-The_Pashupatinath_Temple_27.jpg", "author": "Nabin K. Sapkota", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:The_Pashupatinath_Temple_27.jpg"}]'::jsonb
WHERE id = 7;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bhaktapur_Durbar_Square_7.jpg/1280px-Bhaktapur_Durbar_Square_7.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bhaktapur_Durbar_Square_7.jpg/1280px-Bhaktapur_Durbar_Square_7.jpg", "author": "Janak Bhatta", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Bhaktapur_Durbar_Square_7.jpg"}]'::jsonb
WHERE id = 8;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Phewa_lake_2604.jpg/1280px-Phewa_lake_2604.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Phewa_lake_2604.jpg/1280px-Phewa_lake_2604.jpg", "author": "Bijay Chaurasia", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Phewa_lake_2604.jpg"}]'::jsonb
WHERE id = 9;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Thorong_La_Pass.jpg/1280px-Thorong_La_Pass.jpg',
  gallery = ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Muktinath_Valley%2C_View_of_Thorong_La_Pass%2C_Mountains%2C_Nepal.jpg/1280px-Muktinath_Valley%2C_View_of_Thorong_La_Pass%2C_Mountains%2C_Nepal.jpg']::text[],
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Thorong_La_Pass.jpg/1280px-Thorong_La_Pass.jpg", "author": "Vaupk12", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Thorong_La_Pass.jpg"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Muktinath_Valley%2C_View_of_Thorong_La_Pass%2C_Mountains%2C_Nepal.jpg/1280px-Muktinath_Valley%2C_View_of_Thorong_La_Pass%2C_Mountains%2C_Nepal.jpg", "author": "Vyacheslav Argenberg", "license": "CC BY 4.0", "license_url": "https://creativecommons.org/licenses/by/4.0", "source": "https://commons.wikimedia.org/wiki/File:Muktinath_Valley,_View_of_Thorong_La_Pass,_Mountains,_Nepal.jpg"}]'::jsonb
WHERE id = 10;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Stupa_in_between_Langtang_valley_and_Kyanjin.jpg/1280px-Stupa_in_between_Langtang_valley_and_Kyanjin.jpg',
  gallery = ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Chorten_in_the_Langtang_valley_03.jpg/1280px-Chorten_in_the_Langtang_valley_03.jpg']::text[],
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Stupa_in_between_Langtang_valley_and_Kyanjin.jpg/1280px-Stupa_in_between_Langtang_valley_and_Kyanjin.jpg", "author": "Sunny Shrestha", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Stupa_in_between_Langtang_valley_and_Kyanjin.jpg"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Chorten_in_the_Langtang_valley_03.jpg/1280px-Chorten_in_the_Langtang_valley_03.jpg", "author": "Rsh2020", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Chorten_in_the_Langtang_valley_03.jpg"}]'::jsonb
WHERE id = 11;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Mt_Manaslu.jpg/1280px-Mt_Manaslu.jpg',
  gallery = ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Manaslu_range.jpg/1280px-Manaslu_range.jpg']::text[],
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Mt_Manaslu.jpg/1280px-Mt_Manaslu.jpg", "author": "Pratapgrg", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Mt_Manaslu.jpg"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Manaslu_range.jpg/1280px-Manaslu_range.jpg", "author": "Samdesherpa", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Manaslu_range.jpg"}]'::jsonb
WHERE id = 12;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Yaks_on_the_Mardi_Himal_trek.jpg/1280px-Yaks_on_the_Mardi_Himal_trek.jpg',
  gallery = ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Mardi_Himal_basecamp_panorama.jpg/1280px-Mardi_Himal_basecamp_panorama.jpg']::text[],
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Yaks_on_the_Mardi_Himal_trek.jpg/1280px-Yaks_on_the_Mardi_Himal_trek.jpg", "author": "Rajan Karki", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Yaks_on_the_Mardi_Himal_trek.jpg"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Mardi_Himal_basecamp_panorama.jpg/1280px-Mardi_Himal_basecamp_panorama.jpg", "author": "Nrik kiran", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Mardi_Himal_basecamp_panorama.jpg"}]'::jsonb
WHERE id = 13;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Mustang-Lo_Manthang-14-Dachausflug-2015-gje.jpg/1280px-Mustang-Lo_Manthang-14-Dachausflug-2015-gje.jpg',
  gallery = ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Lo_Manthang_Royal_Palace.JPG/1280px-Lo_Manthang_Royal_Palace.JPG']::text[],
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Mustang-Lo_Manthang-14-Dachausflug-2015-gje.jpg/1280px-Mustang-Lo_Manthang-14-Dachausflug-2015-gje.jpg", "author": "Gerd Eichmann", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Mustang-Lo_Manthang-14-Dachausflug-2015-gje.jpg"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Lo_Manthang_Royal_Palace.JPG/1280px-Lo_Manthang_Royal_Palace.JPG", "author": "Wimbex", "license": "CC BY-SA 3.0", "license_url": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:Lo_Manthang_Royal_Palace.JPG"}]'::jsonb
WHERE id = 14;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Rapti_River%2C_Sauraha%2C_Chitwan.jpg/1280px-Rapti_River%2C_Sauraha%2C_Chitwan.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Rapti_River%2C_Sauraha%2C_Chitwan.jpg/1280px-Rapti_River%2C_Sauraha%2C_Chitwan.jpg", "author": "Ajay Gautam", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Rapti_River,_Sauraha,_Chitwan.jpg", "area_caption": "Rapti River, Sauraha", "area_caption_np": "राप्ती नदी, सौराहा"}]'::jsonb
WHERE id = 15;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Le_Langtang_Lirung_%28Himalaya%2C_N%C3%A9pal%29_%288448200379%29.jpg/1280px-Le_Langtang_Lirung_%28Himalaya%2C_N%C3%A9pal%29_%288448200379%29.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Le_Langtang_Lirung_%28Himalaya%2C_N%C3%A9pal%29_%288448200379%29.jpg/1280px-Le_Langtang_Lirung_%28Himalaya%2C_N%C3%A9pal%29_%288448200379%29.jpg", "author": "Jean-Pierre Dalbéra", "license": "CC BY 2.0", "license_url": "https://creativecommons.org/licenses/by/2.0", "source": "https://commons.wikimedia.org/wiki/File:Le_Langtang_Lirung_(Himalaya,_N%C3%A9pal)_(8448200379).jpg", "area_caption": "Langtang Lirung seen from Nagarkot", "area_caption_np": "नगरकोटबाट देखिएको लाङटाङ लिरुङ"}]'::jsonb
WHERE id = 16;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Lumbini_World_Heritage_Site-IMG_7327.jpg/1280px-Lumbini_World_Heritage_Site-IMG_7327.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Lumbini_World_Heritage_Site-IMG_7327.jpg/1280px-Lumbini_World_Heritage_Site-IMG_7327.jpg", "author": "Bijay Chaurasia", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Lumbini_World_Heritage_Site-IMG_7327.jpg", "area_caption": "Maya Devi Temple, Lumbini", "area_caption_np": "मायादेवी मन्दिर, लुम्बिनी"}]'::jsonb
WHERE id = 17;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Boudha_Stupa_2018_04.jpg/1280px-Boudha_Stupa_2018_04.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Boudha_Stupa_2018_04.jpg/1280px-Boudha_Stupa_2018_04.jpg", "author": "Nabin K. Sapkota", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Boudha_Stupa_2018_04.jpg"}]'::jsonb
WHERE id = 18;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Swayambhu%2C_Kathmandu%2C_Nepal.jpg/1280px-Swayambhu%2C_Kathmandu%2C_Nepal.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Swayambhu%2C_Kathmandu%2C_Nepal.jpg/1280px-Swayambhu%2C_Kathmandu%2C_Nepal.jpg", "author": "Vyacheslav Argenberg", "license": "CC BY 4.0", "license_url": "https://creativecommons.org/licenses/by/4.0", "source": "https://commons.wikimedia.org/wiki/File:Swayambhu,_Kathmandu,_Nepal.jpg"}]'::jsonb
WHERE id = 19;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Kathmandu_Durbar_Square%2C_Shiva_Parvati_Temple%2C_Nepal_%28edit%29.jpg/1280px-Kathmandu_Durbar_Square%2C_Shiva_Parvati_Temple%2C_Nepal_%28edit%29.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Kathmandu_Durbar_Square%2C_Shiva_Parvati_Temple%2C_Nepal_%28edit%29.jpg/1280px-Kathmandu_Durbar_Square%2C_Shiva_Parvati_Temple%2C_Nepal_%28edit%29.jpg", "author": "Vyacheslav Argenberg (derivative work: UnpetitproleX)", "license": "CC BY 4.0", "license_url": "https://creativecommons.org/licenses/by/4.0", "source": "https://commons.wikimedia.org/wiki/File:Kathmandu_Durbar_Square,_Shiva_Parvati_Temple,_Nepal_(edit).jpg"}]'::jsonb
WHERE id = 20;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/View_of_Annapurna_South_and_Machapuchare_from_Sarangkot%2C_Nepal-WLV-1659.jpg/1280px-View_of_Annapurna_South_and_Machapuchare_from_Sarangkot%2C_Nepal-WLV-1659.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/View_of_Annapurna_South_and_Machapuchare_from_Sarangkot%2C_Nepal-WLV-1659.jpg/1280px-View_of_Annapurna_South_and_Machapuchare_from_Sarangkot%2C_Nepal-WLV-1659.jpg", "author": "Bijay Chaurasia", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:View_of_Annapurna_South_and_Machapuchare_from_Sarangkot,_Nepal-WLV-1659.jpg"}]'::jsonb
WHERE id = 21;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Davis_Falls-Pokhara_02.jpg/1280px-Davis_Falls-Pokhara_02.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Davis_Falls-Pokhara_02.jpg/1280px-Davis_Falls-Pokhara_02.jpg", "author": "Sabina Bajracharya", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Davis_Falls-Pokhara_02.jpg"}]'::jsonb
WHERE id = 22;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/World_Peace_Pagoda%2C_Pokhara_by_Y7.jpg/1280px-World_Peace_Pagoda%2C_Pokhara_by_Y7.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/World_Peace_Pagoda%2C_Pokhara_by_Y7.jpg/1280px-World_Peace_Pagoda%2C_Pokhara_by_Y7.jpg", "author": "Yallu007", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:World_Peace_Pagoda,_Pokhara_by_Y7.jpg"}]'::jsonb
WHERE id = 23;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Gupteshwor_Cave_%2C_Pokhara.jpg/1280px-Gupteshwor_Cave_%2C_Pokhara.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Gupteshwor_Cave_%2C_Pokhara.jpg/1280px-Gupteshwor_Cave_%2C_Pokhara.jpg", "author": "Sushila Gurung", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Gupteshwor_Cave_,_Pokhara.jpg"}]'::jsonb
WHERE id = 24;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Greater_one-horned_rhinoceros_at_Chitwan.jpg/1280px-Greater_one-horned_rhinoceros_at_Chitwan.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Greater_one-horned_rhinoceros_at_Chitwan.jpg/1280px-Greater_one-horned_rhinoceros_at_Chitwan.jpg", "author": "Aditya Pal", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Greater_one-horned_rhinoceros_at_Chitwan.jpg"}]'::jsonb
WHERE id = 25;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Tourists_crossing_Rapti_river_in_a_boat_at_Sauraha_%2C_Chitwan.jpg/1280px-Tourists_crossing_Rapti_river_in_a_boat_at_Sauraha_%2C_Chitwan.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Tourists_crossing_Rapti_river_in_a_boat_at_Sauraha_%2C_Chitwan.jpg/1280px-Tourists_crossing_Rapti_river_in_a_boat_at_Sauraha_%2C_Chitwan.jpg", "author": "Supradai", "license": "CC BY 4.0", "license_url": "https://creativecommons.org/licenses/by/4.0", "source": "https://commons.wikimedia.org/wiki/File:Tourists_crossing_Rapti_river_in_a_boat_at_Sauraha_,_Chitwan.jpg"}]'::jsonb
WHERE id = 26;

UPDATE listings SET
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Tharu_Dance_Sauraha_Chitwan_2018.jpg/1280px-Tharu_Dance_Sauraha_Chitwan_2018.jpg',
  gallery = NULL,
  image_credits = '[{"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Tharu_Dance_Sauraha_Chitwan_2018.jpg/1280px-Tharu_Dance_Sauraha_Chitwan_2018.jpg", "author": "Pratap Baniya", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Tharu_Dance_Sauraha_Chitwan_2018.jpg"}]'::jsonb
WHERE id = 27;

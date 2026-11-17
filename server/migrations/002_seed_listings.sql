-- 002_seed_listings.sql
-- Adds details to the 9 existing listings, adds new treks, hotels and tours,
-- and creates hotel room types.
--
-- NOTES ON THE DATA
-- * Prices for NEW listings and all room types are approximate sample
--   figures in USD, not researched quotes. Check them before any launch.
-- * Coordinates and route points are approximate, for map display only.
-- * Room types for the three real hotels (Hotel Barahi, Dwarika's Hotel,
--   Yeti Mountain Home) are sample data, not those hotels' real rooms.
-- * Sauraha Riverside Lodge, Nagarkot Himalayan View Resort and Lumbini
--   Garden Retreat are fictional sample properties.
--
-- Run once, from the server folder:
--   psql -U postgres -d yatra -v ON_ERROR_STOP=1 --single-transaction -f migrations/002_seed_listings.sql

-- 1. Existing treks ---------------------------------------------------------

UPDATE listings SET
  duration_days = 12,
  difficulty = 'challenging',
  max_altitude_m = 5364,
  best_season = 'Mar–May, Sep–Nov',
  best_season_np = 'वसन्त र शरद ऋतु',
  description_np = 'संसारको सर्वोच्च शिखर सगरमाथाको आधार शिविरसम्मको प्रसिद्ध पदयात्रा, शेर्पा गाउँ, गुम्बा र हिमाली दृश्यसहित।',
  included = ARRAY['Kathmandu–Lukla return flights', 'Trekking permits', 'Licensed trekking guide', 'Teahouse accommodation'],
  excluded = ARRAY['International flights', 'Travel insurance', 'Meals not listed', 'Personal expenses and tips'],
  itinerary = '[
    {"day": "1", "title": "Fly Kathmandu to Lukla, trek to Phakding"},
    {"day": "2", "title": "Trek to Namche Bazaar"},
    {"day": "3", "title": "Acclimatisation day in Namche Bazaar"},
    {"day": "4", "title": "Trek to Tengboche"},
    {"day": "5", "title": "Trek to Dingboche"},
    {"day": "6", "title": "Acclimatisation day in Dingboche"},
    {"day": "7", "title": "Trek to Lobuche"},
    {"day": "8", "title": "Trek to Gorak Shep and Everest Base Camp"},
    {"day": "9", "title": "Sunrise at Kala Patthar, descend to Pheriche"},
    {"day": "10", "title": "Trek to Namche Bazaar"},
    {"day": "11", "title": "Trek to Lukla"},
    {"day": "12", "title": "Fly to Kathmandu"}
  ]'::jsonb,
  route = '[[27.6870, 86.7310], [27.8050, 86.7140], [27.8360, 86.7640], [27.8920, 86.8310], [27.9480, 86.8100], [27.9810, 86.8290], [28.0040, 86.8570]]'::jsonb
WHERE id = 1;

UPDATE listings SET
  duration_days = 8,
  difficulty = 'moderate',
  max_altitude_m = 4130,
  best_season = 'Mar–May, Sep–Nov',
  best_season_np = 'वसन्त र शरद ऋतु',
  description_np = 'गुराङ गाउँ, बाँसको जंगल र तातोपानी हुँदै अन्नपूर्ण हिमशृङ्खलाले घेरिएको आधार शिविरसम्मको पदयात्रा।',
  included = ARRAY['Trekking permits', 'Licensed trekking guide', 'Teahouse accommodation', 'Pokhara–Nayapul transport'],
  excluded = ARRAY['International flights', 'Travel insurance', 'Meals not listed', 'Personal expenses and tips'],
  itinerary = '[
    {"day": "1", "title": "Drive Pokhara to Nayapul, trek to Ghandruk"},
    {"day": "2", "title": "Trek to Chhomrong"},
    {"day": "3", "title": "Trek to Bamboo"},
    {"day": "4", "title": "Trek to Deurali"},
    {"day": "5", "title": "Trek to Annapurna Base Camp via Machhapuchhre Base Camp"},
    {"day": "6", "title": "Sunrise at base camp, descend to Bamboo"},
    {"day": "7", "title": "Trek to Jhinu Danda hot springs"},
    {"day": "8", "title": "Trek to Nayapul, drive to Pokhara"}
  ]'::jsonb,
  route = '[[28.2850, 83.7670], [28.3760, 83.8090], [28.4170, 83.8190], [28.4580, 83.8350], [28.4950, 83.8640], [28.5040, 83.8770], [28.5300, 83.8780]]'::jsonb
WHERE id = 2;

UPDATE listings SET
  duration_days = 4,
  difficulty = 'easy',
  max_altitude_m = 3210,
  best_season = 'Oct–Apr',
  best_season_np = 'असोजदेखि वैशाखसम्म',
  description_np = 'अन्नपूर्ण र धौलागिरि हिमशृङ्खलामाथिको सूर्योदयका लागि प्रसिद्ध छोटो चार दिने पदयात्रा।',
  included = ARRAY['Trekking permits', 'Licensed trekking guide', 'Teahouse accommodation', 'Pokhara–Nayapul transport'],
  excluded = ARRAY['Travel insurance', 'Meals not listed', 'Personal expenses and tips'],
  itinerary = '[
    {"day": "1", "title": "Drive Pokhara to Nayapul, trek to Ulleri"},
    {"day": "2", "title": "Trek to Ghorepani"},
    {"day": "3", "title": "Sunrise at Poon Hill, trek to Tadapani"},
    {"day": "4", "title": "Trek to Ghandruk, drive to Pokhara"}
  ]'::jsonb,
  route = '[[28.2850, 83.7670], [28.3400, 83.7400], [28.4000, 83.7000], [28.3990, 83.6997], [28.3910, 83.7650], [28.3760, 83.8090]]'::jsonb
WHERE id = 3;

-- 2. Existing hotels --------------------------------------------------------

UPDATE listings SET
  star_rating = 4,
  description_np = 'फेवा तालनजिकै लेकसाइडमा रहेको आरामदायी होटल, बगैंचा र पौडी पोखरीसहित।',
  amenities = ARRAY['Free Wi-Fi', 'Swimming pool', 'Restaurant', 'Garden', 'Airport transfer', 'Breakfast available']
WHERE id = 4;

UPDATE listings SET
  star_rating = 5,
  description_np = 'परम्परागत नेवारी वास्तुकलामा बनेको काठमाडौंको सम्पदा होटल, कलात्मक आँगन र विलासी सेवासहित।',
  amenities = ARRAY['Free Wi-Fi', 'Spa', 'Swimming pool', 'Restaurant', 'Bar', 'Airport transfer', 'Breakfast included']
WHERE id = 5;

UPDATE listings SET
  description_np = 'खुम्बु क्षेत्रमा पदयात्रीहरूका लागि आरामदायी पहाडी लज, हिमाली दृश्य र तातो खानासहित।',
  amenities = ARRAY['Heated rooms', 'Restaurant', 'Mountain views', 'Breakfast included']
WHERE id = 6;

-- 3. Existing tours ---------------------------------------------------------

UPDATE listings SET
  duration_days = 1,
  description_np = 'बागमती किनारमा रहेको हिन्दूहरूको पवित्र पशुपतिनाथ मन्दिर र यसको आसपासको निर्देशित भ्रमण।',
  included = ARRAY['Licensed city guide', 'Hotel pickup in Kathmandu'],
  excluded = ARRAY['Entrance fees', 'Meals', 'Tips']
WHERE id = 7;

UPDATE listings SET
  duration_days = 1,
  description_np = 'मध्यकालीन नेवारी कला, मन्दिर र दरबारले भरिएको भक्तपुर दरबार क्षेत्रको निर्देशित भ्रमण।',
  included = ARRAY['Licensed city guide', 'Return transport from Kathmandu'],
  excluded = ARRAY['Entrance fees', 'Meals', 'Tips']
WHERE id = 8;

UPDATE listings SET
  duration_days = 1,
  description_np = 'माछापुच्छ्रेको प्रतिबिम्ब देखिने फेवा तालमा रंगीन डुंगा सयर र ताल बाराही मन्दिर भ्रमण।',
  included = ARRAY['Boat and boatman', 'Life jackets'],
  excluded = ARRAY['Tal Barahi temple offerings', 'Meals', 'Tips']
WHERE id = 9;

-- 4. New treks --------------------------------------------------------------

INSERT INTO listings
  (type, name, name_np, description, description_np, city, location_detail,
   latitude, longitude, price, duration_days, max_group_size,
   difficulty, max_altitude_m, best_season, best_season_np,
   included, excluded, itinerary, route)
VALUES
  ('trek', 'Annapurna Circuit Trek', 'अन्नपूर्ण सर्किट पदयात्रा',
   'A classic loop around the Annapurna massif, crossing the high Thorong La pass from green valleys into the dry Mustang landscape.',
   'हरियो उपत्यकाबाट उच्च थोराङ ला भञ्ज्याङ पार गर्दै सुख्खा मुस्ताङतर्फ जाने अन्नपूर्ण हिमशृङ्खलाको परिक्रमा।',
   'Manang', 'Besisahar to Jomsom via Thorong La',
   28.6667000, 84.0167000, 1100.00, 12, 12,
   'challenging', 5416, 'Mar–May, Sep–Nov', 'वसन्त र शरद ऋतु',
   ARRAY['Trekking permits', 'Licensed trekking guide', 'Teahouse accommodation', 'Ground transport per itinerary'],
   ARRAY['International flights', 'Travel insurance', 'Meals not listed', 'Personal expenses and tips'],
   '[
     {"day": "1", "title": "Drive Kathmandu to Chamje"},
     {"day": "2", "title": "Trek to Dharapani"},
     {"day": "3", "title": "Trek to Chame"},
     {"day": "4", "title": "Trek to Upper Pisang"},
     {"day": "5", "title": "Trek to Manang via Ngawal"},
     {"day": "6", "title": "Acclimatisation day in Manang"},
     {"day": "7", "title": "Trek to Yak Kharka"},
     {"day": "8", "title": "Trek to Thorong Phedi"},
     {"day": "9", "title": "Cross Thorong La, descend to Muktinath"},
     {"day": "10", "title": "Trek to Jomsom"},
     {"day": "11", "title": "Fly Jomsom to Pokhara"},
     {"day": "12", "title": "Drive to Kathmandu"}
   ]'::jsonb,
   '[[28.2310, 84.3790], [28.5520, 84.2400], [28.6667, 84.0167], [28.7930, 83.9380], [28.8170, 83.8720], [28.7800, 83.7300]]'::jsonb),

  ('trek', 'Langtang Valley Trek', 'लाङटाङ उपत्यका पदयात्रा',
   'A short trek north of Kathmandu through Tamang villages and rhododendron forest to Kyanjin Gompa, surrounded by glaciers.',
   'काठमाडौंको उत्तरमा तामाङ गाउँ र लालीगुराँसको जंगल हुँदै हिमनदीले घेरिएको क्यान्जिन गुम्बासम्मको छोटो पदयात्रा।',
   'Rasuwa', 'Syabrubesi to Kyanjin Gompa',
   28.2110000, 85.5620000, 650.00, 8, 12,
   'moderate', 4773, 'Mar–May, Sep–Nov', 'वसन्त र शरद ऋतु',
   ARRAY['Trekking permits', 'Licensed trekking guide', 'Teahouse accommodation', 'Kathmandu–Syabrubesi transport'],
   ARRAY['Travel insurance', 'Meals not listed', 'Personal expenses and tips'],
   '[
     {"day": "1", "title": "Drive Kathmandu to Syabrubesi"},
     {"day": "2", "title": "Trek to Lama Hotel"},
     {"day": "3", "title": "Trek to Langtang Village"},
     {"day": "4", "title": "Trek to Kyanjin Gompa"},
     {"day": "5", "title": "Day hike to Kyanjin Ri"},
     {"day": "6", "title": "Trek to Lama Hotel"},
     {"day": "7", "title": "Trek to Syabrubesi"},
     {"day": "8", "title": "Drive to Kathmandu"}
   ]'::jsonb,
   '[[28.1610, 85.3460], [28.1660, 85.4300], [28.2140, 85.5180], [28.2110, 85.5620]]'::jsonb),

  ('trek', 'Manaslu Circuit Trek', 'मनास्लु सर्किट पदयात्रा',
   'A remote circuit around the world''s eighth-highest mountain, crossing Larkya La through Gurung and Tibetan-influenced villages.',
   'संसारको आठौं अग्लो हिमाल मनास्लुको परिक्रमा, गुरुङ र तिब्बती संस्कृतिका गाउँ हुँदै लार्क्या ला पार गर्दै।',
   'Gorkha', 'Machha Khola to Dharapani via Larkya La',
   28.5850000, 84.6360000, 1350.00, 13, 10,
   'strenuous', 5106, 'Mar–May, Sep–Nov', 'वसन्त र शरद ऋतु',
   ARRAY['Restricted area permit', 'Trekking permits', 'Licensed trekking guide', 'Teahouse accommodation', 'Ground transport per itinerary'],
   ARRAY['International flights', 'Travel insurance', 'Meals not listed', 'Personal expenses and tips'],
   '[
     {"day": "1", "title": "Drive Kathmandu to Machha Khola"},
     {"day": "2", "title": "Trek to Jagat"},
     {"day": "3", "title": "Trek to Deng"},
     {"day": "4", "title": "Trek to Namrung"},
     {"day": "5", "title": "Trek to Lho"},
     {"day": "6", "title": "Trek to Samagaun"},
     {"day": "7", "title": "Acclimatisation day in Samagaun"},
     {"day": "8", "title": "Trek to Samdo"},
     {"day": "9", "title": "Trek to Dharamsala"},
     {"day": "10", "title": "Cross Larkya La, descend to Bimthang"},
     {"day": "11", "title": "Trek to Tilije"},
     {"day": "12", "title": "Trek to Dharapani, drive to Besisahar"},
     {"day": "13", "title": "Drive to Kathmandu"}
   ]'::jsonb,
   '[[28.2280, 84.8750], [28.3370, 84.8970], [28.5850, 84.6360], [28.6680, 84.5390], [28.6370, 84.4220], [28.5330, 84.3640]]'::jsonb),

  ('trek', 'Mardi Himal Trek', 'मार्दी हिमाल पदयात्रा',
   'A quieter ridge trek near Pokhara with close-up views of Machhapuchhre and the Annapurna range.',
   'पोखरानजिकै माछापुच्छ्रे र अन्नपूर्ण हिमशृङ्खलाको नजिकको दृश्य दिने शान्त डाँडाको पदयात्रा।',
   'Pokhara', 'Kande to Mardi Himal View Point',
   28.4480000, 83.9070000, 450.00, 6, 12,
   'moderate', 4500, 'Mar–May, Sep–Nov', 'वसन्त र शरद ऋतु',
   ARRAY['Trekking permits', 'Licensed trekking guide', 'Teahouse accommodation', 'Pokhara–Kande transport'],
   ARRAY['Travel insurance', 'Meals not listed', 'Personal expenses and tips'],
   '[
     {"day": "1", "title": "Drive Pokhara to Kande, trek to Deurali"},
     {"day": "2", "title": "Trek to Forest Camp"},
     {"day": "3", "title": "Trek to High Camp"},
     {"day": "4", "title": "Hike to the view point, descend to Badal Danda"},
     {"day": "5", "title": "Trek to Siding village"},
     {"day": "6", "title": "Drive to Pokhara"}
   ]'::jsonb,
   '[[28.2780, 83.8180], [28.3500, 83.8500], [28.4480, 83.9070], [28.4650, 83.9180]]'::jsonb),

  ('trek', 'Upper Mustang Trek', 'माथिल्लो मुस्ताङ पदयात्रा',
   'A journey into the former Kingdom of Lo, with cave dwellings, red cliffs and the walled city of Lo Manthang.',
   'गुफा, रातो चट्टान र पर्खालले घेरिएको लोमान्थाङ सहर भएको पुरानो लो राज्यतर्फको यात्रा।',
   'Mustang', 'Jomsom to Lo Manthang',
   29.1830000, 83.9590000, 2100.00, 12, 10,
   'moderate', 3840, 'Mar–Nov', 'चैतदेखि मंसिरसम्म',
   ARRAY['Restricted area permit', 'Trekking permits', 'Licensed trekking guide', 'Teahouse accommodation', 'Pokhara–Jomsom return flights'],
   ARRAY['International flights', 'Travel insurance', 'Meals not listed', 'Personal expenses and tips'],
   '[
     {"day": "1", "title": "Fly Pokhara to Jomsom, trek to Kagbeni"},
     {"day": "2", "title": "Trek to Chele"},
     {"day": "3", "title": "Trek to Syangboche"},
     {"day": "4", "title": "Trek to Ghami"},
     {"day": "5", "title": "Trek to Charang"},
     {"day": "6", "title": "Trek to Lo Manthang"},
     {"day": "7", "title": "Explore Lo Manthang"},
     {"day": "8", "title": "Trek to Drakmar"},
     {"day": "9", "title": "Trek to Ghiling"},
     {"day": "10", "title": "Trek to Chhusang"},
     {"day": "11", "title": "Trek to Jomsom"},
     {"day": "12", "title": "Fly to Pokhara"}
   ]'::jsonb,
   '[[28.7800, 83.7300], [28.8370, 83.7830], [28.9150, 83.8170], [29.0500, 83.8800], [29.1830, 83.9590]]'::jsonb);

-- 5. New hotels -------------------------------------------------------------

INSERT INTO listings
  (type, name, name_np, description, description_np, city, location_detail,
   latitude, longitude, price, max_group_size, star_rating, amenities)
VALUES
  ('hotel', 'Sauraha Riverside Lodge', 'सौराहा रिभरसाइड लज',
   'A jungle lodge on the Rapti River at the edge of Chitwan National Park, a short walk from safari departures.',
   'चितवन राष्ट्रिय निकुञ्जको छेउमा राप्ती नदी किनारको जंगल लज, सफारी सुरु हुने ठाउँबाट नजिकै।',
   'Chitwan', 'Sauraha',
   27.5760000, 84.4960000, 80.00, NULL, 4,
   ARRAY['Free Wi-Fi', 'Swimming pool', 'Restaurant', 'River views', 'Safari desk', 'Breakfast included']),

  ('hotel', 'Nagarkot Himalayan View Resort', 'नगरकोट हिमालयन भ्यु रिसोर्ट',
   'A hilltop resort east of Kathmandu, known for sunrise views stretching across the Himalaya.',
   'काठमाडौंको पूर्वमा डाँडामाथि रहेको रिसोर्ट, हिमालमाथिको सूर्योदय दृश्यका लागि परिचित।',
   'Nagarkot', 'Nagarkot ridge',
   27.7150000, 85.5200000, 60.00, NULL, 3,
   ARRAY['Free Wi-Fi', 'Restaurant', 'Mountain views', 'Terrace', 'Breakfast included']),

  ('hotel', 'Lumbini Garden Retreat', 'लुम्बिनी गार्डेन रिट्रिट',
   'A calm garden hotel near the Lumbini monastic zone, the birthplace of the Buddha.',
   'भगवान बुद्धको जन्मस्थल लुम्बिनीको विहार क्षेत्रनजिकै रहेको शान्त बगैंचायुक्त होटल।',
   'Lumbini', 'Near the Lumbini monastic zone',
   27.4840000, 83.2760000, 45.00, NULL, 3,
   ARRAY['Free Wi-Fi', 'Restaurant', 'Garden', 'Bicycle rental', 'Breakfast available']);

-- 6. New sightseeing tours --------------------------------------------------

INSERT INTO listings
  (type, name, name_np, description, description_np, city, location_detail,
   latitude, longitude, price, duration_days, max_group_size, included, excluded)
VALUES
  ('sightseeing', 'Boudhanath Stupa Tour', 'बौद्धनाथ स्तूप भ्रमण',
   'Walk the kora around one of the largest stupas in the world, surrounded by monasteries and butter-lamp shops.',
   'गुम्बा र बत्ती पसलहरूले घेरिएको संसारकै ठूला स्तूपमध्ये एक बौद्धनाथको परिक्रमा।',
   'Kathmandu', 'Boudha',
   27.7215000, 85.3620000, 30.00, 1, 15,
   ARRAY['Licensed city guide', 'Hotel pickup in Kathmandu'], ARRAY['Entrance fees', 'Meals', 'Tips']),

  ('sightseeing', 'Swayambhunath Tour', 'स्वयम्भूनाथ भ्रमण',
   'Climb to the hilltop stupa known as the Monkey Temple for sweeping views over the Kathmandu Valley.',
   'बाँदर मन्दिरका नामले चिनिने डाँडामाथिको स्तूपसम्म चढेर काठमाडौं उपत्यकाको फराकिलो दृश्य।',
   'Kathmandu', 'Swayambhu hill',
   27.7149000, 85.2904000, 30.00, 1, 15,
   ARRAY['Licensed city guide', 'Hotel pickup in Kathmandu'], ARRAY['Entrance fees', 'Meals', 'Tips']),

  ('sightseeing', 'Kathmandu Durbar Square Tour', 'काठमाडौं दरबार क्षेत्र भ्रमण',
   'Explore the old royal palace square with its pagoda temples, Kumari Ghar and Newar woodcarving.',
   'प्यागोडा मन्दिर, कुमारी घर र नेवारी काष्ठकलासहितको पुरानो राजदरबार क्षेत्रको भ्रमण।',
   'Kathmandu', 'Basantapur',
   27.7045000, 85.3070000, 35.00, 1, 15,
   ARRAY['Licensed city guide', 'Hotel pickup in Kathmandu'], ARRAY['Entrance fees', 'Meals', 'Tips']),

  ('sightseeing', 'Sarangkot Sunrise Tour', 'सराङकोट सूर्योदय भ्रमण',
   'An early drive to Sarangkot hill to watch the sun rise over Machhapuchhre, Annapurna and Dhaulagiri.',
   'माछापुच्छ्रे, अन्नपूर्ण र धौलागिरिमाथिको सूर्योदय हेर्न बिहानै सराङकोट डाँडाको यात्रा।',
   'Pokhara', 'Sarangkot',
   28.2440000, 83.9490000, 25.00, 1, 15,
   ARRAY['Return transport from Lakeside', 'Local guide'], ARRAY['View tower fee', 'Breakfast', 'Tips']),

  ('sightseeing', 'Davis Falls Visit', 'डेभिस फल्स (पाताले छाँगो) भ्रमण',
   'See the waterfall where the Pardi Khola drops into an underground tunnel, known locally as Patale Chhango.',
   'पर्दी खोला भूमिगत सुरुङमा खस्ने झरना, जसलाई स्थानीय रूपमा पाताले छाँगो भनिन्छ।',
   'Pokhara', 'Chhorepatan',
   28.1900000, 83.9590000, 15.00, 1, 20,
   ARRAY['Return transport from Lakeside'], ARRAY['Entrance fee', 'Meals', 'Tips']),

  ('sightseeing', 'World Peace Pagoda Hike', 'विश्व शान्ति स्तूप पदयात्रा',
   'Cross Phewa Lake by boat and hike up to the white Peace Pagoda for panoramic views of Pokhara and the mountains.',
   'फेवा ताल डुंगाले पार गरी सेतो शान्ति स्तूपसम्म पैदल उकालो, पोखरा र हिमालको मनोरम दृश्यसहित।',
   'Pokhara', 'Anadu hill',
   28.2010000, 83.9450000, 20.00, 1, 15,
   ARRAY['Boat crossing', 'Local guide'], ARRAY['Meals', 'Tips']),

  ('sightseeing', 'Gupteshwor Cave Tour', 'गुप्तेश्वर गुफा भ्रमण',
   'Descend into a limestone cave with a sacred Shiva shrine and a view of Davis Falls from below.',
   'शिवलिंग रहेको पवित्र चुनढुंगे गुफाभित्र झर्दै तलबाट डेभिस फल्सको दृश्य।',
   'Pokhara', 'Chhorepatan',
   28.1895000, 83.9601000, 15.00, 1, 20,
   ARRAY['Return transport from Lakeside'], ARRAY['Entrance fee', 'Meals', 'Tips']),

  ('sightseeing', 'Chitwan Jungle Safari', 'चितवन जंगल सफारी',
   'A jeep safari through Chitwan National Park looking for one-horned rhinos, deer, crocodiles and birdlife.',
   'एकसिंगे गैंडा, मृग, गोही र चराचुरुंगी हेर्दै चितवन राष्ट्रिय निकुञ्जभित्र जीप सफारी।',
   'Chitwan', 'Chitwan National Park',
   27.5750000, 84.4950000, 60.00, 1, 8,
   ARRAY['Jeep and driver', 'Naturalist guide'], ARRAY['National park entry fee', 'Meals', 'Tips']),

  ('sightseeing', 'Rapti River Canoe Ride', 'राप्ती नदी डुंगा यात्रा',
   'A quiet dugout canoe ride along the Rapti River, followed by a short jungle walk.',
   'राप्ती नदीमा परम्परागत डुंगामा शान्त सयर र त्यसपछि छोटो जंगल पैदल यात्रा।',
   'Chitwan', 'Rapti River, Sauraha',
   27.5730000, 84.4900000, 35.00, 1, 8,
   ARRAY['Canoe and boatman', 'Naturalist guide'], ARRAY['National park entry fee', 'Meals', 'Tips']),

  ('sightseeing', 'Tharu Cultural Experience', 'थारु सांस्कृतिक अनुभव',
   'Visit a Tharu village and watch a traditional stick dance performance in Sauraha.',
   'थारु गाउँको भ्रमण र सौराहामा परम्परागत लठ्ठी नाच प्रदर्शन।',
   'Chitwan', 'Sauraha',
   27.5800000, 84.5000000, 20.00, 1, 20,
   ARRAY['Village guide', 'Cultural show ticket'], ARRAY['Meals', 'Tips']);

-- 7. Room types -------------------------------------------------------------
-- Each hotel's listing price is the price of its cheapest room type.

INSERT INTO room_types (listing_id, name, name_np, price_per_night, max_guests, total_rooms)
VALUES
  (4, 'Standard Double', 'स्ट्यान्डर्ड डबल', 105.00, 2, 10),
  (4, 'Deluxe Lake View', 'डिलक्स ताल दृश्य', 140.00, 2, 6),
  (4, 'Family Suite', 'फ्यामिली सुइट', 220.00, 4, 2),

  (5, 'Heritage Deluxe', 'हेरिटेज डिलक्स', 270.00, 2, 8),
  (5, 'Junior Suite', 'जुनियर सुइट', 420.00, 3, 3),

  (6, 'Standard Lodge Room', 'स्ट्यान्डर्ड लज कोठा', 190.00, 2, 6),
  (6, 'Deluxe Mountain View', 'डिलक्स हिमाल दृश्य', 240.00, 2, 3),

  ((SELECT id FROM listings WHERE name = 'Sauraha Riverside Lodge'), 'Garden Cottage', 'गार्डेन कुटी', 80.00, 2, 8),
  ((SELECT id FROM listings WHERE name = 'Sauraha Riverside Lodge'), 'River View Room', 'नदी दृश्य कोठा', 110.00, 3, 4),

  ((SELECT id FROM listings WHERE name = 'Nagarkot Himalayan View Resort'), 'Standard Room', 'स्ट्यान्डर्ड कोठा', 60.00, 2, 12),
  ((SELECT id FROM listings WHERE name = 'Nagarkot Himalayan View Resort'), 'Himalayan View Room', 'हिमाल दृश्य कोठा', 85.00, 2, 6),

  ((SELECT id FROM listings WHERE name = 'Lumbini Garden Retreat'), 'Standard Room', 'स्ट्यान्डर्ड कोठा', 45.00, 2, 10),
  ((SELECT id FROM listings WHERE name = 'Lumbini Garden Retreat'), 'Family Room', 'फ्यामिली कोठा', 70.00, 4, 4);

-- Seed sample menu data for testing the menu display system

-- Insert categories
INSERT INTO categories (name_en, name_it, name_am, description_en, description_it, description_am, display_order) VALUES
('Starters', 'Antipasti', 'መክሰስ', 'Delicious appetizers to start your meal', 'Deliziosi antipasti per iniziare il pasto', 'ምግብዎን ለመጀመር ጣፋጭ መክሰስ', 1),
('Main Course', 'Piatti Principali', 'ዋና ምግብ', 'Hearty main dishes for every taste', 'Piatti principali sostanziosi per ogni gusto', 'ለእያንዳንዱ ጣዕም የሚሆን ዋና ምግብ', 2),
('Desserts', 'Dolci', 'ጣፋጭ', 'Sweet treats to end your meal perfectly', 'Dolci per concludere perfettamente il pasto', 'ምግብዎን በጥሩ ሁኔታ ለመጨረስ ጣፋጭ', 3),
('Drinks', 'Bevande', 'መጠጦች', 'Refreshing beverages and specialty drinks', 'Bevande rinfrescanti e drink speciali', 'አድስ ማድረጊያ መጠጦች እና ልዩ መጠጦች', 4);

-- Insert sample menu items
INSERT INTO menu_items (
    category_id, name_en, name_it, name_am, description_en, description_it, description_am,
    price_usd, price_eur, price_etb, image_url, is_available, is_featured, preparation_time,
    calories, is_vegetarian, is_vegan, is_gluten_free, is_halal, is_dairy_free,
    contains_nuts, contains_dairy, contains_seafood, contains_eggs, contains_soy, contains_gluten
) VALUES
-- Starters
(1, 'Bruschetta Trio', 'Trio di Bruschette', 'ብሩሽቴታ ሶስት', 
 'Three varieties of our signature bruschetta with fresh tomatoes, basil, and mozzarella', 
 'Tre varietà della nostra bruschetta con pomodori freschi, basilico e mozzarella',
 'በትኩስ ቲማቲም፣ በባዚል እና በሞዛሬላ የተሰራ የእኛ ልዩ ብሩሽቴታ ሶስት ዓይነት',
 12.99, 11.50, 650, '/placeholder.svg?height=300&width=400', 
 true, true, 10, 320, true, false, false, true, false, false, true, false, false, false, true),

(1, 'Seafood Platter', 'Piatto di Mare', 'የባህር ምግብ', 
 'Fresh selection of grilled shrimp, calamari, and fish with lemon herbs', 
 'Selezione fresca di gamberi grigliati, calamari e pesce con erbe al limone',
 'በሎሚ ቅጠሎች የተቀመመ ግሪል የተደረገ ሽሪምፕ፣ ካላማሪ እና ዓሳ',
 18.99, 16.50, 950, '/placeholder.svg?height=300&width=400', 
 true, false, 15, 280, false, false, true, true, true, false, false, true, false, false, false),

-- Main Course
(2, 'Grilled Salmon', 'Salmone Grigliato', 'ግሪል ሳልሞን', 
 'Atlantic salmon grilled to perfection with seasonal vegetables and quinoa', 
 'Salmone atlantico grigliato alla perfezione con verdure di stagione e quinoa',
 'በወቅታዊ አትክልቶች እና በኪኖዋ የተሰራ በጥሩ ሁኔታ ግሪል የተደረገ አትላንቲክ ሳልሞን',
 26.99, 24.00, 1350, '/placeholder.svg?height=300&width=400', 
 true, true, 20, 450, false, false, true, true, true, false, false, true, false, false, false),

(2, 'Vegetarian Pasta', 'Pasta Vegetariana', 'የቬጀቴሪያን ፓስታ', 
 'Homemade pasta with roasted vegetables, basil pesto, and parmesan cheese', 
 'Pasta fatta in casa con verdure arrostite, pesto di basilico e parmigiano',
 'በተጠበሰ አትክልት፣ በባዚል ፔስቶ እና በፓርሜዛን ቺዝ የተሰራ የቤት ፓስታ',
 19.99, 17.50, 1000, '/placeholder.svg?height=300&width=400', 
 true, false, 18, 520, true, false, false, true, false, false, true, false, false, false, true),

-- Desserts
(3, 'Tiramisu', 'Tiramisù', 'ቲራሚሱ', 
 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream', 
 'Classico dolce italiano con savoiardi imbevuti di caffè e crema di mascarpone',
 'በቡና የተነከረ ላዲፊንገርስ እና በማስካርፖኔ ክሬም የተሰራ ክላሲክ ጣሊያናዊ ጣፋጭ',
 8.99, 7.50, 450, '/placeholder.svg?height=300&width=400', 
 true, true, 5, 380, true, false, false, true, false, false, true, false, true, false, true),

(3, 'Vegan Chocolate Cake', 'Torta al Cioccolato Vegana', 'ቬጋን ቸኮሌት ኬክ', 
 'Rich chocolate cake made with plant-based ingredients and berry compote', 
 'Ricca torta al cioccolato fatta con ingredienti vegetali e composta di frutti di bosco',
 'በእፅዋት ንጥረ ነገሮች እና በቤሪ ኮምፖት የተሰራ ሀብታም ቸኮሌት ኬክ',
 9.99, 8.50, 500, '/placeholder.svg?height=300&width=400', 
 true, false, 5, 320, true, true, true, true, true, true, false, false, false, false, false),

-- Drinks
(4, 'Fresh Orange Juice', 'Succo d''Arancia Fresco', 'ትኩስ ብርቱካን ጁስ', 
 'Freshly squeezed orange juice from local organic oranges', 
 'Succo d''arancia appena spremuto da arance biologiche locali',
 'ከአካባቢው ኦርጋኒክ ብርቱካን የተጨመቀ ትኩስ ብርቱካን ጁስ',
 4.99, 4.00, 250, '/placeholder.svg?height=300&width=400', 
 true, false, 3, 110, true, true, true, true, true, false, false, false, false, false, false),

(4, 'Ethiopian Coffee', 'Caffè Etiope', 'የኢትዮጵያ ቡና', 
 'Traditional Ethiopian coffee ceremony with freshly roasted beans', 
 'Cerimonia tradizionale del caffè etiope con chicchi appena tostati',
 'በአዲስ የተጠበሰ ፍሬ የተሰራ ባህላዊ የኢትዮጵያ የቡና ሥነ ሥርዓት',
 6.99, 6.00, 350, '/placeholder.svg?height=300&width=400', 
 true, true, 8, 5, true, true, true, true, true, false, false, false, false, false, false);

-- Insert customization options
INSERT INTO customization_options (menu_item_id, option_type, name_en, name_it, name_am, price_modifier, is_required) VALUES
-- Salmon customizations
(3, 'cooking', 'Medium Rare', 'Medio al Sangue', 'መካከለኛ ጥሬ', 0, true),
(3, 'cooking', 'Medium', 'Medio', 'መካከለኛ', 0, true),
(3, 'cooking', 'Well Done', 'Ben Cotto', 'በደንብ የበሰለ', 0, true),
(3, 'side', 'Extra Vegetables', 'Verdure Extra', 'ተጨማሪ አትክልት', 3.00, false),
(3, 'side', 'Rice Instead of Quinoa', 'Riso al Posto della Quinoa', 'ከኪኖዋ ይልቅ ሩዝ', 0, false),

-- Pasta customizations
(4, 'size', 'Regular', 'Normale', 'መደበኛ', 0, true),
(4, 'size', 'Large', 'Grande', 'ትልቅ', 4.00, true),
(4, 'topping', 'Extra Cheese', 'Formaggio Extra', 'ተጨማሪ አይብ', 2.50, false),
(4, 'topping', 'Grilled Chicken', 'Pollo Grigliato', 'ግሪል ዶሮ', 5.00, false);

export type AllergenModel =
// Céréales contenant du gluten
  | 'GLUTEN'              // Blé, seigle, orge, avoine, épeautre, kamut

  // Produits d'origine animale
  | 'MILK'                // Lait et dérivés (lactose, caséine)
  | 'EGGS'                // Œufs et dérivés
  | 'FISH'                // Poissons
  | 'SHELLFISH'           // Crustacés (crevettes, crabes, homards)
  | 'MOLLUSKS'            // Mollusques (escargots, moules, huîtres)

  // Noix et graines
  | 'TREE_NUTS'           // Amandes, noisettes, noix, pistaches, etc.
  | 'PEANUTS'             // Arachides (légumineuse, pas une noix)
  | 'SESAME'              // Graines de sésame

  // Légumineuses et végétaux
  | 'SOY'                 // Soja et dérivés
  | 'CELERY'              // Céleri et dérivés
  | 'MUSTARD'             // Moutarde et dérivés
  | 'LUPIN'               // Lupin (légumineuse)

  // Additifs
  | 'SULFITES'            // Dioxyde de soufre et sulfites (>10mg/kg)

  // Fruits courants
  | 'STRAWBERRIES'        // Fraises et fruits rouges similaires
  | 'KIWI'                // Kiwi
  | 'CITRUS'              // Agrumes (orange, citron, pamplemousse)
  | 'LATEX_FRUITS'        // Banane, avocat, châtaigne (syndrome latex-fruit)
  | 'STONE_FRUITS'        // Pêche, abricot, prune, cerise

  // Légumes
  | 'TOMATOES'            // Tomates et solanacées
  | 'CARROTS'             // Carottes
  | 'ONIONS'              // Oignons, échalotes, ail
  | 'BELL_PEPPERS'        // Poivrons

  // Épices et herbes
  | 'PAPRIKA'             // Paprika
  | 'CORIANDER'           // Coriandre
  | 'FENNEL'              // Fenouil
  | 'MINT'                // Menthe
  | 'PARSLEY'             // Persil

  // Additifs et conservateurs
  | 'MSG'                 // Glutamate monosodique
  | 'FOOD_COLORING'       // Colorants alimentaires
  | 'PRESERVATIVES'       // Conservateurs (BHA, BHT, etc.)
  | 'ARTIFICIAL_SWEETENERS' // Aspartame, sucralose, etc.

  // Autres allergènes spécifiques
  | 'CHOCOLATE'           // Cacao et dérivés
  | 'VANILLA'             // Vanille
  | 'YEAST'               // Levures
  | 'CORN'                // Maïs et dérivés
  | 'RICE'                // Riz (rare mais existe)
  | 'BUCKWHEAT'           // Sarrasin
  ;
// Totally overkill programming language name generator that I had a blast making
// Ramsey Nasser, a cloudy October morning, 2012

var NameGenerator = (function() {
  var patternParser = PEG.buildParser(" \
     start = expression* \
     expression 'expression' = '(' ex:expression+ ')' ch:chance? { return { expressions:ex, chance:(ch == '' ? 1.0 : ch) } } \
        / '[' ex:expression+ ']' ch:chance? { return { options:ex, chance:(ch == '' ? 1.0 : ch) } } \
        / cat:category ch:chance? { return { category:cat, chance:(ch == '' ? 1.0 : ch) } } \
     category = white cat:[a-z]+ white { return cat.join('') } \
     chance = white '%' digits:[0-9]+ white { return parseFloat( '0.' + digits.join('')) } \
     white = ' '* { return '' } \
     ");

  function compile_node (node, config) {
    if(Math.random() < node.chance) {
      if(node.category) {
        if(config[node.category]) {
          var category = config[node.category];
          return category[Math.floor(Math.random() * category.length)];

        } else {
          // unknown category error

        }

      } else if(node.expressions) {
        return node.expressions.map(function(e) {
          return compile_node(e, config);
        }).join("")

      } else if(node.options) {
        // TODO not the best implementation
        return compile_node(node.options[Math.floor(Math.random() * node.options.length)], config);

      }

        
    }

    return "";
  }

  var nameGenerator = {
    make_name: function(pattern, config) {
      if(!config) config=nameGenerator.default_config;
      var name = "";
      
      var ast = patternParser.parse(pattern);
      for (var i = 0; i < ast.length; i++) {
        var node = ast[i];
        name += compile_node(node, config);
      };

      return name;
    },

    default_config: {
      year: function() { return Math.floor(Math.random() * 35 + 60).toString(); },
      suffix: ["!", "#", "*", "+", "++", "-", "--", "Talk", "Script"],
      adjective: ["Adorable", "Beautiful", "Clean", "Drab", "Elegant", "Fancy", "Glamorous", "Handsome", "Long", "Magnificent", "Old-fashioned", "Plain", "Quaint", "Sparkling", "Ugliest", "Unsightly", "Wide-eyed", "Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Gray", "Black", "White", "Alive", "Better", "Careful", "Clever", "Dead", "Easy", "Famous", "Gifted", "Helpful", "Important", "Inexpensive", "Mushy", "Odd", "Powerful", "Rich", "Shy", "Tender", "Uninterested", "Vast", "Wrong.", "Angry", "Bewildered", "Clumsy", "Defeated", "Embarrassed", "Fierce", "Grumpy", "Helpless", "Itchy", "Jealous", "Lazy", "Mysterious", "Nervous", "Obnoxious", "Panicky", "Repulsive", "Scary", "Thoughtless", "Uptight", "Worried", "Agreeable", "Brave", "Calm", "Delightful", "Eager", "Faithful", "Gentle", "Happy", "Jolly", "Kind", "Lively", "Nice", "Obedient", "Proud", "Relieved", "Silly", "Thankful", "Victorious", "Witty", "Zealous", "Broad", "Chubby", "Crooked", "Curved", "Deep", "Flat", "High", "Hollow", "Low", "Narrow", "Round", "Shallow", "Skinny", "Square", "Steep", "Straight", "Wide.", "Big", "Colossal", "Fat", "Gigantic", "Great", "Huge", "Immense", "Large", "Little", "Mammoth", "Massive", "Miniature", "Petite", "Puny", "Scrawny", "Short", "Small", "Tall", "Teeny", "Teeny", "Tiny", "Cooing", "Deafening", "Faint", "Hissing", "Loud", "Melodic", "Noisy", "Purring", "Quiet", "Raspy", "Screeching", "Thundering", "Voiceless", "Whispering", "Ancient", "Brief", "Early", "Fast", "Late", "Long", "Modern", "Old", "Old-fashioned", "Quick", "Rapid", "Short", "Slow", "Swift", "Young", "Bitter", "Delicious", "Fresh", "Greasy", "Juicy", "Hot", "Icy", "Loose", "Melted", "Nutritious", "Prickly", "Rainy", "Rotten", "Salty", "Sticky", "Strong", "Sweet", "Tart", "Tasteless", "Uneven", "Weak", "Wet", "Wooden", "Yummy", "Boiling", "Breeze", "Broken", "Bumpy", "Chilly", "Cold", "Cool", "Creepy", "Crooked", "Cuddly", "Curly", "Damaged", "Damp", "Dirty", "Dry", "Dusty", "Filthy", "Flaky", "Fluffy", "Freezing", "Hot", "Warm", "Wet", "Abundant", "Empty", "Few", "Full", "Heavy", "Light", "Many", "Numerous", "Sparse", "Substantial"],
      gem: ["Agate", "Malachite", "Geode", "Mali", "Alexandrite", "Almandine", "Melanite", "Amazonite", "Moldavite", "Amber", "Moonstone", "Amethyst", "Morganite", "Ametrine", "Opal", "Ammolite", "Quartz", "Andalusite", "Nuumite", "Apatite", "Obsidian", "Aquamarine", "Onyx", "Aventurine", "Opal", "Axinite", "Orthoclase", "Beryl", "Bloodstone", "Pearl", "Calcite", "Peridot", "Carnelian", "Pietersite", "Cassiterite", "Prehnite", "Quartz", "Chalcedony", "Rhodochrosite", "Charoite", "Rhodonite", "Chrysoberyl", "Ruby", "Chrysocolla", "Ruby-zoisite", "Chrysoprase", "Citrine", "Clinohumite", "Sapphire", "Scapolite", "Seraphinite", "Serpentine", "Coral", "Danburite", "Smithsonite", "Diamond", "Sodalite", "Emerald", "Sphalerite", "Sphene", "Spinel", "Fluorite", "Spodumene", "Gaspeite", "Goshenite", "Hackmanite", "Hambergite", "Hematite", "Hemimorphite", "Sugilite", "Hiddenite", "Sunstone", "Howlite", "Tanzanite", "Idocrase", "Iolite", "Jadeite", "Topaz", "Jasper", "Tourmaline", "Kunzite", "Kyanite", "Turquoise", "Labradorite", "Variscite", "Verdite", "Larimar", "Zircon", "Lepidolite"],
      planet: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Ceres", "Haumea", "Makemake", "Eris", "Pluto", "Sedna"],
      emotion: ["Fear", "Anger", "Sadness", "Joy", "Disgust", "Trust", "Anticipation", "Surprise", "Confusion", "Expectation", "Wonder", "Commonplace", "Happiness", "Unhappiness", "Amusement", "Weariness", "Courage", "Timidity", "Cowardice", "Pity", "Cruelty", "Modesty", "Shame", "Closeness", "Detachment", "Distance", "Complaint", "Pain", "Average", "Pleasure", "Caution", "Boldness", "Rashness", "Patience", "Tolerance", "Relaxation", "Composure", "Stress", "Envy", "Nervousness", "Security", "Togetherness", "Privacy", "Respect", "Disrespect", "Appreciation", "Love", "Hatred", "Hope", "Despair"],
      name: ["Afanasyeva", "Agnesi", "Williams", "Andrews", "Asprey", "Ayrton", "Bari", "Barnum", "Barrett", "Baxter", "Bellow", "Bernstein", "Nayak", "Birman", "Blanch", "Blum", "Stott", "Boole", "Borok", "Browne", "Bringmann", "Cartwright", "Chang", "Chtelet", "Chung", "Crous", "Csrnyei", "Curie", "Wavelets", "Daubechies", "David", "Driscoll", "Devi", "Erdmann", "Goldwasser", "Hay", "Haynes", "Herschel", "Hopper", "Howson", "Hudson", "Alexandria", "Karp", "Keen", "Kirwan", "Kopell", "Kovalevskaya", "Krieger", "Kuperberg", "Longyear", "Lovelace", "Lilavati", "Mcduff", "Merrill", "Mirzakhani", "Moufang", "Kalamara", "Neumann", "Nightingale", "Noether", "Ollerenshaw", "Pter", "Piscopia", "Pless", "Kochina", "Praeger", "Rees", "Reiten", "Robinson", "Rudin", "Scott", "Snaith", "Somerville", "Srinivasan", "Stegun", "Szekeres", "Ss", "Todd", "Terras", "Theano", "Tillmann", "Wheeler", "Wood", "Wright", "Wrinch", "Young"],
      letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      animal: ["Aardvark", "Aardwolf", "Afghan", "Hound", "Albatross", "Alligator", "Alpaca", "American", "Robin", "Anaconda", "Angelfish", "Anglerfish", "Ant", "Anteater", "Antelope", "Antlion", "Ape", "Aphid", "Armadillo", "Arrow", "Crab", "Asp", "Ass", "Baboon", "Badger", "Bald", "Eagle", "Bandicoot", "Barnacle", "Basilisk", "Barracuda", "Bass", "Basset", "Bat", "Beaked", "Whale", "Bear", "Beaver", "Bedbug", "Bee", "Beetle", "Bird", "Bison", "Blackbird", "Black", "Panther", "Widow", "Spider", "Blue", "Jay", "Whale", "Boa", "Bobcat", "Bobolink", "Bonobo", "Booby", "Box", "Jellyfish", "Boston", "Terrier", "Bovid", "Buffalo", "Bug", "Bulldog", "Bull", "Butterfly", "Buzzard", "Camel", "Canid", "Cape", "Capybara", "Cardinal", "Caribou", "Carp", "Cat", "Caterpillar", "Catfish", "Cattle", "Centipede", "Cephalopod", "Chameleon", "Cheetah", "Chickadee", "Chicken", "Chihuahua", "Chimpanzee", "Chinchilla", "Chipmunk", "Clam", "Clownfish", "Cobra", "Cockroach", "Cod", "Collie", "Condor", "Constrictor", "Coral", "Cougar", "Cow", "Coyote", "Crab", "Crane", "Fly", "Crawdad", "Crayfish", "Cricket", "Crocodile", "Crow", "Cuckoo", "Daddy", "Longlegs", "Damselfly", "Deer", "Dingo", "Dinosaur", "Dog", "Dolphin", "Donkey", "Dormouse", "Dove", "Dragonfly", "Duck", "Dung", "Beetle", "Earthworm", "Earwig", "Echidna", "Eel", "Egret", "Elephant", "Seal", "Elk", "Emu", "English", "Pointer", "Setter", "Ermine", "Falcon", "Ferret", "Finch", "Firefly", "Fish", "Flamingo", "Flea", "Flyingfish", "Fowl", "Fox", "Frog", "Fruit", "Galliwasp", "Gazelle", "Gecko", "Gerbil", "German", "Shepherd", "Giant", "Panda", "Squid", "Gibbon", "Gila", "Monster", "Guanaco", "Guineafowl", "Giraffe", "Goat", "Golden", "Retriever", "Goldfinch", "Goldfish", "Goose", "Gopher", "Gorilla", "Grasshopper", "Great", "Heron", "Dane", "White", "Shark", "Greyhound", "Grizzly", "Ground", "Sloth", "Grouse", "Guinea", "Pig", "Gull", "Guppy", "Haddock", "Halibut", "Hammerhead", "Hamster", "Hare", "Harrier", "Hawk", "Hedgehog", "Hermit", "Herring", "Hippopotamus", "Hookworm", "Hornet", "Horse", "Hoverfly", "Human", "Hummingbird", "Humpback", "Husky", "Hyena", "Iguana", "Impala", "Insect", "Irish", "Wolfhound", "Irukandji", "Jackal", "Jaguar", "Jellyfish", "Kangaroo", "Mouse", "Rat", "Kingfisher", "Kite", "Kiwi", "Koala", "Koi", "Komodo", "Dragon", "Krill", "Labrador", "Ladybug", "Lamprey", "Lark", "Leech", "Lemming", "Lemur", "Leopard", "Leopon", "Liger", "Lion", "Lizard", "Llama", "Lobster", "Locust", "Loon", "Louse", "Lungfish", "Lynx", "Macaw", "Mackerel", "Magpie", "Mammal", "Mammoth", "Mandrill", "Manta", "Ray", "Marlin", "Marmoset", "Marmot", "Marsupial", "Marten", "Mastiff", "Mastodon", "Meadowlark", "Meerkat", "Mink", "Minnow", "Mite", "Mockingbird", "Mole", "Mollusk", "Mongoose", "Monitor", "Lizard", "Monkey", "Moose", "Mosquito", "Moth", "Mountain", "Goat", "Mouse", "Mule", "Muskox", "Mussel", "Narwhal", "Newt", "Nightingale", "Ocelot", "Octopus", "Old", "Sheepdog", "Opossum", "Orangutan", "Orca", "Ostrich", "Otter", "Owl", "Ox", "Oyster", "Panther", "Panthera", "Hybrid", "Parakeet", "Parrot", "Parrotfish", "Partridge", "Peacock", "Peafowl", "Pekingese", "Pelican", "Penguin", "Perch", "Peregrine", "Persian", "Pheasant", "Pig", "Pigeon", "Pike", "Pilot", "Pinniped", "Piranha", "Planarian", "Platypus", "Polar", "Bear", "Pony", "Poodle", "Porcupine", "Porpoise", "Portuguese", "Man", "O'", "War", "Possum", "Prairie", "Dog", "Prawn", "Praying", "Mantis", "Primate", "Puffin", "Puma", "Python", "Quail", "Quelea", "Quokka", "Rabbit", "Raccoon", "Rainbow", "Trout", "Rat", "Rattlesnake", "Raven", "(batoidea)", "(rajiformes)", "Red", "Reindeer", "Rhinoceros", "Right", "Roadrunner", "Rodent", "Rook", "Rooster", "Roundworm", "Saber-toothed", "Cat", "Sailfish", "Saint", "Bernard", "Salamander", "Salmon", "Sawfish", "Scale", "Insect", "Scallop", "Scorpion", "Sea", "Anemone", "Cow", "Seahorse", "Lion", "Slug", "Urchin", "Shark", "Sheep", "Shrew", "Shrimp", "Siamese", "Silkworm", "Silverfish", "Skink", "Skunk", "Slug", "Smelt", "Snail", "Snake", "Snipe", "Snow", "Sockeye", "Salmon", "Sole", "Spaniel", "Sparrow", "Sperm", "Monkey", "Spoonbill", "Squid", "Squirrel", "Starfish", "Star-nosed", "Steelhead", "Stingray", "Stoat", "Stork", "Sturgeon", "Sugar", "Glider", "Swallow", "Swan", "Swift", "Swordfish", "Swordtail", "Tabby", "Tahr", "Takin", "Tapeworm", "Tapir", "Tarantula", "Tarsier", "Tasmanian", "Devil", "Termite", "Tern", "Thrush", "Tick", "Tiger", "Tiglon", "Toad", "Tortoise", "Toucan", "Toy", "Trapdoor", "Spider", "Tree", "Frog", "Trout", "Tuna", "Turkey", "Turtle", "Tyrannosaurus", "Urial", "Vampire", "Bat", "Vicuna", "Viper", "Vole", "Vulture", "Wallaby", "Walrus", "Wasp", "Warbler", "Water", "Weasel", "Whippet", "Whitefish", "Whooping", "Wildcat", "Wildebeest", "Wildfowl", "Wolf", "Wolverine", "Wombat", "Woodpecker", "Worm", "Wren", "Xerinae", "X-ray", "Fish", "Yak", "Yellow", "Zebra"],
      tree: ["Alder", "Almus", "Snowdrop", "Amur", "Apricot", "Arborvitae", "Ash", "Beech", "Birch", "Gum", "Haw", "Bladdernut", "Goldenrain", "Boxelder", "Buckeye", "Buckthorn", "Bumelia", "Buckwheat", "Camellia", "Carolina", "Cherry", "Laurel", "Castoraralia", "Catalpa", "Cedar", "Lebanon", "Ceder", "Cedrela", "Chastetree", "Cherry", "Cherry;", "Wild", "Black", "Cherrylaurel", "Chestnut", "Chinaberry", "Chinese", "Flame", "Cedrela", "Chinquapin", "Chokeberry", "Chokecherry", "Corktree", "Cottonwood", "Crabapple", "Crabapples", "Crape", "Myrtle", "Cryptomeria", "Cypress", "Dahoon", "Holly", "Date", "Dawn", "Redwood", "Devil", "Devilwood", "Dogwood", "Dove", "Elderberry", "Elm", "Empress", "Princess", "Epaulettetree", "Eucalyptus", "Euonymus", "Euptellea"]
    }

  }

  return nameGenerator;
}());
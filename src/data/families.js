export const SCENT_FAMILIES = [
  {
    id: 'aromatic', name: 'Aromatic', emoji: '🌿',
    examples: 'Chamomile, thyme, lavender',
    desc: 'Clean and herbal, like a warm cup of tea or a calm herbal bath.',
    tagline: 'Like breathing slowly and letting go.',
  },
  {
    id: 'citrus', name: 'Citrus', emoji: '🍋',
    examples: 'Lemon, lime, yuzu',
    desc: 'Fresh and zesty, like peeling a lemon or sipping iced yuzu tea in the summer.',
    tagline: 'The kind of scent that says "hello" with a smile.',
  },
  {
    id: 'fruity', name: 'Fruity', emoji: '🍑',
    examples: 'Peach, cherry, apple, pear',
    desc: 'Juicy and sweet, like biting into a perfectly ripe fruit.',
    tagline: 'A gentle kind of happiness.',
  },
  {
    id: 'floral', name: 'Floral', emoji: '🌸',
    examples: 'Rose, jasmine, lilac, tuberose',
    desc: 'The smell of blooming flowers — soft, romantic, or vibrant.',
    tagline: 'A scent that speaks through petals.',
  },
  {
    id: 'woody', name: 'Woody', emoji: '🪵',
    examples: 'Sandalwood, patchouli, tobacco',
    desc: 'Dry and grounding, like walking through a calm forest or smelling aged wood.',
    tagline: 'The calm strength at the base of a scent.',
  },
  {
    id: 'gourmand', name: 'Gourmand', emoji: '☕',
    examples: 'Chocolate, coffee, caramel',
    desc: 'Sweet and edible, like desserts or cozy cafes.',
    tagline: 'A scent that feels like comfort you could almost eat.',
  },
  {
    id: 'green', name: 'Green', emoji: '🌱',
    examples: 'Cucumber, tomato leaf, mint',
    desc: 'Crisp, raw, and refreshing — like breaking a cucumber or touching wet leaves.',
    tagline: 'Smells like nature waking up.',
  },
  {
    id: 'balsamic', name: 'Balsamic', emoji: '🍯',
    examples: 'Myrrh, amber, balsam',
    desc: 'Sweet and rich, with a warm and soft texture.',
    tagline: 'A scent that stays with you quietly, like a memory.',
  },
  {
    id: 'spicy', name: 'Spicy', emoji: '🫚',
    examples: 'Ginger, cinnamon, anise',
    desc: 'Warm and slightly sharp, like spices in chai or mulled wine.',
    tagline: 'A quiet spark beneath the surface.',
  },
  {
    id: 'animalic', name: 'Animalic', emoji: '🌫️',
    examples: 'Musk, ambergris, civet cat',
    desc: 'Raw and intimate, like warm skin or soft fur.',
    tagline: 'A scent that feels close, instinctive, and very human.',
  },
  {
    id: 'fresh', name: 'Fresh', emoji: '💨',
    examples: 'Linen, rain, ozone',
    desc: 'Clean, airy, and light — like fresh laundry on a windy day.',
    tagline: 'Like opening the window and breathing in clarity.',
  },
  {
    id: 'liquor', name: 'Liquor', emoji: '🥃',
    examples: 'Rum, whiskey, gin',
    desc: 'Warm and intoxicating, like a dimly lit bar or amber glass of spirits.',
    tagline: 'Like feeling the night unfold, smooth and deep.',
  },
]

export const DEFAULT_VIAL_ORDER = SCENT_FAMILIES.map(f => f.id)

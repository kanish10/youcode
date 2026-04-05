export type KidStory = {
  id: string;
  title: string;
  emoji: string;
  readTime: string;
  paragraphs: string[];
};

export type Lullaby = {
  id: string;
  title: string;
  origin: string;
  emoji: string;
  youtubeQuery: string;
};

export type Feeling = {
  id: string;
  emoji: string;
  label: string;
  response: string;
  suggestion: string;
};

export const STORIES: KidStory[] = [
  {
    id: "moon-friend",
    title: "The Moon Who Wanted a Friend",
    emoji: "🌙",
    readTime: "2 min",
    paragraphs: [
      "Once there was a moon who lived all alone in the sky. Every night she would shine her softest light, hoping someone might see her.",
      "One night, a small child looked out of their window and saw the moon. The child waved, and the moon felt warm all over.",
      "\"Hello,\" said the moon, very quietly. \"Hello,\" whispered the child.",
      "From then on, every night, the child looked for the moon, and the moon looked for the child. And neither of them was ever lonely again.",
      "Goodnight, moon. Goodnight, little one. 🌙",
    ],
  },
  {
    id: "brave-mouse",
    title: "The Mouse Who Was Small But Brave",
    emoji: "🐭",
    readTime: "2 min",
    paragraphs: [
      "There was once a very small mouse named Pip. Pip was smaller than all the other mice. When the wind blew, Pip had to hold on tight.",
      "One day the other mice were scared to cross a big puddle. \"It's too big,\" they said. \"We'll get wet.\"",
      "But Pip was small, and Pip was brave. Pip climbed on a leaf and floated right across.",
      "The other mice cheered. They followed Pip, one by one. Pip showed them the way.",
      "Being small did not mean being afraid. It meant finding your own clever path. 🍃",
    ],
  },
  {
    id: "two-trees",
    title: "The Two Trees",
    emoji: "🌳",
    readTime: "2 min",
    paragraphs: [
      "In a quiet forest grew two trees. They were side by side, but their roots tangled together under the ground.",
      "In the storm, one tree bent very low. It thought, \"I will break. I cannot stand.\"",
      "But the other tree held on tight with its roots, holding up its friend.",
      "When the storm passed, both trees were still standing. They had held each other through the whole night.",
      "Every tree needs another tree. That is how forests grow. 🌲🌲",
    ],
  },
  {
    id: "sleepy-cat",
    title: "The Cat Who Found a Warm Spot",
    emoji: "🐈",
    readTime: "2 min",
    paragraphs: [
      "There was a cat who walked and walked. She was looking for a warm place to sleep.",
      "She tried the garden, but the grass was wet. She tried the porch, but the wind was loud.",
      "Then she found a blanket, folded soft on a chair, and it smelled like home.",
      "The cat curled into a small, round shape. She closed her eyes. She felt safe.",
      "Sometimes the warm spot finds you. Just when you need it most. 🛋️",
    ],
  },
];

export const LULLABIES: Lullaby[] = [
  {
    id: "twinkle",
    title: "Twinkle Twinkle Little Star",
    origin: "English classic",
    emoji: "⭐",
    youtubeQuery: "Twinkle Twinkle Little Star lullaby gentle",
  },
  {
    id: "hushaby",
    title: "Hush Little Baby",
    origin: "American folk lullaby",
    emoji: "🌙",
    youtubeQuery: "Hush Little Baby lullaby traditional",
  },
  {
    id: "brahms",
    title: "Brahms' Lullaby",
    origin: "German / universal",
    emoji: "🎵",
    youtubeQuery: "Brahms lullaby piano gentle",
  },
  {
    id: "duerme-negrito",
    title: "Duerme Negrito",
    origin: "Spanish/Latin American",
    emoji: "🌺",
    youtubeQuery: "Duerme Negrito lullaby traditional",
  },
  {
    id: "nina-bobo",
    title: "Nina Bobo",
    origin: "Indonesian lullaby",
    emoji: "🌸",
    youtubeQuery: "Nina Bobo Indonesian lullaby",
  },
  {
    id: "dodo-lenfant",
    title: "Dodo l'enfant do",
    origin: "French lullaby",
    emoji: "🌷",
    youtubeQuery: "Dodo l'enfant do French lullaby",
  },
  {
    id: "chanda-mama",
    title: "Chanda Mama Door Ke",
    origin: "Hindi lullaby",
    emoji: "🌙",
    youtubeQuery: "Chanda Mama Door Ke lullaby",
  },
  {
    id: "mountain-stream",
    title: "Gentle Stream Sounds",
    origin: "Nature · for rest",
    emoji: "💧",
    youtubeQuery: "gentle stream water sounds sleep baby",
  },
];

export const FEELINGS: Feeling[] = [
  {
    id: "happy",
    emoji: "😊",
    label: "Happy",
    response: "That's a nice feeling! What made you smile today?",
    suggestion: "Draw a picture of what made you happy.",
  },
  {
    id: "sad",
    emoji: "😢",
    label: "Sad",
    response: "Sad is okay. It means something matters to you.",
    suggestion: "Would you like to draw your feeling? Or sit with a grown-up who loves you?",
  },
  {
    id: "angry",
    emoji: "😠",
    label: "Mad",
    response: "It's okay to feel mad. Your feelings make sense.",
    suggestion: "Try this: Breathe in like you're smelling a flower. Breathe out like you're blowing out a candle. Three times.",
  },
  {
    id: "scared",
    emoji: "😨",
    label: "Scared",
    response: "Scared means your body is trying to keep you safe. You are safe right now.",
    suggestion: "Look around. Name 3 things you can see. That will help you feel here again.",
  },
  {
    id: "tired",
    emoji: "😴",
    label: "Tired",
    response: "Tired bodies need rest. That's how they grow strong.",
    suggestion: "Listen to a lullaby together. Or just close your eyes for 1 minute.",
  },
  {
    id: "calm",
    emoji: "😌",
    label: "Calm",
    response: "Calm is a beautiful feeling. Stay with it a moment.",
    suggestion: "Breathe in slowly and smile. Can you feel the calm in your toes?",
  },
];

export const COLORING_IDEAS: { emoji: string; title: string; description: string }[] = [
  { emoji: "🌻", title: "Sunflower", description: "A tall sunflower with petals to count" },
  { emoji: "🦋", title: "Butterfly", description: "A big butterfly with matching wings" },
  { emoji: "🏡", title: "My Home", description: "Draw a house with a window and a door" },
  { emoji: "🐠", title: "Fish Tank", description: "Colorful fish swimming in water" },
  { emoji: "🌳", title: "Family Tree", description: "A tree with the people you love" },
  { emoji: "🌈", title: "Rainbow", description: "All the colors you can think of" },
];

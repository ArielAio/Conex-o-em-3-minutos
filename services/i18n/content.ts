import { Mission } from "../../types";

type MissionTranslation = Partial<
  Pick<Mission, "title" | "shortDescription" | "action" | "quote" | "insights">
>;

export const MISSION_TRANSLATIONS_EN: Record<number, MissionTranslation> = {
  1: {
    title: "2-Minute Gaze",
    shortDescription: "Reconnect in silence.",
    action: "Sit facing each other and hold eye contact for 2 minutes. Breathe together.",
    quote: "Shared silence is the language of intimacy.",
    insights: [
      "Eye contact slows the heart and signals safety; use a timer to avoid rushing.",
      "Match breathing to calm the nervous system and shift out of defense mode.",
    ],
  },
  2: {
    title: "Specific Praise",
    shortDescription: "Clear appreciation builds safety.",
    action: "Say one specific thing you admire and why. Be concrete, not generic.",
    quote: "What is admired, blossoms.",
    insights: [
      "Detail makes praise sound true: cite the gesture and its impact on you.",
      "Focus on effort and character, not only results; that sustains motivation.",
    ],
  },
  3: {
    title: "Different Question",
    shortDescription: "Break the script.",
    action: 'Ask: “What was the best minute of your day and why?” Listen without interrupting.',
    quote: "Listening is a silent hug.",
    insights: [
      "New questions pull the brain out of autopilot and reveal what truly matters.",
      "Listening without cuts lowers cortisol and increases the feeling of being held.",
    ],
  },
  4: {
    title: "20-Second Hug",
    shortDescription: "Calming touch.",
    action: "Share a 20-second hug. Just breathe and feel.",
    quote: "A long hug is a temporary home.",
    insights: [
      "Twenty seconds releases oxytocin; relax your shoulders and breathe deeply.",
      "A long hug says 'you are safe with me' without words.",
    ],
  },
  5: {
    title: "Gratitude Tonight",
    shortDescription: "End the day with appreciation.",
    action: "Before bed, thank your partner for something they did today or this week.",
    quote: "Gratitude turns what we have into enough.",
    insights: [
      "Ending the day with gratitude reduces rumination and improves sleep for both.",
      "Thank the behavior and the effort behind it to reinforce repetition.",
    ],
  },
  6: {
    title: "Small Plan Together",
    shortDescription: "Align expectations.",
    action: "Choose one simple thing to do together this week (coffee, short walk).",
    quote: "Small shared dreams build big bonds.",
    insights: [
      "Small plans fit the agenda and avoid frustration from big, delayed plans.",
      "Put it on the calendar with a time; without a date it fades away.",
    ],
  },
  7: {
    title: "No Autocorrect",
    shortDescription: "Speak in the first person.",
    action: 'Share a discomfort using “I feel…” without blaming. Then listen.',
    quote: "Blame shuts, vulnerability opens.",
    insights: [
      "Using 'I feel' instead of 'you always' avoids defense and opens space to listen.",
      "State the fact and the emotion: 'when X happened, I felt Y'; clarity is care.",
    ],
  },
  8: {
    title: "Hold Hands",
    shortDescription: "Simple presence.",
    action: "Hold hands for 1 minute while sharing something good from the day.",
    quote: "Small gestures sustain great stories.",
    insights: [
      "Hands say 'I’m here' without speeches; they calm the nervous system.",
      "Link touch to a good story so the brain stores the warmth with the memory.",
    ],
  },
  9: {
    title: "Thank the Effort",
    shortDescription: "Validate energy spent.",
    action: "Notice an invisible effort the other made (work, care, attention) and thank them.",
    quote: "Being seen is love in action.",
    insights: [
      "Invisible efforts turn into resentment when unseen; name the gesture and intention.",
      "Mention the impact: 'when you did X, I felt Y'.",
    ],
  },
  10: {
    title: "Small Victory",
    shortDescription: "Celebrate the micro.",
    action: "Choose something you won this week and celebrate with a simple gesture (water toast, hug, photo).",
    quote: "Celebrating small wins prepares the ground for big ones.",
    insights: [
      "Celebrating the micro trains the brain to seek what works, not just problems.",
      "A quick ritual releases dopamine and boosts motivation for next steps.",
    ],
  },
  11: {
    title: "5-5 Listening",
    shortDescription: "Take turns.",
    action: "Each speaks for 5 minutes about a favorite topic; the other just listens, then swap.",
    quote: "Listening is giving time without interruption.",
    insights: [
      "Defined time feels safe to speak without being cut off.",
      "Listening about what the other loves reveals values and desires beyond routine.",
    ],
  },
  12: {
    title: "Smell & Memory",
    shortDescription: "Activate senses.",
    action: "Smell something that reminds you of your partner (perfume, coffee, pillow) and share a good memory tied to it.",
    quote: "Scent keeps keys to the heart.",
    insights: [
      "Aromas access emotion faster than words; use it in your favor.",
      "Sharing the story behind a scent shows vulnerability and affection.",
    ],
  },
  13: {
    title: "3-Wish List",
    shortDescription: "Shared direction.",
    action: "Each writes 3 wishes for the next month. Compare and pick one to do together.",
    quote: "To love is to look together in the same direction.",
    insights: [
      "Wishes reveal current values; aligning avoids surprises.",
      "Choosing one shared wish creates focus and a sense of joint achievement.",
    ],
  },
  14: {
    title: "60s Record",
    shortDescription: "Remember the why.",
    action: "Record a 60-second audio about a meaningful memory together.",
    quote: "Shared memory strengthens today.",
    insights: [
      "A short audio becomes a capsule you can replay on tough days.",
      "Recalling the why brings back early-relationship emotion.",
    ],
  },
  15: {
    title: "Thanks for Being",
    shortDescription: "See the person, not just deeds.",
    action: 'Say: “I love how you…” and cite a character trait (kindness, humor, courage).',
    quote: "See the being, not only the doing.",
    insights: [
      "Praising traits shows you value who they are, not only what they deliver.",
      "Traits are stable; recognizing them feels like unconditional acceptance.",
    ],
  },
  16: {
    title: "Screen Pause",
    shortDescription: "Presence without distraction.",
    action: "Have a 15-minute meal without phones. Just talk or stay in silence together.",
    quote: "Attention is the currency of affection.",
    insights: [
      "Fifteen minutes without screens reduces the feeling of isolation at home.",
      "Putting phones away tells the body the other is the priority now.",
    ],
  },
  17: {
    title: "Body Map",
    shortDescription: "Conscious, gentle touch.",
    action: "Touch shoulder, back, or hands and ask where they like affection most. Respect limits.",
    quote: "Consent and care go together.",
    insights: [
      "Asking where to touch shows respect and avoids repeating what no longer feels good.",
      "Preferences change over time; updating the map keeps intimacy alive.",
    ],
  },
  18: {
    title: "Next Date",
    shortDescription: "Plan lightness.",
    action: "Schedule a 30-minute outing this week (walk, ice cream, newsstand).",
    quote: "Planning pleasure is investing in the bond.",
    insights: [
      "Short dates are sustainable and avoid the excuse of no time.",
      "Anticipation releases dopamine and lifts mood even before it happens.",
    ],
  },
  19: {
    title: "Translate a Request",
    shortDescription: "Avoid assumptions.",
    action: 'Each states a clear request for tomorrow: “I need you to…” Be specific and kind.',
    quote: "Clarity is kindness.",
    insights: [
      "Clear requests avoid frustration from guessing games.",
      "Be specific: what, when, and why; it reduces conflict and increases collaboration.",
    ],
  },
  20: {
    title: "Applause for the Invisible",
    shortDescription: "See the backstage.",
    action: "List 2 tasks the other does unseen (dishes, organizing) and thank them.",
    quote: "The invisible sustains the visible.",
    insights: [
      "Noticing invisible tasks prevents resentment about mental load.",
      "Say the task and effect: 'when you did X, I felt lighter for Y'.",
    ],
  },
  21: {
    title: "Random Toast",
    shortDescription: "Celebrate the everyday.",
    action: "Make a toast with water or tea to something simple from today. Optional photo.",
    quote: "Those who celebrate the little receive the much.",
    insights: [
      "Toasting daily trains the eye to abundance instead of lack.",
      "Simple rituals create anchors of lightness and stop the relationship from being only logistics.",
    ],
  },
  22: {
    title: "Breathe Together",
    shortDescription: "Sync rhythms.",
    action: "For 2 minutes, align your breathing. Inhale when the other inhales, exhale together.",
    quote: "Breathing together reminds you you’re a team.",
    insights: [
      "Synced breathing lowers heart rate and stress for both.",
      "Two minutes are enough to reset mood and improve listening.",
    ],
  },
  23: {
    title: "Something New",
    shortDescription: "Novelty creates dopamine.",
    action: "Pick something you’ve never done together (new recipe, new music) and do it for 10 minutes.",
    quote: "Novelty is vitamin for bonds.",
    insights: [
      "Novelty sparks dopamine and mutual interest.",
      "Ten minutes of something new breaks routine without logistics.",
    ],
  },
  24: {
    title: "Don’t Fix",
    shortDescription: "Just listen.",
    action: 'Ask: “Do you want support or solutions?” Follow what they ask. No correcting.',
    quote: "Support isn’t fixing; it’s holding.",
    insights: [
      "Asking prevents offering the wrong help and frustration.",
      "Sometimes they want to be heard, not fixed; validate before acting.",
    ],
  },
  25: {
    title: "Quick Note",
    shortDescription: "Leave a trace.",
    action: "Write a short note with something you admire. Leave it where they’ll find it.",
    quote: "Small notes, big echoes.",
    insights: [
      "Physical notes surprise and become a tangible memory.",
      "Short, specific text hits harder than an automatic message.",
    ],
  },
  26: {
    title: "Goodnight Ritual",
    shortDescription: "Create closure.",
    action: 'Before bed, share a touch (hand, forehead kiss) and a set phrase: “Good night, we’re together.”',
    quote: "Rituals seal safety.",
    insights: [
      "A closing ritual reduces anxiety before sleep and improves rest.",
      "Even on tense days, keeping the ritual avoids sleeping in a fight mode.",
    ],
  },
  27: {
    title: "Time Budget",
    shortDescription: "Invest 30 min.",
    action: "Reserve 30 minutes soon for something you both want. Put it on the calendar.",
    quote: "Scheduled time is emotional commitment.",
    insights: [
      "Blocking time shows the relationship has priority equal to work meetings.",
      "Shared calendar avoids resentment of 'you never have time'.",
    ],
  },
  28: {
    title: "Translate Emotions",
    shortDescription: "Name the feeling.",
    action: 'Each shares one emotion from today and the trigger. Use simple words: joy, fear, tired, hope.',
    quote: "Naming shrinks the distance.",
    insights: [
      "Naming emotions organizes the brain and avoids explosions from build-up.",
      "Sharing the trigger helps the other understand context and support better.",
    ],
  },
  29: {
    title: "Top 3 of the Month",
    shortDescription: "Review the path.",
    action: "List three favorite moments this month and why they mattered to you.",
    quote: "Remembering is reliving with gratitude.",
    insights: [
      "Reviewing the month consolidates positive memory and combats negativity bias.",
      "Saying why it mattered reveals values and needs met.",
    ],
  },
  30: {
    title: "Letter to the Future",
    shortDescription: "Message to tomorrow’s you.",
    action: "Record an audio or write a letter to listen to in 3 months. Say what you want to keep alive.",
    quote: "Love is built daily.",
    insights: [
      "A future letter creates emotional accountability to yourselves.",
      "Recording desires and wins helps measure progress and celebrate evolution.",
    ],
  },
};

export const NEXT_STEP_SUGGESTIONS_EN = [
  "Record a 30s audio sharing the best moment of your day—and why it mattered.",
  "Leave a short note praising something specific the other did in the last 24h.",
  "Book a 15-minute walk together this week just to talk while moving.",
  "Tell each other a recent moment that made you feel more connected.",
  "Do a 1-minute guided breath together, syncing your pace.",
  "Pick a favorite photo and talk for 3 minutes about the story behind it.",
  "Make tea or coffee together and chat without phones for 5 minutes.",
  "Swap a song that matches today’s emotional vibe.",
  'Ask: “What will you need most from me tomorrow?” and listen without interrupting.',
  "Give verbal thanks for a small thing the other did today that you noticed.",
];

export const SOLO_NEXT_STEP_SUGGESTIONS_EN = [
  "Record a 30s audio about the best moment of your day—and why it mattered to you.",
  "Leave yourself a short note praising something specific you did in the last 24h.",
  "Schedule a 15-minute solo walk this week without your phone.",
  "Write a memory that made you feel more connected to yourself.",
  "Do a 1-minute guided breath, focusing on your rhythm.",
  "Pick a favorite photo of yours and write the story behind it.",
  "Make tea or coffee and spend 5 minutes screen-free, just tasting.",
  "Create a 3-song playlist that matches your mood today.",
  'Ask yourself: “What will I need from me tomorrow?” and jot it down.',
  "Thank yourself out loud for something you almost didn’t notice you did.",
];

export const DISTANCE_NEXT_STEP_SUGGESTIONS_EN = [
  "Swap 30s audios about the best minute of the day and listen together on a quick call.",
  "Do a 5-minute video call just to share one good detail of the day—no logistics.",
  "Pick the same song to listen to and send a voice note about how it felt.",
  "Trade a photo of the day and spend 3 minutes talking about it on a call.",
  "Schedule a quick goodnight audio saying one thing you appreciated about each other today.",
  "Set 10 minutes tomorrow for a coffee over video, each with your own mug.",
  "Do a 2-minute 4-4 breath together on a call before bed.",
  "Choose an emoji code to send when you need support during the day.",
  "Send a short, specific praise by voice note before sleeping.",
  "Plan a 15-minute weekend remote date (game, recipe, playlist).",
];

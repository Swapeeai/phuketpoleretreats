/** Public workshop copy. Titles, levels, and descriptions are used as written. */

export const WORKSHOP_INTRO = "Five days to create. The workshops are about style, flow, and play: unusual movement, new combinations, and time to find what feels like you on and off the pole. Come ready to explore, follow the music, and leave with ideas you can actually use.";

export type Workshop = {
  title: string;
  level: string;
  paragraphs: readonly string[];
};

export type WorkshopInstructor = {
  name: string;
  workshops: readonly Workshop[];
};

export const WORKSHOP_INSTRUCTORS: readonly WorkshopInstructor[] = [
  {
    name: "Yvonne Smink",
    workshops: [
      {
        title: "Static Art Combo",
        level: "Intermediate / Advanced",
        paragraphs: [
          "Learn a creative mix of aerial rotations, movement and art on static pole. Yvonne will show you how to create beautiful flowing combinations without touching the floor, using momentum and rotation to connect tricks in unexpected ways. Think flying, turning and discovering new pathways around the pole.",
        ],
      },
      {
        title: "Pole Choreo",
        level: "All Levels",
        paragraphs: [
          "This is not your ordinary choreography — it’s choreo, Yvonne style! Explore unusual movement, musicality and flow while learning to move in ways you may not normally choose. A creative class designed to inspire you and give you new ideas to bring into your own practice.",
        ],
      },
      {
        title: "Animal Flow",
        level: "All Levels",
        paragraphs: [
          "Time to unleash the beast! Explore animal-inspired movement on the floor and around the pole, playing with different ways of travelling, transitioning and using your whole body. A fun class that will challenge your coordination and introduce a completely different quality of movement.",
        ],
      },
      {
        title: "Pole Exploration",
        level: "All Levels",
        paragraphs: [
          "Are you ready to explore? Through freestyle exercises, creative tasks and movement challenges, Yvonne will encourage you to step away from familiar patterns and discover new possibilities both on and off the pole. Work within your own range of motion and leave with new tools for developing your individual style.",
        ],
      },
    ],
  },
  {
    name: "Karem Gutierrez",
    workshops: [
      {
        title: "Pole Handstand",
        level: "Intermediate",
        paragraphs: [
          "Explore handstands with the pole as your partner. Learn different entries, shapes, grips and transitions using the pole for support and creative possibilities. Karem will break down the technique and help you understand how to move safely into and out of handstand-based combinations.",
        ],
      },
      {
        title: "Static Rotation",
        level: "Advanced",
        paragraphs: [
          "Static pole doesn’t have to mean static movement. Learn how to create rotation around a fixed pole using momentum, body positioning, direction and timing. Karem will combine rotational techniques with dynamic transitions to make your static pole movement feel fast, fluid and effortless.",
        ],
      },
      {
        title: "Pole Flow",
        level: "Intermediate",
        paragraphs: [
          "Learn how to connect movements instead of simply moving from trick to trick. This workshop focuses on transitions, pathways and continuous movement around the pole, helping you create combinations that feel natural, fluid and complete.",
        ],
      },
      {
        title: "Spinning Dynamic",
        level: "Advanced / Pro",
        paragraphs: [
          "Take dynamic movement onto spinning pole. Explore powerful entries, exciting transitions and dynamic combinations while learning how to work with the pole’s rotation rather than fight against it. Expect technique, momentum and Karem’s signature dynamic approach.",
        ],
      },
      {
        title: "Static Dynamic",
        level: "Advanced / Advanced Pro",
        paragraphs: [
          "Power, momentum and technique come together in this dynamic static-pole workshop. Learn exciting combinations using direction changes, regrips, rotations and explosive movement. Karem will help you understand how to generate and control momentum so dynamic tricks become cleaner, stronger and more confident.",
        ],
      },
    ],
  },
  {
    name: "Adam Lin",
    workshops: [
      {
        title: "Signature Tricks",
        level: "Intermediate / Advanced",
        paragraphs: [
          "Learn some of Adam’s favourite signature tricks and combinations, adapted to the level of the group. Discover the details that make each movement work — from entries and positioning to transitions and finishing shapes — while adding fresh material to your own pole vocabulary.",
        ],
      },
      {
        title: "Princess Dynamic",
        level: "Advanced / Advanced Pro",
        paragraphs: [
          "Dynamic pole with Adam’s signature style. Explore powerful tricks, unexpected transitions and exciting combinations while developing the timing, coordination and technique needed for dynamic movement. Expect creative sequences that challenge you and give you plenty of new ideas to take into your own training.",
        ],
      },
      {
        title: "Lyrical Choreo",
        level: "Intermediate",
        paragraphs: [
          "Explore a softer, more expressive side of pole through lyrical choreography. Work with musicality, intention, transitions and quality of movement rather than simply learning steps. The goal is to connect your movement to the music and make the choreography feel like your own.",
        ],
      },
      {
        title: "Competition Ready",
        level: "Advanced / Pro",
        paragraphs: [
          "Thinking about competing — or already preparing for the stage? Adam will explore what turns a collection of impressive tricks into a complete competition performance. Work on routine construction, transitions, musicality, presentation, pacing and making your strengths stand out.",
        ],
      },
    ],
  },
  {
    name: "Jenny Liebert",
    workshops: [
      {
        title: "Drops & Flips",
        level: "Advanced",
        paragraphs: [
          "Upgrade your static pole with dramatic drops, powerful flips and dynamic movement. Jenny will break down the technique behind each element and teach you how to build the foundations safely before adding speed and power. You’ll also learn how to spot your pole partner so you can continue practising more safely after the workshop.",
        ],
      },
      {
        title: "Dynamic Combo Creation",
        level: "Advanced / Pro",
        paragraphs: [
          "Take what you already know and turn it into something new. In this creative workshop, Jenny will challenge you to transform your favourite tricks and movements through endless variations — changing the entry, exit, direction, style, rhythm or intention.",
          "We’ll play with everybody’s favourite moves and explore how one familiar element can evolve into completely different combinations. It’s a free and playful class where you never quite know where the movement will take you. The goal is to challenge your habits, expand your creativity and learn how to create original movement from what you already love.",
        ],
      },
      {
        title: "Choreo Expression Play",
        level: "Advanced / Pro",
        paragraphs: [
          "One choreography. Completely different vibes.",
          "Learn one choreographed sequence, then explore how the exact same movement can feel completely different when we change the music, style, energy and intention. Play with musicality, timing, texture and expression to discover how much personality you can bring to the same choreography.",
          "This workshop is about moving beyond simply learning the steps and discovering how to interpret them — so the choreography starts looking and feeling like you.",
        ],
      },
      {
        title: "Spinning Choreo",
        level: "Intermediate",
        paragraphs: [
          "Learn to make spinning pole feel graceful and continuous rather than simply moving from trick to trick. Jenny will combine accessible spinning elements with beautiful transitions and musicality, teaching you how to control the rotation and create a complete flowing sequence.",
        ],
      },
      {
        title: "Spin with Grace",
        level: "Advanced",
        paragraphs: [
          "Learn Jenny’s signature graceful and dramatic style on spinning pole. Explore elegant transitions into technical tricks and discover how body lines, timing and controlled rotation can transform a combination. The goal is not simply to perform the tricks, but to make the entire journey between them look effortless. This is adapted from Jenny’s original Call Me Grace workshop.",
        ],
      },
      {
        title: "Base Tricks",
        level: "Intermediate",
        paragraphs: [
          "The base of the pole is a playground of its own. Discover creative tricks, shapes and transitions that stay close to the floor while still feeling technical and visually impressive. Learn how to move smoothly around the base, connect low-pole elements and use them as transitions between floorwork and aerial movement.",
        ],
      },
    ],
  },
];

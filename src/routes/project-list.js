module.exports = [
  {
    title: 'Bits of Good Homepage',
    hash: 'bog-homepage',
    links: [
      {
        href: 'https://bitsofgood.org',
        text: 'Explore the live site',
      },
      {
        href: 'https://github.com/GTBitsOfGood/bog-web',
        text: 'Scour the Svelt-ified codebase',
        icon: 'github',
      },
    ],
    timeframe: 'May 2019 - present',
    category: 'ongoing',
    tags: ['JAMstack', 'SvelteJS'],
    headline: true,
    img: {
      src: '/static/projects/bog.jpg',
      alt: 'Bits of Good homepage',
    },
    videoSrc: '/static/projects/bog.webm',
    backupVideoSrc: '/static/projects/bog.mp4',
    body: `This was my first experience with rebuilding a brand from the ground up. We spend months in the design and user discovery phase to decide on the best logo, fonts, colors, and general "feel" of the website. A year later, we've built everything from a <a href=https://bitsofgood.org">reimagined splash page</a> to <a href="https://bitsofgood.org/projects">in-depth journey maps</a> for all of our nonprofit projects. Oh, and it's built on the incredible <strong>Svelte + Sapper JS</strong> framework!`,
  },
  {
    title: 'This very website',
    hash: 'this-very-website',
    links: [
      {
        href: 'https://github.com/Holben888/bholmesdev',
        text: 'Scan my way-too-complex codebase',
        icon: 'github',
      },
    ],
    timeframe: 'Jan 2020 - present',
    category: 'ongoing',
    tags: ['JAMstack', 'No frameworks', 'PugJS'],
    headline: true,
    img: {
      src: '/static/projects/this-very-website.jpg',
      alt: 'Text saying that you are already here',
    },
    videoSrc: '/static/projects/this-very-website.webm',
    backupVideoSrc: '/static/projects/this-very-website.mp4',
    body: `This was a seriously big undertaking, mostly because of how I approached it. In short, this is a statically generated website with <strong>zero JS or CSS frameworks</strong> to be found. In fact, everything from client-side routing to the design were built from scratch. More than anything, this was meant as a learning experience in how JAMstack sites <em>really</em> work, but also a testament to how powerful <strong>raw CSS and ES6</strong> have become. If you're curious how I approached it, <a href="https://github.com/Holben888/bholmesdev">check out the source code + the README</a>`,
  },
  {
    title: 'Dolphin field recording visualizer',
    hash: 'dolphin-viz',
    links: [
      {
        href: 'https://dolphinviz.netlify.app/',
        text: 'Play with dolphins... in recording form',
      },
      {
        href: 'https://github.com/Holben888/ng-dolphin-audio-visualizer',
        text: 'Browse our undocumented codebase',
        icon: 'github',
      },
    ],
    timeframe: 'Oct - Dec 2019',
    category: 'completed',
    tags: ['Research', 'Angular 2+'],
    headline: true,
    img: {
      src: '/static/projects/dolphin-viz.jpg',
      alt: 'Dolphin audio spectrogram',
    },
    videoSrc: '/static/projects/dolphin-viz.webm',
    backupVideoSrc: '/static/projects/dolphin-viz.mp4',
    body: `This was a research project with interesting goals: a) to understand the language of dolphins, and b) to find a way to communicate with them as humans. This involved countless field recordings that needed to be compiled and analyzed for commonalities. So, I led a small dev team to build an audio visualizer using <strong>Angular 2+</strong> to view researcher annotations and AI generated models on an easy-to-understand timeline. With some added <strong>WASM</strong> magic, it's now the team's go-to resource for compiling and viewing audio files!`,
  },
  {
    title: '32 Bits Rackets - GameBoy',
    hash: '32-bit-rackets',
    links: [
      {
        href: 'https://gba.zucc.io',
        text: 'Play the AAA title',
      },
      {
        href: 'https://github.com/Holben888/32BitRackets',
        text: 'Pretend to understand my C Basic',
        icon: 'github',
      },
    ],
    timeframe: 'Oct - Nov 2018',
    category: 'completed',
    tags: ['Video game', 'C Basic', 'Emulator'],
    img: {
      src: '/static/projects/32-bit-rackets.jpg',
      alt: 'Gameboy game footage of two tennis players, one about to serve',
    },
    videoSrc: '/static/projects/32-bit-rackets.webm',
    backupVideoSrc: '/static/projects/32-bit-rackets.mp4',
    body: `Though I've found my niche in frontend dev and design, my interest in programming started making <a href="https://imgur.com/a/edUgWnK">simple games using Java Swing.</a> I had yet to rekindle this passion until college, when a system fundamentals class tasked us with creating a game in <strong>C</strong> using a Game Boy emulator. The end result: a tennis simulator against a CPU skilled enough to send shivers down Serena William's spine. I pushed the emulator to its limits calculating arc velocities, jumpshots, angle characteristics, and match-based scoring!`,
  },
  {
    title: 'Peloton Careers Page',
    hash: 'peloton-careers-page',
    links: [
      {
        href: 'https://onepeloton.com/careers',
        text: 'Check out the production deployment',
      },
      {
        href:
          'https://dev.to/bholmesdev/what-i-learned-planning-and-building-an-mvp-as-a-frontend-dev-at-peloton-41id',
        text: "Read about our team's process and lessons learned",
        icon: 'devto',
      },
    ],
    timeframe: 'Jul - Aug 2019',
    category: 'completed',
    tags: ['Product MVP', 'ReactJS', 'TypeScript', 'Redux'],
    img: {
      src: '/static/projects/peloton-careers.jpg',
      alt: 'Peloton careers landing page with all available job openings',
    },
    videoSrc: '/static/projects/peloton-careers-page.webm',
    backupVideoSrc: '/static/projects/peloton-careers-page.mp4',
    body: `This is the first Peloton project I took full ownership of. I worked as the <strong>head engineer</strong> on a multi-disciplinary team, getting involved from the ideation phase to MVP deployment. I spent time researching what was technically possible using the Greenhouse job posting API, working with designers to get my breakpoints pixel-perfect, and managing tasks with a product manager. I also wrote a <a href="https://dev.to/bholmesdev/what-i-learned-planning-and-building-an-mvp-as-a-frontend-dev-at-peloton-41id">neat blog post</a> explaining the entire process + lessons learned along the way!`,
  },
  {
    title: 'OutLink - Microsoft Hack Productivity',
    hash: 'outlink',
    links: [
      {
        href: 'https://devpost.com/software/outlink',
        text: 'Watch an in-depth video walkthrough',
      },
      {
        href: 'https://github.com/Holben888/OutLink',
        text: 'Fork the incredible browser extension',
        icon: 'github',
      },
    ],
    timeframe: 'Oct - Dec 2017',
    category: 'completed',
    tags: ['Hackathon', 'Angular 1.x', 'Chrome extension'],
    img: {
      src: '/static/projects/outlink.jpg',
      alt: 'Tagline for the Outlink app: browse, annotate, collaborate.',
    },
    videoSrc: '/static/projects/outlink.webm',
    backupVideoSrc: '/static/projects/outlink.mp4',
    body: `I consider this project my web dev rite of passage: taking on a ridiculously hard project with beginner-level experience. In brief, Outlink was a way to annotate web pages and send those annotations for others to view. This was a <em>seriously</em> huge task, since I wanted to allow highlighting at the <strong>DOM-element-level</strong>, and reliably highlight those same elements on someone else's computer. Oh, and I wanted to send from your email inbox via a chrome extension. Needless to say, the code is messy, the UI is horrible, and I wouldn't recommend the app. But damnit... <a href="https://www.youtube.com/watch?time_continue=16&v=ZMPBMU1IdSE&feature=emb_logo"><strong>it works.</strong></a>`,
  },
  {
    title: 'Roombowling',
    hash: 'roombowling',
    links: [
      {
        href: 'https://devpost.com/software/roomballing',
        text: 'Experience the suck-iest frame of bowling',
      },
      {
        href: 'https://github.com/Holben888/roombowling-game-display',
        text: 'Scour the Sveltastic instructional UI',
        icon: 'github',
      },
    ],
    timeframe: 'Mar 2019',
    category: 'completed',
    tags: ['Hackathon', 'SvelteJS', 'Python server'],
    headline: true,
    img: {
      src: '/static/projects/roombowling.jpg',
      alt:
        'Roomba in action, knocking down water bottle bowling pins and displaying your score on a web app',
    },
    videoSrc: '/static/projects/roombowling.webm',
    backupVideoSrc: '/static/projects/roombowling.mp4',
    body: `I attended <a href="https://devpost.com/Holben888">my fair share of hackathons</a> as a GA Tech student, but <a href="https://build.hack.gt/">BuildGT2</a> was easily my favorite win. Our team's goal was simple: <strong>reserve the Roomba dev kit ASAP and wing it from there.</strong> Inspired by the childhood classic Wii Bowling, we created an over-engineered, 1-round game with a Roomba as the ball! <br /> Some serious tech was involved: A Kinect motion camera to detect fallen pins, <a href="https://twitter.com/BHolmesDev/status/1102254956973826048">A webapp</a> using <strong>SvelteJS + web sockets</strong> for gameplay instructions and scoring, and a Raspberry Pi to communicate with the Room-ball.`,
  },
  {
    title: 'OutLink - Microsoft Hack Productivity',
    hash: 'outlink',
    links: [
      {
        href: 'https://devpost.com/software/outlink',
        text: 'Watch an in-depth video walkthrough',
      },
      {
        href: 'https://github.com/Holben888/OutLink',
        text: 'Fork the incredible browser extension',
        icon: 'github',
      },
    ],
    timeframe: 'Oct - Dec 2017',
    category: 'completed',
    tags: ['Hackathon', 'Angular 1.x', 'Chrome extension'],
    img: {
      src: '/static/projects/outlink.jpg',
      gifSrc: '/static/projects/outlink.gif',
      alt: 'Tagline for the Outlink app: browse, annotate, collaborate.',
    },
    videoSrc: '/static/projects/outlink.webm',
    backupVideoSrc: '/static/projects/outlink.mp4',
    body: `I consider this project my web dev rite of passage: taking on a ridiculously hard project with beginner-level experience. In brief, Outlink was a way to annotate web pages and send those annotations for others to view. This was a <em>seriously</em> huge task, since I wanted to allow highlighting at the <strong>DOM-element-level</strong>, and reliably highlight those same elements on someone else's computer. Oh, and I wanted to send from your email inbox via a chrome extension. Needless to say, the code is messy, the UI is horrible, and I wouldn't recommend the app. But damnit... <a href="https://www.youtube.com/watch?time_continue=16&v=ZMPBMU1IdSE&feature=emb_logo"><strong>it works.</strong></a>`,
  },
]

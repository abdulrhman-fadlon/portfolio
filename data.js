window.SITE_DATA = {
  "profile": {
    "name": "Abdulrhman Rezk",
    "roleTitle": "Aspiring Machine Learning Engineer",
    "roleTags": "ML · Computer Vision · Python",
    "lead": "Final-year CS student building real things: an ML-driven CPU scheduler targeting Linux, an Arduino fire-alert system, and a computer-vision driver-safety system. I build in public — everything here is documented and honest.",
    "photo": "profile.png",
    "email": "abdulrhman.rrs@gmail.com",
    "phone": "01070272690",
    "linkedin": "https://www.linkedin.com/in/abdulrhman-rezk",
    "github": "https://github.com/abdulrhman-fadlon",
    "logStatus": "OPEN TO — internships · junior roles · freelance",
    "logFocus": "ML · Computer Vision · Python · C++ — learning fast"
  },
  "about": {
    "facts": [
      {
        "label": "WHO I AM",
        "text": "Abdulrhman Rezk — final-year Computer Science student specializing in machine learning."
      },
      {
        "label": "WHAT I OFFER",
        "text": "Solid engineering — Python and C++, ML applied to real problems, and computer-vision systems."
      },
      {
        "label": "WHO IT'S FOR",
        "text": "Teams and startups that value working software and honest documentation over buzzwords."
      },
      {
        "label": "WHAT SETS ME APART",
        "text": "Every claim on this page maps to a real project, a real course, or a real result."
      }
    ],
    "story": "The driving question — \"Why can't software just think?\" — became a method: learn by building, every day.",
    "numbersNote": "// NUMBERS & ACHIEVEMENTS — they land here as real results ship."
  },
  "usp": {
    "heading": "What makes me different",
    "sub": "Three rules I hold myself to — no exceptions.",
    "cards": [
      {
        "num": "01",
        "title": "Real Projects Only",
        "text": "Everything here is real work — built, tested, and shown as it is. Nothing is inflated."
      },
      {
        "num": "02",
        "title": "Systems Thinking",
        "text": "From a Linux kernel scheduler to an Arduino alarm — I want to understand the whole system, not just the model."
      },
      {
        "num": "03",
        "title": "Learning in Public",
        "text": "Every project ships with documentation and notes. You see exactly how it was built — and exactly how I work."
      }
    ],
    "proofTitle": "// THE PROOF",
    "proof": [
      "An ML-driven CPU scheduler — Python simulator, targeted at real Linux scheduling (sched_ext).",
      "An Arduino fire-alert system with one-button emergency response and photo verification.",
      "A computer-vision safety system watching the driver, the passenger, and the road."
    ]
  },
  "education": {
    "heading": "Where I study",
    "sub": "Degrees and structured training.",
    "items": [
      {
        "title": "BSc — Computer Science, Future Academy",
        "meta": "2023 — 2027 (expected) · Egypt",
        "text": "Final-year student. Focus: machine learning and AI coursework."
      }
    ]
  },
  "skills": {
    "heading": "What I Use — and What I'm Learning",
    "sub": "Levels are self-assessed and honest: what I can actually use today.",
    "cards": [
      {
        "num": "01",
        "title": "Programming Core",
        "desc": "My main tools: Python for everything, C++ for the low-level view, and the CS fundamentals underneath.",
        "pills": [
          {
            "name": "Python",
            "level": 65
          },
          {
            "name": "C++",
            "level": 45
          },
          {
            "name": "Data Structures",
            "level": 55
          },
          {
            "name": "Algorithms",
            "level": 50
          }
        ]
      },
      {
        "num": "02",
        "title": "ML & Data — Beginner",
        "desc": "The layer I'm building right now: classical ML and the data formats around it.",
        "pills": [
          {
            "name": "JSON",
            "level": 35
          },
          {
            "name": "SQLite",
            "level": 30
          },
          {
            "name": "NumPy",
            "level": 30
          },
          {
            "name": "Scikit-learn",
            "level": 25
          },
          {
            "name": "TensorFlow",
            "level": 20
          }
        ]
      },
      {
        "num": "03",
        "title": "Tools & Workflow",
        "desc": "The everyday environment I work in — used for real projects, not just tutorials.",
        "pills": [
          {
            "name": "VS Code",
            "level": 60
          },
          {
            "name": "Linux",
            "level": 40
          },
          {
            "name": "Terminal",
            "level": 35
          },
          {
            "name": "Git",
            "level": 30
          },
          {
            "name": "Virtual Envs",
            "level": 30
          }
        ]
      },
      {
        "num": "04",
        "title": "Computer Vision — In Build",
        "desc": "The layer powering DriverGuard: detection, tracking, and real-time video understanding.",
        "pills": [
          {
            "name": "OpenCV",
            "level": 30
          },
          {
            "name": "MediaPipe",
            "level": 30
          },
          {
            "name": "Deep Learning",
            "level": 25
          },
          {
            "name": "EAR / MAR",
            "level": 25
          }
        ]
      }
    ]
  },
  "projects": [
    {
      "id": "proj-1",
      "code": "PRJ_01",
      "badge": "OS + ML · COLLEGE PROJECT",
      "title": "Smart CPU Scheduler — Adaptive Time Quantum with ML",
      "image": "prj01.png",
      "desc": "College team project: one fixed quantum doesn't fit every process — an ML model predicts a suitable quantum per process from its behavior (CPU usage, I/O, history). Built as a Python simulator first, then targeted real Linux scheduling via sched_ext.",
      "highlight": "// GOAL: not faster for one task — better for the total workload.",
      "overview": "College team project: CPU processes behave differently — CPU-bound, I/O-bound, interactive — yet the Round-Robin quantum is one fixed number. Our scheduler uses task signals (CPU usage, I/O behavior, previous execution) and an ML model to predict a suitable time quantum per process. We built a Python simulator to train and test the model first, then targeted real Linux scheduling via sched_ext.",
      "hardPart": "Connecting two worlds: turning an ML prediction into a useful scheduling decision inside the scheduler loop, and moving from a safe Python simulation to a real Linux kernel policy (sched_ext) without breaking the system.",
      "learned": "How CPU scheduling really works — context switches, waiting time, response time, fairness — how to frame a classic OS problem as an ML prediction task, and why you always simulate before you touch the kernel.",
      "steps": [
        "Collect process signals: CPU usage, I/O pattern, execution history",
        "ML model predicts a suitable time quantum for that process",
        "Scheduler runs the process with its predicted quantum",
        "Real Linux via sched_ext: less waiting, fewer switches, fair CPU"
      ],
      "tech": [
        "Python",
        "Machine Learning",
        "Linux",
        "sched_ext",
        "Simulation"
      ],
      "demo": null
    },
    {
      "id": "proj-2",
      "code": "PRJ_02",
      "badge": "HARDWARE · COLLEGE PROJECT",
      "title": "FireGuard — Smart Fire Detection & Alert System",
      "image": "prj02.png",
      "desc": "Arduino team project: a smoke sensor and a camera watch a site; on detection the system raises an alarm and messages the owner, who alerts the fire department or police with one button — with photos attached so responders can verify first.",
      "highlight": "// HIGHLIGHT: an alert flow designed for a stressed human — one button, photos, clear message.",
      "overview": "College hardware team project on Arduino: a smoke sensor and a camera watch a site. On detection the system raises a local alarm and sends the owner a message — who can alert the fire department or the police with a single button press, with photos attached so responders can verify the situation before moving.",
      "hardPart": "Making cheap hardware dependable: false alarms from the smoke sensor, integrating camera and communication modules on an Arduino, and keeping the alert path simple enough to work under stress.",
      "learned": "Practical embedded C++ on Arduino, wiring sensors + camera + communication together, and designing an alert flow around a stressed human: one button, photos, a clear message.",
      "steps": [
        "Smoke sensor + camera watch the site continuously",
        "On detection: the local alarm fires instantly",
        "Owner gets a message with photos attached",
        "One button → alert the fire department or police"
      ],
      "tech": [
        "Arduino",
        "C++",
        "Smoke Sensor",
        "Camera Module",
        "SMS Alerts"
      ],
      "demo": null
    },
    {
      "id": "proj-3",
      "code": "PRJ_03",
      "badge": "COMPUTER VISION · SAFETY SYSTEM",
      "title": "DriverGuard — Driver, Passenger & Road Safety Monitoring",
      "image": "prj03.png",
      "desc": "A camera-based safety system watching three fronts at once: the driver (drowsiness via EAR/MAR, head tilt, seatbelt, phone use), the passenger (suspicious behavior or a threat), and the road (hazards) — with alarms that adapt to the driver's disability: voice, vibration, or flash.",
      "highlight": "// HIGHLIGHT: accessibility-first alarms — voice, vibration, or flash per driver.",
      "overview": "A camera-based safety system watching three fronts at once. The driver: drowsiness via EAR/MAR, head tilt, seatbelt and phone use — each violation with its own alarm. The passenger: suspicious behavior — a sharp object or a fight with the driver. The road: hazards that trigger driver warnings. Alarm type adapts to the driver's disability: voice, vibration, or flash.",
      "hardPart": "Three camera feeds, many simultaneous checks, and real-time constraints — plus designing alarms that respect accessibility instead of assuming one beep fits every driver.",
      "learned": "How to run multiple camera feeds with simultaneous checks in real time, why EAR and MAR plus head pose are the right drowsiness signals, and how to design per-violation alarm logic that adapts to the person behind the wheel.",
      "steps": [
        "Driver camera: EAR / MAR, head tilt, seatbelt, phone use",
        "Passenger camera: suspicious behavior or threat detection",
        "Road camera: hazards and live driver warnings",
        "Per-violation alarm — voice, vibration, or flash (accessibility-first)"
      ],
      "tech": [
        "Python",
        "OpenCV",
        "MediaPipe",
        "EAR / MAR",
        "TensorFlow",
        "Multi-Camera"
      ],
      "demo": null
    },
    {
      "id": "proj-4",
      "code": "PRJ_04",
      "badge": "PYTHON · CLI APP",
      "title": "CineBook — Cinema Ticket Booking CLI",
      "image": "prj04.png",
      "desc": "A terminal app that manages cinema booking end to end: browse movies with prices, view a live seat map, pick and book seats, review or cancel bookings — with SQLite keeping every booking consistent between runs.",
      "highlight": "// HIGHLIGHT: seat map, bookings, and cancellations — all persisted in SQLite.",
      "overview": "A terminal app that manages cinema booking end to end: browse movies with prices and availability, view a live seat map ([ ] free / [X] booked), pick and confirm seats, review or cancel bookings — with SQLite persisting every booking between runs.",
      "hardPart": "Modeling the seat map as clean data (rows × seats) and keeping bookings consistent across runs — no double-booking, ever.",
      "learned": "Practicing data structures on a real product (seat maps), database persistence with SQLite, and building a clean multi-menu CLI flow — small app, real engineering habits.",
      "steps": [
        "Browse movies with genre, duration, price, and availability",
        "Seat map at a glance: [ ] free · [X] booked · [S] selected",
        "Book, review, or cancel — each booking gets its own ID",
        "SQLite persists everything between runs"
      ],
      "tech": [
        "Python",
        "SQLite",
        "JSON",
        "CLI"
      ],
      "demo": null
    }
  ],
  "experience": {
    "heading": "Work so far",
    "sub": "An honest record — real roles land here as they happen.",
    "items": [
      {
        "title": "Machine Learning Trainee — Digital Egypt Pioneers Initiative (DEPI)",
        "meta": "2026 — present · رواد مصر الرقمية · MCIT",
        "text": "Microsoft Machine Learning Engineer track: structured training in ML fundamentals, model building, and evaluation — with graded practical projects and mentorship."
      }
    ],
    "badge": "No practical job experience yet — training and real projects are in progress."
  },
  "services": {
    "heading": "What I can do for you",
    "sub": "Based on what I've actually built — not on buzzwords.",
    "cards": [
      {
        "num": "S.01",
        "title": "Python Applications & CLI Tools",
        "text": "Custom Python apps and terminal tools — like CineBook, a cinema booking system with a live seat map and SQLite persistence."
      },
      {
        "num": "S.02",
        "title": "Computer Vision Systems",
        "text": "Detection and monitoring with OpenCV and MediaPipe — like DriverGuard, watching driver, passenger, and road in real time."
      },
      {
        "num": "S.03",
        "title": "ML for Real Problems",
        "text": "Machine learning where it actually pays off — like a CPU scheduler that predicts a better time quantum per process."
      }
    ]
  },
  "certificates": [
    {
      "title": "[Certificate name]",
      "meta": "[Issuer] · [Year]",
      "image": null
    },
    {
      "title": "[Certificate name]",
      "meta": "[Issuer] · [Year]",
      "image": null
    },
    {
      "title": "[Certificate name]",
      "meta": "[Issuer] · [Year]",
      "image": null
    }
  ],
  "testimonials": [
    {
      "quote": "\"Nothing here yet — this spot is reserved for the first person I build something valuable for.\"",
      "author": "— could be you",
      "dim": false
    },
    {
      "quote": "\"…\"",
      "author": "— reserved · first client",
      "dim": true
    },
    {
      "quote": "\"…\"",
      "author": "— reserved · first mentor",
      "dim": true
    },
    {
      "quote": "\"…\"",
      "author": "— reserved · track supervisor",
      "dim": true
    },
    {
      "quote": "\"…\"",
      "author": "— reserved · a teammate",
      "dim": true
    },
    {
      "quote": "\"…\"",
      "author": "— reserved · code reviewer",
      "dim": true
    }
  ]
};

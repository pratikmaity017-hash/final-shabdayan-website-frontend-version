// Shabdayon hero icon marquee: smooth alternating movement with gentle row-to-row circulation.
(function initIconRows() {
  const rows = [...document.querySelectorAll(".icon-row")];
  if (!rows.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const GAP = 5;

  // Keep one source set per row, then duplicate it for a seamless loop.
  // No timed DOM shuffling: that caused uneven gaps and visible jumps.
  const sourceSets = rows.map((row) => {
    const track = row.querySelector(".icon-track");
    if (!track) return [];
    const children = [...track.children];
    const half = Math.max(1, Math.floor(children.length / 2));
    return children.slice(0, half).map((card) => card.cloneNode(true));
  });

  function fillTrack(track, cards) {
    track.replaceChildren();
    const first = cards.map((card) => card.cloneNode(true));
    const second = cards.map((card) => card.cloneNode(true));
    [...first, ...second].forEach((card) => track.appendChild(card));
  }

  function configureRows() {
    rows.forEach((row, index) => {
      const track = row.querySelector(".icon-track");
      if (!track) return;

      fillTrack(track, sourceSets[index]);
      track.classList.add("is-marquee-track");
      track.style.setProperty("--row-duration", `${28 + index * 2.5}s`);
      track.style.setProperty("--row-delay", `${-index * 2.8}s`);
      track.style.setProperty(
        "--row-direction",
        row.dataset.direction === "right" ? "reverse" : "normal",
      );

      track.style.animationPlayState = "running";
    });
  }

  // Circulate each row's icon set to the next row in a coordinated cycle.
  // At the end of a cycle, the next icon set is installed as a duplicated pair,
  // preserving the seamless track length and avoiding blank space.
  let cycleTimer;
  function circulateSets() {
    if (reduceMotion.matches || sourceSets.length < 2) return;
    const next = sourceSets.map(
      (_, index) =>
        sourceSets[(index - 1 + sourceSets.length) % sourceSets.length],
    );
    sourceSets.forEach((_, index) => {
      sourceSets[index] = next[index];
    });
    rows.forEach((row, index) => {
      const track = row.querySelector(".icon-track");
      if (!track) return;
      const wasPaused = getComputedStyle(track).animationPlayState === "paused";
      fillTrack(track, sourceSets[index]);
      track.style.animation = "none";
      // Force style recalculation so the animation restarts without stale transforms.
      void track.offsetWidth;
      track.style.animation = "";
      track.style.setProperty("--row-duration", `${28 + index * 2.5}s`);
      track.style.setProperty("--row-delay", `${-index * 2.8}s`);
      track.style.setProperty(
        "--row-direction",
        row.dataset.direction === "right" ? "reverse" : "normal",
      );
      track.style.animationPlayState = wasPaused ? "paused" : "running";
    });
  }

  rows.forEach((row) => {
    const track = row.querySelector(".icon-track");
    if (!track) return;
    row.addEventListener(
      "mouseenter",
      () => (track.style.animationPlayState = "paused"),
    );
    row.addEventListener(
      "mouseleave",
      () => (track.style.animationPlayState = "running"),
    );
    row.addEventListener(
      "focusin",
      () => (track.style.animationPlayState = "paused"),
    );
    row.addEventListener(
      "focusout",
      () => (track.style.animationPlayState = "running"),
    );
    row.addEventListener(
      "touchstart",
      () => (track.style.animationPlayState = "paused"),
      { passive: true },
    );
    row.addEventListener(
      "touchend",
      () => {
        window.setTimeout(() => {
          if (!row.matches(":hover") && !row.contains(document.activeElement)) {
            track.style.animationPlayState = "running";
          }
        }, 700);
      },
      { passive: true },
    );
  });

  function applyMotionPreference() {
    if (reduceMotion.matches) {
      window.clearInterval(cycleTimer);
      rows.forEach((row) => {
        const track = row.querySelector(".icon-track");
        if (track) {
          track.style.animation = "none";
          track.style.transform = "none";
        }
      });
    } else {
      configureRows();
      window.clearInterval(cycleTimer);
      cycleTimer = window.setInterval(circulateSets, 12000);
    }
  }

  configureRows();
  applyMotionPreference();
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener("change", applyMotionPreference);
  }
  window.addEventListener("resize", () => {
    // CSS percentage-based card widths recalculate naturally; avoid a jumpy JS offset.
    rows.forEach((row) => {
      const track = row.querySelector(".icon-track");
      if (track) track.style.willChange = "transform";
    });
  });
})();
const stories = [
  {
    title: "কালো রহস্য",
    author: "রাহুল দাস",
    rating: "4.7",
    icon: "🌙",
    genre: "রহস্য",
    text: "এক অন্ধকার রাতে পুরোনো বাড়ির দরজা নিজে থেকেই খুলে গেল। তারপর শুরু হল এক অজানা রহস্যের গল্প।",
    youtubeUrl: "https://www.youtube.com/watch?v=eOY1tBpmvow",
  },
  {
    title: "প্রেমের গান",
    author: "অনন্যা চক্রবর্তী",
    rating: "4.5",
    icon: "💌",
    genre: "রোমান্স",
    text: "বৃষ্টিভেজা শহরে একটি চিঠি বদলে দিল দুজন মানুষের জীবনের গল্প।",
    youtubeUrl: ""
  },
  {
    title: "হারানো চিঠি",
    author: "মিতা বসু",
    rating: "4.4",
    icon: "🔎",
    genre: "রহস্য",
    text: "বহু বছর পর পাওয়া একটি চিঠির ভিতরে লুকিয়ে ছিল পরিবারের পুরোনো সত্য।",
    youtubeUrl: ""
  },
  {
    title: "রক্তের দাগ",
    author: "সুমন মুখার্জি",
    rating: "4.6",
    icon: "🩸",
    genre: "ভৌতিক",
    text: "নির্জন বাড়িতে রাত বাড়ার সঙ্গে সঙ্গে অদ্ভুত শব্দ শোনা যেতে লাগল।",
    youtubeUrl: ""
  },
  {
    title: "নীল পাহাড়",
    author: "অর্পিতা সেন",
    rating: "4.2",
    icon: "🏔️",
    genre: "সাহিত্য",
    text: "পাহাড়ের পথে যাত্রা করতে গিয়ে সে নিজের জীবনের নতুন অর্থ খুঁজে পেল।",
    youtubeUrl: ""
  },
  {
    title: "ভাঙা তারা",
    author: "কৌশিক ঘোষ",
    rating: "4.3",
    icon: "⭐",
    genre: "সাহিত্য",
    text: "একটি অসমাপ্ত স্বপ্ন আর একটি ভাঙা তারার গল্প।",
    youtubeUrl: ""
  },
  {
    title: "পলাশীর যুদ্ধ",
    author: "দেবাশিস রায়",
    rating: "4.6",
    icon: "⚔️",
    genre: "সাহিত্য",
    text: "ইতিহাসের এক গুরুত্বপূর্ণ অধ্যায়কে গল্পের ভাষায় শোনানো হয়েছে।",
    youtubeUrl: ""
  },
  {
    title: "মধ্যরাতের সঙ্গীত",
    author: "শীলা ভট্টাচার্য",
    rating: "4.3",
    icon: "👻",
    genre: "ভৌতিক",
    text: "মধ্যরাতে শোনা সেই সুরের উৎস খুঁজতে গিয়ে রহস্য আরও গভীর হয়ে উঠল।",
    youtubeUrl: ""
  },
  {
    title: "প্রথম পাঠ",
    author: "অনন্যা ঘোষ",
    rating: "4.4",
    icon: "📖",
    genre: "সাহিত্য",
    text: "শৈশবের প্রথম বইটির স্মৃতি তাকে আবার ফিরিয়ে নিয়ে গেল পুরোনো দিনে।",
    youtubeUrl: ""
  },
  {
    title: "আলোর পথ",
    author: "তন্ময় সাহা",
    rating: "4.1",
    icon: "😊",
    genre: "রোমান্স",
    text: "কঠিন সময়ে দুজন মানুষ একে অপরের জীবনে আলো হয়ে উঠল।",
    youtubeUrl: ""
  },
  {
    title: "পুরোনো মন্দির",
    author: "সৌরভ রায়",
    rating: "4.5",
    icon: "🏛️",
    genre: "রহস্য",
    text: "জঙ্গলের ভিতরের মন্দিরটি বহু বছর ধরে বন্ধ ছিল। কিন্তু এক রাতে তার দরজা খুলে গেল।",
    youtubeUrl: ""
  },
  {
    title: "বৃষ্টির দিনে",
    author: "মৌসুমী পাল",
    rating: "4.2",
    icon: "🌧️",
    genre: "অন্যান্য",
    text: "এক বৃষ্টির দিনে ঘটে যাওয়া ছোট্ট একটি ঘটনা সারাজীবনের স্মৃতি হয়ে রইল।",
    youtubeUrl: ""
  },
];

const card = (s) =>
  `<article class="story-card" data-genre="${s.genre}" tabindex="0" data-title="${s.title}"><div class="story-art">${s.icon}</div><div class="story-info"><p class="story-title">${s.title}</p><p class="story-author">${s.author}</p><div class="story-meta"><span>★ ${s.rating}</span><span class="headphone">▶ শুনুন</span></div></div></article>`;
function render(id, data) {
  document.getElementById(id).innerHTML = data.map(card).join("");
  bindCards();
}
render("weeklyCards", stories.slice(0, 8));
render("starterCards", stories.slice(8).concat(stories.slice(2, 4)));
render("popularCards", stories.slice(4, 10));


function bindCards() {
  document.querySelectorAll(".story-card").forEach((c) => {
    const openStoryVideo = () => {
      const story = stories.find(
        (s) => s.title === c.dataset.title
      );

      if (story?.youtubeUrl) {
        window.open(
          story.youtubeUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }
    };

    c.onclick = openStoryVideo;

    c.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openStoryVideo();
      }
    };
  });
}


document.querySelectorAll(".chip").forEach((btn) =>
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".chip")
      .forEach((x) => x.classList.remove("active"));
    btn.classList.add("active");
    applyFilters(btn.dataset.filter);
  }),
);
function applyFilters(filter) {
  document
    .querySelectorAll(".story-card")
    .forEach(
      (c) =>
        (c.style.display =
          filter === "all" || c.dataset.genre === filter ? "" : "none"),
    );
}

const drawer = document.getElementById("drawer"),
  overlay = document.getElementById("overlay");
const closeMenu = () => {
  drawer.classList.remove("open");
  overlay.classList.remove("show");
};
document.getElementById("menuOpen").onclick = () => {
  drawer.classList.add("open");
  overlay.classList.add("show");
  setTimeout(() => document.getElementById("searchInput")?.focus(), 100);
};
document.getElementById("menuClose").onclick = closeMenu;
overlay.onclick = closeMenu;
document.querySelectorAll(".drawer a").forEach((a) => (a.onclick = closeMenu));

document.getElementById("searchInput").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll(".story-card").forEach((c) => {
    const s = stories.find((x) => x.title === c.dataset.title);
    c.style.display =
      !q || `${s.title} ${s.author} ${s.genre}`.toLowerCase().includes(q)
        ? ""
        : "none";
  });
});

document.querySelectorAll(".show-all").forEach(
  (a) =>
    (a.onclick = (e) => {
      e.preventDefault();
      const id = a.dataset.target;
      document
        .getElementById(id)
        .querySelectorAll(".story-card")
        .forEach((c) => (c.style.display = ""));
      document
        .getElementById(id)
        .scrollIntoView({ behavior: "smooth", block: "center" });
    }),
);
document.querySelector(".show-authors").onclick = (e) => {
  e.preventDefault();
  document.getElementById("authors").scrollIntoView({ behavior: "smooth" });
};
document.getElementById("authorsBtn").onclick = () =>
  alert(
    "লেখকদের তালিকা: রাহুল দাস, অনন্যা চক্রবর্তী, মিতা বসু, অর্পিতা সেন, কৌশিক ঘোষ",
  );
document.getElementById("narratorsBtn").onclick = () =>
  alert("কথকদের তালিকা খুলবে — এই ডেমোতে জনপ্রিয় কথকদের তথ্য দেখানো হয়েছে।");
document.querySelector(".gold-btn").onclick = () =>
  document.querySelector("#popular").scrollIntoView({ behavior: "smooth" });

// Quiz interaction: clear feedback, visual answer states, and one score award per page visit.
const quizAnswers = { "1": true, "2": false, "3": false, "4": false };
const quizButton = document.getElementById("quizBtn");
const quizResult = document.getElementById("quizResult");
const quizOptions = [...document.querySelectorAll('#quiz input[name="q"]')];
let quizSubmitted = false;

quizOptions.forEach((input) => {
  input.addEventListener("change", () => {
    if (quizSubmitted) return;
    quizOptions.forEach((option) => {
      option.closest(".quiz-option")?.classList.remove("is-correct", "is-wrong");
    });
    quizResult.textContent = "";
    quizResult.className = "quiz-result";
  });
});

quizButton.addEventListener("click", () => {
  if (quizSubmitted) return;

  const selected = document.querySelector('#quiz input[name="q"]:checked');
  if (!selected) {
    quizResult.textContent = "আগে একটি উত্তর নির্বাচন করুন, তারপর জমা দিন।";
    quizResult.className = "quiz-result is-error";
    return;
  }

  quizSubmitted = true;
  const isCorrect = quizAnswers[selected.value] === true;

  quizOptions.forEach((input) => {
    input.disabled = true;
    const label = input.closest(".quiz-option");
    if (input.value === "1") label?.classList.add("is-correct");
    if (input.checked && !isCorrect) label?.classList.add("is-wrong");
  });

  if (isCorrect) {
    let score = 0;
    try {
      score = Number(localStorage.getItem("quizPoints") || 0);
      if (!Number.isFinite(score) || score < 0) score = 0;
      score += 12;
      localStorage.setItem("quizPoints", String(score));
    } catch (error) {
      // The quiz can still show the result if browser storage is unavailable.
    }
    quizResult.textContent = "দারুণ! সঠিক উত্তর। +১২ পয়েন্ট 🎉";
    quizResult.className = "quiz-result is-success";
  } else {
    quizResult.textContent = "এই উত্তরটি সঠিক নয়। সঠিক উত্তরটি সবুজ রঙে দেখানো হয়েছে।";
    quizResult.className = "quiz-result is-error";
  }

  quizButton.disabled = true;
  quizButton.innerHTML = '<span>উত্তর জমা হয়েছে</span><span aria-hidden="true">✓</span>';
});

// Newsletter
const subscribe = document.getElementById("subscribe");
subscribe.onsubmit = (e) => {
  e.preventDefault();
  const input = subscribe.querySelector("input");
  if (!input.checkValidity()) {
    input.reportValidity();
    return;
  }
  localStorage.setItem("subscriberEmail", input.value.trim());
  input.value = "";
  alert("সাবস্ক্রাইব করার জন্য ধন্যবাদ! আপনার ইমেইল সংরক্ষণ করা হয়েছে।");
};

// Login/signup local demo account
const modal = document.getElementById("loginModal"),
  authForm = document.getElementById("authForm"),
  authMessage = document.getElementById("authMessage"),
  authTitle = document.getElementById("authTitle"),
  authSub = document.getElementById("authSub"),
  authSubmit = document.getElementById("authSubmit");
function openLogin() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("email").focus(), 50);
}
function closeLogin() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  authMessage.textContent = "";
}
document.getElementById("loginOpen").onclick = openLogin;
document.getElementById("accountLogin").onclick = openLogin;
document.getElementById("footerLogin")?.addEventListener("click", openLogin);
document.getElementById("loginClose").onclick = closeLogin;
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeLogin();
});
document.querySelectorAll(".auth-tab").forEach(
  (tab) =>
    (tab.onclick = () => {
      document
        .querySelectorAll(".auth-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const signup = tab.dataset.mode === "signup";
      authForm.classList.toggle("signup-mode", signup);
      authTitle.textContent = signup
        ? "নতুন অ্যাকাউন্ট তৈরি করুন"
        : "লগ ইন করুন";
      authSub.textContent = signup
        ? "কয়েক সেকেন্ডেই আপনার অ্যাকাউন্ট তৈরি করুন"
        : "আপনার অ্যাকাউন্টে প্রবেশ করুন";
      authSubmit.textContent = signup ? "অ্যাকাউন্ট তৈরি করুন" : "লগ ইন";
      authMessage.textContent = "";
    }),
);
document.getElementById("togglePass").onclick = () => {
  const p = document.getElementById("password");
  const show = p.type === "password";
  p.type = show ? "text" : "password";
  document.getElementById("togglePass").textContent = show ? "লুকান" : "দেখুন";
};
authForm.onsubmit = (e) => {
  e.preventDefault();
  const signup = authForm.classList.contains("signup-mode");
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  if (signup) {
    if (!name) {
      authMessage.textContent = "আপনার নাম দিন।";
      return;
    }
    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    authMessage.textContent =
      "অ্যাকাউন্ট তৈরি হয়েছে। এখন আপনি লগ ইন করতে পারবেন।";
    document.querySelector('[data-mode="login"]').click();
    document.getElementById("email").value = email;
  } else {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.email !== email || user.password !== password) {
      authMessage.textContent =
        "ইমেইল/মোবাইল অথবা পাসওয়ার্ড সঠিক নয়। আগে নতুন অ্যাকাউন্ট তৈরি করুন।";
      return;
    }
    localStorage.setItem("loggedIn", "true");
    document.querySelector(".account-strip span").textContent =
      `স্বাগতম, ${user.name}`;
    document.getElementById("loginOpen").textContent = "আমার অ্যাকাউন্ট";
    authMessage.textContent = "সফলভাবে লগ ইন হয়েছে ✓";
    setTimeout(closeLogin, 700);
  }
};
document.querySelector(".forgot").onclick = () =>
  (authMessage.textContent =
    "ডেমো: পাসওয়ার্ড রিসেটের জন্য আপনার নিবন্ধিত ইমেইলে লিংক পাঠানো হবে।");
document.querySelector(".google-btn").onclick = () =>
  (authMessage.textContent =
    "Google login চালু করতে production Google OAuth credentials/backend যুক্ত করতে হবে।");

// Story player using browser speech synthesis so cards actually play without external audio files
const playerModal = document.getElementById("playerModal");
let currentStory = null,
  isPlaying = false,
  utterance = null,
  progressTimer = null,
  progressValue = 0;
function openPlayer(title) {
  currentStory = stories.find((s) => s.title === title);
  if (!currentStory) return;
  document.getElementById("playerArt").textContent = currentStory.icon;
  document.getElementById("playerTitle").textContent = currentStory.title;
  document.getElementById("playerAuthor").textContent =
    `${currentStory.author} • ${currentStory.genre} • ★ ${currentStory.rating}`;
  document.getElementById("playerDesc").textContent = currentStory.text;
  document.getElementById("progress").value = 0;
  progressValue = 0;
  document.getElementById("playerNote").textContent = "";
  playerModal.classList.add("show");
  playerModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closePlayer() {
  stopSpeech();
  playerModal.classList.remove("show");
  playerModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  clearInterval(progressTimer);
  isPlaying = false;
  document.getElementById("playPause").textContent = "▶";
}
function playStory() {
  if (!currentStory) return;
  if (!("speechSynthesis" in window)) {
    document.getElementById("playerNote").textContent =
      "এই ব্রাউজারে অডিও প্লেব্যাক সাপোর্ট নেই।";
    return;
  }
  if (isPlaying) {
    stopSpeech();
    return;
  }
  utterance = new SpeechSynthesisUtterance(currentStory.text);
  utterance.lang = "bn-IN";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.onend = () => {
    isPlaying = false;
    document.getElementById("playPause").textContent = "▶";
    document.getElementById("progress").value = 100;
  };
  utterance.onerror = () => {
    isPlaying = false;
    document.getElementById("playPause").textContent = "▶";
    document.getElementById("playerNote").textContent =
      "ব্রাউজারের speech voice পাওয়া যায়নি।";
  };
  window.speechSynthesis.speak(utterance);
  isPlaying = true;
  document.getElementById("playPause").textContent = "❚❚";
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (progressValue < 95) {
      progressValue += 1;
      document.getElementById("progress").value = progressValue;
    }
  }, 500);
}
document.getElementById("playPause").onclick = playStory;
document.getElementById("playerClose").onclick = closePlayer;
playerModal.addEventListener("click", (e) => {
  if (e.target === playerModal) closePlayer();
});
document.getElementById("back10").onclick = () => {
  progressValue = Math.max(0, progressValue - 10);
  document.getElementById("progress").value = progressValue;
};
document.getElementById("forward10").onclick = () => {
  progressValue = Math.min(100, progressValue + 10);
  document.getElementById("progress").value = progressValue;
};
document.getElementById("progress").oninput = (e) => {
  progressValue = Number(e.target.value);
};
document.getElementById("favoriteBtn").onclick = (e) => {
  if (!currentStory) return;
  const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
  const i = fav.indexOf(currentStory.title);
  if (i >= 0) {
    fav.splice(i, 1);
    e.currentTarget.textContent = "♡ পছন্দ";
  } else {
    fav.push(currentStory.title);
    e.currentTarget.textContent = "♥ পছন্দ";
  }
  localStorage.setItem("favorites", JSON.stringify(fav));
};
document.getElementById("shareBtn").onclick = async () => {
  const data = {
    title: currentStory.title,
    text: `${currentStory.title} — শব্দায়ন`,
    url: location.href,
  };
  try {
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(`${data.title} — ${data.url}`);
    document.getElementById("playerNote").textContent =
      "শেয়ার লিংক প্রস্তুত হয়েছে ✓";
  } catch {}
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLogin();
    closePlayer();
    closeMenu();
  }
});

// Restore login state
const savedUser = JSON.parse(localStorage.getItem("user") || "null");
if (savedUser && localStorage.getItem("loggedIn") === "true") {
  document.querySelector(".account-strip span").textContent =
    `স্বাগতম, ${savedUser.name}`;
  document.getElementById("loginOpen").textContent = "আমার অ্যাকাউন্ট";
}

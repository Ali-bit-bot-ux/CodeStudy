/* ==========================================================================
   CodeStudy. — Main App Logic (Stepplify-inspired)
   ========================================================================== */

const WA = "77712927393";
let lang = "ru";

// ─── WhatsApp helper ───────────────────────────────────────────────────────
function wa(msg) {
  const def = lang === "kz"
    ? "Сәлеметсіз бе! CodeStudy. сайтынан жазылу."
    : "Здравствуйте! Пишу с сайта CodeStudy. Хочу записать ребёнка на бесплатный пробный урок.";
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg || def)}`, "_blank");
}

// ─── Scroll progress ───────────────────────────────────────────────────────
function initScrollProgress() {
  const fill = document.getElementById("scrollFill");
  if (!fill) return;
  window.addEventListener("scroll", () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.width = docH > 0 ? (window.scrollY / docH * 100) + "%" : "0%";
  }, { passive: true });
}

// ─── Topbar scroll effect ──────────────────────────────────────────────────
function initTopbar() {
  const bar = document.getElementById("topbar");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    bar.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
}

// ─── Mobile nav ────────────────────────────────────────────────────────────
function initMobileNav() {
  const toggle = document.getElementById("mobileToggle");
  const nav    = document.getElementById("navCenter");
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("mobile-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle("mobile-open");
    toggle.setAttribute("aria-expanded", open);
  });

  // Close when a nav link or CTA button inside is clicked
  nav.querySelectorAll("a, button").forEach(el =>
    el.addEventListener("click", closeMenu)
  );

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("mobile-open")) {
      closeMenu();
    }
  });
}


// ─── Scroll reveal ─────────────────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll(".reveal-up");
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-revealed");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

// ─── Course search filter ──────────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById("courseSearch");
  if (!input) return;

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll(".course-card").forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = !q || text.includes(q) ? "" : "none";
    });
  });
}

// ─── Calculator ────────────────────────────────────────────────────────────
let calcFmt = "group"; // "group" = 1500 | "indiv" = 2500
let calcHrs = 2;

function recalc() {
  const rate  = calcFmt === "indiv" ? 2500 : 1500;
  const total = rate * calcHrs * 4;
  const el    = document.getElementById("calcTotal");
  const hv    = document.getElementById("calcHoursVal");
  if (el) el.textContent = total.toLocaleString("ru-RU") + " ₸";
  if (hv) hv.textContent = calcHrs + " " + (lang === "kz" ? "сабақ/апта" : "урока/нед");
}

function initCalc() {
  document.querySelectorAll(".calc-fmt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".calc-fmt-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      calcFmt = btn.dataset.format;
      recalc();
    });
  });

  const range = document.getElementById("calcRange");
  if (range) range.addEventListener("input", () => { calcHrs = +range.value; recalc(); });

  const ctaBtn = document.getElementById("calcCtaBtn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      const fmt  = calcFmt === "indiv"
        ? (lang === "kz" ? "Жеке (2 500 ₸/сағ)" : "Индивидуально (2 500 ₸/ч)")
        : (lang === "kz" ? "Топта (1 500 ₸/сағ)" : "В группе (1 500 ₸/ч)");
      const msg = lang === "kz"
        ? `Сәлеметсіз бе! Мені ${fmt} форматы қызықтырады. Аптасына ${calcHrs} сабақ.`
        : `Здравствуйте! Интересует формат ${fmt}, ${calcHrs} занятия в неделю. Как записаться?`;
      wa(msg);
    });
  }

  recalc();
}

// ─── FAQ accordion ─────────────────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll(".faq-item").forEach(item => {
    item.querySelector(".faq-q").addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });
}

// ─── Modal ─────────────────────────────────────────────────────────────────
function initModal() {
  const overlay = document.getElementById("bookingModal");
  const form    = document.getElementById("bookingForm");
  const close   = overlay?.querySelector(".modal-close");

  function open(coursePref) {
    if (coursePref) {
      const sel = document.getElementById("modalCourse");
      if (sel) sel.value = coursePref;
    }
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".open-modal-btn").forEach(btn =>
    btn.addEventListener("click", e => {
      e.preventDefault();
      open(btn.dataset.coursePref);
    })
  );

  close?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  form?.addEventListener("submit", e => {
    e.preventDefault();
    const name   = document.getElementById("modalName")?.value.trim() || "";
    const age    = document.getElementById("modalAge")?.value || "";
    const course = document.getElementById("modalCourse")?.value || "";
    const fmt    = document.getElementById("modalFormat")?.value || "";

    const msg = lang === "kz"
      ? `Сәлеметсіз бе! CodeStudy. сынақ сабағы:\n- Аты: ${name}\n- Жасы: ${age}\n- Бағыт: ${course}\n- Формат: ${fmt}`
      : `Здравствуйте! Запись на пробный урок CodeStudy:\n- Имя: ${name}\n- Возраст: ${age}\n- Курс: ${course}\n- Формат: ${fmt}`;

    wa(msg);
    closeModal();
    form.reset();
  });
}

// ─── Direct WhatsApp buttons ────────────────────────────────────────────────
function initWAButtons() {
  document.querySelectorAll(".direct-wa-btn, .fab-wa").forEach(btn =>
    btn.addEventListener("click", e => { e.preventDefault(); wa(); })
  );
}

// ─── Language switching ─────────────────────────────────────────────────────
function setLang(l) {
  if (!translations?.[l]) return;
  lang = l;
  localStorage.setItem("cs_lang", l);

  document.querySelectorAll(".lang-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.lang === l)
  );

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[l][key] !== undefined) el.textContent = translations[l][key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[l][key] !== undefined) el.placeholder = translations[l][key];
  });

  recalc();

  // Fade in after language swap
  document.documentElement.style.opacity = "1";
}

function initLang() {
  document.querySelectorAll(".lang-btn").forEach(btn =>
    btn.addEventListener("click", () => setLang(btn.dataset.lang))
  );

  const saved = localStorage.getItem("cs_lang") || "ru";
  setLang(saved);
}

// ─── Video Controller ──────────────────────────────────────────────────────
function initVideo() {
  const v = document.getElementById("heroVideo");
  if (!v) return;

  v.muted = true;
  v.defaultMuted = true;

  const tryPlay = () => {
    const p = v.play();
    if (p !== undefined) {
      p.then(() => {
        document.body.classList.remove("no-video");
        document.querySelector(".hero")?.classList.remove("no-video");
      }).catch(() => {});
    }
  };

  tryPlay();

  const onUserActive = () => {
    if (v.paused) tryPlay();
    window.removeEventListener("pointerdown", onUserActive);
    window.removeEventListener("scroll", onUserActive);
    window.removeEventListener("keydown", onUserActive);
  };
  window.addEventListener("pointerdown", onUserActive, { passive: true });
  window.addEventListener("scroll", onUserActive, { passive: true });
  window.addEventListener("keydown", onUserActive, { passive: true });

  v.addEventListener("error", () => {
    if (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      document.body.classList.add("no-video");
      document.querySelector(".hero")?.classList.add("no-video");
    }
  }, true);
}

// ─── Interactive Quiz ───────────────────────────────────────────────────────
function initQuiz() {
  const overlay    = document.getElementById("quizModal");
  const closeBtn   = document.getElementById("quizClose");
  const backBtn    = document.getElementById("quizBackBtn");
  const progressFl = document.getElementById("quizProgressFill");
  const stepLabel  = document.getElementById("quizStepLabel");
  const toResult   = document.getElementById("quizToResult");
  const quizForm   = document.getElementById("quizForm");
  if (!overlay) return;

  // Quiz state
  let currentStep = 1;
  let history     = [];
  let answers     = { age: null, interest: null };
  const TOTAL_STEPS = 3;

  // Micro-questions per interest
  const microQ = {
    gamedev: {
      title: "Маленький вопрос на логику! 🎮",
      text:  "Персонажу нужно сделать 5 шагов вперёд. Какой блок кода лучше использовать?",
      options: [
        { letter: "А", text: "Повторить 5 раз действие «Шаг»",   correct: true  },
        { letter: "Б", text: "Написать «Шаг» 5 раз вручную",     correct: false },
        { letter: "В", text: "Ничего не делать — он дойдёт сам", correct: false },
      ],
      feedbackCorrect: "🎉 Правильно! Это называется цикл — основа всего программирования!",
      feedbackWrong:   "💡 Почти! Правильный ответ: А. Цикл — один из главных инструментов программиста!",
    },
    webdev: {
      title: "Маленький вопрос на HTML! 🌐",
      text:  "Какой тег создаст самый крупный заголовок на странице?",
      options: [
        { letter: "А", text: "<h1> — главный заголовок", correct: true  },
        { letter: "Б", text: "<p>  — просто абзац",      correct: false },
        { letter: "В", text: "<div> — блок-контейнер",   correct: false },
      ],
      feedbackCorrect: "🎉 Верно! Тег <h1> — самый важный заголовок. Поисковики обожают его!",
      feedbackWrong:   "💡 Почти! Правильный ответ: А. Тег <h1> создаёт главный заголовок страницы!",
    },
    algo: {
      title: "Маленький вопрос на логику! 🧠",
      text:  "Тебе нужно найти самое большое число в списке из 1000 чисел. Что будешь делать?",
      options: [
        { letter: "А", text: "Перебрать все числа и запомнить максимум", correct: true  },
        { letter: "Б", text: "Угадать наугад",                           correct: false },
        { letter: "В", text: "Взять первое число",                       correct: false },
      ],
      feedbackCorrect: "🎉 Отлично! Это и есть алгоритм — чёткая последовательность шагов для решения задачи!",
      feedbackWrong:   "💡 Почти! Правильный ответ: А. Перебор элементов — базовый алгоритм поиска максимума!",
    },
  };

  // Results per interest
  const results = {
    gamedev: {
      badge:  "🚀",
      title:  "Вам идеально подходит: Python &amp; GameDev!",
      desc:   "Ваш ребёнок за 45 минут создаст свою первую мини-игру под руководством наставника. Roblox Studio, Python, 3D-логика — и всё это в одном курсе!",
      course: "Python & Roblox GameDev",
    },
    webdev: {
      badge:  "🌐",
      title:  "Вам идеально подходит: HTML &amp; CSS!",
      desc:   "Ваш ребёнок за 45 минут создаст свою первую веб-страницу. HTML, CSS, анимации — и личный портфолио из 3 сайтов!",
      course: "HTML & CSS",
    },
    algo: {
      badge:  "🏆",
      title:  "Вам идеально подходит: C++ &amp; Алгоритмы!",
      desc:   "Ваш ребёнок освоит алгоритмическое мышление — фундамент для любого технического успеха. Олимпиадная подготовка, C++, структуры данных!",
      course: "C++ & Алгоритмы",
    },
  };

  // ── Open / Close ──────────────────────────────────────────────────────────
  function openQuiz() {
    resetQuiz();
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeQuiz() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // ── Step management ───────────────────────────────────────────────────────
  function showStep(n) {
    document.querySelectorAll(".quiz-step").forEach(s => s.classList.add("hidden"));
    const el = document.getElementById("qStep" + n);
    if (el) {
      el.classList.remove("hidden");
      el.style.animation = "none";
      el.offsetHeight; // force reflow
      el.style.animation = "";
    }

    currentStep = n;
    const pct = (Math.min(n, TOTAL_STEPS) / TOTAL_STEPS) * 100;
    if (progressFl) progressFl.style.width = pct + "%";

    const labels = ["", "Шаг 1 из 3", "Шаг 2 из 3", "Шаг 3 из 3", "Ваш результат 🎉"];
    if (stepLabel) stepLabel.textContent = labels[n] || "";

    if (backBtn) backBtn.style.display = (history.length > 0 && n !== 4) ? "block" : "none";
  }

  function goTo(n) {
    history.push(currentStep);
    showStep(n);
  }

  function goBack() {
    if (!history.length) return;
    const prev = history.pop();
    if (prev === 3) resetStep3();
    showStep(prev);
  }

  function resetQuiz() {
    history = [];
    answers = { age: null, interest: null };
    resetStep3();
    document.querySelectorAll(".quiz-card").forEach(c => c.classList.remove("selected"));
    showStep(1);
  }

  function resetStep3() {
    const feedback = document.getElementById("quizFeedback");
    if (feedback) feedback.classList.add("hidden");
    document.querySelectorAll(".quiz-option").forEach(o => {
      o.classList.remove("correct", "wrong");
      o.disabled = false;
      o.style.pointerEvents = "";
    });
  }

  // ── Build micro-question dynamically ─────────────────────────────────────
  function buildMicroQ(interest) {
    const q       = microQ[interest] || microQ.gamedev;
    const titleEl = document.getElementById("quizMicroTitle");
    const textEl  = document.getElementById("quizMicroText");
    const optsEl  = document.getElementById("quizMicroOptions");
    if (titleEl) titleEl.textContent = q.title;
    if (textEl)  textEl.textContent  = q.text;
    if (!optsEl) return;

    optsEl.innerHTML = "";
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.dataset.correct = opt.correct ? "true" : "false";
      btn.innerHTML =
        `<span class="quiz-option-letter">${opt.letter}</span>` +
        `<span class="quiz-option-text">${opt.text}</span>`;
      btn.addEventListener("click", () => handleMicroAnswer(btn, opt.correct, q));
      optsEl.appendChild(btn);
    });
  }

  function handleMicroAnswer(btn, isCorrect, q) {
    // Lock all options
    document.querySelectorAll(".quiz-option").forEach(o => {
      o.disabled = true;
      o.style.pointerEvents = "none";
    });

    btn.classList.add(isCorrect ? "correct" : "wrong");

    if (!isCorrect) {
      document.querySelectorAll(".quiz-option").forEach(o => {
        if (o.dataset.correct === "true") o.classList.add("correct");
      });
    }

    const feedback = document.getElementById("quizFeedback");
    const fbIcon   = document.getElementById("quizFeedbackIcon");
    const fbText   = document.getElementById("quizFeedbackText");
    if (feedback) {
      feedback.style.borderColor = isCorrect ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.25)";
      if (fbIcon) fbIcon.textContent = isCorrect ? "🎉" : "💡";
      if (fbText) fbText.textContent = isCorrect ? q.feedbackCorrect : q.feedbackWrong;
      feedback.classList.remove("hidden");
    }
  }

  // ── Build result screen ───────────────────────────────────────────────────
  function buildResult(interest) {
    const r     = results[interest] || results.gamedev;
    const badge = document.getElementById("quizResultBadge");
    const title = document.getElementById("quizResultTitle");
    const desc  = document.getElementById("quizResultDesc");
    if (badge) {
      badge.textContent    = r.badge;
      badge.style.animation = "none";
      badge.offsetHeight;
      badge.style.animation = "";
    }
    if (title) title.innerHTML   = r.title;
    if (desc)  desc.textContent  = r.desc;
  }

  // ── Trigger buttons ───────────────────────────────────────────────────────
  document.querySelectorAll("#heroQuizBtn, #quizStartBtn").forEach(btn => {
    btn?.addEventListener("click", openQuiz);
  });

  closeBtn?.addEventListener("click", closeQuiz);
  overlay?.addEventListener("click", e => { if (e.target === overlay) closeQuiz(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeQuiz();
  });
  backBtn?.addEventListener("click", goBack);

  // ── Step 1: age cards ─────────────────────────────────────────────────────
  document.querySelectorAll("#qStep1 .quiz-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("#qStep1 .quiz-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      answers.age = card.dataset.val;
      setTimeout(() => goTo(2), 200);
    });
  });

  // ── Step 2: interest cards ────────────────────────────────────────────────
  document.querySelectorAll("#qStep2 .quiz-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("#qStep2 .quiz-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      answers.interest = card.dataset.val;
      buildMicroQ(answers.interest);
      setTimeout(() => goTo(3), 200);
    });
  });

  // ── Step 3 → Result ───────────────────────────────────────────────────────
  toResult?.addEventListener("click", () => {
    buildResult(answers.interest || "gamedev");
    goTo(4);
  });

  // ── Quiz form submit ──────────────────────────────────────────────────────
  quizForm?.addEventListener("submit", e => {
    e.preventDefault();
    const name  = document.getElementById("quizParentName")?.value.trim() || "";
    const phone = document.getElementById("quizPhone")?.value.trim() || "";
    const r     = results[answers.interest] || results.gamedev;
    const ageLabel = answers.age === "junior" ? "6–9 лет"
                   : answers.age === "middle"  ? "10–13 лет"
                   : "14–16 лет";
    const msg = `Здравствуйте! Прошли квиз на сайте CodeStudy.\n` +
                `- Имя: ${name}\n` +
                `- Телефон: ${phone}\n` +
                `- Рекомендованный курс: ${r.course}\n` +
                `- Возраст: ${ageLabel}\n` +
                `Хотим записаться на бесплатный пробный урок!`;
    wa(msg);
    closeQuiz();
    quizForm.reset();
  });

  // init
  showStep(1);
}

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initTopbar();
  initMobileNav();
  initReveal();
  initSearch();
  initCalc();
  initFAQ();
  initModal();
  initWAButtons();
  initVideo();
  initLang();
  initQuiz();
});

// =========================================
// A LITTLE UNIVERSE OF US
// INTERACTIONS & DIWALI FIREWORKS
// =========================================


// 1. OPENING BUTTON — SCROLL TO FIRST PAGE

const beginButton = document.querySelector("#beginButton");

const openingSection = document.querySelector("#opening");

beginButton?.addEventListener("click", () => {

  openingSection?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

});


// =========================================
// 2. INTERACTIVE TIMELINE
// =========================================

document.querySelectorAll(".memory-toggle").forEach((button) => {

  button.addEventListener("click", () => {

    const card = button.closest(".memory-card");

    const isOpen = card.classList.toggle("open");

    button.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });

});


// =========================================
// 3. SCROLL REVEAL ANIMATIONS
// =========================================

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

  const observer = new IntersectionObserver(

    (entries, obs) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          obs.unobserve(entry.target);

        }

      });

    },

    {
      threshold: 0.12
    }

  );

  revealItems.forEach((item) => {

    observer.observe(item);

  });

} else {

  revealItems.forEach((item) => {

    item.classList.add("visible");

  });

}


// =========================================
// 4. DIWALI FIREWORKS
// =========================================

const canvas = document.querySelector("#fireworks");

const ctx = canvas?.getContext("2d");

const fireworkButton = document.querySelector("#fireworkButton");

let particles = [];

let animationFrame = null;

let lastAutoBurst = 0;


// RESIZE CANVAS

function resizeCanvas() {

  if (!canvas || !ctx) return;

  const ratio = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  const bounds = canvas.getBoundingClientRect();

  canvas.width = Math.floor(bounds.width * ratio);

  canvas.height = Math.floor(bounds.height * ratio);

  ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// FIREWORK COLOURS

const fireworkColors = [

  "#e7cf83",  // Antique gold
  "#d7b7e8",  // Lavender
  "#a5a52e",  // Olive green
  "#f5e7c5",  // Warm ivory
  "#8f62a4"   // Purple

];


// CREATE A FIREWORK BURST

function burst(x, y) {

  const count = 48 + Math.floor(
    Math.random() * 24
  );

  const color = fireworkColors[
    Math.floor(Math.random() * fireworkColors.length)
  ];

  for (let i = 0; i < count; i++) {

    const angle =
      (Math.PI * 2 * i) / count +
      Math.random() * 0.12;

    const speed =
      1.1 + Math.random() * 3.1;

    particles.push({

      x,
      y,

      vx: Math.cos(angle) * speed,

      vy: Math.sin(angle) * speed,

      alpha: 1,

      radius: 1 + Math.random() * 1.7,

      color: color,

      gravity: 0.018 + Math.random() * 0.025

    });

  }

}


// ANIMATION LOOP

function animateFireworks(time = 0) {

  if (!ctx || !canvas) return;

  const width = canvas.clientWidth;

  const height = canvas.clientHeight;

  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  // AUTOMATIC FIREWORKS

  if (time - lastAutoBurst > 1450) {

    burst(

      width * (
        0.18 + Math.random() * 0.64
      ),

      height * (
        0.12 + Math.random() * 0.48
      )

    );

    lastAutoBurst = time;

  }


  // UPDATE PARTICLES

  particles = particles.filter(
    particle => particle.alpha > 0.025
  );


  particles.forEach((particle) => {

    particle.x += particle.vx;

    particle.y += particle.vy;

    particle.vy += particle.gravity;

    particle.vx *= 0.991;

    particle.alpha *= 0.978;


    ctx.globalAlpha = particle.alpha;

    ctx.fillStyle = particle.color;

    ctx.beginPath();

    ctx.arc(

      particle.x,

      particle.y,

      particle.radius,

      0,

      Math.PI * 2

    );

    ctx.fill();

  });


  ctx.globalAlpha = 1;


  animationFrame = requestAnimationFrame(
    animateFireworks
  );

}


// =========================================
// 5. START FIREWORKS WHEN DIWALI IS VISIBLE
// =========================================

const diwaliSection = document.querySelector("#diwali");

if (
  diwaliSection &&
  "IntersectionObserver" in window
) {

  const fireworksObserver = new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (
          entry.isIntersecting &&
          !animationFrame
        ) {

          resizeCanvas();

          animationFrame = requestAnimationFrame(
            animateFireworks
          );

        }

      });

    },

    {
      threshold: 0.08
    }

  );

  fireworksObserver.observe(diwaliSection);

} else if (diwaliSection) {

  animationFrame = requestAnimationFrame(
    animateFireworks
  );

}


// =========================================
// 6. EXTRA FIREWORKS BUTTON
// =========================================

fireworkButton?.addEventListener("click", () => {

  if (!canvas) return;

  const width = canvas.clientWidth;

  const height = canvas.clientHeight;


  // First burst

  burst(

    width * (
      0.25 + Math.random() * 0.5
    ),

    height * (
      0.15 + Math.random() * 0.4
    )

  );


  // Second burst

  burst(

    width * (
      0.25 + Math.random() * 0.5
    ),

    height * (
      0.2 + Math.random() * 0.45
    )

  );


  if (!animationFrame) {

    animationFrame = requestAnimationFrame(
      animateFireworks
    );

  }

});


// =========================================
// 7. PAUSE ANIMATIONS WHEN TAB IS HIDDEN
// =========================================

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.hidden &&
      animationFrame
    ) {

      cancelAnimationFrame(animationFrame);

      animationFrame = null;

    } else if (
      !document.hidden &&
      diwaliSection
    ) {

      const rect =
        diwaliSection.getBoundingClientRect();

      if (
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        !animationFrame
      ) {

        animationFrame = requestAnimationFrame(
          animateFireworks
        );

      }

    }

  }
);

// =====================================
// ACTIVE PAGE NAVIGATION
// =====================================

const currentPage =
  window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".main-nav a").forEach(link => {

  const linkPage = link.getAttribute("href");

  if (linkPage === currentPage) {

    link.classList.add("active");

  }

});

/* =========================================
   CHAPTER NAVIGATION SYSTEM
========================================= */

const chapters = document.querySelectorAll(".chapter");

const navLinks = document.querySelectorAll(".nav-link");

const navigationButtons = document.querySelectorAll("[data-go]");


function showChapter(chapterId) {

  const target = document.getElementById(chapterId);

  if (!target || !target.classList.contains("chapter")) {
    return;
  }

  // Hide all chapters

  chapters.forEach(chapter => {

    chapter.classList.remove("active");

  });


  // Show selected chapter

  target.classList.add("active");


  // Update navigation numbers

  navLinks.forEach(link => {

    const isActive = link.dataset.go === chapterId;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

  });


  // Return to the top of the new chapter

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });


  // Make reveal elements visible in the selected chapter

  target.querySelectorAll(".reveal").forEach(element => {

    element.classList.add("visible");

  });

}


// Handle all navigation buttons

navigationButtons.forEach(button => {

  button.addEventListener("click", () => {

    const destination = button.dataset.go;

    showChapter(destination);

  });

});


// Start on the opening chapter

showChapter("home");


// Keyboard navigation: Left and Right arrows

document.addEventListener("keydown", event => {

  const order = [
    "home",
    "beginning",
    "months",
    "memories",
    "letter",
    "diwali"
  ];

  const current = document.querySelector(".chapter.active");

  if (!current) return;

  const currentIndex = order.indexOf(current.id);

  if (event.key === "ArrowRight" && currentIndex < order.length - 1) {

    showChapter(order[currentIndex + 1]);

  }

  if (event.key === "ArrowLeft" && currentIndex > 0) {

    showChapter(order[currentIndex - 1]);

  }

});

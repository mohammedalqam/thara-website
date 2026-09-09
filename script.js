/* =========================================================
   THARA REAL ESTATES
========================================================= */


/* =========================================================
   HEADER
========================================================= */

const siteHeader =
  document.getElementById("siteHeader");

const menuButton =
  document.getElementById("menuButton");

const mainNav =
  document.getElementById("mainNav");


if (menuButton && mainNav) {

  menuButton.addEventListener(
    "click",
    () => {

      const open =
        mainNav.classList.toggle("active");


      menuButton.classList.toggle(
        "active",
        open
      );


      menuButton.setAttribute(
        "aria-expanded",
        String(open)
      );


      document.body.classList.toggle(
        "menu-open",
        open
      );

    }
  );


  mainNav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          mainNav.classList.remove(
            "active"
          );

          menuButton.classList.remove(
            "active"
          );

          document.body.classList.remove(
            "menu-open"
          );

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });

}



window.addEventListener(
  "scroll",
  () => {

    siteHeader?.classList.toggle(
      "scrolled",
      window.scrollY > 25
    );

  },
  {
    passive: true
  }
);



/* =========================================================
   HOME PAGE
========================================================= */

if (
  document.body.classList.contains(
    "home-page"
  )
) {


  /* =======================================================
     LIGHTWEIGHT CINEMATIC MOTION
     No dependencies, scroll hijacking or persistent RAF loop.
     Content is visible even when animation APIs are unavailable.
  ======================================================= */

  const hero = document.querySelector(".hero");
  const heroSlides = [...document.querySelectorAll(".hero-slide")];
  const heroDots = [...document.querySelectorAll(".hero-dot")];
  const heroCurrent = document.getElementById("heroCurrent");
  const heroProgress = document.getElementById("heroProgress");
  const heroPause = document.getElementById("heroPause");
  const heroMedia = document.querySelector(".hero-slides");
  const heroCopy = document.getElementById("heroContent");
  const featuredPhoto = document.querySelector(".featured-gallery-main");
  const featuredImage = featuredPhoto?.querySelector("img");
  const story = document.querySelector(".brand-moment");
  const storyPhrases = [...document.querySelectorAll(".story-phrase")];
  const storyLine = document.querySelector(".brand-moment-line");
  const revealElements = [...document.querySelectorAll(".reveal")];
  const counters = [...document.querySelectorAll(".count-up")];
  const counterGroup = document.querySelector(".featured-specs");
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)") ||
    { matches: true };
  const desktopMotion = window.matchMedia?.(
    "(min-width: 900px) and (hover: hover) and (pointer: fine)"
  ) || { matches: false };
  const connection = navigator.connection;
  const constrainedDevice = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const supportsObserver = typeof window.IntersectionObserver === "function";
  const activeAnimations = new Set();
  const activeScenes = new Set();
  const HERO_DURATION = 5200;
  const EASE = "cubic-bezier(.16,1,.3,1)";
  let motionEnabled = false;
  let richMotion = false;
  let heroIndex = 0;
  let heroInView = false;
  let heroUserPaused = false;
  let heroTimer = null;
  let progressAnimation = null;
  let scrollFrame = 0;
  let counterFrame = 0;
  let sceneObserver = null;
  let revealObserver = null;

  const clamp = (value) => Math.max(0, Math.min(1, value));

  function animateOnce(element, frames, options) {
    if (!motionEnabled || document.hidden || !element?.animate) return;
    const animation = element.animate(frames, { fill: "backwards", ...options });
    activeAnimations.add(animation);
    const release = () => activeAnimations.delete(animation);
    animation.finished.then(release, release);
  }

  function finishCounters() {
    cancelAnimationFrame(counterFrame);
    counterFrame = 0;
    counters.forEach((element) => {
      element.textContent = String(Number(element.dataset.count));
    });
  }

  function reveal(element) {
    element.classList.add("visible");
    if (!motionEnabled || document.hidden) return;
    const stagger = desktopMotion.matches
      ? (element.classList.contains("delay-2") ? 120 :
        element.classList.contains("delay-1") ? 60 : 0)
      : 0;
    animateOnce(element, [
      { opacity: 0, transform: `translateY(${richMotion ? 32 : 14}px)` },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: richMotion ? 850 : 500, delay: stagger, easing: EASE });

    if (element.matches(".editorial-image")) {
      animateOnce(element.querySelector("img"), [
        { transform: `scale(${richMotion ? 1.1 : 1.04})` },
        { transform: "scale(1)" }
      ], { duration: richMotion ? 1100 : 650, delay: stagger, easing: EASE });
    }

    if (element.matches(".brand-moment-content") && !richMotion) {
      storyPhrases.forEach((phrase, index) => {
        animateOnce(phrase, [{ opacity: .6 }, { opacity: 1 }], {
          duration: 550, delay: index * 100, easing: "ease-out"
        });
      });
    }
  }

  function stopHeroSlider() {
    clearTimeout(heroTimer);
    heroTimer = null;
    progressAnimation?.cancel();
    progressAnimation = null;
  }

  function syncHeroSlider() {
    stopHeroSlider();
    if (!motionEnabled || !heroInView || document.hidden ||
        heroUserPaused || heroSlides.length < 2) return;
    if (heroProgress?.animate) {
      progressAnimation = heroProgress.animate(
        [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
        { duration: HERO_DURATION, easing: "linear", fill: "forwards" }
      );
    }
    heroTimer = setTimeout(() => {
      showHeroSlide((heroIndex + 1) % heroSlides.length);
      syncHeroSlider();
    }, HERO_DURATION);
  }

  function showHeroSlide(index) {
    heroIndex = index;
    heroSlides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    heroDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-current", String(i === index));
    });
    if (heroCurrent) heroCurrent.textContent = String(index + 1).padStart(2, "0");
  }

  heroDots.forEach((dot, index) => {
    dot.setAttribute("aria-label", `عرض الصورة ${index + 1}`);
    dot.addEventListener("click", () => {
      showHeroSlide(index);
      syncHeroSlider();
    });
  });
  showHeroSlide(0);

  heroPause?.addEventListener("click", () => {
    heroUserPaused = !heroUserPaused;
    heroPause.setAttribute("aria-pressed", String(heroUserPaused));
    heroPause.textContent = heroUserPaused ? "متابعة العرض" : "إيقاف العرض";
    syncHeroSlider();
  });

  function resetScenes() {
    [heroMedia, heroCopy, featuredImage].forEach((element) => {
      element?.style.removeProperty("--motion-y");
      element?.style.removeProperty("--motion-scale");
    });
    storyPhrases.forEach((phrase) => phrase.style.removeProperty("opacity"));
    storyLine?.style.removeProperty("transform");
    [hero, featuredPhoto, story].forEach((element) =>
      element?.classList.remove("motion-in-view")
    );
  }

  function renderScroll() {
    scrollFrame = 0;
    if (!richMotion || document.hidden) return;
    const viewport = window.innerHeight;
    // Complete all layout reads before any style writes (at most three scenes).
    const positions = [...activeScenes].map((element) => ({
      element, rect: element.getBoundingClientRect()
    }));
    positions.forEach(({ element, rect }) => {
      if (rect.height <= 0) return;
      if (element === hero) {
        const progress = clamp(-rect.top / rect.height);
        heroMedia?.style.setProperty("--motion-y", `${(progress * 64).toFixed(2)}px`);
        heroCopy?.style.setProperty("--motion-y", `${(-progress * 28).toFixed(2)}px`);
      } else if (element === featuredPhoto) {
        const progress = clamp((viewport - rect.top) / (viewport + rect.height));
        featuredImage?.style.setProperty("--motion-y", `${((progress - .5) * 16).toFixed(2)}px`);
        featuredImage?.style.setProperty("--motion-scale", (1.1 - progress * .055).toFixed(4));
      } else if (element === story) {
        const progress = clamp((viewport * .86 - rect.top) / (viewport * .52));
        storyPhrases.forEach((phrase, index) => {
          phrase.style.opacity = String(.6 + .4 * clamp(progress * storyPhrases.length - index));
        });
        if (storyLine) storyLine.style.transform = `scaleX(${.35 + .65 * progress})`;
      }
    });
  }

  function queueScroll() {
    if (!scrollFrame && richMotion && !document.hidden && activeScenes.size) {
      scrollFrame = requestAnimationFrame(renderScroll);
    }
  }

  function syncMotionPolicy() {
    motionEnabled = !reducedMotion.matches && !connection?.saveData;
    richMotion = motionEnabled && desktopMotion.matches && !constrainedDevice &&
      supportsObserver;
    document.body.dataset.motion = motionEnabled ? (richMotion ? "full" : "light") : "off";
    if (heroPause) heroPause.hidden = !motionEnabled || !supportsObserver || heroSlides.length < 2;
    activeAnimations.forEach((animation) => animation.cancel());
    activeAnimations.clear();
    finishCounters();
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    window.removeEventListener("scroll", queueScroll);
    sceneObserver?.disconnect();
    activeScenes.clear();
    resetScenes();
    heroInView = false;
    if (sceneObserver) {
      if (hero) sceneObserver.observe(hero);
      if (richMotion) {
        if (featuredPhoto) sceneObserver.observe(featuredPhoto);
        if (story) sceneObserver.observe(story);
        window.addEventListener("scroll", queueScroll, { passive: true });
      }
    }
    if (!motionEnabled) {
      revealObserver?.disconnect();
      revealElements.forEach((element) => element.classList.add("visible"));
    }
    syncHeroSlider();
  }

  if (supportsObserver) {
    sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) {
          heroInView = entry.isIntersecting;
          syncHeroSlider();
        }
        if (!richMotion) return;
        entry.target.classList.toggle("motion-in-view", entry.isIntersecting);
        if (entry.isIntersecting) activeScenes.add(entry.target);
        else activeScenes.delete(entry.target);
      });
      queueScroll();
    }, { threshold: 0 });
  }
  syncMotionPolicy();

  if (supportsObserver && motionEnabled) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealObserver.unobserve(entry.target);
        reveal(entry.target);
      });
    }, { threshold: .08 });
    revealElements.forEach((element) => revealObserver.observe(element));

    if (counterGroup) {
      const counterObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        counterObserver.disconnect();
        if (!motionEnabled || document.hidden) return finishCounters();
        const start = performance.now();
        function tick(now) {
          const progress = clamp((now - start) / 850);
          counters.forEach((element) => {
            const target = Number(element.dataset.count);
            element.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          });
          counterFrame = progress < 1 ? requestAnimationFrame(tick) : 0;
        }
        counterFrame = requestAnimationFrame(tick);
      }, { threshold: .5 });
      counterObserver.observe(counterGroup);
    }
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      finishCounters();
      activeAnimations.forEach((animation) => animation.cancel());
      activeAnimations.clear();
    } else {
      queueScroll();
    }
    syncHeroSlider();
  });
  // Live preference changes and screen rotations must also stop unnecessary work.
  reducedMotion.addEventListener?.("change", syncMotionPolicy);
  desktopMotion.addEventListener?.("change", syncMotionPolicy);
  connection?.addEventListener?.("change", syncMotionPolicy);
  window.addEventListener("resize", queueScroll, { passive: true });


  /* =======================================================
     WHATSAPP
  ======================================================= */

  const whatsappNumber =
    "972532121036";


  function openWhatsApp(message, number = whatsappNumber) {

    const safeNumber =
      String(number).replace(/\D/g, "");


    const url =
      `https://wa.me/${safeNumber}?text=${encodeURIComponent(message)}`;


    window.open(
      url,
      "_blank",
      "noopener"
    );

  }


  document
    .querySelectorAll(
      ".whatsapp-link"
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          event.preventDefault();


          openWhatsApp(
            link.dataset.message ||
            "مرحباً، أريد الاستفسار عن فلل THARA.",
            link.dataset.whatsappNumber ||
            whatsappNumber
          );

        }
      );

    });



  /* =======================================================
     WHATSAPP CONTACT PICKERS
  ======================================================= */

  const whatsappPickers =
    Array.from(
      document.querySelectorAll(
        ".whatsapp-picker"
      )
    );


  function closeWhatsappPickers(exceptPicker = null) {

    whatsappPickers.forEach((picker) => {

      if (picker === exceptPicker) {
        return;
      }


      picker.classList.remove(
        "active"
      );


      const toggle =
        picker.querySelector(
          ".whatsapp-picker-toggle"
        );


      if (toggle) {
        toggle.setAttribute(
          "aria-expanded",
          "false"
        );
      }

    });

  }


  whatsappPickers.forEach((picker) => {

    const toggle =
      picker.querySelector(
        ".whatsapp-picker-toggle"
      );


    if (!toggle) {
      return;
    }


    toggle.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();


        const willOpen =
          !picker.classList.contains(
            "active"
          );


        closeWhatsappPickers();


        if (willOpen) {
          picker.classList.add(
            "active"
          );


          toggle.setAttribute(
            "aria-expanded",
            "true"
          );
        }

      }
    );


    picker.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

      }
    );

  });


  document.addEventListener(
    "click",
    () => closeWhatsappPickers()
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {
        closeWhatsappPickers();
      }

    }
  );



  /* =======================================================
     ADVANCED GALLERY LIGHTBOX
  ======================================================= */

  const galleryItems =
    Array.from(
      document.querySelectorAll(
        ".gallery-viewer"
      )
    );


  const lightbox =
    document.getElementById(
      "homeLightbox"
    );

  const lightboxImage =
    document.getElementById(
      "homeLightboxImage"
    );

  const lightboxClose =
    document.getElementById(
      "homeLightboxClose"
    );

  const lightboxOverlay =
    document.getElementById(
      "homeLightboxOverlay"
    );

  const lightboxPrev =
    document.getElementById(
      "lightboxPrev"
    );

  const lightboxNext =
    document.getElementById(
      "lightboxNext"
    );

  const lightboxCurrent =
    document.getElementById(
      "lightboxCurrent"
    );

  const lightboxTotal =
    document.getElementById(
      "lightboxTotal"
    );


  const galleryImages =
    galleryItems.map(
      (item) => item.dataset.full
    );


  let lightboxIndex = 0;

  let lightboxTouchStart = 0;



  function updateLightboxImage() {

    if (!lightboxImage) {
      return;
    }


    lightboxImage.classList.add(
      "changing"
    );


    setTimeout(
      () => {

        lightboxImage.src =
          galleryImages[
            lightboxIndex
          ];


        lightboxCurrent.textContent =
          lightboxIndex + 1;


        lightboxTotal.textContent =
          galleryImages.length;


        lightboxImage.classList.remove(
          "changing"
        );

      },
      150
    );

  }



  function openLightbox(index) {

    if (!lightbox) {
      return;
    }


    lightboxIndex = index;


    lightboxImage.src =
      galleryImages[index];


    lightboxCurrent.textContent =
      index + 1;


    lightboxTotal.textContent =
      galleryImages.length;


    lightbox.classList.add(
      "active"
    );


    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "lightbox-open"
    );

  }



  function closeLightbox() {

    lightbox?.classList.remove(
      "active"
    );


    lightbox?.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.classList.remove(
      "lightbox-open"
    );

  }



  function nextLightboxImage() {

    lightboxIndex =
      (
        lightboxIndex + 1
      ) % galleryImages.length;


    updateLightboxImage();

  }



  function previousLightboxImage() {

    lightboxIndex =
      (
        lightboxIndex -
        1 +
        galleryImages.length
      ) % galleryImages.length;


    updateLightboxImage();

  }



  galleryItems.forEach(
    (item, index) => {

      item.addEventListener(
        "click",
        () => {

          openLightbox(
            index
          );

        }
      );

    }
  );


  lightboxClose?.addEventListener(
    "click",
    closeLightbox
  );


  lightboxOverlay?.addEventListener(
    "click",
    closeLightbox
  );


  lightboxNext?.addEventListener(
    "click",
    nextLightboxImage
  );


  lightboxPrev?.addEventListener(
    "click",
    previousLightboxImage
  );



  /* SWIPE */

  lightboxImage?.addEventListener(
    "touchstart",
    (event) => {

      lightboxTouchStart =
        event.changedTouches[0]
          .screenX;

    },
    {
      passive: true
    }
  );


  lightboxImage?.addEventListener(
    "touchend",
    (event) => {

      const end =
        event.changedTouches[0]
          .screenX;


      const difference =
        lightboxTouchStart -
        end;


      if (
        Math.abs(
          difference
        ) < 45
      ) {
        return;
      }


      if (difference > 0) {

        nextLightboxImage();

      } else {

        previousLightboxImage();

      }

    },
    {
      passive: true
    }
  );



  /* KEYBOARD */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        !lightbox?.classList.contains(
          "active"
        )
      ) {
        return;
      }


      if (
        event.key === "Escape"
      ) {

        closeLightbox();

      }


      if (
        event.key === "ArrowLeft"
      ) {

        nextLightboxImage();

      }


      if (
        event.key === "ArrowRight"
      ) {

        previousLightboxImage();

      }

    }
  );



  /* =======================================================
     FUTURE LINKS
  ======================================================= */

  const toast =
    document.getElementById(
      "siteToast"
    );


  let toastTimer;


  document
    .querySelectorAll(
      ".footer-future-link"
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          event.preventDefault();


          if (!toast) {
            return;
          }


          toast.classList.add(
            "active"
          );


          clearTimeout(
            toastTimer
          );


          toastTimer =
            setTimeout(
              () => {

                toast.classList.remove(
                  "active"
                );

              },
              2000
            );

        }
      );

    });



  /* YEAR */

  const currentYear =
    document.getElementById(
      "currentYear"
    );


  if (currentYear) {

    currentYear.textContent =
      new Date().getFullYear();

  }

}

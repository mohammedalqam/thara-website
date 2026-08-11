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
     HERO CINEMATIC SLIDER
  ======================================================= */

  const heroSlides =
    document.querySelectorAll(
      ".hero-slide"
    );

  const heroDots =
    document.querySelectorAll(
      ".hero-dot"
    );

  const heroCurrent =
    document.getElementById(
      "heroCurrent"
    );

  const heroProgress =
    document.getElementById(
      "heroProgress"
    );


  const HERO_DURATION = 5200;

  let heroIndex = 0;

  let heroTimer = null;



  function restartProgress() {

    if (!heroProgress) {
      return;
    }


    heroProgress.classList.remove(
      "running"
    );


    void heroProgress.offsetWidth;


    heroProgress.classList.add(
      "running"
    );

  }



  function showHeroSlide(index) {

    heroSlides.forEach(
      (slide, slideIndex) => {

        slide.classList.toggle(
          "active",
          slideIndex === index
        );

      }
    );


    heroDots.forEach(
      (dot, dotIndex) => {

        dot.classList.toggle(
          "active",
          dotIndex === index
        );

      }
    );


    if (heroCurrent) {

      heroCurrent.textContent =
        String(index + 1)
          .padStart(2, "0");

    }


    heroIndex = index;


    restartProgress();

  }



  function nextHeroSlide() {

    const next =
      (heroIndex + 1)
      % heroSlides.length;


    showHeroSlide(next);

  }



  function startHeroSlider() {

    clearInterval(heroTimer);


    if (heroSlides.length < 2) {
      return;
    }


    heroTimer =
      setInterval(
        nextHeroSlide,
        HERO_DURATION
      );

  }



  heroDots.forEach(
    (dot, index) => {

      dot.addEventListener(
        "click",
        () => {

          showHeroSlide(index);

          startHeroSlider();

        }
      );

    }
  );


  if (heroSlides.length) {

    restartProgress();

    startHeroSlider();

  }



  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {

        clearInterval(heroTimer);

      } else {

        restartProgress();

        startHeroSlider();

      }

    }
  );



  /* =======================================================
     REVEAL ANIMATION
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );


  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "visible"
                );


                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(
      (element) => {

        observer.observe(
          element
        );

      }
    );

  } else {

    revealElements.forEach(
      (element) => {

        element.classList.add(
          "visible"
        );

      }
    );

  }



  /* =======================================================
     NUMBER COUNTER
  ======================================================= */

  const counters =
    document.querySelectorAll(
      ".count-up"
    );


  const counterObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting) {
              return;
            }


            const element =
              entry.target;


            const target =
              Number(
                element.dataset.count
              );


            const duration = 1100;

            const startTime =
              performance.now();


            function animate(now) {

              const progress =
                Math.min(
                  (
                    now - startTime
                  ) / duration,
                  1
                );


              const eased =
                1 -
                Math.pow(
                  1 - progress,
                  3
                );


              element.textContent =
                Math.round(
                  target * eased
                );


              if (progress < 1) {

                requestAnimationFrame(
                  animate
                );

              }

            }


            requestAnimationFrame(
              animate
            );


            counterObserver.unobserve(
              element
            );

          }
        );

      },
      {
        threshold: .6
      }
    );


  counters.forEach(
    (counter) => {

      counterObserver.observe(
        counter
      );

    }
  );



  /* =======================================================
     FEATURED PARALLAX
  ======================================================= */

  const parallaxImages =
    document.querySelectorAll(
      ".parallax-image"
    );


  let parallaxTicking = false;


  function updateParallax() {

    parallaxImages.forEach(
      (image) => {

        const parent =
          image.parentElement;


        const rect =
          parent.getBoundingClientRect();


        const viewport =
          window.innerHeight;


        if (
          rect.bottom < 0 ||
          rect.top > viewport
        ) {
          return;
        }


        const center =
          rect.top +
          rect.height / 2;


        const offset =
          (
            center -
            viewport / 2
          ) / viewport;


        const movement =
          Math.max(
            -22,
            Math.min(
              22,
              offset * -35
            )
          );


        image.style.setProperty(
          "--parallax-y",
          `${movement}px`
        );

      }
    );


    parallaxTicking = false;

  }



  window.addEventListener(
    "scroll",
    () => {

      if (
        parallaxTicking
      ) {
        return;
      }


      parallaxTicking = true;


      requestAnimationFrame(
        updateParallax
      );

    },
    {
      passive: true
    }
  );


  updateParallax();



  /* =======================================================
     WHATSAPP
  ======================================================= */

  const whatsappNumber =
    "972532121036";


  function openWhatsApp(message) {

    const url =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


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
            "مرحباً، أريد الاستفسار عن فلل THARA."
          );

        }
      );

    });



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
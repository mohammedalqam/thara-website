
/* =========================================================
   OWNER SERVICES PAGE
========================================================= */

if (document.body.classList.contains("owners-page")) {
  const ownersHero = document.querySelector(".owners-hero");
  const ownersHeroImage = document.querySelector(".owners-hero-image");
  let ownersParallaxFrame = null;

  function updateOwnersParallax() {
    ownersParallaxFrame = null;
    if (!ownersHero || !ownersHeroImage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = ownersHero.getBoundingClientRect();
    const movement = Math.max(-24, Math.min(24, rect.top * -0.035));
    ownersHeroImage.style.setProperty("--owners-parallax", `${movement}px`);
  }

  window.addEventListener("scroll", () => {
    if (ownersParallaxFrame) return;
    ownersParallaxFrame = requestAnimationFrame(updateOwnersParallax);
  }, { passive: true });
  updateOwnersParallax();

  document.querySelectorAll(".owners-faq-item").forEach((item) => {
    const button = item.querySelector("button");
    const answer = item.querySelector(".owners-faq-answer");
    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const willOpen = !item.classList.contains("active");

      document.querySelectorAll(".owners-faq-item.active").forEach((openItem) => {
        if (openItem === item) return;
        openItem.classList.remove("active");
        openItem.querySelector("button")?.setAttribute("aria-expanded", "false");
        const openAnswer = openItem.querySelector(".owners-faq-answer");
        if (openAnswer) openAnswer.style.maxHeight = "0px";
      });

      item.classList.toggle("active", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
      answer.style.maxHeight = willOpen ? `${answer.scrollHeight}px` : "0px";
    });
  });

  const ownersCounters = Array.from(document.querySelectorAll(".owners-count"));
  const ownersReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ownersNumberFormatter = new Intl.NumberFormat("en-US");

  function formatOwnersCount(counter, value) {
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";
    return `${prefix}${ownersNumberFormatter.format(value)}${suffix}`;
  }

  function showOwnersFinalCount(counter) {
    counter.textContent = formatOwnersCount(counter, Number(counter.dataset.count || 0));
    counter.dataset.counted = "true";
  }

  function animateOwnersCount(counter, index) {
    if (counter.dataset.counted === "true") return;
    counter.dataset.counted = "true";

    const target = Number(counter.dataset.count || 0);
    const requestedDuration = Number(counter.dataset.duration || 3000);
    const duration = Math.round(requestedDuration * 0.68);
    const staggerDelay = 220 + (index * 90);

    window.setTimeout(() => {
      const startedAt = performance.now();

      function updateCount(now) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        counter.textContent = formatOwnersCount(counter, current);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = formatOwnersCount(counter, target);
        }
      }

      requestAnimationFrame(updateCount);
    }, staggerDelay);
  }

  if (ownersReduceMotion) {
    ownersCounters.forEach(showOwnersFinalCount);
  } else if ("IntersectionObserver" in window) {
    const ownersCounterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        animateOwnersCount(counter, ownersCounters.indexOf(counter));
        observer.unobserve(counter);
      });
    }, { threshold: .35 });

    ownersCounters.forEach((counter) => {
      counter.textContent = formatOwnersCount(counter, 0);
      ownersCounterObserver.observe(counter);
    });
  } else {
    ownersCounters.forEach(showOwnersFinalCount);
  }

    const ownersForm = document.getElementById("ownersForm");
  const ownersContactPicker = document.getElementById("ownersContactPicker");

  ownersForm?.addEventListener("input", () => {
    if (ownersContactPicker) ownersContactPicker.hidden = true;
  });

  ownersForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!ownersForm.reportValidity()) return;

    const value = (id, fallback = "غير محدد") => {
      const element = document.getElementById(id);
      return element?.value?.trim() || fallback;
    };

    const services = Array.from(
      ownersForm.querySelectorAll('input[name="ownersService"]:checked')
    ).map((input) => input.value);

    const message = `مرحباً THARA،
أريد الاستفسار عن التعاون بخصوص فيلا.

الاسم: ${value("ownersName")}
رقم الهاتف: ${value("ownersPhone")}
اسم الفيلا: ${value("ownersVillaName")}
الموقع: ${value("ownersLocation")}
عدد الغرف: ${value("ownersRooms")}
حالة الفيلا: ${value("ownersStatus")}
الخدمات المطلوبة: ${services.length ? services.join("، ") : "غير محدد"}
رابط الفيلا: ${value("ownersSocial")}

التفاصيل:
${value("ownersDetails", "لا توجد تفاصيل إضافية")}`;

    ownersContactPicker?.querySelectorAll("[data-owner-number]").forEach((link) => {
      const number = String(link.dataset.ownerNumber || "").replace(/\D/g, "");
      link.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    });

    if (ownersContactPicker) {
      ownersContactPicker.hidden = false;
      ownersContactPicker.scrollIntoView({ behavior: "smooth", block: "nearest" });
      ownersContactPicker.querySelector("a")?.focus({ preventScroll: true });
    }
  });
}

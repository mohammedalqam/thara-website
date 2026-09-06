/* =========================================================
   THARA REAL ESTATES
   VILLAS CATALOG
========================================================= */


/* =========================================================
   VILLAS DATA
========================================================= */

const villasData = {

    elegance: {
      name: "فيلا الأناقة",
      category: "VIP",
      location: "أريحا",
  
      description:
        "فيلا واسعة ومميزة بخصوصية عالية، مناسبة للعائلات والمجموعات، مع مساحات داخلية وخارجية مصممة لقضاء عطلة مريحة ومميزة.",
  
      images: [
        "assets/IMG_4601.webp",
        "assets/IMG_4597.webp",
        "assets/IMG_4600.webp",
        "assets/IMG_4623.webp",
        "assets/IMG_4614.webp",
        "assets/IMG_4622.webp"
      ],
  
      facts: [
        {
          icon: "🛏️",
          value: "4 غرف",
          label: "غرف النوم"
        },
        {
          icon: "👥",
          value: "10",
          label: "حتى 10 أشخاص"
        },
        {
          icon: "🏊",
          value: "خاص",
          label: "مسبح"
        },
        {
          icon: "🎱",
          value: "متوفر",
          label: "بلياردو"
        }
      ],
  
      features: [
        "مسبح خاص",
        "4 غرف نوم",
        "جلسات خارجية",
        "طاولة بلياردو",
        "منطقة شواء",
        "مطبخ مجهز",
        "خصوصية عالية",
        "مواقف سيارات"
      ]
    },
  
  
    calm: {
      name: "فيلا الهدوء",
      category: "عائلية",
      location: "أريحا",
  
      description:
        "فيلا هادئة بأجواء عائلية مريحة، توفر الخصوصية والمساحات المناسبة لقضاء يوم جميل بعيداً عن الازدحام.",
  
      images: [
        "assets/IMG_4596.webp",
        "assets/IMG_4622.webp",
        "assets/IMG_4614.webp",
        "assets/IMG_4597.webp"
      ],
  
      facts: [
        {
          icon: "🛏️",
          value: "3 غرف",
          label: "غرف النوم"
        },
        {
          icon: "👥",
          value: "7",
          label: "حتى 7 أشخاص"
        },
        {
          icon: "🏊",
          value: "خاص",
          label: "مسبح"
        },
        {
          icon: "🔥",
          value: "متوفر",
          label: "شواء"
        }
      ],
  
      features: [
        "3 غرف نوم",
        "مسبح خاص",
        "جلسات خارجية",
        "منطقة شواء",
        "مطبخ",
        "مناسبة للعائلات",
        "خصوصية",
        "مواقف سيارات"
      ]
    },
  
  
    rustic: {
      name: "فيلا الريف",
      category: "هادئة",
      location: "أريحا",
  
      description:
        "خيار مريح للأزواج والعائلات الصغيرة، بأجواء هادئة ومساحة عملية مع مسبح خاص وخصوصية عالية.",
  
      images: [
        "assets/IMG_4623.webp",
        "assets/IMG_4614.webp",
        "assets/IMG_4622.webp"
      ],
  
      facts: [
        {
          icon: "🛏️",
          value: "غرفتين",
          label: "غرف النوم"
        },
        {
          icon: "👥",
          value: "4",
          label: "حتى 4 أشخاص"
        },
        {
          icon: "🏊",
          value: "خاص",
          label: "مسبح"
        },
        {
          icon: "🌿",
          value: "هادئة",
          label: "الأجواء"
        }
      ],
  
      features: [
        "غرفتين نوم",
        "مسبح خاص",
        "جلسات",
        "مطبخ",
        "مناسبة للعائلات الصغيرة",
        "خصوصية",
        "منطقة هادئة"
      ]
    }
  
  };
  
  
  
  /* =========================================================
     FILTERS
  ========================================================= */
  
  const filterButtons =
    document.querySelectorAll(".filter-btn");
  
  const villaCards =
    document.querySelectorAll(".villa-catalog-card");
  
  
  filterButtons.forEach((button) => {
  
    button.addEventListener("click", () => {
  
      const selectedFilter =
        button.dataset.filter;
  
  
      filterButtons.forEach((btn) => {
  
        btn.classList.remove("active");
  
        btn.setAttribute(
          "aria-pressed",
          "false"
        );
  
      });
  
  
      button.classList.add("active");
  
      button.setAttribute(
        "aria-pressed",
        "true"
      );
  
  
      villaCards.forEach((card) => {
  
        const categories =
          (card.dataset.category || "")
            .split(" ");
  
  
        const shouldShow =
          selectedFilter === "all" ||
          categories.includes(selectedFilter);
  
  
        if (shouldShow) {
  
          card.classList.remove("hide");
  
          card.classList.add("show-card");
  
  
          setTimeout(() => {
            card.classList.remove("show-card");
          }, 400);
  
        } else {
  
          card.classList.add("hide");
  
        }
  
      });
  
    });
  
  });
  
  
  
  /* =========================================================
     CARD SLIDERS
  ========================================================= */
  
  const villaSliders =
    document.querySelectorAll(".villa-slider");
  
  
  villaSliders.forEach((slider) => {
  
    const track =
      slider.querySelector(".villa-slider-track");
  
    const images =
      slider.querySelectorAll(
        ".villa-slider-track img"
      );
  
    const prevButton =
      slider.querySelector(".slider-prev");
  
    const nextButton =
      slider.querySelector(".slider-next");
  
    const dots =
      slider.querySelectorAll(".slider-dot");
  
  
    let currentSlide = 0;
  
    let touchStartX = 0;
  
    let touchEndX = 0;
  
  
    function updateSlider() {
  
      track.style.transform =
        `translateX(-${currentSlide * 100}%)`;
  
  
      dots.forEach((dot, index) => {
  
        dot.classList.toggle(
          "active",
          index === currentSlide
        );
  
      });
  
    }
  
  
    function nextSlide() {
  
      currentSlide =
        (currentSlide + 1) % images.length;
  
      updateSlider();
  
    }
  
  
    function previousSlide() {
  
      currentSlide =
        (currentSlide - 1 + images.length)
        % images.length;
  
      updateSlider();
  
    }
  
  
    nextButton?.addEventListener(
      "click",
      (event) => {
  
        event.stopPropagation();
  
        nextSlide();
  
      }
    );
  
  
    prevButton?.addEventListener(
      "click",
      (event) => {
  
        event.stopPropagation();
  
        previousSlide();
  
      }
    );
  
  
    dots.forEach((dot, index) => {
  
      dot.addEventListener(
        "click",
        (event) => {
  
          event.stopPropagation();
  
          currentSlide = index;
  
          updateSlider();
  
        }
      );
  
    });
  
  
  
    /* MOBILE SWIPE */
  
    slider.addEventListener(
      "touchstart",
      (event) => {
  
        touchStartX =
          event.changedTouches[0].screenX;
  
      },
      {
        passive: true
      }
    );
  
  
    slider.addEventListener(
      "touchend",
      (event) => {
  
        touchEndX =
          event.changedTouches[0].screenX;
  
  
        const difference =
          touchStartX - touchEndX;
  
  
        if (
          Math.abs(difference) < 45
        ) {
          return;
        }
  
  
        if (difference > 0) {
  
          nextSlide();
  
        } else {
  
          previousSlide();
  
        }
  
      },
      {
        passive: true
      }
    );
  
  
    updateSlider();
  
  });
  
  
  
  /* =========================================================
     MODAL
  ========================================================= */
  
  const villaModal =
    document.getElementById("villaModal");
  
  const villaModalOverlay =
    document.getElementById("villaModalOverlay");
  
  const villaModalClose =
    document.getElementById("villaModalClose");
  
  const villaModalContent =
    document.getElementById("villaModalContent");
  
  const openVillaButtons =
    document.querySelectorAll(".open-villa");
  
  
  let activeVilla = null;
  
  let modalImageIndex = 0;
  
  
  
  /* =========================================================
     OPEN MODAL
  ========================================================= */
  
  openVillaButtons.forEach((button) => {
  
    button.addEventListener("click", () => {
  
      const villaId =
        button.dataset.villa;
  
  
      activeVilla =
        villasData[villaId];
  
  
      if (!activeVilla) {
        return;
      }
  
  
      modalImageIndex = 0;
  
  
      renderVillaModal(activeVilla);
  
  
      villaModal.classList.add("active");
  
  
      villaModal.setAttribute(
        "aria-hidden",
        "false"
      );
  
  
      document.body.style.overflow =
        "hidden";
  
    });
  
  });
  
  
  
  /* =========================================================
     RENDER MODAL
  ========================================================= */
  
  function renderVillaModal(villa) {
  
    const thumbnails =
      villa.images
        .map((image, index) => {
  
          return `
            <button
              class="premium-thumbnail ${
                index === 0 ? "active" : ""
              }"
              type="button"
              data-image-index="${index}"
              aria-label="عرض الصورة ${index + 1}"
            >
              <img
                src="${image}"
                alt="${villa.name} - صورة ${index + 1}"
              >
            </button>
          `;
  
        })
        .join("");
  
  
    const facts =
      villa.facts
        .map((fact) => {
  
          return `
            <div class="premium-fact">
  
              <span class="premium-fact-icon">
                ${fact.icon}
              </span>
  
              <div>
                <strong>
                  ${fact.value}
                </strong>
  
                <small>
                  ${fact.label}
                </small>
              </div>
  
            </div>
          `;
  
        })
        .join("");
  
  
    const features =
      villa.features
        .map((feature) => {
  
          return `
            <li>
              <span class="feature-check">
                ✓
              </span>
  
              ${feature}
            </li>
          `;
  
        })
        .join("");
  
  
    villaModalContent.innerHTML = `
  
      <div class="premium-modal-layout">
  
  
        <!-- ================= GALLERY ================= -->
  
        <div class="premium-modal-gallery">
  
  
          <div class="premium-main-image">
  
            <img
              id="modalMainImage"
              src="${villa.images[0]}"
              alt="${villa.name}"
            >
  
  
            <span class="premium-modal-badge">
              ${villa.category}
            </span>
  
  
            <div class="modal-image-counter">
  
              <span id="modalCurrentImage">
                1
              </span>
  
              /
  
              <span>
                ${villa.images.length}
              </span>
  
            </div>
  
  
            <button
              class="modal-gallery-arrow modal-gallery-prev"
              id="modalGalleryPrev"
              type="button"
              aria-label="الصورة السابقة"
            >
              ‹
            </button>
  
  
            <button
              class="modal-gallery-arrow modal-gallery-next"
              id="modalGalleryNext"
              type="button"
              aria-label="الصورة التالية"
            >
              ›
            </button>
  
          </div>
  
  
          <div class="premium-thumbnails">
  
            ${thumbnails}
  
          </div>
  
  
        </div>
  
  
  
        <!-- ================= INFO ================= -->
  
        <div class="premium-modal-info">
  
  
          <p class="premium-location">
            ${villa.location}
          </p>
  
  
          <h2>
            ${villa.name}
          </h2>
  
  
          <p class="premium-description">
            ${villa.description}
          </p>
  
  
  
          <!-- QUICK FACTS -->
  
          <div class="premium-facts">
  
            ${facts}
  
          </div>
  
  
  
          <!-- FEATURES -->
  
          <div class="premium-features-section">
  
            <h3>
              المرافق والتجهيزات
            </h3>
  
  
            <ul class="premium-feature-list">
  
              ${features}
  
            </ul>
  
          </div>
  
  
  
          <!-- BOOKING / INQUIRY -->
  
          <div class="premium-inquiry-box">
  
  
            <div class="premium-inquiry-heading">
  
              <span>
                استفسار سريع
              </span>
  
              <small>
                بدون التزام
              </small>
  
            </div>
  
  
            <div class="premium-inquiry-fields">
  
  
              <label>
  
                <span>
                  التاريخ
                </span>
  
                <input
                  type="date"
                  id="modalDate"
                >
  
              </label>
  
  
              <label>
  
                <span>
                  عدد الأشخاص
                </span>
  
                <select id="modalGuests">
  
                  <option value="">
                    اختر العدد
                  </option>
  
                  <option value="2">
                    شخصان
                  </option>
  
                  <option value="3">
                    3 أشخاص
                  </option>
  
                  <option value="4">
                    4 أشخاص
                  </option>
  
                  <option value="5">
                    5 أشخاص
                  </option>
  
                  <option value="6">
                    6 أشخاص
                  </option>
  
                  <option value="7">
                    7 أشخاص
                  </option>
  
                  <option value="8">
                    8 أشخاص
                  </option>
  
                  <option value="9">
                    9 أشخاص
                  </option>
  
                  <option value="10">
                    10 أشخاص
                  </option>
  
                  <option value="11">
                    11 شخصاً
                  </option>
  
                  <option value="12">
                    12 شخصاً
                  </option>
  
                  <option value="13">
                    13 شخصاً
                  </option>
  
                  <option value="14">
                    14 شخصاً
                  </option>
  
                  <option value="15">
                    15 شخصاً
                  </option>
  
                </select>
  
              </label>
  
  
            </div>
  
  
            <button
              class="premium-inquiry-button"
              id="modalInquiryButton"
              type="button"
            >
              استفسر عن هذه الفيلا
            </button>
  
  
            <p class="premium-inquiry-note">
              سيتم تحويلك إلى واتساب لإكمال الاستفسار.
            </p>
  
  
          </div>
  
  
        </div>
  
  
      </div>
  
    `;
  
  
    setupModalGallery(villa);
  
    setupModalInquiry(villa);
  
  }
  
  
  
  /* =========================================================
     MODAL GALLERY
  ========================================================= */
  
  function setupModalGallery(villa) {
  
    const mainImage =
      document.getElementById("modalMainImage");
  
    const currentCounter =
      document.getElementById(
        "modalCurrentImage"
      );
  
    const previousButton =
      document.getElementById(
        "modalGalleryPrev"
      );
  
    const nextButton =
      document.getElementById(
        "modalGalleryNext"
      );
  
    const thumbnails =
      document.querySelectorAll(
        ".premium-thumbnail"
      );
  
  
    function updateModalImage() {
  
      mainImage.classList.add(
        "changing"
      );
  
  
      setTimeout(() => {
  
        mainImage.src =
          villa.images[modalImageIndex];
  
  
        currentCounter.textContent =
          modalImageIndex + 1;
  
  
        thumbnails.forEach(
          (thumbnail, index) => {
  
            thumbnail.classList.toggle(
              "active",
              index === modalImageIndex
            );
  
          }
        );
  
  
        mainImage.classList.remove(
          "changing"
        );
  
      }, 120);
  
    }
  
  
    function nextImage() {
  
      modalImageIndex =
        (modalImageIndex + 1)
        % villa.images.length;
  
  
      updateModalImage();
  
    }
  
  
    function previousImage() {
  
      modalImageIndex =
        (
          modalImageIndex
          - 1
          + villa.images.length
        )
        % villa.images.length;
  
  
      updateModalImage();
  
    }
  
  
    nextButton?.addEventListener(
      "click",
      nextImage
    );
  
  
    previousButton?.addEventListener(
      "click",
      previousImage
    );
  
  
    thumbnails.forEach((thumbnail) => {
  
      thumbnail.addEventListener(
        "click",
        () => {
  
          modalImageIndex =
            Number(
              thumbnail.dataset.imageIndex
            );
  
  
          updateModalImage();
  
        }
      );
  
    });
  
  
  
    /* MOBILE SWIPE */
  
    let touchStart = 0;
  
    let touchEnd = 0;
  
  
    mainImage?.addEventListener(
      "touchstart",
      (event) => {
  
        touchStart =
          event.changedTouches[0].screenX;
  
      },
      {
        passive: true
      }
    );
  
  
    mainImage?.addEventListener(
      "touchend",
      (event) => {
  
        touchEnd =
          event.changedTouches[0].screenX;
  
  
        const difference =
          touchStart - touchEnd;
  
  
        if (
          Math.abs(difference) < 50
        ) {
          return;
        }
  
  
        if (difference > 0) {
  
          nextImage();
  
        } else {
  
          previousImage();
  
        }
  
      },
      {
        passive: true
      }
    );
  
  }
  
  
  
  /* =========================================================
     INQUIRY
  ========================================================= */
  
  function setupModalInquiry(villa) {
  
    const dateInput =
      document.getElementById("modalDate");
  
    const guestsInput =
      document.getElementById("modalGuests");
  
    const inquiryButton =
      document.getElementById(
        "modalInquiryButton"
      );
  
  
    /* Prevent choosing past dates */
  
    const today =
      new Date();
  
  
    const year =
      today.getFullYear();
  
    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");
  
    const day =
      String(
        today.getDate()
      ).padStart(2, "0");
  
  
    dateInput.min =
      `${year}-${month}-${day}`;
  
  
  
    inquiryButton?.addEventListener(
      "click",
      () => {
  
        const date =
          dateInput.value ||
          "غير محدد";
  
  
        const guests =
          guestsInput.value ||
          "غير محدد";
  
  
        const message =
  `مرحباً، أريد الاستفسار عن ${villa.name}.
  
  📅 التاريخ: ${date}
  👥 عدد الأشخاص: ${guests}
  
  أريد معرفة التوفر والسعر.`;
  
  
        openWhatsapp(message);
  
      }
    );
  
  }
  
  
  
  /* =========================================================
     CLOSE MODAL
  ========================================================= */
  
  function closeVillaModal() {
  
    villaModal.classList.remove(
      "active"
    );
  
  
    villaModal.setAttribute(
      "aria-hidden",
      "true"
    );
  
  
    document.body.style.overflow = "";
  
  }
  
  
  
  villaModalClose?.addEventListener(
    "click",
    closeVillaModal
  );
  
  
  villaModalOverlay?.addEventListener(
    "click",
    closeVillaModal
  );
  
  
  document.addEventListener(
    "keydown",
    (event) => {
  
      if (
        event.key === "Escape" &&
        villaModal.classList.contains("active")
      ) {
  
        closeVillaModal();
  
      }
  
    }
  );
  
  
  
  /* =========================================================
     WHATSAPP
  ========================================================= */
  
  const villasWhatsappNumber =
    "972532121036";
  
  
  function openWhatsapp(message) {
  
    const encodedMessage =
      encodeURIComponent(message);
  
  
    const url =
      `https://wa.me/${villasWhatsappNumber}?text=${encodedMessage}`;
  
  
    window.open(
      url,
      "_blank"
    );
  
  }
  
  
  
  /* =========================================================
     CARD REVEAL
  ========================================================= */
  
  if (
    "IntersectionObserver" in window
  ) {
  
    const catalogObserver =
      new IntersectionObserver(
        (entries) => {
  
          entries.forEach((entry) => {
  
            if (
              entry.isIntersecting
            ) {
  
              entry.target.classList.add(
                "catalog-visible"
              );
  
  
              catalogObserver.unobserve(
                entry.target
              );
  
            }
  
          });
  
        },
        {
          threshold: 0.1
        }
      );
  
  
    villaCards.forEach((card) => {
  
      catalogObserver.observe(card);
  
    });
  
  } else {
  
    villaCards.forEach((card) => {
  
      card.classList.add(
        "catalog-visible"
      );
  
    });
  
  }
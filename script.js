document.addEventListener("DOMContentLoaded", () => {
  // 1. القائمة الجانبية للجوال
  const menuButton = document.getElementById("menuButton");
  const mainNav = document.getElementById("mainNav");
  const navLinks = mainNav.querySelectorAll("a");

  const toggleMenu = () => {
    menuButton.classList.toggle("active");
    mainNav.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  };

  menuButton.addEventListener("click", toggleMenu);

  // إغلاق القائمة عند النقر على أي رابط داخلها
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav.classList.contains("open")) {
        toggleMenu();
      }
    });
  });

  // 2. الهيدر (تغيير الستايل عند التمرير)
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 3. تأثير الظهور الانسيابي للعناصر (Scroll Reveal)
  const revealElements = document.querySelectorAll(".reveal");

  const revealOptions = {
    threshold: 0.15, // يظهر العنصر عندما يظهر 15% منه على الشاشة
    rootMargin: "0px 0px -50px 0px",
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // إيقاف المراقبة بعد ظهوره لأول مرة لتقليل العبء
      }
    });
  }, revealOptions);

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // 4. معرض الصور (Lightbox)
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  const galleryItems = document.querySelectorAll(".gallery-item");

  let currentIndex = 0;
  // استخراج الروابط من خصائص الصور
  const images = Array.from(galleryItems).map((item) => item.dataset.full);

  const openLightbox = (index) => {
    if (!images[index]) return;
    currentIndex = index;
    lightboxImage.src = images[currentIndex];
    lightbox.classList.add("open");
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");
    // تفريغ الصورة قليلاً لتخفيف الذاكرة
    setTimeout(() => {
      lightboxImage.src = "";
    }, 300);
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImage.src = images[currentIndex];
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentIndex];
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  // إغلاق المعرض عند النقر في المساحة الفارغة
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // التنقل بالكيبورد
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showPrev(); // معكوسة لأن الاتجاه RTL
    if (e.key === "ArrowLeft") showNext();
  });

  // 5. روابط الواتساب الديناميكية
  // ضع رقم هاتفك هنا بدلاً من الأصفار، بالصيغة الدولية بدون (+) أو (00) مثلاً 970599000000
  const whatsappNumber = "970000000000";

  const whatsappLinks = document.querySelectorAll(".whatsapp-link");
  whatsappLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const message =
        link.dataset.message || "مرحباً، أريد الاستفسار عن الفلل المتاحة.";
      // تشفير النص ليدعمه رابط الواتساب بشكل صحيح
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(url, "_blank");
    });
  });
});

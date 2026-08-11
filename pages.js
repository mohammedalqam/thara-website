/* =========================================================
   THARA INTERNAL PAGES
========================================================= */


/* =========================================================
   REVEAL
========================================================= */

const pageRevealElements =
  document.querySelectorAll(
    ".page-reveal"
  );


if (
  "IntersectionObserver" in window
) {

  const pageRevealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            pageRevealObserver.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.1
      }
    );


  pageRevealElements.forEach(
    (element) => {

      pageRevealObserver.observe(
        element
      );

    }
  );

} else {

  pageRevealElements.forEach(
    (element) => {

      element.classList.add(
        "visible"
      );

    }
  );

}



/* =========================================================
   FAQ
========================================================= */

const faqItems =
  document.querySelectorAll(
    ".faq-item"
  );


faqItems.forEach((item) => {

  const question =
    item.querySelector(
      ".faq-question"
    );

  const answer =
    item.querySelector(
      ".faq-answer"
    );


  question?.addEventListener(
    "click",
    () => {

      const isOpen =
        item.classList.contains(
          "active"
        );


      faqItems.forEach(
        (otherItem) => {

          otherItem.classList.remove(
            "active"
          );


          const otherAnswer =
            otherItem.querySelector(
              ".faq-answer"
            );


          if (otherAnswer) {
            otherAnswer.style.maxHeight =
              null;
          }

        }
      );


      if (!isOpen) {

        item.classList.add(
          "active"
        );


        if (answer) {

          answer.style.maxHeight =
            answer.scrollHeight +
            "px";

        }

      }

    }
  );

});



/* =========================================================
   WHATSAPP
========================================================= */

const pagesWhatsappNumber =
  "972532121036";


function openPagesWhatsApp(message) {

  const url =
    `https://wa.me/${pagesWhatsappNumber}?text=${encodeURIComponent(message)}`;


  window.open(
    url,
    "_blank",
    "noopener"
  );

}



document
  .querySelectorAll(
    ".page-whatsapp"
  )
  .forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        event.preventDefault();


        const message =
          link.dataset.message ||
          "مرحباً، أريد الاستفسار عن فلل THARA.";


        openPagesWhatsApp(
          message
        );

      }
    );

  });



/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
  document.getElementById(
    "contactForm"
  );


contactForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const name =
      document
        .getElementById("contactName")
        ?.value
        .trim() || "غير محدد";


    const date =
      document
        .getElementById("contactDate")
        ?.value || "غير محدد";


    const guests =
      document
        .getElementById("contactGuests")
        ?.value || "غير محدد";


    const rooms =
      document
        .getElementById("contactRooms")
        ?.value || "غير محدد";


    const notes =
      document
        .getElementById("contactNotes")
        ?.value
        .trim() || "لا يوجد";


    const message =
`مرحباً THARA،

الاسم: ${name}
التاريخ: ${date}
عدد الأشخاص: ${guests}
عدد الغرف: ${rooms}

ملاحظات:
${notes}

أريد معرفة الخيارات المتاحة.`;


    openPagesWhatsApp(
      message
    );

  }
);



/* =========================================================
   FOOTER YEAR
========================================================= */

document
  .querySelectorAll(
    ".page-current-year"
  )
  .forEach((year) => {

    year.textContent =
      new Date().getFullYear();

  });
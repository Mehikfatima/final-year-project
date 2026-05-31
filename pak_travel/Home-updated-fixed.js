document.addEventListener("DOMContentLoaded", function () {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Mobile nav
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => navLinks.classList.toggle("active"));
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("active")));
  }

 

  // Hero swiper
  if (document.querySelector(".heroSwiper")) {
    new Swiper(".heroSwiper", {
      loop: true,
      speed: 1000,
      autoplay: { delay: 3200, disableOnInteraction: false },
      effect: "fade",
      fadeEffect: { crossFade: true }
    });
  }

  // Destination filter
  const filterBtns = $$(".dest-filter-btn");
  const destCards = $$(".dest-pro-card");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      destCards.forEach(card => {
        card.classList.toggle("hide", filter !== "all" && card.dataset.category !== filter);
      });
    });
  });
  // Destination modal
  const destModal = $("#destModal");
  const destModalClose = $("#destModalClose");
  const destModalImg = $("#destModalImg");
  const destModalTitle = $("#destModalTitle");
  $$(".dest-view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      destModalImg.src = btn.dataset.img;
      destModalTitle.textContent = btn.dataset.title;
      destModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });
  function closeDestModal() {
    if (destModal) destModal.classList.remove("active");
    document.body.style.overflow = "";
  }
  if (destModalClose) destModalClose.addEventListener("click", closeDestModal);
  if (destModal) destModal.addEventListener("click", e => { if (e.target === destModal) closeDestModal(); });

  // Custom tour modal submit btn

  const customModal = document.getElementById("customTripModal");
const openCustomBtn = document.getElementById("openCustomTripModal");
const topCustomizeBtn = document.getElementById("topCustomizeBtn");
const closeCustomBtn = document.getElementById("closeCustomTripModal");

function openCustomModal() {
  if (customModal) {
    customModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeCustomModal() {
  if (customModal) {
    customModal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

if (openCustomBtn) {
  openCustomBtn.addEventListener("click", openCustomModal);
}

if (topCustomizeBtn) {
  topCustomizeBtn.addEventListener("click", openCustomModal);
}

if (closeCustomBtn) {
  closeCustomBtn.addEventListener("click", closeCustomModal);
}

if (customModal) {
  customModal.addEventListener("click", function (e) {
    if (e.target === customModal) {
      closeCustomModal();
    }
  });
}

const customTourForm = document.getElementById("customTourForm");
const customTourMsg = document.getElementById("customTourMsg");

// if (customTourForm) {
//   customTourForm.addEventListener("submit", function (e) {
//     e.preventDefault();

//     const customRequest = {
//       id: Date.now(),
//       type: "Custom Tour Request",
//       name: document.getElementById("customName").value.trim(),
//       phone: document.getElementById("customPhone").value.trim(),
//       fromCity: document.getElementById("customFromCity").value.trim(),
//       destination: document.getElementById("customDestination").value.trim(),
//       budget: document.getElementById("customBudget").value,
//       travelers: document.getElementById("customTravelers").value,
//       duration: document.getElementById("customDays").value,
//       vehicle: document.getElementById("customVehicle").value,
//       hotel: document.getElementById("customHotel").value,
//       food: document.getElementById("customFood").value,
//       note: document.getElementById("customNote").value.trim(),
//       status: "Pending Admin Custom Plan"
//     };

//     const requests =
//       JSON.parse(localStorage.getItem("customTourRequests")) || [];

//     requests.push(customRequest);
//     localStorage.setItem("customTourRequests", JSON.stringify(requests));

//     customTourMsg.innerHTML = `
//       Your custom tour request has been submitted successfully.
//       Admin will prepare an affordable plan according to your budget:
//       <strong>Rs. ${Number(customRequest.budget).toLocaleString()}</strong>.
//     `;

//     customTourMsg.classList.remove("hidden");
//     customTourForm.reset();

//     setTimeout(function () {
//       closeCustomModal();
//       customTourMsg.classList.add("hidden");
//     }, 2500);
//   });
// }

if (customTourForm) {

  customTourForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const formData = new FormData();

    formData.append("name", document.getElementById("customName").value.trim());
    formData.append("phone", document.getElementById("customPhone").value.trim());
    formData.append("from_city", document.getElementById("customFromCity").value.trim());
    formData.append("destination", document.getElementById("customDestination").value.trim());
    formData.append("budget", document.getElementById("customBudget").value);
    formData.append("travelers", document.getElementById("customTravelers").value);
    formData.append("duration", document.getElementById("customDays").value);
    formData.append("vehicle", document.getElementById("customVehicle").value);
    formData.append("hotel", document.getElementById("customHotel").value);
    formData.append("food", document.getElementById("customFood").value);
    formData.append("note", document.getElementById("customNote").value.trim());

    fetch("backend/submit_custom_tour.php", {
      method: "POST",
      body: formData
    })

    .then(response => response.json())

    .then(data => {

      if (data.success) {

        customTourMsg.innerHTML = "Custom Tour Request Successfully Submitted ✅";

        customTourMsg.classList.remove("hidden");

        customTourForm.reset();

        setTimeout(() => {
          closeCustomModal();
          customTourMsg.classList.add("hidden");
        }, 2500);

      } else {

        customTourMsg.innerHTML = data.message;
        customTourMsg.classList.remove("hidden");

      }

    })

    .catch(error => {

      customTourMsg.innerHTML =
        "Backend Error: " + error;

      customTourMsg.classList.remove("hidden");

    });

  });

}


  // How to book
  const bookingSteps = $$(".booking-flow-step");
  const bookingData = [
    { step: "Step 01", icon: "fa-map-location-dot", title: "Choose Place", text: "Browse beautiful destinations like Hunza, Skardu, Swat, Naran Kaghan, Kalam, and Lahore.", btn: "Explore Destinations", link: "#destinations" },
    { step: "Step 02", icon: "fa-suitcase-rolling", title: "Select Tour", text: "Pick a travel package according to your days, budget, hotel preference, and travel style.", btn: "View Packages", link: "#packages" },
    { step: "Step 03", icon: "fa-headset", title: "Talk To Our Team", text: "Contact our travel experts to confirm dates, transport, hotel options, and final details.", btn: "Call Now", link: "tel:+923001234567" },
    { step: "Step 04", icon: "fa-wallet", title: "Confirm Payment", text: "Reserve your seat or private plan after final confirmation.", btn: "WhatsApp Team", link: "https://wa.me/923166564980" },
    { step: "Step 05", icon: "fa-plane-departure", title: "Enjoy The Trip", text: "Pack your bags and enjoy a smooth, comfortable, and memorable journey.", btn: "Start Planning", link: "#custom-trip-section" }
  ];
  bookingSteps.forEach(step => {
    step.addEventListener("click", () => {
      const data = bookingData[Number(step.dataset.step)];
      bookingSteps.forEach(s => s.classList.remove("active"));
      step.classList.add("active");
      $("#bookingPreviewIcon").innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
      $("#bookingPreviewStep").textContent = data.step;
      $("#bookingPreviewTitle").textContent = data.title;
      $("#bookingPreviewText").textContent = data.text;
      $("#bookingPreviewBtn").textContent = data.btn;
      $("#bookingPreviewBtn").href = data.link;
    });
  });

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("tourContainer");

  if (!container) return;

  const tours = JSON.parse(localStorage.getItem("adminTours")) || [];

  container.innerHTML = "";

  tours.forEach(tour => {
    const card = document.createElement("div");
    card.className = "tour-card";

    card.innerHTML = `
      <img src="${tour.image}" alt="${tour.name}" loading="lazy" decoding="async">
      <h3>${tour.name}</h3>
      <p>${tour.duration}</p>
      <p>Rs. ${tour.price}</p>
      <a href="#">View Details</a>
    `;

    container.appendChild(card);
  });
});

      const groupGalleries = [

{
  title: "Islamabad City Tour Gallery",

  images: [

    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop", // Faisal Mosque

    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop", // Monal / Margalla View

    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop", // Margalla Hills

    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop", // Daman-e-Koh

    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop", // Rawal Lake

    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop" // Pakistan Monument Area

  ]
},
{
  title: "Gwadar Beach & City Gallery",

  images: [

    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop", // Gwadar Beach

    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", // Coastal Highway

    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop", // Mountains near Gwadar

    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop", // Princess of Hope style landscape

    "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop", // Sunset Beach

    "https://images.unsplash.com/photo-1439853949127-fa647821eba0?q=80&w=1200&auto=format&fit=crop", // Sea View

    "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop", // Coastal Nature

    "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?q=80&w=1200&auto=format&fit=crop", // Desert & Coast

    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop", // Marine Drive Style

    "https://images.unsplash.com/photo-1455218873509-8097305ee378?q=80&w=1200&auto=format&fit=crop" // Ocean Sunset

  ]
},

{
  title: "Shogran Gallery",
  images: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1443890923422-7819ed4101c0?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200&auto=format&fit=crop"
  ]
},

{
  title: "Malam Jabba Gallery",
  images: [
    "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1439853949127-fa647821eba0?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop"
  ]
},

{
  title: "Naran Kaghan Gallery",
  images: [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1455218873509-8097305ee378?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200&auto=format&fit=crop"
  ]
}

];
  
  const groupModal = $("#groupGalleryModal");
  function closeGroupGallery() { groupModal.classList.remove("active"); document.body.style.overflow = ""; }
  $$(".group-gallery-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const gallery = groupGalleries[Number(btn.dataset.gallery)];
      $("#groupGalleryTitle").textContent = gallery.title;
      $("#groupGalleryImages").innerHTML = gallery.images.map(src => `<img src="${src}" alt="${gallery.title}" loading="lazy" decoding="async">`).join("");
      groupModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });
  if ($("#groupGalleryClose")) $("#groupGalleryClose").addEventListener("click", closeGroupGallery);
  if (groupModal) groupModal.addEventListener("click", e => { if (e.target === groupModal) closeGroupGallery(); });



  const fullImageModal = document.createElement("div");
fullImageModal.className = "full-image-modal";
fullImageModal.innerHTML = `
  <button class="full-image-close">
    <i class="fa-solid fa-xmark"></i>
  </button>
  <img src="" alt="Full Image">
`;
document.body.appendChild(fullImageModal);

const fullImage = fullImageModal.querySelector("img");
const fullImageClose = fullImageModal.querySelector(".full-image-close");

document.addEventListener("click", function (e) {
  if (e.target.matches("#groupGalleryImages img")) {
    fullImage.src = e.target.src;
    fullImageModal.classList.add("active");
  }
});

fullImageClose.addEventListener("click", function () {
  fullImageModal.classList.remove("active");
  fullImage.src = "";
});

fullImageModal.addEventListener("click", function (e) {
  if (e.target === fullImageModal) {
    fullImageModal.classList.remove("active");
    fullImage.src = "";
  }
});






  // Location switcher
  const mapLocations = {
    office: ["Allahabad, Rajanpur", "Main office location", "https://www.google.com/maps?q=Allahabad%20Rajanpur%20Pakistan&output=embed"],
    hunza: ["Hunza Valley", "Popular northern Pakistan tour stop", "https://www.google.com/maps?q=Hunza%20Valley%20Pakistan&output=embed"],
    skardu: ["Skardu", "Adventure and mountain tour destination", "https://www.google.com/maps?q=Skardu%20Pakistan&output=embed"],
    swat: ["Swat Valley", "Scenic valley and family tour stop", "https://www.google.com/maps?q=Swat%20Valley%20Pakistan&output=embed"],
    naran: ["Naran Kaghan", "Lake Saif-ul-Malook and mountain route", "https://www.google.com/maps?q=Naran%20Kaghan%20Pakistan&output=embed"],
    kalam: ["Kalam Valley", "Mahodand Lake and Ushu Forest route", "https://www.google.com/maps?q=Kalam%20Swat%20Pakistan&output=embed"],
    lahore: ["Lahore", "Historical and cultural city tour", "https://www.google.com/maps?q=Lahore%20Pakistan&output=embed"]
  };
  $$(".location-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      $$(".location-tag").forEach(t => t.classList.remove("active"));
      tag.classList.add("active");
      const data = mapLocations[tag.dataset.map];
      $("#travelMapFrame").src = data[2];
      $("#mapPlaceTitle").textContent = data[0];
      $("#mapPlaceText").textContent = data[1];
    });
  });

  // Reviews with backend/database
  const reviewList = $("#travelerReviewList");
  const reviewForm = $("#travelerReviewForm");
  const stars = $$("#travelerStars span");
  let selectedRating = 5;
  let reviews = [];

  // Home page agar pak_travel root me hai to ye path correct hai.
  // Agar home page kisi folder ke andar ho to isko "../backend/" kar dein.
  const REVIEW_BACKEND_PATH = "/pak_travel/backend/";

  function escapeHTML(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function updateStars(rating) {
    stars.forEach(star => star.classList.toggle("active", Number(star.dataset.value) <= rating));
  }

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString || new Date());
    const seconds = Math.floor((now - past) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 }
    ];

    for (let i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count >= 1) return count + " " + i.label + (count > 1 ? "s" : "") + " ago";
    }

    return "Just now";
  }

  function initTravelerReviewSwiper() {
    const reviewSwiperEl = document.querySelector(".travelerReviewSwiper");
    if (!reviewSwiperEl || !reviewList) return;

    const slideCount = reviewList.querySelectorAll(".swiper-slide").length;

    if (window.travelerSwiper && typeof window.travelerSwiper.destroy === "function") {
      window.travelerSwiper.destroy(true, true);
      window.travelerSwiper = null;
    }

    if (slideCount === 0) return;

    window.travelerSwiper = new Swiper(".travelerReviewSwiper", {
      loop: slideCount > 3,
      spaceBetween: 24,
      speed: 800,
      autoplay: {
        delay: 2800,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
      },
      observer: true,
      observeParents: true,
      pagination: false,
      breakpoints: {
        0: { slidesPerView: 1 },
        700: { slidesPerView: Math.min(2, slideCount) },
        1100: { slidesPerView: Math.min(3, slideCount) }
      }
    });

    window.travelerSwiper.autoplay.start();
    setupReviewDots();
  }

  function renderReviews() {
    if (!reviewList) return;

    reviewList.innerHTML = "";

    reviews.forEach(review => {
      const rating = Number(review.rating) || 5;
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      slide.innerHTML = `<article class="traveler-review-card">
        <div class="traveler-review-card-top">
          <div class="traveler-review-avatar">${escapeHTML((review.name || "U").charAt(0).toUpperCase())}</div>
          <div class="traveler-review-user">
            <h3>${escapeHTML(review.name)}</h3>
            <span>${timeAgo(review.created_at)}</span>
          </div>
        </div>
        <div class="traveler-review-tour">${escapeHTML(review.tour)}</div>
        <p class="traveler-review-text">${escapeHTML(review.review_text)}</p>
        <div class="traveler-review-stars">${"★".repeat(rating)}${"☆".repeat(5-rating)}</div>
      </article>`;

      reviewList.appendChild(slide);
    });

    initTravelerReviewSwiper();
  }

  function loadReviewsFromBackend() {
    console.log("Review load URL:", REVIEW_BACKEND_PATH + "get_reviews.php?ts=" + Date.now());
    fetch(REVIEW_BACKEND_PATH + "get_reviews.php?ts=" + Date.now())
      .then(async response => {
        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new Error("get_reviews.php JSON nahi de raha. Response: " + text);
        }

        if (!response.ok) throw new Error(data.message || "HTTP Error " + response.status);
        return data;
      })
      .then(data => {
        if (data.success) {
          reviews = data.reviews || [];
          renderReviews();
        } else {
          console.error("Review load error:", data.message);
        }
      })
      .catch(error => {
        console.error("Backend reviews load error:", error);
      });
  }

  stars.forEach(star => star.addEventListener("click", () => {
    selectedRating = Number(star.dataset.value);
    const ratingInput = $("#travelerRatingValue");
    if (ratingInput) ratingInput.value = selectedRating;
    updateStars(selectedRating);
  }));

  updateStars(5);

  // Swiper ab renderReviews() ke baad initialize hota hai,
  // kyun ke reviews backend se baad me load hotay hain.
  loadReviewsFromBackend();

  if (reviewForm) {
    reviewForm.addEventListener("submit", e => {
      e.preventDefault();

      const name = $("#travelerReviewName") ? $("#travelerReviewName").value.trim() : "";
      const tour = $("#travelerReviewTour") ? $("#travelerReviewTour").value : "";
      const reviewText = $("#travelerReviewText") ? $("#travelerReviewText").value.trim() : "";

      if (!name || !tour || !reviewText) {
        $("#travelerReviewStatus").textContent = "Please fill all review fields.";
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("tour", tour);
      formData.append("review_text", reviewText);
      formData.append("rating", selectedRating);

      $("#travelerReviewStatus").textContent = "Submitting review...";

      console.log("Review submit URL:", REVIEW_BACKEND_PATH + "submit_review.php");
      fetch(REVIEW_BACKEND_PATH + "submit_review.php", {
        method: "POST",
        body: formData
      })
        .then(async response => {
          const text = await response.text();
          let data;

          try {
            data = JSON.parse(text);
          } catch (error) {
            throw new Error("submit_review.php JSON nahi de raha. Response: " + text);
          }

          if (!response.ok) throw new Error(data.message || "HTTP Error " + response.status);
          return data;
        })
        .then(data => {
          if (data.success) {
            $("#travelerReviewStatus").textContent = "Thank you! Your review has been saved in database. DB ID: " + (data.id || "saved");
            reviewForm.reset();
            selectedRating = 5;
            updateStars(5);
            loadReviewsFromBackend();

            setTimeout(() => {
              $("#travelerReviewStatus").textContent = "";
            }, 3500);
          } else {
            $("#travelerReviewStatus").textContent = data.message;
          }
        })
        .catch(error => {
          $("#travelerReviewStatus").textContent = "Backend Error: " + error.message;
          console.error(error);
        });
    });
  } 
// only 4 dot show
  const customDots = document.querySelectorAll(".custom-pagination span");

  function updateCustomDots() {
    if (!window.travelerSwiper) return;

    let realIndex = window.travelerSwiper.realIndex || 0;
    let activeIndex = realIndex % 4;

    customDots.forEach(dot => dot.classList.remove("active"));
    if (customDots[activeIndex]) {
      customDots[activeIndex].classList.add("active");
    }
  }

  function setupReviewDots() {
    if (!window.travelerSwiper) return;

    window.travelerSwiper.off("slideChange", updateCustomDots);
    window.travelerSwiper.on("slideChange", updateCustomDots);
    updateCustomDots();

    customDots.forEach(dot => {
      if (dot.dataset.bound === "true") return;
      dot.dataset.bound = "true";
      dot.addEventListener("click", () => {
        const index = Number(dot.dataset.index);
        if (window.travelerSwiper && window.travelerSwiper.slideToLoop) {
          window.travelerSwiper.slideToLoop(index);
        } else if (window.travelerSwiper) {
          window.travelerSwiper.slideTo(index);
        }
      });
    });
  }

  // Back to top + reveal
  const backToTop = $("#backToTop");
  function handleScroll() {
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 500);
    $$(".reveal").forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add("active");
    });
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll();
  if (backToTop) backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Close modals with Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeDestModal();
      if (customModal && customModal.classList.contains("active")) closeCustomModal();
      if (groupModal && groupModal.classList.contains("active")) closeGroupGallery();
    }
  });
});

/* ========================= */
/* ADVANCED AI CHATBOT */
/* ========================= */

const chatToggleBtn =
document.getElementById("chatToggleBtn");

const closeChatBtn =
document.getElementById("closeChatBtn");

const travelChatbot =
document.getElementById("travelChatbot");

const chatBody =
document.getElementById("chatBody");

const chatInput =
document.getElementById("chatInput");

const sendBtn =
document.getElementById("sendBtn");

const clearChatBtn =
document.getElementById("clearChatBtn");

// Optional: Configure your OpenAI API key here for live AI answers.
// WARNING: DO NOT use a real secret key in public client-side code for production.
const OPENAI_API_KEY = ""; // add your key or use a backend proxy endpoint
const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

/* ========================= */
/* OPEN CLOSE */
/* ========================= */

if (chatToggleBtn && travelChatbot) chatToggleBtn.onclick = () => {

  travelChatbot.style.display = "flex";
};

if (closeChatBtn && travelChatbot) closeChatBtn.onclick = () => {

  travelChatbot.style.display = "none";
};

if (clearChatBtn) clearChatBtn.onclick = () => {
  chatBody.innerHTML = `<div class="bot-msg">
    Assalamualaikum 👋 <br><br>
    Main aapka Pak Travel Spark AI Assistant hun. <br><br>
    Main aapke sawalon ka jawab de sakta hun:<br><br>
    ✔ Destinations & Best Packages<br>
    ✔ Weather & Best Season<br>
    ✔ Safety Tips<br>
    ✔ Budget & Affordable Trips<br>
    ✔ Hotels & Accommodation<br>
    ✔ Routes & Distances<br>
    ✔ Custom Tours & Group Plans<br>
    ✔ Travel Advice for Pakistan<br><br>
    Try: "tell me destinations", "Hunza ka package", "Murree ka weather".
  </div>`;
  localStorage.removeItem("travelChats");
};

/* ========================= */
/* SAVE CHAT */
/* ========================= */

window.onload = () => {

  const savedChats =
  localStorage.getItem("travelChats");

  if(savedChats){

    chatBody.innerHTML = savedChats;
  }
};

function saveChats(){

  localStorage.setItem(
    "travelChats",
    chatBody.innerHTML
  );
}

/* ========================= */
/* ADD MESSAGE */
/* ========================= */

function addMessage(message, sender){

  const div =
  document.createElement("div");

  div.className =
  sender === "user"
  ? "user-msg"
  : "bot-msg";

  div.innerHTML = message;

  chatBody.appendChild(div);

  chatBody.scrollTop =
  chatBody.scrollHeight;

  saveChats();
}

/* ========================= */
/* SMART AI REPLY SYSTEM */
/* ========================= */

function getBotReply(question){

  const q = question.toLowerCase().trim();

  /* ========================= */
  /* HUNZA */
  /* ========================= */

  if(
    q.includes("hunza")
  ){

    return `
    🏔 <strong>Hunza Valley</strong>
    <br><br>

    📍 Gilgit Baltistan Pakistan
    <br><br>

    🚗 Distance from Islamabad:
    600km+
    <br><br>

    🕒 Travel Time:
    14-18 hours by road
    <br><br>

    💸 Average Budget:
    50k - 120k
    <br><br>

    ⭐ Famous Places:
    Attabad Lake,
    Passu Cones,
    Baltit Fort
    <br><br>

    ✅ Safe for families
    `;
  }

  /* ========================= */
  /* SKARDU */
  /* ========================= */

  else if(
    q.includes("skardu")
  ){

    return `
    🏔 <strong>Skardu</strong>
    <br><br>

    📍 Gilgit Baltistan
    <br><br>

    🛣 Route:
    Islamabad → Besham → Chilas → Skardu
    <br><br>

    🕒 Time:
    18-22 hours
    <br><br>

    ✈ Flights available
    <br><br>

    ⭐ Famous:
    Deosai,
    Shangrila,
    Upper Kachura Lake
    `;
  }

  /* ========================= */
  /* SWAT */
  /* ========================= */

  else if(
    q.includes("swat")
  ){

    return `
    🌲 <strong>Swat Valley</strong>
    <br><br>

    📍 KPK Pakistan
    <br><br>

    ⭐ Famous Areas:
    Kalam,
    Bahrain,
    Malam Jabba
    <br><br>

    💸 Budget Friendly
    <br><br>

    ✅ Family Friendly
    `;
  }

  /* ========================= */
  /* MURREE */
  /* ========================= */

  else if(
    q.includes("murree")
  ){

    return `
    ❄ <strong>Murree</strong>
    <br><br>

    📍 Punjab Pakistan
    <br><br>

    ⭐ Famous:
    Mall Road,
    Patriata,
    Kashmir Point
    <br><br>

    💸 Cheap Trip
    <br><br>

    ✅ Best in Winter
    `;
  }

  /* ========================= */
  /* WEATHER */
  /* ========================= */

  else if(
    q.includes("weather") ||
    q.includes("season")
  ){

    return `
    🌤 <strong>Best Travel Seasons</strong>
    <br><br>

    ☀ Summer:
    Hunza, Skardu, Swat
    <br><br>

    ❄ Winter:
    Murree, Malam Jabba
    <br><br>

    🌸 Spring:
    Hunza Blossom Season
    `;
  }

  /* ========================= */
  /* ROUTES */
  /* ========================= */

  else if(
    q.includes("route") ||
    q.includes("road")
  ){

    return `
    🛣 <strong>Popular Routes</strong>
    <br><br>

    Islamabad → Naran
    <br><br>

    Islamabad → Hunza via KKH
    <br><br>

    Lahore → Swat Motorway
    `;
  }

  /* ========================= */
  /* HOTELS */
  /* ========================= */

  else if(
    q.includes("hotel") ||
    q.includes("stay")
  ){

    return `
    🏨 <strong>Hotel Costs</strong>
    <br><br>

    Budget:
    3k-5k/night
    <br><br>

    Standard:
    8k-15k/night
    <br><br>

    Luxury:
    20k+
    `;
  }

  /* ========================= */
  /* SAFETY */
  /* ========================= */

  else if(
    q.includes("safe") ||
    q.includes("safety")
  ){

    return `
    ✅ <strong>Travel Safety Tips</strong>
    <br><br>

    ✔ Avoid night travel
    <br>
    ✔ Carry CNIC
    <br>
    ✔ Check weather
    <br>
    ✔ Use trusted hotels
    `;
  }

  /* ========================= */
  /* FAMILY */
  /* ========================= */

  else if(
    q.includes("family")
  ){

    return `
    👨‍👩‍👧 <strong>Family Tour Places</strong>
    <br><br>

    ✔ Swat
    <br>
    ✔ Murree
    <br>
    ✔ Hunza
    <br>
    ✔ Naran
    `;
  }

  /* ========================= */
  /* ADVENTURE */
  /* ========================= */

  else if(
    q.includes("adventure")
  ){

    return `
    🏔 <strong>Adventure Destinations</strong>
    <br><br>

    ✔ Fairy Meadows
    <br>
    ✔ Skardu
    <br>
    ✔ Deosai
    <br>
    ✔ Rakaposhi Base Camp
    `;
  }

  /* ========================= */
  /* AGENCIES */
  /* ========================= */

  else if(
    q.includes("agency") ||
    q.includes("travel company")
  ){

    return `
    🧳 <strong>Travel Agencies</strong>
    <br><br>

    ✔ Adventurer Treks
    <br>
    ✔ Nature Explorer
    <br>
    ✔ Find My Adventure
    <br>
    ✔ Pak Tours
    `;
  }

  /* ========================= */
  /* BUDGET */
  /* ========================= */

  const budgetMatch =
  q.match(/\d+/);

  const budget =
  budgetMatch
  ? parseInt(budgetMatch[0])
  : null;

  if(budget){

    if(budget <= 30000){

      return `
      💰 <strong>Low Budget Trips</strong>
      <br><br>

      ✔ Murree
      <br>
      ✔ Swat
      <br>
      ✔ Lahore
      `;
    }

    else if(budget <= 70000){

      return `
      🌄 <strong>Medium Budget Trips</strong>
      <br><br>

      ✔ Hunza
      <br>
      ✔ Kalam
      <br>
      ✔ Naran
      `;
    }

    else{

      return `
      ✨ <strong>Luxury Tours</strong>
      <br><br>

      ✔ Skardu
      <br>
      ✔ Fairy Meadows
      <br>
      ✔ Deosai
      `;
    }
  }

  /* ========================= */
  /* DEFAULT */
  /* ========================= */

  return `
  🤖 Main Pakistan travel assistant hun.
  <br><br>

  Aap pooch sakte hain:
  <br><br>

  ✔ Hunza kesa hai?
  <br>
  ✔ Skardu safe hai?
  <br>
  ✔ Murree ka budget?
  <br>
  ✔ Swat route?
  <br>
  ✔ Best family tours?
  <br>
  ✔ Hotels?
  <br>
  ✔ Weather?
  `;
}

/* ========================= */
/* ADVANCED OVERRIDE */
/* ========================= */
function getBotReply(question){

  const q = question.toLowerCase().trim();
  const normalized = q.replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  const has = word => normalized.includes(word);
  const matches = regex => regex.test(normalized);

  const tours = {
    hunza: {
      title: "Hunza Valley",
      route: "Islamabad → Abbottabad → Besham → Gilgit → Hunza",
      duration: "5-7 days",
      budget: "55k-110k per person",
      bestSeason: "April to October",
      highlights: "Attabad Lake, Karimabad, Passu Cones, Baltit Fort",
      idealFor: "nature, photography, families, couples",
      type: ["nature", "adventure", "family"],
      page: "hunza/hunza.html"
    },
    skardu: {
      title: "Skardu",
      route: "Islamabad → Besham → Chilas → Skardu",
      duration: "5-7 days",
      budget: "70k-140k per person",
      bestSeason: "May to September",
      highlights: "Deosai, Shangrila Resort, Upper Kachura Lake",
      idealFor: "adventure, camping, mountains",
      type: ["adventure", "nature"],
      page: "skardu-group-tour-footer-child-final-fixed/skardu.html"
    },
    swat: {
      title: "Swat Valley",
      route: "Islamabad → M1 → M2 → Swat Motorway",
      duration: "3-4 days",
      budget: "20k-45k per person",
      bestSeason: "April to October",
      highlights: "Kalam, Malam Jabba, Bahrain, Mingora",
      idealFor: "families, budget travel, hill stations",
      type: ["family", "nature"],
      page: "swat/swat.html"
    },
    fairy_meadows: {
      title: "Fairy Meadows",
      route: "Islamabad → Abbottabad → Besham → Fairy Meadows track",
      duration: "4-6 days",
      budget: "55k-100k per person",
      bestSeason: "June to September",
      highlights: "Fairy Meadows campsite, Nanga Parbat views, trekking",
      idealFor: "adventure seekers, photographers",
      type: ["adventure", "nature"],
      page: "fairy_meadows/fairy-meadows.html",
      aliases: ["fairy meadows", "fairy"]
    },
    murree: {
      title: "Murree",
      route: "Islamabad → Murree Expressway",
      duration: "2-3 days",
      budget: "10k-25k per person",
      bestSeason: "April to December",
      highlights: "Mall Road, Patriata, Kashmir Point",
      idealFor: "families, weekend trips, winter snow",
      type: ["family", "nature"],
      page: "murree/muree.html"
    },
    naran: {
      title: "Naran Kaghan",
      route: "Islamabad → Abbottabad → Balakot → Naran",
      duration: "3-4 days",
      budget: "30k-60k per person",
      bestSeason: "May to September",
      highlights: "Saif-ul-Malook, Babusar Top, Kunhar River",
      idealFor: "lake lovers, nature, couples",
      type: ["nature", "family"],
      page: "naran-kaghan/naran-kaghan.html"
    },
    neelum: {
      title: "Neelum Valley",
      route: "Muzaffarabad → Neelum Valley Road",
      duration: "3-5 days",
      budget: "30k-60k per person",
      bestSeason: "May to September",
      highlights: "Mahodand Lake, Ushu Forest, waterfalls",
      idealFor: "cool weather, rivers, nature",
      type: ["nature", "family"],
      page: "neelum/neelum.html"
    },
    lahore: {
      title: "Lahore",
      route: "Islamabad → Lahore Motorway",
      duration: "2-4 days",
      budget: "20k-45k per person",
      bestSeason: "September to March",
      highlights: "Badshahi Mosque, Lahore Fort, Food Streets",
      idealFor: "culture, food, heritage",
      type: ["city", "culture"],
      page: "lahore/lahore-updated.html"
    },
    multan: {
      title: "Multan",
      route: "Lahore → Multan Motorway",
      duration: "2-3 days",
      budget: "25k-50k per person",
      bestSeason: "October to March",
      highlights: "Shrines, bazaars, blue pottery",
      idealFor: "heritage, culture",
      type: ["culture", "heritage"],
      page: "multan/multan.html"
    },
    chitral: {
      title: "Chitral",
      route: "Islamabad → Naran → Dir → Chitral",
      duration: "4-6 days",
      budget: "40k-80k per person",
      bestSeason: "May to September",
      highlights: "Kalash Valleys, Chitral Fort, scenic roads",
      idealFor: "culture, nature, mountains",
      type: ["nature", "culture"],
      page: "chitral/chitral.html"
    },
    gwadar: {
      title: "Gwadar",
      route: "Karachi → Gwadar by road or flight",
      duration: "3-5 days",
      budget: "30k-60k per person",
      bestSeason: "October to April",
      highlights: "Beaches, Gwadar Port, Kund Malir",
      idealFor: "sea lovers, budget trips",
      type: ["nature", "beach"],
      page: "gwadar/gwadar.html"
    },
    islamabad: {
      title: "Islamabad",
      route: "City travel from Islamabad airport",
      duration: "1-2 days",
      budget: "15k-30k per person",
      bestSeason: "October to April",
      highlights: "Faisal Mosque, Daman-e-Koh, Lok Virsa",
      idealFor: "city tours, families",
      type: ["city", "culture"],
      page: "islamabad/islamabad.html"
    },
    shogran: {
      title: "Shogran",
      route: "Islamabad → Balakot → Shogran",
      duration: "2-3 days",
      budget: "20k-40k per person",
      bestSeason: "May to September",
      highlights: "Siri Paye Meadows, pine forests, hill views",
      idealFor: "couples, families, nature lovers",
      type: ["nature", "family"],
      page: "shogran/shogran-updated.html"
    },
    university_trips: {
      title: "University Student Trips",
      route: "Varies by package — city pickups and group routes",
      duration: "1-5 days (package dependent)",
      budget: "8k-35k per student (approx)",
      bestSeason: "All year — depends on chosen package and destination",
      highlights: "Group discounts, educational visits, tailored itineraries, coach transport, hostel/budget stays",
      idealFor: "students, colleges, educational groups",
      type: ["educational", "group", "budget"],
      page: "university-trips-files/university-trips.html",
      aliases: ["university","student","students","college","student trip","student tours"]
    }
  };

  const knownPlaces = Object.keys(tours).reduce((acc, key) => {
    acc.push(key);
    const aliases = tours[key].aliases || [];
    return acc.concat(aliases);
  }, []);

  const placeKey = knownPlaces.find(place => normalized.includes(place));
  const place = placeKey ? Object.keys(tours).find(key => key === placeKey || (tours[key].aliases || []).includes(placeKey)) : null;
  const tour = place ? tours[place] : null;

  const intents = {
    weather: /weather|temperature|climate|season|rain|snow|cold|hot/,
    safety: /safe|safety|security|danger|risk|hazard/,
    hotel: /hotel|stay|accommodation|guesthouse|resort|lodge/,
    route: /route|road|distance|drive|highway|motorway|hours|time/,
    package: /package|tour package|itinerary|custom tour|group tour|booking|book|reserve/,
    budget: /budget|cheap|affordable|cost|price|rate|k per|k-/,
    nature: /nature|nature lovers|scenery|landscape|beautiful|view|green|forest/,
    adventure: /adventure|trek|camp|hike|mountain|lake|rafting|jeep/,
    family: /family|children|kids|couple|friends|group/,
    university: /university|student|students|college|student trip|student tours|educational/,
    contact: /contact|phone|email|reach|inquiry|inquiry/,
    food: /food|cuisine|eat|dining|restaurant|street food/,
    destinations: /destination|destinations|places|best tour|best trips|tell me destinations|kahan jao|kin destinations|saray destinations/
  };

  const intent = Object.keys(intents).find(key => intents[key].test(normalized));

  function formatTourList(list){
    return list.map(t => `✔ <strong>${t.title}</strong> (${t.budget})`).join("<br>");
  }

  // --- Helpers: Fare, Planner, Packing, Split & WhatsApp integration ---
  const routePrices = {
    lahore: { hunza: 18000, skardu: 24000, swat: 14000, kalam: 16000, naran: 15000, murree: 9000, gwadar: 30000 },
    islamabad: { hunza: 12000, skardu: 18000, swat: 9000, kalam: 11000, naran: 10000, murree: 5000, lahore: 7000, gwadar: 28000 },
    karachi: { hunza: 36000, skardu: 42000, swat: 33000, kalam: 35000, naran: 34000, murree: 30000, lahore: 18000, gwadar: 15000 },
    multan: { hunza: 25000, skardu: 30000, swat: 22000, kalam: 24000, naran: 23000, murree: 16000, lahore: 8000, gwadar: 26000 },
    peshawar: { hunza: 18000, skardu: 23000, swat: 8000, kalam: 10000, naran: 15000, murree: 12000, lahore: 16000, gwadar: 35000 }
  };

  function calculateFareFromQuery(text){
    // parse patterns like: from lahore to hunza for 4 persons 5 days private budget
    const ft = text.match(/from\s+([a-z-]+)\s+(?:to|→)\s+([a-z-]+)/) || text.match(/([a-z-]+)\s+to\s+([a-z-]+)/);
    if(!ft) return null;
    let from = ft[1];
    let to = ft[2];

    // normalize common names
    from = from.replace(/kaghan/, 'naran');
    to = to.replace(/kaghan/, 'naran');

    const personsM = text.match(/(\d+)\s*(?:people|persons|pax|passengers)/) || text.match(/for\s+(\d+)\s*persons?/) || text.match(/for\s*(\d+)/);
    const persons = personsM ? Number(personsM[1]) : 1;
    const daysM = text.match(/(\d+)\s*(?:days|day)/);
    const days = daysM ? Number(daysM[1]) : 1;
    const transport = /private/.test(text) ? 'private' : /luxury/.test(text) ? 'luxury' : /coach|bus|hiace|coaster/.test(text) ? 'coach' : 'shared';
    const hotel = /budget/.test(text) ? 'budget' : /standard/.test(text) ? 'standard' : /luxury/.test(text) ? 'luxury' : 'standard';

    if(!routePrices[from] || !routePrices[from][to]) return null;

    const base = routePrices[from][to];
    const transportExtra = transport === 'private' ? 15000 : transport === 'luxury' ? 28000 : 7000;
    const hotelPerDay = hotel === 'budget' ? 3500 : hotel === 'standard' ? 6500 : 13000;
    const foodPerPerson = 1500;

    const transportCost = base + transportExtra;
    const hotelCost = hotelPerDay * days;
    const foodCost = foodPerPerson * persons * days;
    const emergencyBuffer = Math.round((transportCost + hotelCost + foodCost) * 0.08);
    const total = transportCost + hotelCost + foodCost + emergencyBuffer;
    const perPerson = Math.round(total / Math.max(1, persons));

    return `
      🧾 <strong>Estimated Trip Cost</strong>
      <br><br>
      Route: ${from.toUpperCase()} → ${to.toUpperCase()}
      <br>
      Persons: ${persons} | Days: ${days}
      <br>
      Transport: ${transport} | Hotel: ${hotel}
      <br><br>
      Transport Cost: Rs. ${transportCost.toLocaleString()}
      <br>
      Hotel Cost (total): Rs. ${hotelCost.toLocaleString()}
      <br>
      Food Cost: Rs. ${foodCost.toLocaleString()}
      <br>
      Emergency Buffer (8%): Rs. ${emergencyBuffer.toLocaleString()}
      <br><br>
      <strong>Total Estimated Payment: Rs. ${total.toLocaleString()}</strong>
      <br>
      Per Person: Rs. ${perPerson.toLocaleString()}
    `;
  }

  function suggestTripFromQuery(text){
    const b = text.match(/(budget|budget:\s*)\s*(\d+)/) || text.match(/(\d+)\s*(?:budget|rs|rupees)/);
    const budget = b ? Number(b[b.length - 1]) : null;
    const daysM = text.match(/(\d+)\s*(?:days|day)/);
    const days = daysM ? Number(daysM[1]) : null;
    if(!budget) return null;
    let suggestion = '';
    if(budget <= 30000) suggestion = 'Murree, Swat, or Lahore short trip.';
    else if(budget <= 60000) suggestion = 'Naran Kaghan or Kalam.';
    else if(budget <= 100000) suggestion = 'Hunza or Skardu.';
    else suggestion = 'Luxury options: Hunza, Skardu, Fairy Meadows.';
    return `💡 <strong>Trip Suggestion</strong><br><br>Budget: Rs. ${budget.toLocaleString()}${days?'<br>Days: '+days:''}<br><br>Suggestion: ${suggestion}`;
  }

  function packingListFromQuery(text){
    const destM = text.match(/(hunza|skardu|swat|murree|naran|neelum|fairy|lahore|gwadar|chitral|shogran)/);
    const seasonM = text.match(/(winter|summer|rainy|spring)/);
    const dest = destM ? destM[1] : null;
    const season = seasonM ? seasonM[1] : 'general';
    if(!dest && !seasonM) return null;
    const list = ['CNIC', 'Cash', 'Mobile Charger', 'Power Bank', 'Medicines'];
    if(season === 'winter'){ list.push('Warm Jacket','Gloves','Wool Cap','Thermal Wear'); }
    if(season === 'summer'){ list.push('Sunglasses','Sunblock','Light Clothes','Water Bottle'); }
    if(season === 'rainy'){ list.push('Umbrella','Raincoat','Waterproof Shoes'); }
    if(dest === 'skardu' || dest === 'hunza' || dest === 'fairy') list.push('Hiking Shoes','Extra Socks','Warm Clothes');
    return `🎒 <strong>Packing List for ${dest?dest.toUpperCase():'your trip'} (${season})</strong><br><br>${list.map(i=> '✅ '+i).join('<br>')}`;
  }

  function splitBudgetFromQuery(text){
    const m = text.match(/(?:split|each|per person).*?(\d+[\,\d]*)/) || text.match(/(\d+[\,\d]*)\s*for\s*(\d+)/);
    // Look for patterns: "split 12000 among 4" or "12000 for 4"
    const totalM = text.match(/(\d[\d,]*)\s*(?:rs|rupees|rs\.|rs)?/);
    const peopleM = text.match(/(\d+)\s*(?:people|persons|friends|pax)/) || text.match(/for\s*(\d+)/);
    if(!totalM || !peopleM) return null;
    const total = Number(totalM[1].replace(/,/g, ''));
    const people = Number(peopleM[1]);
    if(!total || !people) return null;
    const per = Math.round(total / people);
    return `💸 <strong>Budget Split</strong><br><br>Total: Rs. ${total.toLocaleString()}<br>People: ${people}<br><br>Each person pays: Rs. ${per.toLocaleString()}`;
  }

  function whatsappTemplateReply(text){
    // If user asks to send a booking or whatsapp, prepare a template link
    const nameM = text.match(/name\s*[:\-]?\s*([a-z ]+)/i);
    const tripM = text.match(/trip\s*[:\-]?\s*([a-z ]+)/i);
    const name = nameM ? nameM[1].trim() : 'Guest';
    const trip = tripM ? tripM[1].trim() : 'Tour Inquiry';
    const msg = encodeURIComponent(`Booking Request%0AName: ${name}%0ATrip: ${trip}%0AMessage: Please share details and price.`);
    return `📲 <strong>WhatsApp Booking</strong><br><br>Click to message our team: <a href="https://wa.me/923166564980?text=${msg}" target="_blank">Open WhatsApp</a>`;
  }

  function tourPackageAnswer(tourData){
    return `
      🎒 <strong>${tourData.title} Package</strong>
      <br><br>
      📍 Region: ${tourData.title}
      <br>
      🚗 Route: ${tourData.route}
      <br>
      🕒 Duration: ${tourData.duration}
      <br>
      💸 Budget: ${tourData.budget}
      <br>
      🌼 Best Season: ${tourData.bestSeason}
      <br>
      ⭐ Highlights: ${tourData.highlights}
      <br>
      ✅ Ideal for: ${tourData.idealFor}
      <br><br>
      📌 For booking, use the Contact page or call +92 316 656 4980.
    `;
  }

  function tourSafetyAnswer(tourData){
    return `
      ✅ <strong>${tourData.title} Safety</strong>
      <br><br>
      - Generally safe for tourists with normal travel precautions.
      <br>
      - Travel during daylight, especially on mountain roads.
      <br>
      - Book trusted hotels and local guides in remote areas.
      <br>
      - Carry CNIC and local emergency contact numbers.
    `;
  }

  function tourRouteAnswer(tourData){
    return `
      🛣 <strong>${tourData.title} Route</strong>
      <br><br>
      - ${tourData.route}
      <br>
      - Estimated time: ${tourData.duration.replace(/days?/, "").trim()}.
      <br>
      - Best travel season: ${tourData.bestSeason}.
    `;
  }

  function tourNatureAnswer(tourData){
    return `
      🌿 <strong>${tourData.title} for Nature Lovers</strong>
      <br><br>
      - ${tourData.highlights}
      <br>
      - Best season: ${tourData.bestSeason}.
      <br>
      - Ideal for: ${tourData.idealFor}.
    `;
  }

  function tourHotelAnswer(tourData){
    return `
      🏨 <strong>${tourData.title} Stays</strong>
      <br><br>
      - Budget hotels and guesthouses available near major sites.
      <br>
      - Standard stays: 8k-15k per night in most locations.
      <br>
      - Book in advance for peak season in ${tourData.bestSeason}.
    `;
  }

  function tourBudgetAnswer(tourData){
    return `
      💸 <strong>${tourData.title} Budget</strong>
      <br><br>
      - Expected tour cost: ${tourData.budget}.
      <br>
      - Includes transport, hotel and sightseeing suggestions.
      <br>
      - Ask for custom package if you want a lower budget.
    `;
  }

  function genericCategoryAnswer(){
    if (matches(/nature lovers/)) {
      const list = [tours.hunza, tours.skardu, tours.fairy_meadows, tours.neelum, tours.chitral, tours.shogran];
      return `
        🌿 <strong>Best Tours for Nature Lovers</strong>
        <br><br>
        ${formatTourList(list)}
      `;
    }
    if (matches(/budget/)) {
      const list = [tours.murree, tours.swat, tours.lahore, tours.multan, tours.islamabad];
      return `
        💰 <strong>Best Budget Tours</strong>
        <br><br>
        ${formatTourList(list)}
      `;
    }
    if (matches(/adventure/)) {
      const list = [tours.skardu, tours.fairy_meadows, tours.hunza, tours.chitral];
      return `
        🧗 <strong>Best Adventure Tours</strong>
        <br><br>
        ${formatTourList(list)}
      `;
    }
    if (matches(/family|couple|friends|group/)) {
      const list = [tours.swat, tours.murree, tours.hunza, tours.lahore];
      return `
        👨‍👩‍👧 <strong>Best Family / Couple Tours</strong>
        <br><br>
        ${formatTourList(list)}
      `;
    }
    return null;
  }

  if (tour && intent === "weather") {
    return `
      🌤 <strong>${tour.title} Weather</strong>
      <br><br>
      - Best season: ${tour.bestSeason}.
      <br>
      - Carry warm clothes for nights in mountain areas.
      <br>
      - Check the live weather forecast before trip.
      <br><br>
      📌 For exact weather, main live forecast de sakta hun agar aap destination ka naam check karen.
    `;
  }

  if (tour && intent === "package") return tourPackageAnswer(tour);
  if (tour && intent === "route") return tourRouteAnswer(tour);
  if (tour && intent === "budget") return tourBudgetAnswer(tour);
  if (tour && intent === "safety") return tourSafetyAnswer(tour);
  if (tour && intent === "hotel") return tourHotelAnswer(tour);
  if (tour && intent === "nature") return tourNatureAnswer(tour);
  if (tour && intent === "family") return `
      👨‍👩‍👧 <strong>${tour.title} for Families</strong>
      <br><br>
      - Ideal for: ${tour.idealFor}.
      <br>
      - Best season: ${tour.bestSeason}.
      <br>
      - Highlights: ${tour.highlights}.
    `;
  if (tour && intent === "adventure") return `
      🧗 <strong>${tour.title} Adventure</strong>
      <br><br>
      - Perfect for: ${tour.idealFor}.
      <br>
      - Highlights: ${tour.highlights}.
      <br>
      - Best season: ${tour.bestSeason}.
    `;
  if (tour && intent === "contact") return `
      📞 <strong>Contact for ${tour.title}</strong>
      <br><br>
      - Call: +92 316 656 4980
      <br>
      - Email: mehikfatima3@gmail.com
      <br>
      - Send your request through the Contact page.
    `;
  if (tour && intent === "food") return `
      🍲 <strong>${tour.title} & Local Food</strong>
      <br><br>
      - Local food is best in the nearby towns and city stops.
      <br>
      - Try regional meals and roadside cafés cautiously.
      <br>
      - Ask for trusted hotels with good dining.
    `;

  const generic = genericCategoryAnswer();
  if (generic) return generic;

  // Quick utility handlers: fare estimate, trip suggestion, packing list, budget split, WhatsApp template
  try {
    const fareResp = calculateFareFromQuery(normalized);
    if (fareResp) return fareResp;
    const suggestResp = suggestTripFromQuery(normalized);
    if (suggestResp) return suggestResp;
    const packingResp = packingListFromQuery(normalized);
    if (packingResp) return packingResp;
    const splitResp = splitBudgetFromQuery(normalized);
    if (splitResp) return splitResp;
    if (/whatsapp|wa\.me|whatsap|send whatsapp|send booking/.test(normalized)) return whatsappTemplateReply(normalized);
  } catch (e) {
    // ignore helper errors and continue
  }

  // If a specific tour was detected, answer tour-focused intents first
  if (tour) {
    if (intent === "weather") {
      return `
        🌤 <strong>${tour.title} Weather</strong>
        <br><br>
        - Best season: ${tour.bestSeason}.
        <br>
        - Carry warm clothes for nights in mountain areas.
        <br>
        - Check the live weather forecast before trip.
      `;
    }
    if (intent === "package") return tourPackageAnswer(tour);
    if (intent === "route") return tourRouteAnswer(tour);
    if (intent === "budget") return tourBudgetAnswer(tour);
    if (intent === "safety") return tourSafetyAnswer(tour);
    if (intent === "hotel") return tourHotelAnswer(tour);
    if (intent === "nature") return tourNatureAnswer(tour);
    if (intent === "family") return `
        👨‍👩‍👧 <strong>${tour.title} for Families</strong>
        <br><br>
        - Ideal for: ${tour.idealFor}.
        <br>
        - Best season: ${tour.bestSeason}.
        <br>
        - Highlights: ${tour.highlights}.
      `;
    if (intent === "university") return `
        🎓 <strong>${tour.title} — Student & University Trips</strong>
        <br><br>
        - Suitable for: ${tour.idealFor}.
        <br>
        - Typical duration: ${tour.duration}.
        <br>
        - Budget (approx): ${tour.budget} per student.
        <br>
        - For group booking, minimum 10 students; larger groups receive discounts.
        <br><br>
        📌 Open the student trips page for calculators and booking: ${tour.page}
      `;
    if (intent === "adventure") return `
        🧗 <strong>${tour.title} Adventure</strong>
        <br><br>
        - Perfect for: ${tour.idealFor}.
        <br>
        - Highlights: ${tour.highlights}.
        <br>
        - Best season: ${tour.bestSeason}.
      `;
    if (intent === "contact") return `
        📞 <strong>Contact for ${tour.title}</strong>
        <br><br>
        - Call: +92 316 656 4980
        <br>
        - Email: mehikfatima3@gmail.com
        <br>
        - Send your request through the Contact page.
      `;
    if (intent === "food") return `
        🍲 <strong>${tour.title} & Local Food</strong>
        <br><br>
        - Local food is best in the nearby towns and city stops.
        <br>
        - Try regional meals and roadside cafés cautiously.
        <br>
        - Ask for trusted hotels with good dining.
      `;

    // default tour answer
    return tourPackageAnswer(tour);
  }

  // Global intents (no specific tour detected)
  if (intent === "weather") {
    return `
      🌤 <strong>Weather Advice</strong>
      <br><br>
      - Northern areas: Hunza, Skardu, Fairy Meadows are best in summer.
      <br>
      - Murree and Swat are nice in spring and autumn.
      <br>
      - Beach tours like Gwadar are best in winter.
    `;
  }

  if (intent === "safety") {
    return `
      ✅ <strong>Travel Safety Guide</strong>
      <br><br>
      - Travel in daylight, use trusted transport.
      <br>
      - Carry ID, emergency phone, and local contacts.
      <br>
      - Book hotels in advance in peak season.
    `;
  }

  if (intent === "university") {
    return `
      🎓 <strong>University & Student Trips</strong>
      <br><br>
      - We offer student-focused packages: Northern Adventure, Cultural Heritage, Industrial/Educational visits, Desert Camp, and Swat student tours.
      - Group discounts available for 20+ students, larger discounts for 30/50/80+.
      - Vehicle options: Coaster, Hiace, Luxury Bus. Minimum 10 students per booking.
      - Visit the Student Trips page for calculators and booking: university-trips-files/university-trips.html
    `;
  }

  if (intent === "package" || intent === "destinations") {
    return `
      🎒 <strong>Popular Pakistan Destinations</strong>
      <br><br>
      - <strong>Hunza</strong> (mountain valley, nature, photography)
      <br>
      - <strong>Skardu</strong> (adventure, lakes, camping)
      <br>
      - <strong>Fairy Meadows</strong> (trekking, Nanga Parbat views)
      <br>
      - <strong>Swat</strong> (family valley tours, hill stations)
      <br>
      - <strong>Murree</strong> (weekend getaway, pine forests)
      <br>
      - <strong>Naran Kaghan</strong> (lakes, rivers, scenic roads)
      <br>
      - <strong>Neelum Valley</strong> (waterfalls, forests, cool weather)
      <br>
      - <strong>Lahore</strong> (culture, food, heritage)
      <br>
      - <strong>Multan</strong> (shrines, history, bazaars)
      <br>
      - <strong>Chitral</strong> (Kalash culture, mountains)
      <br>
      - <strong>Gwadar</strong> (coast, beaches, budget sea tours)
      <br>
      - <strong>Islamabad</strong> (city tour, monuments)
      <br>
      - <strong>Shogran</strong> (meadows, pine hills)
      <br><br>
      Type a destination name for exact details, for example: "Hunza package" or "Murree weather".
    `;
  }

  return `
    🤖 <strong>Pak Travel Spark Assistant</strong>
    <br><br>
    Aap apna sawal is tarah pooch sakte hain:
    <br>
    - "Hunza ka tour package batao"
    <br>
    - "Swat ka budget kya hai?"
    <br>
    - "Nature lovers ke liye best tour"
    <br>
    - "Murree ka weather"
    <br>
    - "Book Gwadar tour"
    <br><br>
    Main aapko abhi bhi exact destination ke liye pakka jawab de sakta hun.
  `;
}

/* ========================= */
/* SEND MESSAGE */
/* ========================= */

async function getWeatherForLocation(location){
  const coords = {
    hunza: { lat: 36.3186, lon: 74.6111 },
    skardu: { lat: 35.2977, lon: 75.6378 },
    swat: { lat: 35.2225, lon: 72.4258 },
    murree: { lat: 33.9041, lon: 73.3949 },
    naran: { lat: 34.9062, lon: 73.6486 },
    neelum: { lat: 34.4630, lon: 73.7784 },
    lahore: { lat: 31.5204, lon: 74.3587 },
    multan: { lat: 30.1575, lon: 71.5249 },
    fairy: { lat: 35.3240, lon: 74.9384 },
    chitral: { lat: 35.8510, lon: 71.7840 },
    gwadar: { lat: 25.1204, lon: 62.3254 },
    islamabad: { lat: 33.6844, lon: 73.0479 },
    shogran: { lat: 34.8324, lon: 73.4771 }
  };

  const place = location.toLowerCase();
  const coord = coords[place];

  // If we don't have a hardcoded coord, try Open-Meteo geocoding (supports many cities like Mumbai)
  let finalCoord = coord;
  if (!finalCoord) {
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en`;
      const geoResp = await fetch(geoUrl);
      if (geoResp.ok) {
        const geoData = await geoResp.json();
        if (geoData.results && geoData.results.length > 0) {
          const r = geoData.results[0];
          finalCoord = { lat: r.latitude, lon: r.longitude };
        }
      }
    } catch (err) {
      // ignore geocoding errors and fall through to null
    }
  }

  if (!finalCoord) return null;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia/Karachi`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.current_weather) return null;

    const current = data.current_weather;
    const todayMax = data.daily.temperature_2m_max?.[0];
    const todayMin = data.daily.temperature_2m_min?.[0];
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail"
    };
    const conditionText = weatherCodes[current.weathercode] || "Unknown weather";

    return `
      🌤 <strong>Current Weather in ${location.charAt(0).toUpperCase() + location.slice(1)}</strong>
      <br><br>
      🌡 Temperature: ${current.temperature}°C
      <br>
      💨 Wind Speed: ${current.windspeed} km/h
      <br>
      ☁ Condition: ${conditionText}
      <br>
      🌙 Today: ${todayMin ?? "N/A"}°C - ${todayMax ?? "N/A"}°C
      <br><br>
      Tip: For exact local weather, check forecast updates before departure.
    `;
  } catch (error) {
    return null;
  }
}

async function fetchAIReply(question) {
  try {
    const response = await fetch(OPENAI_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful travel assistant for Pakistan tour packages." },
          { role: "user", content: question }
        ],
        max_tokens: 350,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content;
    return aiText ? aiText.trim() : null;
  } catch (error) {
    return null;
  }
}

async function sendTextMessage(question){

  question = (question || "").toString().trim();
  if(!question) return;

  addMessage(question, "user");

  addMessage(
    "Typing...",
    "bot"
  );

  setTimeout(async () => {

    const typing = document.querySelectorAll(".bot-msg");
    typing[typing.length - 1].remove();

    let reply = null;

    if (OPENAI_API_KEY) {
      reply = await fetchAIReply(question);
    }

    if (!reply) {
      reply = getBotReply(question);

      const weatherKeywords = /weather|temperature|climate|season|rain|snow/;
      const placeKeywords = /(hunza|skardu|swat|murree|naran|neelum|lahore|multan|fairy|shogran|chitral|gwadar|islamabad)/;

      if (weatherKeywords.test(question.toLowerCase()) && placeKeywords.test(question.toLowerCase())) {
        const location = question.toLowerCase().match(placeKeywords)[0];
        const weatherReply = await getWeatherForLocation(location);
        if (weatherReply) reply = weatherReply;
      }
    }

    addMessage(reply, "bot");

  }, 800);
}

async function sendMessage(){
  const question = chatInput.value.trim();
  if(!question) return;
  await sendTextMessage(question);
  chatInput.value = "";
}

if (sendBtn) sendBtn.onclick =
sendMessage;

if (chatInput) chatInput.addEventListener(
"keydown",
function(e){

  if(e.key === "Enter"){

    sendMessage();
  }
});

/* ========================= */
/* VOICE SEARCH */
/* ========================= */
// Voice feature removed — chat messages only.
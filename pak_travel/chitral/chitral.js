document.addEventListener("DOMContentLoaded", function () {
  const startBookingBtn = document.getElementById("startBookingBtn");
  const authPanel = document.getElementById("authPanel");
  const previousRecordPanel = document.getElementById("previousRecordPanel");
  const bookingFormPanel = document.getElementById("bookingFormPanel");

  const authForm = document.getElementById("authForm");
  const authTabs = document.querySelectorAll(".auth-tabs button");
  const authName = document.getElementById("authName");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const closeAuthPanel = document.getElementById("closeAuthPanel");

  const previousBookingBox = document.getElementById("previousBookingBox");
  const newBookingBtn = document.getElementById("newBookingBtn");

  const bookingForm = document.getElementById("tourBookingForm");
  const startCity = document.getElementById("startCity");
  const guestCount = document.getElementById("guestCount");
  const roomCount = document.getElementById("roomCount");
  const hotelChoice = document.getElementById("hotelChoice");
  const vehicleChoice = document.getElementById("vehicleChoice");
  const pickupPoint = document.getElementById("pickupPoint");
  const pickupAddress = document.getElementById("pickupAddress");
  const selectedVehicleText = document.getElementById("selectedVehicleText");
  const selectedPickupText = document.getElementById("selectedPickupText");

  const travelerFields = document.getElementById("travelerFields");
  const calculatedPrice = document.getElementById("calculatedPrice");
  const calculatedRoute = document.getElementById("calculatedRoute");
  const selectedHotelText = document.getElementById("selectedHotelText");
  const basePriceText = document.getElementById("basePriceText");
  const hotelPriceText = document.getElementById("hotelPriceText");
  const roomCountText = document.getElementById("roomCountText");

  const routeText = document.getElementById("routeText");
  const routeMap = document.getElementById("routeMap");

  const startLocation = document.getElementById("startLocation");
  const customLocation = document.getElementById("customLocation");
  const priceText = document.getElementById("priceText");

  const accountBox = document.getElementById("accountBox");
  const confirmationMsg = document.getElementById("confirmationMsg");
  const seatsLeft = document.getElementById("seatsLeft");

  let authMode = "login";
  let currentUser = null;
  let seats = Number(localStorage.getItem("chitralGroupTourSeats")) || 16;
  seatsLeft.textContent = seats;

  const priceByCity = {
    islamabad: 46000,
    rawalpindi: 46000,
    lahore: 56000,
    peshawar: 40000,
    faisalabad: 58000,
    multan: 66000,
    karachi: 82000,
    sialkot: 59000,
    gujranwala: 58000,
    gujrat: 57000,
    sargodha: 59000,
    bahawalpur: 70000,
    hyderabad: 80000,
    abbottabad: 43000,
    mansehra: 44000,
    swat: 42000,
    mardan: 41000,
    chakwal: 48000,
    jhelum: 50000
  };

  const hotels = {
    hindukush: { name: "Hindukush Heights Chitral", adjustment: 14000, label: "Luxury mountain-view rooms" },
    tirichmir: { name: "Tirich Mir View Hotel", adjustment: 10000, label: "Premium hotel rooms" },
    kalashGuest: { name: "Kalash Valley Guest House", adjustment: 8000, label: "Cultural stay rooms" },
    garamResort: { name: "Garam Chashma Resort Stay", adjustment: 7000, label: "Standard resort rooms" },
    budgetHotel: { name: "Budget Chitral Hotel", adjustment: 5000, label: "Economy room option" }
  };

  function hideAll() {
    authPanel.classList.add("hidden");
    previousRecordPanel.classList.add("hidden");
    bookingFormPanel.classList.add("hidden");
  }

  function normalizeCity(city) {
    return (city || "").trim().toLowerCase();
  }

  function money(amount) {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  }

  function getHotel() {
    return hotels[hotelChoice.value] || null;
  }

  function getCityPrice(city) {
    return priceByCity[normalizeCity(city)] || 0;
  }

  function getTravelerCharge(perPerson, type, age) {
    const travelerAge = Number(age) || 0;
    if (type === "Child") {
      if (travelerAge > 0 && travelerAge <= 4) {
        return { amount: 0, label: "Child 0-4 years: Free" };
      }
      if (travelerAge >= 5 && travelerAge <= 8) {
        return { amount: perPerson * 0.5, label: "Child 5-8 years: 50% charges" };
      }
    }
    return { amount: perPerson, label: "Adult / 9+ years: Full charges" };
  }

  function calculateTravelersTotal(perPerson) {
    const travelerCards = Array.from(document.querySelectorAll(".traveler-card"));
    if (!travelerCards.length) {
      const guests = Number(guestCount.value) || 0;
      return {
        total: perPerson * guests,
        breakdown: guests ? `${money(perPerson)} x ${guests} traveler${guests > 1 ? "s" : ""}` : "No travelers added yet"
      };
    }

    let total = 0;
    const lines = travelerCards.map((card, index) => {
      const type = card.querySelector(".traveler-type").value;
      const age = Number(card.querySelector(".traveler-age").value) || 0;
      const charge = getTravelerCharge(perPerson, type, age);
      total += charge.amount;
      return `Traveler ${index + 1}: ${charge.label} = ${money(charge.amount)}`;
    });

    return { total, breakdown: lines.join("<br>") };
  }

  function updateMapAndTopLocation(city) {
    if (!city) {
      routeText.textContent = "Select your starting city to show route to Chitral.";
      routeMap.src = "https://www.google.com/maps?q=Chitral%20Pakistan&output=embed";
      return;
    }

    routeText.textContent = `${city} → Chitral`;
    routeMap.src = `https://www.google.com/maps?q=${encodeURIComponent(city + " to Chitral Pakistan")}&output=embed`;

    let matched = false;
    Array.from(startLocation.options).forEach(option => {
      if (option.value.toLowerCase() === city.toLowerCase()) {
        startLocation.value = option.value;
        matched = true;
      }
    });

    if (!matched) {
      startLocation.value = "custom";
      customLocation.classList.remove("hide");
      customLocation.value = city;
    } else {
      customLocation.classList.add("hide");
      customLocation.value = "";
    }
  }

  function updatePriceAndRoute() {
    const city = startCity.value.trim();
    const guests = Number(guestCount.value) || 0;
    const rooms = Math.max(1, Number(roomCount.value) || 1);
    const hotel = getHotel();

    selectedVehicleText.textContent = vehicleChoice.value || "Please select vehicle";
    selectedPickupText.textContent = pickupPoint.value ? `${pickupPoint.value}${pickupAddress.value.trim() ? " - " + pickupAddress.value.trim() : ""}` : "Please select pickup point";
    if (roomCountText) roomCountText.textContent = `${rooms} room${rooms > 1 ? "s" : ""}`;

    if (!city) {
      calculatedRoute.textContent = "Please enter start city";
      selectedHotelText.textContent = hotel ? hotel.name : "Please select hotel";
      basePriceText.textContent = "Rs. 0";
      hotelPriceText.textContent = "Rs. 0";
      calculatedPrice.textContent = "Rs. 0";
      priceText.textContent = "Select start location";
      updateMapAndTopLocation("");
      return;
    }

    const perPerson = getCityPrice(city);
    const roomPrice = hotel ? hotel.adjustment : 0;
    const travelersCalc = calculateTravelersTotal(perPerson);
    const baseTotal = travelersCalc.total;
    const hotelTotal = roomPrice * rooms;
    const total = baseTotal + hotelTotal;

    calculatedRoute.textContent = `${city} to Chitral Unique Culture Tour`;
    selectedHotelText.innerHTML = hotel
      ? `${hotel.name} <span class="hotel-price-badge">${hotel.label}</span>`
      : "Please select hotel";

    if (perPerson > 0) {
      priceText.textContent = `${money(perPerson)} adult / 9+ per person`;
      basePriceText.innerHTML = `${money(baseTotal)}<br><small>${travelersCalc.breakdown}</small>`;
      calculatedPrice.textContent = `${money(total)} (${guests} traveler${guests > 1 ? "s" : ""}, ${rooms} room${rooms > 1 ? "s" : ""})`;
    } else {
      priceText.textContent = "Custom price will be confirmed";
      basePriceText.textContent = "Custom price";
      calculatedPrice.textContent = "Custom price will be confirmed";
    }

    hotelPriceText.textContent = hotel
      ? `${money(hotelTotal)} (${money(roomPrice)} x ${rooms} room${rooms > 1 ? "s" : ""})`
      : "Rs. 0";

    updateMapAndTopLocation(city);
  }

  function renderTravelerFields() {
    const count = Math.max(0, Number(guestCount.value) || 0);
    travelerFields.innerHTML = "";

    for (let i = 1; i <= count; i++) {
      const card = document.createElement("div");
      card.className = "traveler-card";
      card.innerHTML = `
        <h4>Traveler ${i}</h4>
        <div class="traveler-card-grid">
          <select class="traveler-type" required>
            <option value="Adult">Adult</option>
            <option value="Child">Child</option>
          </select>
          <input type="text" class="traveler-name" placeholder="Full Name" required>
          <input type="number" class="traveler-age" placeholder="Age" min="1" required>
          <select class="traveler-gender" required>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" class="traveler-cnic cnic-field" placeholder="CNIC / ID Card" required>
        </div>`;

      const typeSelect = card.querySelector(".traveler-type");
      const cnicInput = card.querySelector(".traveler-cnic");
      typeSelect.addEventListener("change", function () {
        if (this.value === "Child") {
          card.classList.add("child");
          cnicInput.required = false;
          cnicInput.value = "";
        } else {
          card.classList.remove("child");
          cnicInput.required = true;
        }
        updatePriceAndRoute();
      });
      card.querySelector(".traveler-age").addEventListener("input", updatePriceAndRoute);
      travelerFields.appendChild(card);
    }
    updatePriceAndRoute();
  }

  function collectTravelers() {
    const city = startCity.value.trim();
    const perPerson = getCityPrice(city);
    return Array.from(document.querySelectorAll(".traveler-card")).map((card, index) => {
      const type = card.querySelector(".traveler-type").value;
      const age = Number(card.querySelector(".traveler-age").value) || 0;
      const charge = getTravelerCharge(perPerson, type, age);
      return {
        travelerNo: index + 1,
        type,
        name: card.querySelector(".traveler-name").value.trim(),
        age,
        gender: card.querySelector(".traveler-gender").value,
        cnic: type === "Child" ? "Not required for child" : card.querySelector(".traveler-cnic").value.trim(),
        paymentPolicy: charge.label,
        travelerPayment: charge.amount
      };
    });
  }

  function findPreviousBooking(phone) {
    const bookings = JSON.parse(localStorage.getItem("adminBookings")) || [];
    return bookings.filter(b => b.phone === phone && b.tour === "Chitral Unique Culture Tour").slice(-1)[0];
  }

  function showPreviousOrForm() {
    hideAll();
    const previous = findPreviousBooking(currentUser.phone);
    if (previous) {
      previousBookingBox.innerHTML = `
        <p><strong>Name:</strong> ${previous.name}</p>
        <p><strong>Phone:</strong> ${previous.phone}</p>
        <p><strong>From:</strong> ${previous.from}</p>
        <p><strong>To:</strong> ${previous.to}</p>
        <p><strong>Hotel:</strong> ${previous.hotelName || "Not selected"}</p>
        <p><strong>Hotel Rooms:</strong> ${previous.hotelRoomCount || "Not saved"}</p>
        <p><strong>Vehicle:</strong> ${previous.vehicle || "Not saved"}</p>
        <p><strong>Pickup:</strong> ${previous.pickupPoint || "Not saved"}</p>
        <p><strong>Total Travelers:</strong> ${previous.guests}</p>
        <p><strong>Total Payment:</strong> ${money(previous.totalPayment)}</p>
        <p><strong>Payment Type:</strong> ${previous.paymentType}</p>
        <p><strong>Date:</strong> ${previous.date}</p>`;
      previousRecordPanel.classList.remove("hidden");
    } else {
      document.getElementById("customerName").value = currentUser.name || "";
      document.getElementById("customerPhone").value = currentUser.phone || "";
      bookingFormPanel.classList.remove("hidden");
    }
  }

  startBookingBtn.addEventListener("click", function () {
    hideAll();
    authPanel.classList.remove("hidden");
    authPanel.scrollIntoView({ behavior: "smooth" });
  });

  if (closeAuthPanel) {
    closeAuthPanel.addEventListener("click", () => authPanel.classList.add("hidden"));
  }

  authTabs.forEach(btn => {
    btn.addEventListener("click", function () {
      authTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      authMode = btn.dataset.auth;
      authSubmitBtn.textContent = authMode === "login" ? "Login" : "Register";
      authName.classList.toggle("hidden", authMode === "login");
    });
  });

  // authForm.addEventListener("submit", function (e) {
  //   e.preventDefault();
  //   const phone = document.getElementById("authPhone").value.trim();
  //   const password = document.getElementById("authPassword").value.trim();
  //   let users = JSON.parse(localStorage.getItem("tourUsers")) || [];
  //   if (authMode === "register") {
  //     const name = authName.value.trim();
  //     if (!name) return alert("Please enter name");
  //     let user = users.find(u => u.phone === phone);
  //     if (!user) {
  //       user = { name, phone, password };
  //       users.push(user);
  //       localStorage.setItem("tourUsers", JSON.stringify(users));
  //     }
  //     currentUser = user;
  //     alert("Registration successful.");
  //   } else {
  //     const user = users.find(u => u.phone === phone && u.password === password);
  //     if (!user) return alert("User not found. Please register first or check phone/password.");
  //     currentUser = user;
  //   }
  //   showPreviousOrForm();
  // });

  // newBookingBtn.addEventListener("click", function () {
  //   hideAll();
  //   document.getElementById("customerName").value = currentUser.name;
  //   document.getElementById("customerPhone").value = currentUser.phone;
  //   bookingFormPanel.classList.remove("hidden");
  // });

  // startLocation.addEventListener("change", function () {
  //   const selectedOption = startLocation.options[startLocation.selectedIndex];
  //   const city = selectedOption.value;
  //   if (city === "custom") {
  //     customLocation.classList.remove("hide");
  //     priceText.textContent = "Custom price will be confirmed";
  //     routeText.textContent = "Enter your city to show route to Chitral.";
  //     routeMap.src = "https://www.google.com/maps?q=Chitral%20Pakistan&output=embed";
  //     return;
  //   }
  //   customLocation.classList.add("hide");
  //   customLocation.value = "";
  //   startCity.value = city;
  //   updatePriceAndRoute();
  // });
authForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const phone = document.getElementById("authPhone").value.trim();
  const password = document.getElementById("authPassword").value.trim();

  if (!phone || !password) {
    alert("Please enter phone and password.");
    return;
  }

  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("password", password);

  let url = "../backend/login_user.php";

  if (authMode === "register") {
    const name = authName.value.trim();

    if (!name) {
      alert("Please enter name.");
      return;
    }

    formData.append("name", name);
    url = "../backend/register_user.php";
  }

  authSubmitBtn.textContent = "Please wait...";

  fetch(url, {
    method: "POST",
    body: formData
  })
    .then(async response => {
      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error("PHP response JSON nahi hai. Response: " + text);
      }

      if (!response.ok) {
        throw new Error(data.message || "HTTP Error " + response.status);
      }

      return data;
    })
    .then(data => {
      authSubmitBtn.textContent = authMode === "login" ? "Login" : "Register";

      if (data.success) {
        currentUser = data.user;

        document.getElementById("customerName").value = currentUser.name || "";
        document.getElementById("customerPhone").value = currentUser.phone || "";

        alert(data.message);
        showPreviousOrForm();
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      authSubmitBtn.textContent = authMode === "login" ? "Login" : "Register";
      alert("Login/Register backend error: " + error.message);
      console.error(error);
    });
});







  customLocation.addEventListener("input", function () {
    startCity.value = customLocation.value.trim();
    updatePriceAndRoute();
  });

  startCity.addEventListener("input", updatePriceAndRoute);
  hotelChoice.addEventListener("change", updatePriceAndRoute);
  roomCount.addEventListener("input", updatePriceAndRoute);
  vehicleChoice.addEventListener("change", updatePriceAndRoute);
  pickupPoint.addEventListener("change", updatePriceAndRoute);
  pickupAddress.addEventListener("input", updatePriceAndRoute);
  guestCount.addEventListener("input", renderTravelerFields);

  document.querySelectorAll('input[name="paymentType"]').forEach(radio => {
    radio.addEventListener("change", function () {
      accountBox.classList.toggle("hidden", this.value === "No Advance");
    });
  });

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const guests = Number(guestCount.value) || 1;
    const rooms = Math.max(1, Number(roomCount.value) || 1);
    const hotel = getHotel();
    const city = startCity.value.trim();
    const perPerson = getCityPrice(city);

    if (!hotel) {
      alert("Please select hotel package.");
      return;
    }

    if (!vehicleChoice.value) {
      alert("Please select travel vehicle.");
      return;
    }

    if (!pickupPoint.value) {
      alert("Please select pickup point.");
      return;
    }

    const travelers = collectTravelers();

    if (travelers.length !== guests) {
      alert("Please add traveler details according to total travelers.");
      return;
    }

    const travelersCalc = calculateTravelersTotal(perPerson);
    const baseTotal = travelersCalc.total;
    const hotelTotal = hotel.adjustment * rooms;
    const total = baseTotal + hotelTotal;
    const paymentType = document.querySelector('input[name="paymentType"]:checked').value;

    const formData = new FormData();
    formData.append("tour_name", document.getElementById("tourName").value);
    formData.append("customer_name", document.getElementById("customerName").value.trim());
    formData.append("phone", document.getElementById("customerPhone").value.trim());
    formData.append("cnic", document.getElementById("customerCnic").value.trim());
    formData.append("travel_date", document.getElementById("travelDate").value);
    formData.append("guests", guests);
    formData.append("room_count", rooms);
    formData.append("from_city", city);
    formData.append("to_destination", "Chitral");
    formData.append("route_text", city + " to Chitral");
    formData.append("hotel_package", hotelChoice.value);
    formData.append("hotel_name", hotel.name);
    formData.append("vehicle", vehicleChoice.value);
    formData.append("pickup_point", pickupPoint.value);
    formData.append("pickup_address", pickupAddress.value.trim());
    formData.append("per_person_price", perPerson);
    formData.append("hotel_price", hotel.adjustment);
    formData.append("base_payment", baseTotal);
    formData.append("hotel_payment", hotelTotal);
    formData.append("total_payment", total);
    formData.append("travelers_json", JSON.stringify(travelers));
    formData.append("booking_note", document.getElementById("bookingNote").value.trim());
    formData.append("payment_type", paymentType);

    const screenshotInput = document.getElementById("paymentScreenshot");
    if (screenshotInput && screenshotInput.files.length > 0) {
      formData.append("payment_screenshot", screenshotInput.files[0]);
    }

    confirmationMsg.innerHTML = "Submitting booking to backend...";
    confirmationMsg.classList.remove("hidden");

    fetch("../backend/submit_tour_booking.php", {
      method: "POST",
      body: formData
    })
      .then(async response => {
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new Error("PHP response JSON nahi hai. Response: " + text);
        }
        if (!response.ok) {
          throw new Error(data.message || "HTTP Error " + response.status);
        }
        return data;
      })
      .then(data => {
        if (data.success) {
          seats = Math.max(0, seats - guests);
          seatsLeft.textContent = seats;

          confirmationMsg.innerHTML =
            "Booking submitted successfully ✅<br>" +
            "Route: <strong>" + city + " to Chitral</strong><br>" +
            "Hotel: <strong>" + hotel.name + "</strong><br>" +
            "Rooms: <strong>" + rooms + "</strong><br>" +
            "Vehicle: <strong>" + vehicleChoice.value + "</strong><br>" +
            "Total payment: <strong>" + money(total) + "</strong><br>" +
            "Status: Pending Admin Confirmation.";

          bookingForm.reset();
          travelerFields.innerHTML = "";
          updatePriceAndRoute();
        } else {
          confirmationMsg.innerHTML = "Backend Error: " + data.message;
          alert("Backend Error: " + data.message);
        }
      })
      .catch(error => {
        confirmationMsg.innerHTML = "Backend connection error: " + error.message;
        alert("Backend connection error: " + error.message);
        console.error(error);
      });
  });

  document.querySelectorAll(".faq-item button").forEach(btn => {
    btn.addEventListener("click", function () {
      btn.parentElement.classList.toggle("active");
    });
  });

  function showLocationOnMap(query, activeElement, selector, activeClass) {
    document.querySelectorAll(selector).forEach(item => item.classList.remove(activeClass));
    activeElement.classList.add(activeClass);
    routeMap.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    routeText.textContent = `Map showing: ${query}`;
    document.querySelector(".tour-map-card").scrollIntoView({ behavior: "smooth" });
  }

  document.querySelectorAll(".place-card").forEach(card => {
    card.addEventListener("click", function () {
      showLocationOnMap(this.dataset.place, this, ".place-card", "active-place");
    });
  });

  document.querySelectorAll(".clickable-hotel").forEach(card => {
    card.addEventListener("click", function () {
      showLocationOnMap(this.dataset.hotel, this, ".clickable-hotel", "active-hotel");
    });
  });

  updatePriceAndRoute();
});

// image slider
let heroSlideIndex = 0;
const heroSlides = document.querySelectorAll(".hero-slider .slide");
function showHeroSlide(index) {
  if (!heroSlides.length) return;
  heroSlides.forEach(slide => slide.classList.remove("active"));
  if (index >= heroSlides.length) heroSlideIndex = 0;
  if (index < 0) heroSlideIndex = heroSlides.length - 1;
  heroSlides[heroSlideIndex].classList.add("active");
}
function changeHeroSlide(step) {
  heroSlideIndex += step;
  showHeroSlide(heroSlideIndex);
}
setInterval(() => {
  heroSlideIndex++;
  showHeroSlide(heroSlideIndex);
}, 3000);

/* ADVANCED AI CHATBOT */
const chatToggleBtn = document.getElementById("chatToggleBtn");
const closeChatBtn = document.getElementById("closeChatBtn");
const travelChatbot = document.getElementById("travelChatbot");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");

if (chatToggleBtn && travelChatbot) {
  chatToggleBtn.onclick = () => travelChatbot.style.display = "flex";
}
if (closeChatBtn && travelChatbot) {
  closeChatBtn.onclick = () => travelChatbot.style.display = "none";
}

function saveChats() {
  if (chatBody) localStorage.setItem("travelChats", chatBody.innerHTML);
}
function addMessage(message, sender) {
  if (!chatBody) return;
  const div = document.createElement("div");
  div.className = sender === "user" ? "user-msg" : "bot-msg";
  div.innerHTML = message;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
  saveChats();
}
function getBotReply(question) {
  const q = question.toLowerCase().trim();
  if (q.includes("chitral") || q.includes("kalash")) {
    return `🏔 <strong>Chitral Tour</strong><br><br>Famous places: Kalash Valley, Garam Chashma, Chitral Fort, Chitral Museum and Shandur Pass.<br><br>Best for families, culture lovers and adventure travelers.`;
  }
  if (q.includes("hotel") || q.includes("stay")) {
    return `🏨 <strong>Chitral Hotel Options</strong><br><br>Hindukush Heights, Tirich Mir View Hotel, Kalash Guest House, Garam Chashma Resort and Budget Chitral Hotel.`;
  }
  if (q.includes("route") || q.includes("road")) {
    return `🛣 <strong>Route</strong><br><br>Select your city on the page. The map will show route to Chitral automatically.`;
  }
  if (q.includes("family") || q.includes("safe")) {
    return `✅ Chitral is suitable for families. Carry CNIC, check weather and avoid night travel on mountain routes.`;
  }
  return `🤖 Main Pakistan travel assistant hun.<br><br>Aap pooch sakte hain: Chitral route, hotels, Kalash Valley, family tour, budget, weather, places aur booking.`;
}
function sendMessage() {
  if (!chatInput || !chatInput.value.trim()) return;
  const question = chatInput.value.trim();
  addMessage(question, "user");
  addMessage("Typing...", "bot");
  setTimeout(() => {
    const botMsgs = document.querySelectorAll(".bot-msg");
    if (botMsgs.length) botMsgs[botMsgs.length - 1].remove();
    addMessage(getBotReply(question), "bot");
  }, 500);
  chatInput.value = "";
}
if (sendBtn) sendBtn.onclick = sendMessage;
if (chatInput) chatInput.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
window.addEventListener("load", () => {
  const savedChats = localStorage.getItem("travelChats");
  if (savedChats && chatBody) chatBody.innerHTML = savedChats;
});
if (voiceBtn) {
  voiceBtn.onclick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice input is not supported in this browser.");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = (event) => {
      chatInput.value = event.results[0][0].transcript;
      sendMessage();
    };
  };
}

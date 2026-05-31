document.addEventListener("DOMContentLoaded", function () {
  const startBookingBtn = document.getElementById("startBookingBtn");
  const authPanel = document.getElementById("authPanel");
  const previousRecordPanel = document.getElementById("previousRecordPanel");
  const bookingFormPanel = document.getElementById("bookingFormPanel");

  const authForm = document.getElementById("authForm");
  const authTabs = document.querySelectorAll(".auth-tabs button");
  const authName = document.getElementById("authName");
  const authSubmitBtn = document.getElementById("authSubmitBtn");

  const previousBookingBox = document.getElementById("previousBookingBox");
  const newBookingBtn = document.getElementById("newBookingBtn");

  const bookingForm = document.getElementById("tourBookingForm");
  const startCity = document.getElementById("startCity");
  const guestCount = document.getElementById("guestCount");
  const roomCount = document.getElementById("roomCount");
  const hotelChoice = document.getElementById("hotelChoice");

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
  let seats = Number(localStorage.getItem("naranKaghanGroupTourSeats")) || 18;
  if (seatsLeft) seatsLeft.textContent = seats;

  const priceByCity = {
    lahore: 28000,
    islamabad: 22000,
    rawalpindi: 22000,
    multan: 34000,
    rajanpur: 39000,
    karachi: 48000,
    khanewal: 35000,
    chakwal: 24000,
    attock: 23000,
    bahawalpur: 37000,
    gujranwala: 30000
  };

  const hotels = {
    standard: {
      name: "ICONIC Hotel & Restaurant Naran",
      adjustment: 9000,
      label: "Standard room package"
    },
    premium: {
      name: "The Sarai Hotel & Resort",
      adjustment: 16000,
      label: "Premium room package"
    },
    family: {
      name: "Croft Family Cottages",
      adjustment: 20000,
      label: "Family cottage per room"
    }
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
      routeText.textContent = "Select your starting city in the form to show route to Naran Kaghan.";
      routeMap.src = "https://www.google.com/maps?q=Naran%20Kaghan%20Pakistan&output=embed";
      return;
    }

    routeText.textContent = `${city} → Naran Kaghan`;
    routeMap.src = `https://www.google.com/maps?q=${encodeURIComponent(city + " to Naran Kaghan Pakistan")}&output=embed`;

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
    const rooms = Math.max(1, Number(roomCount?.value) || 1);
    const hotel = getHotel();

    if (!city) {
      calculatedRoute.textContent = "Please enter start city";
      selectedHotelText.textContent = hotel ? hotel.name : "Please select hotel";
      basePriceText.textContent = "Rs. 0";
      hotelPriceText.textContent = "Rs. 0";
      if (roomCountText) roomCountText.textContent = `${rooms} room${rooms > 1 ? "s" : ""}`;
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

    calculatedRoute.textContent = `${city} to Naran Kaghan Group Tour`;
    selectedHotelText.innerHTML = hotel
      ? `${hotel.name} <span class="hotel-price-badge">${hotel.label}</span>`
      : "Please select hotel";

    if (roomCountText) roomCountText.textContent = `${rooms} room${rooms > 1 ? "s" : ""}`;

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
        </div>
      `;

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
        cnic: type === "Child"
          ? "Not required for child"
          : card.querySelector(".traveler-cnic").value.trim(),
        paymentPolicy: charge.label,
        travelerPayment: charge.amount
      };
    });
  }

  function findPreviousBooking(phone) {
    const bookings = JSON.parse(localStorage.getItem("adminBookings")) || [];
    return bookings
      .filter(b => b.phone === phone && b.tour === "Naran Kaghan Valley Tour")
      .slice(-1)[0];
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
        <p><strong>Total Travelers:</strong> ${previous.guests}</p>
        <p><strong>Hotel Rooms:</strong> ${previous.hotelRoomCount || "Not saved"}</p>
        <p><strong>Total Payment:</strong> ${money(previous.totalPayment)}</p>
        <p><strong>Payment Type:</strong> ${previous.paymentType}</p>
        <p><strong>Date:</strong> ${previous.date}</p>
      `;

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

  //     if (!name) {
  //       alert("Please enter name");
  //       return;
  //     }

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

  //     if (!user) {
  //       alert("User not found. Please register first or check phone/password.");
  //       return;
  //     }

  //     currentUser = user;
  //   }

  //   showPreviousOrForm();
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







  newBookingBtn.addEventListener("click", function () {
    hideAll();
    document.getElementById("customerName").value = currentUser.name;
    document.getElementById("customerPhone").value = currentUser.phone;
    bookingFormPanel.classList.remove("hidden");
  });

  startLocation.addEventListener("change", function () {
    const selectedOption = startLocation.options[startLocation.selectedIndex];
    const city = selectedOption.value;

    if (city === "custom") {
      customLocation.classList.remove("hide");
      priceText.textContent = "Custom price will be confirmed";
      routeText.textContent = "Enter your city to show route to Naran Kaghan.";
      routeMap.src = "https://www.google.com/maps?q=Naran%20Kaghan%20Pakistan&output=embed";
      return;
    }

    customLocation.classList.add("hide");
    customLocation.value = "";
    startCity.value = city;
    updatePriceAndRoute();
  });

  customLocation.addEventListener("input", function () {
    const city = customLocation.value.trim();
    startCity.value = city;
    updatePriceAndRoute();
  });

  startCity.addEventListener("input", updatePriceAndRoute);

  hotelChoice.addEventListener("change", updatePriceAndRoute);
  if (roomCount) roomCount.addEventListener("input", updatePriceAndRoute);

  guestCount.addEventListener("input", function () {
    renderTravelerFields();
    updatePriceAndRoute();
  });

  document.querySelectorAll('input[name="paymentType"]').forEach(radio => {
    radio.addEventListener("change", function () {
      accountBox.classList.toggle("hidden", this.value === "No Advance");
    });
  });

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const guests = Number(guestCount.value) || 1;
    const rooms = Math.max(1, Number(roomCount?.value) || 1);
    const hotel = getHotel();
    const city = startCity.value.trim();
    const perPerson = getCityPrice(city);

    if (!hotel) {
      alert("Please select hotel package.");
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
    formData.append("to_destination", "Naran Kaghan");
    formData.append("route_text", city + " to Naran Kaghan");
    formData.append("hotel_package", hotelChoice.value);
    formData.append("hotel_name", hotel.name);

    // Is form me vehicle/pickup fields nahi hain, is liye blank save ho raha hai.
    formData.append("vehicle", "");
    formData.append("pickup_point", "");
    formData.append("pickup_address", "");

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
          if (seatsLeft) seatsLeft.textContent = seats;

          confirmationMsg.innerHTML =
            "Booking submitted successfully ✅<br>" +
            "Route: <strong>" + city + " to Naran Kaghan</strong><br>" +
            "Hotel: <strong>" + hotel.name + "</strong><br>" +
            "Rooms: <strong>" + rooms + "</strong><br>" +
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

  updatePriceAndRoute();
});
// cross btn js
const closeAuthPanel =
document.getElementById("closeAuthPanel");

const authPanel =
document.getElementById("authPanel");

if (closeAuthPanel && authPanel) {
  closeAuthPanel.addEventListener("click", () => {
    authPanel.classList.add("hidden");
  });
}


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

const voiceBtn =
document.getElementById("voiceBtn");

/* ========================= */
/* OPEN CLOSE */
/* ========================= */

if (chatToggleBtn && travelChatbot) {
  chatToggleBtn.onclick = () => {
    travelChatbot.style.display = "flex";
  };
}

if (closeChatBtn && travelChatbot) {
  closeChatBtn.onclick = () => {
    travelChatbot.style.display = "none";
  };
}

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
/* SEND MESSAGE */
/* ========================= */

function sendMessage(){

  const question =
  chatInput.value.trim();

  if(!question) return;

  addMessage(question, "user");

  addMessage(
    "Typing...",
    "bot"
  );

  setTimeout(() => {

    const typing =
    document.querySelectorAll(".bot-msg");

    typing[
      typing.length - 1
    ].remove();

    const reply =
    getBotReply(question);

    addMessage(reply, "bot");

  }, 800);

  chatInput.value = "";
}

if (sendBtn) {
  sendBtn.onclick = sendMessage;
}

if (chatInput) {
  chatInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}

/* ========================= */
/* VOICE SEARCH */
/* ========================= */

if (voiceBtn) {
voiceBtn.onclick = () => {

  const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

  if(!SpeechRecognition){

    addMessage(
      "Voice not supported",
      "bot"
    );

    return;
  }
  const recognition =
  new SpeechRecognition();

  recognition.lang =
  "en-US";

  recognition.start();

  addMessage(
    "🎤 Listening...",
    "bot"
  );

  recognition.onresult =
  function(event){

    const text =
    event.results[0][0]
    .transcript;

    chatInput.value =
    text;

    sendMessage();
  };
};
}




// image slider
let heroSlideIndex = 0;
const heroSlides = document.querySelectorAll(".hero-slider .slide");

function showHeroSlide(index) {
  heroSlides.forEach(slide => slide.classList.remove("active"));

  if (index >= heroSlides.length) {
    heroSlideIndex = 0;
  }

  if (index < 0) {
    heroSlideIndex = heroSlides.length - 1;
  }

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

document.querySelectorAll(".place-card").forEach(card => {
  card.addEventListener("click", function () {
    const place = this.dataset.place;
    document.querySelectorAll(".place-card").forEach(item => item.classList.remove("active-place"));
    this.classList.add("active-place");
    const routeMap = document.getElementById("routeMap");
    const routeText = document.getElementById("routeText");
    if (routeMap && routeText && place) {
      routeMap.src = `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
      routeText.textContent = `Map showing: ${place}`;
      document.querySelector(".tour-map-card")?.scrollIntoView({ behavior: "smooth" });
    }
  });
});

document.querySelectorAll(".clickable-hotel").forEach(hotel => {
  hotel.addEventListener("click", function () {
    const hotelLocation = this.dataset.hotel;
    document.querySelectorAll(".clickable-hotel").forEach(item => item.classList.remove("active-hotel"));
    this.classList.add("active-hotel");
    const routeMap = document.getElementById("routeMap");
    const routeText = document.getElementById("routeText");
    if (routeMap && routeText && hotelLocation) {
      routeMap.src = `https://www.google.com/maps?q=${encodeURIComponent(hotelLocation)}&output=embed`;
      routeText.textContent = `Map showing: ${hotelLocation}`;
      document.querySelector(".tour-map-card")?.scrollIntoView({ behavior: "smooth" });
    }
  });
});

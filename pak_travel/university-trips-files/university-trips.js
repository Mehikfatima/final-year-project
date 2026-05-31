document.addEventListener("DOMContentLoaded", function(){
  const packages = {
    northern:{
      name:"Northern Adventure Trip",
      destination:"Hunza Pakistan",
      duration:"5 Days / 4 Nights",
      stops:["Islamabad","Mansehra","Balakot","Naran","Chilas","Hunza"],
      base:{Lahore:18500,Islamabad:15500,Karachi:34500,Multan:23000,Faisalabad:20500,Peshawar:17000,Quetta:36000,Hyderabad:33000,Sialkot:20500,Bahawalpur:24500,Other:0},
      itinerary:[
        ["Day 1","Departure to Islamabad / Balakot","Pickup from selected city, refreshment stops and night stay according to route."],
        ["Day 2","Naran / Chilas Route","Travel through scenic mountain route with photography and group activities."],
        ["Day 3","Hunza + Attabad Lake","Visit Attabad Lake, Passu Cones and local market. Bonfire at night."],
        ["Day 4","Khunjerab / Local Exploration","Optional Khunjerab or local Hunza sightseeing according to weather."],
        ["Day 5","Return Journey","Breakfast, checkout and travel back to selected city."]
      ]
    },
    heritage:{
      name:"Cultural Heritage Trip",
      destination:"Lahore Multan Bahawalpur Pakistan",
      duration:"3 Days / 2 Nights",
      stops:["Lahore","Multan","Bahawalpur","Noor Mahal"],
      base:{Lahore:9500,Islamabad:14500,Karachi:25000,Multan:8500,Faisalabad:10500,Peshawar:16500,Quetta:27000,Hyderabad:23000,Sialkot:12500,Bahawalpur:7500,Other:0},
      itinerary:[
        ["Day 1","Lahore / Multan Heritage Arrival","Travel, hotel check-in, food street and city walk."],
        ["Day 2","Shrines + Noor Mahal","Visit Multan shrines, blue pottery market and Bahawalpur Noor Mahal."],
        ["Day 3","Museum / Return","Short educational visit and return journey with refreshment stops."]
      ]
    },
    industrial:{
      name:"Educational Industrial Trip",
      destination:"Lahore Islamabad Karachi Pakistan",
      duration:"2 Days / 1 Night",
      stops:["Industrial Area","Software House","University Visit","Career Session"],
      base:{Lahore:6500,Islamabad:7000,Karachi:8500,Multan:9500,Faisalabad:6500,Peshawar:9500,Quetta:16000,Hyderabad:8500,Sialkot:8500,Bahawalpur:10500,Other:0},
      itinerary:[
        ["Day 1","Industry + University Visit","Factory/software house visit, professional session and hotel stay."],
        ["Day 2","Career Workshop + Return","Startup talk, group photography and return journey."]
      ]
    },
    desert:{
      name:"Cholistan Desert Camp",
      destination:"Derawar Fort Cholistan Bahawalpur Pakistan",
      duration:"3 Days / 2 Nights",
      stops:["Bahawalpur","Noor Mahal","Derawar Fort","Cholistan Desert"],
      base:{Lahore:12500,Islamabad:18500,Karachi:22500,Multan:9500,Faisalabad:13500,Peshawar:21000,Quetta:25000,Hyderabad:20500,Sialkot:15000,Bahawalpur:8000,Other:0},
      itinerary:[
        ["Day 1","Bahawalpur Arrival","Hotel check-in, Noor Mahal visit and local food."],
        ["Day 2","Derawar Fort + Desert Camp","Jeep ride, desert photography, camping and bonfire."],
        ["Day 3","Breakfast + Return","Checkout and return journey towards selected city."]
      ]
    },
    swat:{
      name:"Swat Kalam Student Tour",
      destination:"Swat Kalam Pakistan",
      duration:"4 Days / 3 Nights",
      stops:["Islamabad","Mingora","Bahrain","Kalam","Malam Jabba"],
      base:{Lahore:16500,Islamabad:13500,Karachi:32000,Multan:21500,Faisalabad:18500,Peshawar:12500,Quetta:35000,Hyderabad:30500,Sialkot:19000,Bahawalpur:23500,Other:0},
      itinerary:[
        ["Day 1","Departure to Swat","Pickup, travel and hotel check-in at Mingora/Bahrain."],
        ["Day 2","Kalam Valley Tour","Visit Kalam, river side points and student group activities."],
        ["Day 3","Malam Jabba / Bahrain","Chairlift area or Bahrain visit according to weather."],
        ["Day 4","Return Journey","Breakfast and travel back to selected city."]
      ]
    }
  };

  const vehicles = {
    coaster:{name:"Coaster",adjustment:1500,capacity:"20-25 students"},
    hiace:{name:"Hiace",adjustment:2500,capacity:"10-14 students"},
    luxuryBus:{name:"Luxury Bus",adjustment:1000,capacity:"35-45 students"},
    sleeperBus:{name:"Sleeper Bus",adjustment:3500,capacity:"Long-route comfort"}
  };

  const stays = {
    hostel:{name:"Student Hostel / Shared Rooms",adjustment:0},
    budget:{name:"Budget Hotel",adjustment:1500},
    standard:{name:"Standard Hotel",adjustment:3000},
    premium:{name:"Premium Hotel",adjustment:5500}
  };

  const money = n => `Rs. ${Number(n || 0).toLocaleString()}`;

  const topCity = document.getElementById("topCity");
  const topPackage = document.getElementById("topPackage");
  const topPrice = document.getElementById("topPrice");
  const topRouteText = document.getElementById("topRouteText");
  const routeMap = document.getElementById("routeMap");

  const startCity = document.getElementById("startCity");
  const customCity = document.getElementById("customCity");
  const tripPackage = document.getElementById("tripPackage");
  const vehicleChoice = document.getElementById("vehicleChoice");
  const stayType = document.getElementById("stayType");
  const studentCount = document.getElementById("studentCount");
  const selectedRoute = document.getElementById("selectedRoute");
  const stoppingCities = document.getElementById("stoppingCities");
  const selectedVehicle = document.getElementById("selectedVehicle");
  const selectedStay = document.getElementById("selectedStay");
  const perStudentPrice = document.getElementById("perStudentPrice");
  const discountText = document.getElementById("discountText");
  const totalPayment = document.getElementById("totalPayment");
  const itineraryBox = document.getElementById("itineraryBox");
  const accountBox = document.getElementById("accountBox");
  const form = document.getElementById("studentTripForm");
  const confirmationMsg = document.getElementById("confirmationMsg");

  function selectedCity(){
    if(startCity.value === "Other") return customCity.value.trim() || "Other";
    return startCity.value || topCity.value || "Lahore";
  }

  function getBasePrice(pkgKey, city){
    const p = packages[pkgKey];
    return p.base[city] ?? p.base.Other ?? 0;
  }

  function getDiscount(students, subtotal){
    if(students >= 80) return subtotal * 0.12;
    if(students >= 50) return subtotal * 0.10;
    if(students >= 30) return subtotal * 0.07;
    if(students >= 20) return subtotal * 0.05;
    return 0;
  }

  function renderItinerary(pkgKey){
    const pkg = packages[pkgKey] || packages.northern;
    itineraryBox.innerHTML = pkg.itinerary.map(item => `
      <div class="itinerary-item">
        <span>${item[0]}</span>
        <div><h3>${item[1]}</h3><p>${item[2]}</p></div>
      </div>
    `).join("");
  }

  function updateTop(){
    const city = topCity.value;
    const pkgKey = topPackage.value;
    const pkg = packages[pkgKey];
    const price = getBasePrice(pkgKey, city);
    topPrice.textContent = price ? `${money(price)} per student` : "Custom price will be confirmed";
    topRouteText.textContent = `${city} → ${pkg.stops.join(" → ")}`;
    routeMap.src = `https://www.google.com/maps?q=${encodeURIComponent(city + " to " + pkg.destination)}&output=embed`;

    startCity.value = city;
    tripPackage.value = pkgKey;
    renderItinerary(pkgKey);
    updateCalculator();
  }

  function updateCalculator(){
    const city = selectedCity();
    const pkgKey = tripPackage.value || topPackage.value || "northern";
    const pkg = packages[pkgKey];
    const vehicle = vehicles[vehicleChoice.value];
    const stay = stays[stayType.value];
    const students = Math.max(1, Number(studentCount.value) || 1);
    const base = getBasePrice(pkgKey, city);
    const vehicleExtra = vehicle ? vehicle.adjustment : 0;
    const stayExtra = stay ? stay.adjustment : 0;
    const perStudent = base ? base + vehicleExtra + stayExtra : 0;
    const subtotal = perStudent * students;
    const discount = getDiscount(students, subtotal);
    const total = Math.max(0, subtotal - discount);

    selectedRoute.textContent = base ? `${city} → ${pkg.name}` : `${city} → ${pkg.name} | Custom price`;
    stoppingCities.textContent = pkg.stops.join(" → ");
    selectedVehicle.textContent = vehicle ? `${vehicle.name} (${vehicle.capacity}) + ${money(vehicle.adjustment)}` : "Please select vehicle";
    selectedStay.textContent = stay ? `${stay.name} + ${money(stay.adjustment)}` : "Please select stay type";
    perStudentPrice.textContent = perStudent ? money(perStudent) : "Custom price will be confirmed";
    discountText.textContent = money(discount);
    totalPayment.textContent = perStudent ? money(total) : "Custom price will be confirmed";

    routeMap.src = `https://www.google.com/maps?q=${encodeURIComponent(city + " to " + pkg.destination)}&output=embed`;
    topRouteText.textContent = `${city} → ${pkg.stops.join(" → ")}`;
    renderItinerary(pkgKey);

    document.querySelectorAll(".package-card").forEach(card=>{
      card.classList.toggle("active", card.dataset.packageCard === pkgKey);
    });
  }

  topCity.addEventListener("change", updateTop);
  topPackage.addEventListener("change", updateTop);
  startCity.addEventListener("change", function(){
    customCity.classList.toggle("hidden", this.value !== "Other");
    topCity.value = this.value !== "Other" ? this.value : topCity.value;
    updateCalculator();
  });
  customCity.addEventListener("input", updateCalculator);
  tripPackage.addEventListener("change", function(){ topPackage.value = this.value; updateCalculator(); });
  vehicleChoice.addEventListener("change", updateCalculator);
  stayType.addEventListener("change", updateCalculator);
  studentCount.addEventListener("input", updateCalculator);

  document.querySelectorAll(".package-card").forEach(card=>{
    card.addEventListener("click", function(){
      tripPackage.value = this.dataset.packageCard;
      topPackage.value = this.dataset.packageCard;
      document.getElementById("bookingPanel").scrollIntoView({behavior:"smooth"});
      updateCalculator();
    });
  });

  document.querySelectorAll('input[name="paymentType"]').forEach(radio=>{
    radio.addEventListener("change", function(){
      accountBox.classList.toggle("hidden", this.value === "No Advance");
    });
  });

  form.addEventListener("submit", function(e){
    e.preventDefault();

    const pkgKey = tripPackage.value;
    const city = selectedCity();
    const students = Number(studentCount.value) || 1;
    const vehicle = vehicles[vehicleChoice.value];
    const stay = stays[stayType.value];

    if(!pkgKey || !vehicle || !stay){
      alert("Please select package, vehicle and stay type.");
      return;
    }

    if(students < 10){
      alert("Minimum 10 students required for university package.");
      return;
    }

    const base = getBasePrice(pkgKey, city);
    const perStudent = base ? base + vehicle.adjustment + stay.adjustment : 0;
    const subtotal = perStudent * students;
    const discount = getDiscount(students, subtotal);
    const total = Math.max(0, subtotal - discount);
    const paymentType = document.querySelector('input[name="paymentType"]:checked').value;

    const formData = new FormData();
    formData.append("leader_name", document.getElementById("studentName").value.trim());
    formData.append("phone", document.getElementById("studentPhone").value.trim());
    formData.append("university_name", document.getElementById("universityName").value.trim());
    formData.append("department_name", document.getElementById("departmentName").value.trim());
    formData.append("trip_date", document.getElementById("tripDate").value);
    formData.append("student_count", students);
    formData.append("from_city", city);
    formData.append("trip_package", packages[pkgKey].name);
    formData.append("destination", packages[pkgKey].destination);
    formData.append("duration", packages[pkgKey].duration);
    formData.append("stops_json", JSON.stringify(packages[pkgKey].stops));
    formData.append("vehicle", vehicle.name);
    formData.append("vehicle_capacity", vehicle.capacity);
    formData.append("stay_type", stay.name);
    formData.append("per_student_price", perStudent);
    formData.append("discount", discount);
    formData.append("total_payment", total);
    formData.append("pickup_point", document.getElementById("pickupPoint").value);
    formData.append("pickup_address", document.getElementById("pickupAddress").value.trim());
    formData.append("special_note", document.getElementById("specialNote").value.trim());
    formData.append("payment_type", paymentType);
    formData.append("status", "Pending Admin Confirmation");

    const screenshotInput = document.getElementById("paymentScreenshot");
    if (screenshotInput && screenshotInput.files.length > 0) {
      formData.append("payment_screenshot", screenshotInput.files[0]);
    }

    confirmationMsg.innerHTML = "Submitting university trip request to backend...";
    confirmationMsg.classList.remove("hidden");

    fetch("../backend/submit_university_trip.php", {
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
          confirmationMsg.innerHTML = `
            <strong>Student trip request submitted successfully ✅</strong><br>
            Package: <strong>${packages[pkgKey].name}</strong><br>
            Route: <strong>${city} → ${packages[pkgKey].stops.join(" → ")}</strong><br>
            Vehicle: <strong>${vehicle.name}</strong><br>
            Students: <strong>${students}</strong><br>
            Total Payment: <strong>${perStudent ? money(total) : "Custom price will be confirmed"}</strong><br>
            Status: Pending Admin Confirmation.
          `;
          confirmationMsg.scrollIntoView({behavior:"smooth"});
          form.reset();
          updateCalculator();
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

  document.querySelectorAll(".faq-item button").forEach(btn=>{
    btn.addEventListener("click", function(){ btn.parentElement.classList.toggle("active"); });
  });

  const chatToggleBtn = document.getElementById("chatToggleBtn");
  const closeChatBtn = document.getElementById("closeChatBtn");
  const studentChatbot = document.getElementById("studentChatbot");
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  if (chatToggleBtn && studentChatbot) {
    chatToggleBtn.onclick = () => studentChatbot.style.display = "flex";
  }
  if (closeChatBtn && studentChatbot) {
    closeChatBtn.onclick = () => studentChatbot.style.display = "none";
  }

  function addMessage(msg, type){
    const div = document.createElement("div");
    div.className = type === "user" ? "user-msg" : "bot-msg";
    div.innerHTML = msg;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function reply(q){
    q = q.toLowerCase();
    if(q.includes("cheap") || q.includes("affordable") || q.includes("budget")) return "Cheapest packages: Educational Industrial Trip, Heritage Trip, and Cholistan Desert Camp. Large group ho to Luxury Bus sab se affordable hoti hai.";
    if(q.includes("hunza") || q.includes("northern")) return "Northern Adventure Trip students ke liye best hai: Islamabad → Naran → Chilas → Hunza. 5 days / 4 nights.";
    if(q.includes("female") || q.includes("girls")) return "Female students ke liye separate seating, teacher/coordinator seat aur safe hotel arrangement add kiya ja sakta hai.";
    if(q.includes("vehicle") || q.includes("bus")) return "20 students ke liye Coaster, 10-14 ke liye Hiace, 35+ group ke liye Luxury Bus best hai.";
    if(q.includes("discount")) return "Group discount automatic hai: 20+ students 5%, 30+ students 7%, 50+ students 10%, 80+ students 12%.";
    return "Please city, students count aur trip type batao. Example: Lahore se 40 students Hunza trip.";
  }

  function sendChat(){
    const text = chatInput.value.trim();
    if(!text) return;
    addMessage(text,"user");
    setTimeout(()=>addMessage(reply(text),"bot"),300);
    chatInput.value="";
  }

  if (sendBtn) sendBtn.onclick = sendChat;
  if (chatInput) chatInput.addEventListener("keydown", e=>{ if(e.key === "Enter") sendChat(); });

  window.slideIndex = 0;
  window.changeSlide = function(dir){
    const slides = document.querySelectorAll(".slide");
    slides[window.slideIndex].classList.remove("active");
    window.slideIndex = (window.slideIndex + dir + slides.length) % slides.length;
    slides[window.slideIndex].classList.add("active");
  };
  setInterval(()=>window.changeSlide(1),5000);

  updateTop();
});

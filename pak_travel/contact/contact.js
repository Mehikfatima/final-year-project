document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactPageForm");
  const status = document.getElementById("contactPageStatus");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("contactName").value.trim());
    formData.append("phone", document.getElementById("contactPhone").value.trim());
    formData.append("email", document.getElementById("contactEmail").value.trim());
    formData.append("city", document.getElementById("contactCity").value.trim());
    formData.append("service", document.getElementById("contactService").value);
    formData.append("destination", document.getElementById("contactDestination").value);
    formData.append("travel_date", document.getElementById("travelDate").value);
    formData.append("travelers", document.getElementById("travelers").value);
    formData.append("budget_range", document.getElementById("budgetRange").value);
    formData.append("hotel_type", document.getElementById("hotelType").value);
    formData.append("message", document.getElementById("contactMessage").value.trim());
    formData.append("status", "New Inquiry");
    formData.append("source", "Contact Page");

    status.textContent = "Submitting your inquiry...";

    fetch("../backend/submit_contact_inquiry.php", {
      method: "POST",
      body: formData
    })
      .then(async response => {
        const text = await response.text();
        let data;
        try { data = JSON.parse(text); }
        catch (error) { throw new Error("PHP response JSON nahi hai. Response: " + text); }
        if (!response.ok) throw new Error(data.message || "HTTP Error " + response.status);
        return data;
      })
      .then(data => {
        if (data.success) {
          status.textContent = "Thank you! Your inquiry has been submitted successfully.";
          form.reset();
          setTimeout(function () { status.textContent = ""; }, 5000);
        } else {
          status.textContent = "Backend Error: " + data.message;
          alert("Backend Error: " + data.message);
        }
      })
      .catch(error => {
        status.textContent = "Backend connection error: " + error.message;
        alert("Backend connection error: " + error.message);
        console.error(error);
      });
  });
});

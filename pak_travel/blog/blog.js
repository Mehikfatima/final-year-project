const blogGrid = document.getElementById("blogGrid");
const searchInput = document.getElementById("blogSearch");
const searchBtn = document.getElementById("blogSearchBtn");
const categoryBtns = document.querySelectorAll(".category-btn");
const tagBtns = document.querySelectorAll(".tags button");

const modal = document.getElementById("blogModal");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

let blogs = [];

let currentCategory = "all";

function renderBlogs(items) {
  if (!blogGrid) return;
  blogGrid.innerHTML = "";

  if (!items.length) {
    blogGrid.innerHTML = `<div class="no-results">No blog found. Try another keyword or category.</div>`;
    return;
  }

  items.forEach(blog => {
    const card = document.createElement("article");
    card.className = "blog-card";
    card.innerHTML = `
      <div class="blog-card-image">
        <img src="${blog.image}" alt="${blog.title}">
        <span class="card-category">${blog.category}</span>
      </div>
      <div class="blog-card-content">
        <h3>${blog.title}</h3>
        <p>${blog.excerpt}</p>
        <div class="blog-card-footer">
          <span><i class="fa-regular fa-calendar"></i> ${blog.date} · ${blog.read}</span>
          <button data-id="${blog.id}">Read More</button>
        </div>
      </div>
    `;

    blogGrid.appendChild(card);
  });
}

function filterBlogs() {
  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";

  let filtered = blogs.filter(blog => {
    const matchCategory = currentCategory === "all" || blog.category === currentCategory;
    const matchKeyword =
      !keyword ||
      blog.title.toLowerCase().includes(keyword) ||
      blog.excerpt.toLowerCase().includes(keyword) ||
      (Array.isArray(blog.tags) ? blog.tags : []).some(tag => String(tag).toLowerCase().includes(keyword));

    return matchCategory && matchKeyword;
  });

  renderBlogs(filtered);
}

function openBlog(id) {
  if (!blogs || !blogs.length) {
    console.error("Blogs are not loaded yet.");
    return;
  }

  const numericId = Number(id);

  // Backend database IDs 1,2,3... ho sakti hain.
  // Old static buttons data-id 0,1,2... use karte hain.
  // Is liye pehle database id se find, phir array index se fallback.
  let blog = blogs.find(item => Number(item.id) === numericId);

  if (!blog && blogs[numericId]) {
    blog = blogs[numericId];
  }

  if (!blog) {
    console.error("Blog not found for id/index:", id, blogs);
    return;
  }

  if (!modal || !modalImage || !modalCategory || !modalTitle || !modalBody) {
    console.error("Blog modal HTML elements missing.");
    return;
  }

  modalImage.src = blog.image || "";
  modalImage.alt = blog.title || "Blog Image";
  modalCategory.innerText = (blog.category || "BLOG").toUpperCase();
  modalTitle.innerText = blog.title || "";
  modalBody.innerText = blog.body || blog.excerpt || "";
  modal.style.display = "flex";
}

// Static "Read Full Guide" / "Read More" buttons ke liye event delegation.
// Ye backend blogs load hone ke baad bhi kaam karta hai.
document.addEventListener("click", function(e) {
  const btn = e.target.closest(".read-more-btn, .blog-card-footer button");
  if (!btn) return;

  e.preventDefault();

  const id = btn.dataset.id;
  if (id !== undefined) {
    openBlog(id);
    return;
  }

  // Agar kisi button me data-id missing ho to nearest card ka title use karke blog find karo.
  const card = btn.closest(".blog-card, article");
  const title = card ? card.querySelector("h3")?.innerText?.trim() : "";
  if (title) {
    const blog = blogs.find(item => (item.title || "").trim() === title);
    if (blog) openBlog(blog.id);
  }
});

if (modalClose && modal) {
  modalClose.addEventListener("click", () => modal.style.display = "none");
}

if (modal) {
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
}

categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach(item => item.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    filterBlogs();
  });
});

if (searchBtn) searchBtn.addEventListener("click", filterBlogs);

if (searchInput) {
  searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") filterBlogs();
  });
}

tagBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    searchInput.value = btn.dataset.tag;
    currentCategory = "all";
    categoryBtns.forEach(item => item.classList.remove("active"));
    const allCategoryBtn = document.querySelector('[data-category="all"]');
    if (allCategoryBtn) allCategoryBtn.classList.add("active");
    filterBlogs();
    const blogMain = document.querySelector(".blog-main-section");
    if (blogMain) window.scrollTo({ top: blogMain.offsetTop - 80, behavior: "smooth" });
  });
});

const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const emailInput = document.getElementById("newsletterEmail");
    const status = document.getElementById("newsletterStatus");
    const email = emailInput ? emailInput.value.trim() : "";

    if (!email) {
      status.innerText = "Please enter your email.";
      return;
    }

    const formData = new FormData();
    formData.append("email", email);

    status.innerText = "Subscribing...";

    fetch("../backend/submit_blog_subscriber.php", {
      method: "POST",
      body: formData
    })
      .then(async response => {
        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new Error("submit_blog_subscriber.php JSON nahi de raha. Response: " + text);
        }

        if (!response.ok) {
          throw new Error(data.message || "HTTP Error " + response.status);
        }

        return data;
      })
      .then(data => {
        if (data.success) {
          status.innerText = data.message || "Subscribed successfully!";
          newsletterForm.reset();
          setTimeout(() => {
            status.innerText = "";
          }, 3500);
        } else {
          status.innerText = data.message;
        }
      })
      .catch(error => {
        status.innerText = "Backend Error: " + error.message;
        console.error(error);
      });
  });
}

function loadBlogsFromBackend() {
  fetch("../backend/get_blogs.php?ts=" + Date.now())
    .then(async response => {
      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error("get_blogs.php JSON nahi de raha. Response: " + text);
      }

      if (!response.ok) {
        throw new Error(data.message || "HTTP Error " + response.status);
      }

      return data;
    })
    .then(data => {
      if (data.success) {
        blogs = data.blogs || [];
        renderBlogs(blogs);
      } else {
        if (blogGrid) blogGrid.innerHTML = `<div class="no-results">${data.message}</div>`;
      }
    })
    .catch(error => {
      console.error(error);
      if (blogGrid) {
        blogGrid.innerHTML = `<div class="no-results">Backend Error: ${error.message}</div>`;
      }
    });
}

loadBlogsFromBackend();

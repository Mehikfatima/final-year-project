<?php
include "db.php";

function table_exists($conn, $table) {
    $safe = mysqli_real_escape_string($conn, $table);
    $result = mysqli_query($conn, "SHOW TABLES LIKE '$safe'");
    return $result && mysqli_num_rows($result) > 0;
}

$tour_filter = isset($_GET["tour"]) ? trim($_GET["tour"]) : "";
$search_phone = isset($_GET["phone"]) ? trim($_GET["phone"]) : "";
$search_cnic = isset($_GET["cnic"]) ? trim($_GET["cnic"]) : "";

$bookings = false;
$tours = false;

if (table_exists($conn, "tour_bookings")) {
    $tours = mysqli_query($conn, "SELECT DISTINCT tour_name FROM tour_bookings ORDER BY tour_name ASC");

    $where = [];
    $params = [];
    $types = "";

    if ($tour_filter !== "") {
        $where[] = "tour_name = ?";
        $params[] = $tour_filter;
        $types .= "s";
    }

    if ($search_phone !== "") {
        $where[] = "phone LIKE ?";
        $params[] = "%" . $search_phone . "%";
        $types .= "s";
    }

    if ($search_cnic !== "") {
        $where[] = "cnic LIKE ?";
        $params[] = "%" . $search_cnic . "%";
        $types .= "s";
    }

    $sql = "SELECT * FROM tour_bookings";
    if (!empty($where)) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }
    $sql .= " ORDER BY id DESC";

    $stmt = mysqli_prepare($conn, $sql);
    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }
    mysqli_stmt_execute($stmt);
    $bookings = mysqli_stmt_get_result($stmt);
}

$custom_requests = false;
if (table_exists($conn, "custom_tour_requests")) {
    $custom_requests = mysqli_query($conn, "SELECT * FROM custom_tour_requests ORDER BY id DESC");
}

$registered_users = false;
if (table_exists($conn, "tour_users")) {
    $registered_users = mysqli_query($conn, "SELECT id, name, phone, created_at FROM tour_users ORDER BY id DESC");
}

$contact_inquiries = false;
if (table_exists($conn, "contact_inquiries")) {
    $contact_inquiries = mysqli_query($conn, "SELECT * FROM contact_inquiries ORDER BY id DESC");
}

$university_trips = false;
if (table_exists($conn, "university_trip_bookings")) {
    $university_trips = mysqli_query($conn, "SELECT * FROM university_trip_bookings ORDER BY id DESC");
}

$traveler_reviews = false;
if (table_exists($conn, "traveler_reviews")) {
    $traveler_reviews = mysqli_query($conn, "SELECT * FROM traveler_reviews ORDER BY id DESC");
}

$blog_posts = false;
if (table_exists($conn, "blog_posts")) {
    $blog_posts = mysqli_query($conn, "SELECT * FROM blog_posts ORDER BY id DESC");
}

$blog_subscribers = false;
if (table_exists($conn, "blog_subscribers")) {
    $blog_subscribers = mysqli_query($conn, "SELECT * FROM blog_subscribers ORDER BY id DESC");
}

$total_bookings = 0;
$confirmed_count = 0;
$pending_count = 0;
$cancelled_count = 0;
$total_users = 0;

if (table_exists($conn, "tour_bookings")) {
    $summary = mysqli_query($conn, "SELECT 
        COUNT(*) AS total_bookings,
        SUM(CASE WHEN status='Confirmed' THEN 1 ELSE 0 END) AS confirmed_count,
        SUM(CASE WHEN status='Cancelled' THEN 1 ELSE 0 END) AS cancelled_count,
        SUM(CASE WHEN status='Pending Admin Confirmation' OR status='Pending Payment' THEN 1 ELSE 0 END) AS pending_count
        FROM tour_bookings");
    if ($summary) {
        $s = mysqli_fetch_assoc($summary);
        $total_bookings = $s["total_bookings"] ?? 0;
        $confirmed_count = $s["confirmed_count"] ?? 0;
        $cancelled_count = $s["cancelled_count"] ?? 0;
        $pending_count = $s["pending_count"] ?? 0;
    }
}

if (table_exists($conn, "tour_users")) {
    $u_summary = mysqli_query($conn, "SELECT COUNT(*) AS total_users FROM tour_users");
    if ($u_summary) {
        $u = mysqli_fetch_assoc($u_summary);
        $total_users = $u["total_users"] ?? 0;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pak Travel Admin Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>

:root{
  --bg:#f5f7fb;
  --panel:#ffffff;
  --text:#0f172a;
  --muted:#64748b;
  --line:#e2e8f0;
  --navy:#0f172a;
  --navy2:#111827;
  --orange:#f97316;
  --green:#84cc16;
  --blue:#2563eb;
  --purple:#7c3aed;
  --shadow:0 18px 45px rgba(15,23,42,.08);
  --radius:22px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  font-family:Inter,Segoe UI,Arial,sans-serif;
  background:linear-gradient(135deg,#f8fafc 0%,#eef2ff 100%);
  margin:0;
  color:var(--text);
}
.admin-shell{display:flex;min-height:100vh}
.sidebar{
  width:290px;
  background:linear-gradient(180deg,#0f172a 0%,#111827 55%,#1e293b 100%);
  color:white;
  position:fixed;
  inset:0 auto 0 0;
  padding:22px 18px;
  overflow-y:auto;
  box-shadow:14px 0 40px rgba(15,23,42,.22);
  z-index:20;
}
.brand{
  display:flex;align-items:center;gap:12px;
  padding:12px 10px 24px;
  border-bottom:1px solid rgba(255,255,255,.12);
  margin-bottom:16px;
}
.brand-icon{
  width:46px;height:46px;border-radius:16px;
  display:grid;place-items:center;
  background:linear-gradient(135deg,var(--orange),#facc15);
  box-shadow:0 12px 28px rgba(249,115,22,.35);
}
.brand h1{font-size:18px;line-height:1.2;margin:0}
.brand span{font-size:12px;color:#cbd5e1}
.nav-title{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;margin:16px 12px 8px}
.side-nav{display:flex;flex-direction:column;gap:7px}
.side-nav a{
  color:#dbeafe;text-decoration:none;
  padding:12px 13px;
  border-radius:14px;
  display:flex;align-items:center;gap:11px;
  font-weight:750;font-size:14px;
  transition:.2s ease;
}
.side-nav a:hover,.side-nav a.active{
  background:rgba(255,255,255,.12);
  color:white;
  transform:translateX(4px);
}
.side-nav i{width:18px;text-align:center;color:#fbbf24}
.sidebar-footer{
  margin-top:20px;padding:14px;border-radius:18px;
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.10);
  color:#cbd5e1;font-size:13px;line-height:1.5;
}
.main{
  margin-left:290px;
  width:calc(100% - 290px);
  min-height:100vh;
}
.topbar{
  position:sticky;top:0;z-index:12;
  backdrop-filter:blur(18px);
  background:rgba(248,250,252,.82);
  border-bottom:1px solid rgba(226,232,240,.75);
  padding:18px 28px;
  display:flex;align-items:center;justify-content:space-between;gap:18px;
}
.top-left h2{margin:0;font-size:24px;color:#0f172a}
.top-left p{margin:5px 0 0;color:var(--muted);font-size:14px}
.top-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.searchbox{
  display:flex;align-items:center;gap:8px;
  background:white;border:1px solid var(--line);
  border-radius:999px;padding:9px 13px;
  box-shadow:0 6px 18px rgba(15,23,42,.05);
}
.searchbox input{
  border:0;outline:0;padding:0;min-width:210px;background:transparent;
}
.theme-btn,.menu-toggle{
  border:0;border-radius:14px;padding:11px 14px;
  background:#0f172a;color:white;cursor:pointer;
  box-shadow:0 10px 25px rgba(15,23,42,.18);
}
.admin-profile{
  display:flex;align-items:center;gap:10px;
  background:white;border:1px solid var(--line);
  padding:8px 12px;border-radius:999px;
  box-shadow:0 8px 20px rgba(15,23,42,.06);
  font-weight:800;
}
.avatar{
  width:34px;height:34px;border-radius:50%;
  display:grid;place-items:center;background:linear-gradient(135deg,#22c55e,#84cc16);color:white;
}
.content{padding:28px}
.notice{background:#dcfce7;color:#166534;padding:12px 16px;border-radius:16px;margin-bottom:18px;font-weight:800}
.summary{
  display:grid;
  grid-template-columns:repeat(5,minmax(150px,1fr));
  gap:16px;
  margin-bottom:22px;
}
.summary-box{
  position:relative;
  background:rgba(255,255,255,.9);
  border:1px solid rgba(226,232,240,.9);
  border-radius:var(--radius);
  padding:18px;
  box-shadow:var(--shadow);
  overflow:hidden;
}
.summary-box::after{
  content:"";position:absolute;right:-25px;top:-25px;width:90px;height:90px;
  border-radius:50%;background:rgba(249,115,22,.12);
}
.summary-box span{display:block;color:var(--muted);font-weight:800;font-size:13px}
.summary-box strong{display:block;margin-top:8px;font-size:30px;color:#0f172a}
.summary-box small{display:block;margin-top:8px;color:#94a3b8}
.card{
  background:rgba(255,255,255,.96);
  border:1px solid rgba(226,232,240,.9);
  border-radius:26px;
  padding:22px;
  box-shadow:var(--shadow);
  margin-bottom:24px;
  scroll-margin-top:96px;
}
.card h2{
  margin:0 0 18px;
  color:#0f172a;
  display:flex;align-items:center;gap:10px;
  font-size:22px;
}
.card h2::before{
  content:"";width:10px;height:28px;border-radius:999px;
  background:linear-gradient(180deg,var(--orange),#facc15);
}
.filter{
  margin-bottom:18px;
  display:flex;
  gap:10px;
  align-items:center;
  flex-wrap:wrap;
  background:#f8fafc;
  border:1px solid var(--line);
  border-radius:18px;
  padding:14px;
}
select,input,button{
  padding:10px 12px;
  border:1px solid #d1d5db;
  border-radius:12px;
  outline:none;
}
input:focus,select:focus{border-color:var(--orange);box-shadow:0 0 0 4px rgba(249,115,22,.12)}
button{
  background:linear-gradient(135deg,var(--orange),#fb923c);
  color:white;
  font-weight:800;
  cursor:pointer;
  border:0;
}
.table-wrap{
  overflow:auto;
  border:1px solid var(--line);
  border-radius:18px;
  background:white;
}
table{border-collapse:separate;border-spacing:0;width:100%;min-width:1600px}
.users-table{min-width:720px}.custom-table{min-width:1100px}.contact-table{min-width:1400px}.university-table{min-width:1600px}.reviews-table{min-width:1000px}.blog-table{min-width:1400px}.subscriber-table{min-width:700px}
th,td{
  border-bottom:1px solid #e5e7eb;
  padding:12px 11px;
  text-align:left;
  font-size:13px;
  vertical-align:top;
}
th{
  background:#0f172a;
  color:white;
  white-space:nowrap;
  position:sticky;top:0;z-index:1;
}
tr:nth-child(even){background:#f8fafc}
tr:hover{background:#fff7ed}
.badge{
  display:inline-block;
  padding:6px 10px;
  border-radius:999px;
  background:#fff7ed;
  color:#c2410c;
  font-weight:900;
  white-space:nowrap;
}
.user-badge{background:#e0f2fe;color:#075985}
.empty{
  background:#fff7ed;
  color:#9a3412;
  padding:14px 16px;
  border-radius:16px;
  font-weight:800;
  border:1px solid #fed7aa;
}
.screenshot-link{color:#2563eb;font-weight:900;background:none;border:0;padding:0;cursor:pointer;text-decoration:underline}
pre{white-space:pre-wrap;max-width:350px;max-height:180px;overflow:auto;margin:0}
.status-pill{padding:7px 11px;border-radius:999px;font-weight:900;display:inline-block;margin-bottom:8px}
.status-pending{background:#fef3c7;color:#92400e}.status-confirmed{background:#dcfce7;color:#166534}.status-cancelled{background:#fee2e2;color:#991b1b}.status-completed{background:#dbeafe;color:#1d4ed8}
.status-form{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.status-form select{min-width:180px}
.image-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:99999;align-items:center;justify-content:center;padding:20px}
.image-modal.active{display:flex}
.image-modal-box{position:relative;max-width:92vw;max-height:88vh;background:#fff;border-radius:22px;padding:16px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.image-modal-box img{max-width:86vw;max-height:78vh;object-fit:contain;display:block;border-radius:14px}
.image-close{position:absolute;top:-14px;right:-14px;width:42px;height:42px;border-radius:50%;border:0;background:#ef4444;color:white;font-size:26px;line-height:1;cursor:pointer;display:grid;place-items:center}
.image-title{margin:0 0 10px;color:#1e293b;font-weight:900}
body.dark{
  --bg:#020617;
  --panel:#0f172a;
  --text:#e5e7eb;
  --muted:#94a3b8;
  --line:#1e293b;
  background:#020617;
  color:#e5e7eb;
}
body.dark .topbar{background:rgba(2,6,23,.82);border-bottom-color:#1e293b}
body.dark .top-left h2, body.dark .card h2, body.dark .summary-box strong{color:#f8fafc}
body.dark .card, body.dark .summary-box, body.dark .searchbox, body.dark .admin-profile{background:#0f172a;border-color:#1e293b}
body.dark .filter, body.dark .table-wrap{background:#111827;border-color:#1e293b}
body.dark td{border-color:#1e293b}
body.dark tr:nth-child(even){background:#111827}
body.dark tr:hover{background:#1e293b}
body.dark input, body.dark select{background:#020617;color:#e5e7eb;border-color:#334155}

.section-tools{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
  margin:-4px 0 16px;
}
.section-search{
  display:flex;
  align-items:center;
  gap:8px;
  background:#f8fafc;
  border:1px solid var(--line);
  border-radius:999px;
  padding:9px 13px;
  min-width:280px;
}
.section-search i{color:#94a3b8}
.section-search input{
  border:0;
  outline:0;
  padding:0;
  background:transparent;
  width:230px;
}
.section-count{
  color:var(--muted);
  font-weight:800;
  font-size:13px;
}
.pickup-col,
td.pickup-cell{
  min-width:320px !important;
  max-width:420px;
  white-space:normal;
  line-height:1.55;
}
body.dark .section-search{background:#111827;border-color:#1e293b}
body.dark .section-search input{color:#e5e7eb}

@media(max-width:1200px){.summary{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){
  .sidebar{transform:translateX(-100%);transition:.25s ease}
  body.sidebar-open .sidebar{transform:translateX(0)}
  .main{margin-left:0;width:100%}
  .menu-toggle{display:inline-flex}
  .topbar{align-items:flex-start;flex-direction:column}
  .searchbox input{min-width:160px}
}
@media(min-width:901px){.menu-toggle{display:none}}
@media(max-width:650px){.summary{grid-template-columns:1fr}.content{padding:18px}.topbar{padding:16px}.sidebar{width:270px}}



/* ===== Fully responsive mobile menu + dashboard fixes ===== */
.sidebar-close{
  display:none;
  position:absolute;
  top:14px;
  right:14px;
  width:42px;
  height:42px;
  border-radius:50%;
  background:rgba(255,255,255,.14);
  color:#fff;
  border:1px solid rgba(255,255,255,.22);
  font-size:20px;
  z-index:1002;
  align-items:center;
  justify-content:center;
  box-shadow:none;
}
.sidebar-backdrop{
  display:none;
  position:fixed;
  inset:0;
  background:rgba(2,6,23,.58);
  z-index:998;
}
body.sidebar-open{overflow:hidden}
body.sidebar-open .sidebar-backdrop{display:block}

.topbar,.top-left,.top-actions,.searchbox{min-width:0}
.table-wrap{-webkit-overflow-scrolling:touch}
.table-wrap::after{
  content:"Swipe left/right to view full table";
  display:none;
  padding:9px 12px;
  color:#64748b;
  font-size:12px;
  font-weight:800;
  background:#f8fafc;
  border-top:1px solid var(--line);
}
body.dark .table-wrap::after{background:#111827;color:#94a3b8}

@media(max-width:900px){
  .sidebar{
    width:min(86vw,320px);
    transform:translateX(-110%);
    transition:transform .28s ease;
    z-index:1000;
    padding-top:62px;
  }
  body.sidebar-open .sidebar{transform:translateX(0)}
  .sidebar-close{display:flex}
  .main{margin-left:0;width:100%}
  .menu-toggle{
    display:inline-flex !important;
    align-items:center;
    justify-content:center;
    width:44px;
    height:44px;
    padding:0;
    flex:0 0 44px;
    position:relative;
    z-index:50;
  }
  .topbar{
    padding:14px 16px;
    flex-direction:row;
    align-items:center;
    justify-content:flex-start;
    flex-wrap:wrap;
    gap:10px;
  }
  .top-left{flex:1 1 calc(100% - 60px)}
  .top-left h2{font-size:20px}
  .top-left p{font-size:12px}
  .top-actions{width:100%;display:grid;grid-template-columns:1fr auto auto;gap:8px}
  .searchbox{width:100%;padding:9px 11px}
  .searchbox input{min-width:0;width:100%}
  .theme-btn{width:44px;height:44px;padding:0;display:inline-flex;align-items:center;justify-content:center}
  .admin-profile{width:44px;height:44px;padding:0;justify-content:center}
  .admin-profile span{display:none}
  .content{padding:16px}
  .summary{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .summary-box{padding:13px;border-radius:17px}
  .summary-box span{font-size:11px;line-height:1.25}
  .summary-box strong{font-size:22px;margin-top:5px}
  .summary-box small{font-size:11px;margin-top:5px;line-height:1.25}
  .card{padding:15px;border-radius:20px;margin-bottom:16px;scroll-margin-top:120px}
  .card h2{font-size:18px;margin-bottom:12px}
  .filter{display:grid;grid-template-columns:1fr;gap:8px;padding:12px;border-radius:16px}
  .filter select,.filter input,.filter button,.filter a{width:100%}
  .section-tools{align-items:stretch;gap:8px;margin-bottom:12px}
  .section-search{width:100%;min-width:0;border-radius:14px}
  .section-search input{width:100%;min-width:0}
  .section-count{width:100%}
  .table-wrap{border-radius:14px;overflow-x:auto}
  .table-wrap::after{display:block}
  table{min-width:980px}
  .users-table,.subscriber-table{min-width:620px}
  .custom-table,.reviews-table{min-width:900px}
  .contact-table,.blog-table{min-width:1050px}
  .university-table{min-width:1200px}
  th,td{padding:10px 9px;font-size:12px}
  .status-form{display:grid;grid-template-columns:1fr;gap:7px;min-width:150px}
  .status-form select{min-width:0;width:100%}
  .status-form button{width:100%}
  pre{max-width:220px;max-height:130px}
  .pickup-col,td.pickup-cell{min-width:220px !important;max-width:260px}
  .image-modal{padding:12px}
  .image-modal-box{max-width:96vw;padding:12px}
  .image-modal-box img{max-width:90vw;max-height:72vh}
}

@media(max-width:520px){
  .summary{grid-template-columns:1fr 1fr}
  .summary-box::after{width:60px;height:60px;right:-20px;top:-20px}
  .content{padding:12px}
  .topbar{padding:12px}
  .top-left h2{font-size:18px}
  .card{padding:12px}
}
@media(max-width:380px){
  .summary{grid-template-columns:1fr}
}
@media(min-width:901px){
  .menu-toggle{display:none !important}
  .sidebar-backdrop{display:none !important}
  body{overflow:auto}
}

</style>
</head>
<body>
<div class="sidebar-backdrop" id="sidebarBackdrop"></div>
<div class="admin-shell">
  <aside class="sidebar" id="sidebar">
    <button class="sidebar-close" id="sidebarClose" type="button" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
    <div class="brand">
      <div class="brand-icon"><i class="fa-solid fa-mountain-sun"></i></div>
      <div>
        <h1>Pak Travel</h1>
        <span>Admin Control Center</span>
      </div>
    </div>
    <div class="nav-title">Main Menu</div>
    <nav class="side-nav">
      <a href="#tour-bookings"><i class="fa-solid fa-ticket"></i><span>Tour Bookings</span></a>
<a href="#custom-requests"><i class="fa-solid fa-route"></i><span>Custom Tours</span></a>
<a href="#registered-users"><i class="fa-solid fa-users"></i><span>Users</span></a>
<a href="#contact-inquiries"><i class="fa-solid fa-envelope"></i><span>Contact</span></a>
<a href="#university-trips"><i class="fa-solid fa-graduation-cap"></i><span>University Trips</span></a>
<a href="#traveler-reviews"><i class="fa-solid fa-star"></i><span>Reviews</span></a>
<a href="#blog-posts"><i class="fa-solid fa-newspaper"></i><span>Blog Posts</span></a>
<a href="#blog-subscribers"><i class="fa-solid fa-bell"></i><span>Subscribers</span></a>
    </nav>
    <div class="sidebar-footer">
      <strong>Modern Dashboard</strong><br>
      Manage bookings, users, reviews, blogs, and university trips in one place.
    </div>
  </aside>

  <main class="main">
    <header class="topbar">
      <button class="menu-toggle" id="menuToggle" type="button"><i class="fa-solid fa-bars"></i></button>
      <div class="top-left">
        <h2>Dashboard Overview</h2>
        <p>Real-time admin panel for Pak Travel Spark.</p>
      </div>
      <div class="top-actions">
        <div class="searchbox">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" id="dashboardSearch" placeholder="Search table text...">
        </div>
        <button class="theme-btn" id="themeToggle" type="button"><i class="fa-solid fa-moon"></i></button>
        <div class="admin-profile">
          <div class="avatar">A</div>
          <span>Admin</span>
        </div>
      </div>
    </header>

    <section class="content">
      <?php if(isset($_GET["updated"])) { ?>
        <div class="notice">Booking status successfully updated ✅</div>
      <?php } ?>

      <div class="summary">
        <div class="summary-box"><span>Total Bookings</span><strong><?php echo number_format((float)$total_bookings); ?></strong><small>All submitted tour bookings</small></div>
        <div class="summary-box"><span>Confirmed</span><strong><?php echo number_format((float)$confirmed_count); ?></strong><small>Approved travel plans</small></div>
        <div class="summary-box"><span>Pending</span><strong><?php echo number_format((float)$pending_count); ?></strong><small>Needs admin review</small></div>
        <div class="summary-box"><span>Cancelled</span><strong><?php echo number_format((float)$cancelled_count); ?></strong><small>Cancelled requests</small></div>
        <div class="summary-box"><span>Registered Users</span><strong><?php echo number_format((float)$total_users); ?></strong><small>Login/register accounts</small></div>
      </div>

<div class="card" id="tour-bookings">
    <h2>All Tour Bookings</h2>
    <div class="section-tools">
      <div class="section-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" class="section-search-input" data-section="tour-bookings" placeholder="Search tour bookings by name, phone, CNIC, city, status...">
      </div>
      <span class="section-count" data-count-for="tour-bookings"></span>
    </div>

    <form class="filter" method="GET">
      <label><strong>Filter by Tour:</strong></label>
      <select name="tour">
        <option value="">All Tours</option>
        <?php if ($tours) { while($t = mysqli_fetch_assoc($tours)) { ?>
          <option value="<?php echo htmlspecialchars($t["tour_name"]); ?>" <?php if($tour_filter === $t["tour_name"]) echo "selected"; ?>>
            <?php echo htmlspecialchars($t["tour_name"]); ?>
          </option>
        <?php }} ?>
      </select>

      <label><strong>Search Phone:</strong></label>
      <input type="text" name="phone" placeholder="Enter phone" value="<?php echo htmlspecialchars($search_phone); ?>">

      <label><strong>Search CNIC:</strong></label>
      <input type="text" name="cnic" placeholder="Enter CNIC" value="<?php echo htmlspecialchars($search_cnic); ?>">

      <button type="submit">Search / Filter</button>
      <a href="admin_dashboard.php" style="font-weight:bold;color:#e05528">Reset</a>
    </form>

    <?php if ($bookings && mysqli_num_rows($bookings) > 0) { ?>
      <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Tour</th><th>Name</th><th>Phone</th><th>CNIC</th><th>Travel Date</th>
            <th>Guests</th><th>Rooms</th><th>From</th><th>To</th><th>Route</th>
            <th>Hotel/Stay</th><th>Vehicle</th><th class="pickup-col">Pickup</th><th>Per Person</th>
            <th>Hotel Price</th><th>Base Payment</th><th>Hotel Payment</th><th>Total</th>
            <th>Payment Type</th><th>Screenshot</th><th>Travelers</th><th>Note</th><th>Status / Update</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
        <?php while($row = mysqli_fetch_assoc($bookings)) { 
          $status = $row["status"];
          $status_class = "status-pending";
          if ($status === "Confirmed") $status_class = "status-confirmed";
          if ($status === "Cancelled") $status_class = "status-cancelled";
          if ($status === "Completed") $status_class = "status-completed";
        ?>
          <tr>
            <td><?php echo htmlspecialchars($row["id"]); ?></td>
            <td><span class="badge"><?php echo htmlspecialchars($row["tour_name"]); ?></span></td>
            <td><?php echo htmlspecialchars($row["customer_name"]); ?></td>
            <td><?php echo htmlspecialchars($row["phone"]); ?></td>
            <td><?php echo htmlspecialchars($row["cnic"]); ?></td>
            <td><?php echo htmlspecialchars($row["travel_date"]); ?></td>
            <td><?php echo htmlspecialchars($row["guests"]); ?></td>
            <td><?php echo htmlspecialchars($row["room_count"]); ?></td>
            <td><?php echo htmlspecialchars($row["from_city"]); ?></td>
            <td><?php echo htmlspecialchars($row["to_destination"]); ?></td>
            <td><?php echo htmlspecialchars($row["route_text"]); ?></td>
            <td><?php echo htmlspecialchars($row["hotel_name"]); ?></td>
            <td><?php echo htmlspecialchars($row["vehicle"]); ?></td>
            <td class="pickup-cell"><?php echo htmlspecialchars($row["pickup_point"] . " " . $row["pickup_address"]); ?></td>
            <td>Rs. <?php echo number_format((float)$row["per_person_price"]); ?></td>
            <td>Rs. <?php echo number_format((float)$row["hotel_price"]); ?></td>
            <td>Rs. <?php echo number_format((float)$row["base_payment"]); ?></td>
            <td>Rs. <?php echo number_format((float)$row["hotel_payment"]); ?></td>
            <td><strong>Rs. <?php echo number_format((float)$row["total_payment"]); ?></strong></td>
            <td><?php echo htmlspecialchars($row["payment_type"]); ?></td>
            <td>
              <?php if($row["payment_screenshot"] && $row["payment_screenshot"] !== "Not uploaded") { ?>
                <button type="button" class="screenshot-link" data-img="<?php echo htmlspecialchars($row["payment_screenshot"]); ?>">View</button>
              <?php } else { echo "Not uploaded"; } ?>
            </td>
            <td><pre><?php echo htmlspecialchars($row["travelers_json"]); ?></pre></td>
            <td><?php echo htmlspecialchars($row["booking_note"]); ?></td>
            <td>
              <span class="status-pill <?php echo $status_class; ?>"><?php echo htmlspecialchars($status); ?></span>
              <form class="status-form" method="POST" action="update_booking_status.php">
                <input type="hidden" name="booking_id" value="<?php echo htmlspecialchars($row["id"]); ?>">
                <select name="status">
                  <?php 
                    $statuses = ["Pending Admin Confirmation", "Pending Payment", "Confirmed", "Cancelled", "Completed"];
                    foreach($statuses as $st) {
                      $sel = $status === $st ? "selected" : "";
                      echo "<option value='".htmlspecialchars($st)."' $sel>".htmlspecialchars($st)."</option>";
                    }
                  ?>
                </select>
                <button type="submit">Update</button>
              </form>
            </td>
            <td><?php echo htmlspecialchars($row["created_at"]); ?></td>
          </tr>
        <?php } ?>
        </tbody>
      </table>
      </div>
    <?php } else { ?>
      <div class="empty">No booking found for this search.</div>
    <?php } ?>
  </div>

  <div class="card" id="custom-requests">
    <h2>Custom Tour Requests</h2>
    <div class="section-tools">
      <div class="section-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" class="section-search-input" data-section="custom-requests" placeholder="Search custom requests by name, phone, city, destination...">
      </div>
      <span class="section-count" data-count-for="custom-requests"></span>
    </div>
    <?php if ($custom_requests && mysqli_num_rows($custom_requests) > 0) { ?>
      <div class="table-wrap">
      <table class="custom-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Phone</th><th>From City</th><th>Destination</th>
            <th>Budget</th><th>Travelers</th><th>Duration</th><th>Vehicle</th><th>Hotel</th><th>Food</th><th>Note</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
        <?php while($row = mysqli_fetch_assoc($custom_requests)) { ?>
          <tr>
            <td><?php echo htmlspecialchars($row["id"]); ?></td>
            <td><?php echo htmlspecialchars($row["name"]); ?></td>
            <td><?php echo htmlspecialchars($row["phone"]); ?></td>
            <td><?php echo htmlspecialchars($row["from_city"]); ?></td>
            <td><?php echo htmlspecialchars($row["destination"]); ?></td>
            <td><?php echo htmlspecialchars($row["budget"]); ?></td>
            <td><?php echo htmlspecialchars($row["travelers"]); ?></td>
            <td><?php echo htmlspecialchars($row["duration"]); ?></td>
            <td><?php echo htmlspecialchars($row["vehicle"]); ?></td>
            <td><?php echo htmlspecialchars($row["hotel"]); ?></td>
            <td><?php echo htmlspecialchars($row["food"]); ?></td>
            <td><?php echo htmlspecialchars($row["note"]); ?></td>
            <td><?php echo htmlspecialchars($row["created_at"]); ?></td>
          </tr>
        <?php } ?>
        </tbody>
      </table>
      </div>
    <?php } else { ?>
      <div class="empty">Abhi koi custom tour request submit nahi hui.</div>
    <?php } ?>
  </div>

  <div class="card" id="registered-users">
    <h2>Registered Users</h2>
    <div class="section-tools">
      <div class="section-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" class="section-search-input" data-section="registered-users" placeholder="Search users by name, phone, date...">
      </div>
      <span class="section-count" data-count-for="registered-users"></span>
    </div>
    <?php if ($registered_users && mysqli_num_rows($registered_users) > 0) { ?>
      <div class="table-wrap">
      <table class="users-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Registered Date</th>
          </tr>
        </thead>
        <tbody>
        <?php while($user = mysqli_fetch_assoc($registered_users)) { ?>
          <tr>
            <td><span class="badge user-badge"><?php echo htmlspecialchars($user["id"]); ?></span></td>
            <td><?php echo htmlspecialchars($user["name"]); ?></td>
            <td><?php echo htmlspecialchars($user["phone"]); ?></td>
            <td><?php echo htmlspecialchars($user["created_at"]); ?></td>
          </tr>
        <?php } ?>
        </tbody>
      </table>
      </div>
    <?php } else { ?>
      <div class="empty">Abhi koi registered user nahi hai. Pehle login/register backend ka database.sql run karein.</div>
    <?php } ?>
  </div>

  <div class="card" id="contact-inquiries">
    <h2>Contact Inquiries</h2>
    <div class="section-tools">
      <div class="section-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" class="section-search-input" data-section="contact-inquiries" placeholder="Search contact inquiries by name, phone, email, service...">
      </div>
      <span class="section-count" data-count-for="contact-inquiries"></span>
    </div>
    <?php if ($contact_inquiries && mysqli_num_rows($contact_inquiries) > 0) { ?>
      <div class="table-wrap">
      <table class="contact-table">
        <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>City</th><th>Service</th><th>Destination</th><th>Travel Date</th><th>Travelers</th><th>Budget</th><th>Hotel Type</th><th>Message</th><th>Status</th><th>Source</th><th>Created</th></tr></thead>
        <tbody>
        <?php while($inq = mysqli_fetch_assoc($contact_inquiries)) { ?>
          <tr>
            <td><?php echo htmlspecialchars($inq["id"]); ?></td>
            <td><?php echo htmlspecialchars($inq["name"]); ?></td>
            <td><?php echo htmlspecialchars($inq["phone"]); ?></td>
            <td><?php echo htmlspecialchars($inq["email"]); ?></td>
            <td><?php echo htmlspecialchars($inq["city"]); ?></td>
            <td><?php echo htmlspecialchars($inq["service"]); ?></td>
            <td><?php echo htmlspecialchars($inq["destination"]); ?></td>
            <td><?php echo htmlspecialchars($inq["travel_date"]); ?></td>
            <td><?php echo htmlspecialchars($inq["travelers"]); ?></td>
            <td><?php echo htmlspecialchars($inq["budget_range"]); ?></td>
            <td><?php echo htmlspecialchars($inq["hotel_type"]); ?></td>
            <td><?php echo htmlspecialchars($inq["message"]); ?></td>
            <td><span class="badge user-badge"><?php echo htmlspecialchars($inq["status"]); ?></span></td>
            <td><?php echo htmlspecialchars($inq["source"]); ?></td>
            <td><?php echo htmlspecialchars($inq["created_at"]); ?></td>
          </tr>
        <?php } ?>
        </tbody>
      </table></div>
    <?php } else { ?>
      <div class="empty">Abhi koi contact inquiry submit nahi hui.</div>
    <?php } ?>
  </div>

  <div class="card" id="university-trips">
    <h2>University Trip Requests</h2>
    <div class="section-tools">
      <div class="section-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" class="section-search-input" data-section="university-trips" placeholder="Search university trips by leader, phone, university, package...">
      </div>
      <span class="section-count" data-count-for="university-trips"></span>
    </div>
    <?php if ($university_trips && mysqli_num_rows($university_trips) > 0) { ?>
      <div class="table-wrap">
      <table class="university-table">
        <thead>
          <tr>
            <th>ID</th><th>Leader</th><th>Phone</th><th>University</th><th>Department</th>
            <th>Trip Date</th><th>Students</th><th>From City</th><th>Package</th><th>Duration</th>
            <th>Destination</th><th>Vehicle</th><th>Capacity</th><th>Stay</th><th>Per Student</th>
            <th>Discount</th><th>Total</th>

            <th class="pickup-col">Pickup</th>

            <th>Note</th><th>Payment</th><th>Screenshot</th><th>Status</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
        <?php while($uni = mysqli_fetch_assoc($university_trips)) { ?>
          <tr>
            <td><?php echo htmlspecialchars($uni["id"]); ?></td>
            <td><?php echo htmlspecialchars($uni["leader_name"]); ?></td>
            <td><?php echo htmlspecialchars($uni["phone"]); ?></td>
            <td><?php echo htmlspecialchars($uni["university_name"]); ?></td>
            <td><?php echo htmlspecialchars($uni["department_name"]); ?></td>
            <td><?php echo htmlspecialchars($uni["trip_date"]); ?></td>
            <td><?php echo htmlspecialchars($uni["student_count"]); ?></td>
            <td><?php echo htmlspecialchars($uni["from_city"]); ?></td>
            <td><span class="badge"><?php echo htmlspecialchars($uni["trip_package"]); ?></span></td>
            <td><?php echo htmlspecialchars($uni["duration"]); ?></td>
            <td><?php echo htmlspecialchars($uni["destination"]); ?></td>
            <td><?php echo htmlspecialchars($uni["vehicle"]); ?></td>
            <td><?php echo htmlspecialchars($uni["vehicle_capacity"]); ?></td>
            <td><?php echo htmlspecialchars($uni["stay_type"]); ?></td>
            <td>Rs. <?php echo number_format((float)$uni["per_student_price"]); ?></td>
            <td>Rs. <?php echo number_format((float)$uni["discount"]); ?></td>
            <td><strong>Rs. <?php echo number_format((float)$uni["total_payment"]); ?></strong></td>
             <td class="pickup-cell"><?php echo htmlspecialchars($uni["pickup_point"] . " " . $uni["pickup_address"]); ?></td>
            <td><?php echo htmlspecialchars($uni["special_note"]); ?></td>
            <td><?php echo htmlspecialchars($uni["payment_type"]); ?></td>
            <td>
              <?php if($uni["payment_screenshot"] && $uni["payment_screenshot"] !== "Not uploaded") { ?>
                <button type="button" class="screenshot-link" data-img="<?php echo htmlspecialchars($uni["payment_screenshot"]); ?>">View</button>
              <?php } else { echo "Not uploaded"; } ?>
            </td>
            <td><span class="badge user-badge"><?php echo htmlspecialchars($uni["status"]); ?></span></td>
            <td><?php echo htmlspecialchars($uni["created_at"]); ?></td>
          </tr>
        <?php } ?>
        </tbody>
      </table>
      </div>
    <?php } else { ?>
      <div class="empty">Abhi koi university trip request submit nahi hui.</div>
    <?php } ?>
  </div>


  <div class="card" id="traveler-reviews">
    <h2>Traveler Reviews</h2>
    <div class="section-tools">
      <div class="section-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" class="section-search-input" data-section="traveler-reviews" placeholder="Search reviews by name, tour, rating...">
      </div>
      <span class="section-count" data-count-for="traveler-reviews"></span>
    </div>
    <?php if ($traveler_reviews && mysqli_num_rows($traveler_reviews) > 0) { ?>
      <div class="table-wrap">
      <table class="reviews-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Tour</th>
            <th>Review</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
        <?php while($rev = mysqli_fetch_assoc($traveler_reviews)) { ?>
          <tr>
            <td><?php echo htmlspecialchars($rev["id"]); ?></td>
            <td><?php echo htmlspecialchars($rev["name"]); ?></td>
            <td><span class="badge"><?php echo htmlspecialchars($rev["tour"]); ?></span></td>
            <td><?php echo htmlspecialchars($rev["review_text"]); ?></td>
            <td><?php echo str_repeat("★", (int)$rev["rating"]) . str_repeat("☆", 5 - (int)$rev["rating"]); ?></td>
            <td><span class="badge user-badge"><?php echo htmlspecialchars($rev["status"]); ?></span></td>
            <td><?php echo htmlspecialchars($rev["created_at"]); ?></td>
          </tr>
        <?php } ?>
        </tbody>
      </table>
      </div>
    <?php } else { ?>
      <div class="empty">Abhi koi traveler review submit nahi hua.</div>
    <?php } ?>
  </div>


  <div class="card" id="blog-posts">
    <h2>Blog Posts</h2>
    <div class="section-tools">
      <div class="section-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" class="section-search-input" data-section="blog-posts" placeholder="Search blog posts by title, category, tags...">
      </div>
      <span class="section-count" data-count-for="blog-posts"></span>
    </div>
    <?php if ($blog_posts && mysqli_num_rows($blog_posts) > 0) { ?>
      <div class="table-wrap">
      <table class="blog-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Read Time</th>
            <th>Excerpt</th>
            <th>Tags</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
        <?php while($blog = mysqli_fetch_assoc($blog_posts)) { ?>
          <tr>
            <td><?php echo htmlspecialchars($blog["id"]); ?></td>
            <td><?php echo htmlspecialchars($blog["title"]); ?></td>
            <td><span class="badge"><?php echo htmlspecialchars($blog["category"]); ?></span></td>
            <td><?php echo htmlspecialchars($blog["publish_date"]); ?></td>
            <td><?php echo htmlspecialchars($blog["read_time"]); ?></td>
            <td><?php echo htmlspecialchars($blog["excerpt"]); ?></td>
            <td><?php echo htmlspecialchars($blog["tags"]); ?></td>
            <td><span class="badge user-badge"><?php echo htmlspecialchars($blog["status"]); ?></span></td>
            <td><?php echo htmlspecialchars($blog["created_at"]); ?></td>
          </tr>
        <?php } ?>
        </tbody>
      </table>
      </div>
    <?php } else { ?>
      <div class="empty">Abhi koi blog post database me nahi hai. Pehle blog_database.sql run karein.</div>
    <?php } ?>
  </div>

  <div class="card" id="blog-subscribers">
    <h2>Blog Newsletter Subscribers</h2>
    <div class="section-tools">
      <div class="section-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" class="section-search-input" data-section="blog-subscribers" placeholder="Search subscribers by email or date...">
      </div>
      <span class="section-count" data-count-for="blog-subscribers"></span>
    </div>
    <?php if ($blog_subscribers && mysqli_num_rows($blog_subscribers) > 0) { ?>
      <div class="table-wrap">
      <table class="subscriber-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Subscribed Date</th>
          </tr>
        </thead>
        <tbody>
        <?php while($sub = mysqli_fetch_assoc($blog_subscribers)) { ?>
          <tr>
            <td><span class="badge user-badge"><?php echo htmlspecialchars($sub["id"]); ?></span></td>
            <td><?php echo htmlspecialchars($sub["email"]); ?></td>
            <td><?php echo htmlspecialchars($sub["created_at"]); ?></td>
          </tr>
        <?php } ?>
        </tbody>
      </table>
      </div>
    <?php } else { ?>
      <div class="empty">Abhi koi blog newsletter subscriber nahi hai.</div>
    <?php } ?>
  </div>


    </section>
  </main>
</div>

<div class="image-modal" id="imageModal">
  <div class="image-modal-box">
    <button class="image-close" id="imageClose" type="button">&times;</button>
    <p class="image-title">Payment Screenshot</p>
    <img src="" alt="Payment Screenshot" id="modalImage">
  </div>
</div>

<script>
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const imageClose = document.getElementById("imageClose");
const menuToggle = document.getElementById("menuToggle");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const themeToggle = document.getElementById("themeToggle");
const dashboardSearch = document.getElementById("dashboardSearch");

document.querySelectorAll(".screenshot-link").forEach(btn => {
  btn.addEventListener("click", function () {
    modalImage.src = this.dataset.img;
    imageModal.classList.add("active");
  });
});

function closeImageModal() {
  imageModal.classList.remove("active");
  modalImage.src = "";
}

if (imageClose) imageClose.addEventListener("click", closeImageModal);
if (imageModal) imageModal.addEventListener("click", function(e) {
  if (e.target === imageModal) closeImageModal();
});

function openAdminSidebar() {
  document.body.classList.add("sidebar-open");
}
function closeAdminSidebar() {
  document.body.classList.remove("sidebar-open");
}
if (menuToggle) {
  menuToggle.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.toggle("sidebar-open");
  });
}
if (sidebarClose) {
  sidebarClose.addEventListener("click", function(e) {
    e.preventDefault();
    closeAdminSidebar();
  });
}
if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener("click", closeAdminSidebar);
}

document.querySelectorAll(".side-nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".side-nav a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");
    closeAdminSidebar();
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("adminDarkMode", document.body.classList.contains("dark") ? "1" : "0");
    themeToggle.innerHTML = document.body.classList.contains("dark")
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  });

  if (localStorage.getItem("adminDarkMode") === "1") {
    document.body.classList.add("dark");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

if (dashboardSearch) {
  dashboardSearch.addEventListener("input", function() {
    const term = this.value.toLowerCase().trim();
    document.querySelectorAll("tbody tr").forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(term) ? "" : "none";
    });
    updateSectionCounts();
  });
}


function updateSectionCounts() {
  document.querySelectorAll(".card").forEach(card => {
    const id = card.id;
    const rows = card.querySelectorAll("tbody tr");
    const visibleRows = Array.from(rows).filter(row => row.style.display !== "none").length;
    const countEl = document.querySelector(`[data-count-for="${id}"]`);
    if (countEl && rows.length) {
      countEl.textContent = visibleRows + " / " + rows.length + " records";
    } else if (countEl) {
      countEl.textContent = "";
    }
  });
}

document.querySelectorAll(".section-search-input").forEach(input => {
  input.addEventListener("input", function() {
    const card = document.getElementById(this.dataset.section);
    if (!card) return;

    const term = this.value.toLowerCase().trim();
    card.querySelectorAll("tbody tr").forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(term) ? "" : "none";
    });

    updateSectionCounts();
  });
});

updateSectionCounts();


document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    if (imageModal && imageModal.classList.contains("active")) closeImageModal();
    closeAdminSidebar();
  }
});
</script>
</body>
</html>
<?php mysqli_close($conn); ?>

// Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

// DOM Elements
const elements = {
  loadingState: document.getElementById("loadingState"),
  jobsList: document.getElementById("jobsList"),
  emptyState: document.getElementById("emptyState"),
  alertContainer: document.getElementById("alertContainer"),
};

// Initialize
async function init() {
  await loadJobs();
}

// Load jobs from API
async function loadJobs() {
  try {
    showLoading(true);

    const response = await fetch(`${API_BASE_URL}/jobs`);

    if (!response.ok) {
      throw new Error("Failed to load jobs");
    }

    const result = await response.json();
    const jobs = result.data || [];

    showLoading(false);

    if (jobs.length === 0) {
      showEmptyState();
    } else {
      renderJobs(jobs);
    }
  } catch (error) {
    console.error("Error loading jobs:", error);
    showLoading(false);
    showAlert(
      "Gagal memuat daftar lowongan. Silakan refresh halaman.",
      "danger"
    );
    showEmptyState();
  }
}

// Render jobs list
function renderJobs(jobs) {
  elements.jobsList.innerHTML = "";
  elements.jobsList.style.display = "flex";

  jobs.forEach((job) => {
    const jobCard = createJobCard(job);
    elements.jobsList.appendChild(jobCard);
  });
}

// Create job card element
function createJobCard(job) {
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4 mb-4";

  const postedDate = job.created_at ? formatDate(job.created_at) : "";

  col.innerHTML = `
    <div class="card job-card h-100" onclick="goToDetail('${job.slug}')">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <span class="job-badge">
            <i class="bi bi-briefcase-fill me-1"></i>
            Dibuka
          </span>
          ${postedDate ? `<small class="text-muted">${postedDate}</small>` : ""}
        </div>
        <h5 class="card-title fw-bold mt-4">${escapeHtml(job.title)}</h5>
      </div>
    </div>
  `;

  return col;
}

// Navigate to detail page
window.goToDetail = function (slug) {
  window.location.href = `/karir/detail.html?slug=${slug}`;
};

// Show/hide loading state
function showLoading(show) {
  elements.loadingState.style.display = show ? "flex" : "none";
  elements.jobsList.style.display = show ? "none" : "flex";
  elements.emptyState.style.display = "none";
}

// Show empty state
function showEmptyState() {
  elements.loadingState.style.display = "none";
  elements.jobsList.style.display = "none";
  elements.emptyState.style.display = "block";
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;

  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Show alert
function showAlert(message, type = "info") {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.setAttribute("role", "alert");
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  elements.alertContainer.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

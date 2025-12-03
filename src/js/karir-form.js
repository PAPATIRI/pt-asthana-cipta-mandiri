const API_BASE_URL = "http://127.0.0.1:8000/api";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

// State management
const state = {
  jobs: [],
  isSubmitting: false,
  preselectedJob: null,
};

// DOM Elements
const elements = {
  form: document.getElementById("applicationForm"),
  jobSelect: document.getElementById("jobId"),
  jobSelectWrapper: document.getElementById("jobSelectWrapper"),
  jobInfoBadge: document.getElementById("jobInfoBadge"),
  jobTitleDisplay: document.getElementById("jobTitleDisplay"),
  backLink: document.getElementById("backLink"),
  cvInput: document.getElementById("cv"),
  clInput: document.getElementById("coverLetter"),
  submitBtn: document.getElementById("submitBtn"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  alertContainer: document.getElementById("alertContainer"),
};

// Initialize application
async function init() {
  checkPreselectedJob();
  await loadJobs();
  setupEventListeners();
  setupFileUpload(
    "cv",
    "cvUploadWrapper",
    "cvFileInfo",
    "cvFileName",
    "cvFileSize"
  );
  setupFileUpload(
    "coverLetter",
    "clUploadWrapper",
    "clFileInfo",
    "clFileName",
    "clFileSize"
  );
}

// Check if job is preselected from URL
function checkPreselectedJob() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("job_id");
  const jobSlug = params.get("job_slug");
  const jobTitle = params.get("job_title");

  if (jobId && jobTitle) {
    state.preselectedJob = {
      id: jobId,
      slug: jobSlug,
      title: jobTitle,
    };

    // Show job info badge
    elements.jobInfoBadge.style.display = "block";
    elements.jobTitleDisplay.textContent = jobTitle;

    // Hide job select dropdown
    elements.jobSelectWrapper.style.display = "none";
  }
}

// Load job positions
async function loadJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`);

    if (!response.ok) {
      throw new Error("Failed to load job positions");
    }

    const data = await response.json();
    state.jobs = data.data || data;

    // Populate job select
    elements.jobSelect.innerHTML =
      '<option value="" selected disabled>Pilih posisi yang tersedia...</option>';

    state.jobs.forEach((job) => {
      const option = document.createElement("option");
      option.value = job.id;
      option.textContent = job.title || job.name;

      // Preselect if coming from detail page
      if (state.preselectedJob && job.id == state.preselectedJob.id) {
        option.selected = true;
      }

      elements.jobSelect.appendChild(option);
    });

    // If preselected, set the value and mark as valid
    if (state.preselectedJob) {
      elements.jobSelect.value = state.preselectedJob.id;
      elements.jobSelect.classList.add("is-valid");
    }
  } catch (error) {
    console.error("Error loading jobs:", error);
    showAlert("Gagal memuat daftar posisi. Silakan refresh halaman.", "danger");
  }
}

// Setup event listeners
function setupEventListeners() {
  elements.form.addEventListener("submit", handleSubmit);

  // Real-time validation
  elements.form.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) {
        validateField(input);
      }
    });
  });
}

// Setup file upload with drag & drop
function setupFileUpload(inputId, wrapperId, infoId, nameId, sizeId) {
  const input = document.getElementById(inputId);
  const wrapper = document.getElementById(wrapperId);
  const fileInfo = document.getElementById(infoId);
  const fileName = document.getElementById(nameId);
  const fileSize = document.getElementById(sizeId);

  // File change event
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file, input, fileInfo, fileName, fileSize);
    }
  });

  // Drag & drop events
  wrapper.addEventListener("dragover", (e) => {
    e.preventDefault();
    wrapper.classList.add("drag-over");
  });

  wrapper.addEventListener("dragleave", () => {
    wrapper.classList.remove("drag-over");
  });

  wrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    wrapper.classList.remove("drag-over");

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      input.files = e.dataTransfer.files;
      handleFileSelect(file, input, fileInfo, fileName, fileSize);
    }
  });
}

// Handle file selection
function handleFileSelect(file, input, fileInfo, fileName, fileSize) {
  // Validate file type
  if (file.type !== "application/pdf") {
    input.value = "";
    showAlert("File harus berformat PDF", "warning");
    return;
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    input.value = "";
    showAlert(
      `Ukuran file maksimal 2MB. File Anda: ${formatFileSize(file.size)}`,
      "warning"
    );
    return;
  }

  // Display file info
  fileName.textContent = file.name;
  fileSize.textContent = formatFileSize(file.size);
  fileInfo.classList.add("show");

  // Mark as valid
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
}

// Clear file selection
window.clearFile = function (inputId) {
  const input = document.getElementById(inputId);
  input.value = "";
  input.classList.remove("is-valid", "is-invalid");

  const prefix = inputId === "cv" ? "cv" : "cl";
  document.getElementById(`${prefix}FileInfo`).classList.remove("show");
};

// Validate single field
function validateField(input) {
  const value = input.value.trim();
  let isValid = true;
  let message = "";

  // Skip validation for hidden job select if preselected
  if (input === elements.jobSelect && state.preselectedJob) {
    return true;
  }

  // Required validation
  if (input.hasAttribute("required") && !value) {
    isValid = false;
    message = `${input.previousElementSibling.textContent
      .replace("*", "")
      .trim()} wajib diisi`;
  }

  // Email validation
  if (input.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      message = "Format email tidak valid";
    }
  }

  // Phone validation
  if (input.id === "phone" && value) {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      message = "Format nomor telepon tidak valid";
    }
  }

  // File validation
  if (input.type === "file" && input.files.length > 0) {
    const file = input.files[0];
    if (file.type !== "application/pdf") {
      isValid = false;
      message = "File harus berformat PDF";
    } else if (file.size > MAX_FILE_SIZE) {
      isValid = false;
      message = "Ukuran file maksimal 2MB";
    }
  }

  // Update UI
  const feedback = input.parentElement.querySelector(".invalid-feedback");
  if (!isValid) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    if (feedback) feedback.textContent = message;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  return isValid;
}

// Validate entire form
function validateForm() {
  const inputs = elements.form.querySelectorAll("input, select");
  let isValid = true;

  inputs.forEach((input) => {
    // Skip hidden job select if preselected
    if (input === elements.jobSelect && state.preselectedJob) {
      return;
    }

    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  // Validate form
  if (!validateForm()) {
    showAlert("Mohon lengkapi semua field yang wajib diisi", "warning");
    return;
  }

  // Prevent double submission
  if (state.isSubmitting) return;
  state.isSubmitting = true;

  // Update UI
  elements.submitBtn.disabled = true;
  elements.submitBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2"></span>Mengirim...';
  elements.loadingOverlay.classList.add("show");

  try {
    // Prepare form data
    const formData = new FormData(elements.form);

    // If job is preselected, ensure it's in the form data
    if (state.preselectedJob) {
      formData.set("job_id", state.preselectedJob.id);
    }

    // Submit to API
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw { response, data: result };
    }

    // Success
    showAlert(
      "Lamaran Anda berhasil dikirim! Kami akan menghubungi Anda segera.",
      "success"
    );

    elements.form.reset();
    elements.form.querySelectorAll(".is-valid, .is-invalid").forEach((el) => {
      el.classList.remove("is-valid", "is-invalid");
    });
    document
      .querySelectorAll(".file-info")
      .forEach((el) => el.classList.remove("show"));

    // Show application number
    setTimeout(() => {
      showAlert(
        `Nomor Lamaran Anda: ${result.data.application_number}`,
        "info"
      );
    }, 2000);

    // Redirect to jobs list after 4 seconds
    setTimeout(() => {
      window.location.href = "/karir.html";
    }, 4000);
  } catch (error) {
    console.error("Submission error:", error);

    // Handle validation errors
    if (error.response?.status === 422 && error.data?.errors) {
      handleValidationErrors(error.data.errors);
      showAlert(
        "Terdapat kesalahan pada form. Mohon periksa kembali.",
        "danger"
      );
    } else {
      showAlert(
        error.data?.message || "Terjadi kesalahan. Silakan coba lagi.",
        "danger"
      );
    }
  } finally {
    // Reset UI
    state.isSubmitting = false;
    elements.submitBtn.disabled = false;
    elements.submitBtn.innerHTML =
      '<i class="bi bi-send-fill"></i> Kirim Lamaran';
    elements.loadingOverlay.classList.remove("show");
  }
}

// Handle validation errors from server
function handleValidationErrors(errors) {
  Object.keys(errors).forEach((fieldName) => {
    const input = elements.form.querySelector(`[name="${fieldName}"]`);
    if (input) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");

      const feedback = input.parentElement.querySelector(".invalid-feedback");
      if (feedback) {
        feedback.textContent = Array.isArray(errors[fieldName])
          ? errors[fieldName][0]
          : errors[fieldName];
      }
    }
  });
}

// Show alert notification
function showAlert(message, type = "info") {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.setAttribute("role", "alert");
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  elements.alertContainer.appendChild(alert);

  // Auto remove after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

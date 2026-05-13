// --- SIGNUP LOGIC ---
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const role = document.getElementById("roleSelect").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const messageBox = document.getElementById("signupMessage");
    if (messageBox) messageBox.innerText = "";

    if (password !== confirmPassword) {
      if (messageBox) {
        messageBox.innerText = "Passwords do not match!";
        messageBox.className = "message-container error";
      }
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      if (messageBox) {
        messageBox.innerText = "Email already registered!";
        messageBox.className = "message-container error";
      }
      return;
    }

    users.push({ fullName, role, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    window.location.href = "index.html";
  });
}

// --- LOGIN LOGIC ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!role) {
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // 1. Try to find an exact match (email, password, role)
    let user = users.find(u => u.email === email && u.password === password && u.role === role);

    // 2. If no exact match, but email exists, maybe they used a dummy password?
    // According to "any dummy credentials should enter", we let them in anyway.
    if (!user) {
      const existingUser = users.find(u => u.email === email && u.role === role);
      if (existingUser) {
        user = existingUser; // Use their registered name even with dummy password
      } else {
        // 3. Completely new dummy credentials
        const guestName = email.split('@')[0];
        user = { fullName: guestName, email: email, role: role };
      }
    }

    // Save to session so dashboard can read it
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));

    if (role === "user") {
      window.location.href = "userdashboard.html";
    } else {
      window.location.href = "admindashboard.html";
    }
  });
}

// --- DASHBOARD LOGIC (Auto-fill profile) ---
window.addEventListener("load", function() {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  
  if (loggedInUser) {
    const welcomeName = document.getElementById("welcomeName");
    const profileEmail = document.getElementById("profileEmail");
    const profileRole = document.querySelector(".user-role");

    if (welcomeName) welcomeName.innerText = `Welcome ${loggedInUser.fullName}`;
    if (profileEmail) profileEmail.innerText = loggedInUser.email;
    if (profileRole) profileRole.innerText = loggedInUser.role.toUpperCase();
  }

  // --- TAB SWITCHING LOGIC (User Dashboard) ---
  const tabs = {
    "tab-dashboard": "dashboard-section",
    "tab-orders": "my-orders-section",
    "tab-menu": "menu-section",
    "tab-reservations": "reservations-section",
    "tab-rewards": "rewards-section"
  };

  Object.keys(tabs).forEach(tabId => {
    const tabEl = document.getElementById(tabId);
    if (tabEl) {
      tabEl.addEventListener("click", function() {
        // Remove active from all tabs
        Object.keys(tabs).forEach(id => {
          document.getElementById(id).classList.remove("active");
          document.getElementById(tabs[id]).classList.remove("active");
        });

        // Add active to clicked tab
        this.classList.add("active");
        document.getElementById(tabs[tabId]).classList.add("active");
      });
    }
  });

  // --- ADMIN TAB SWITCHING LOGIC ---
  const adminTabs = {
    "admin-tab-dashboard": "admin-dashboard-section",
    "admin-tab-orders": "admin-orders-section",
    "admin-tab-menu": "admin-menu-section",
    "admin-tab-guests": "admin-guests-section",
    "admin-tab-reservations": "admin-reservations-section"
  };

  Object.keys(adminTabs).forEach(tabId => {
    const tabEl = document.getElementById(tabId);
    if (tabEl) {
      tabEl.addEventListener("click", function() {
        // Remove active from all admin tabs
        Object.keys(adminTabs).forEach(id => {
          document.getElementById(id).classList.remove("active");
          document.getElementById(adminTabs[id]).classList.remove("active");
        });

        // Add active to clicked admin tab
        this.classList.add("active");
        document.getElementById(adminTabs[tabId]).classList.add("active");
      });
    }
  });

  // --- RESERVATION REDIRECT ---
  const resForm = document.querySelector(".reservation-form");
  if (resForm) {
    resForm.addEventListener("submit", function(e) {
      e.preventDefault();
      window.location.href = "404.html";
    });
  }

  // --- MOBILE MENU TOGGLE ---
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function() {
      sidebar.classList.toggle("active");
      // Change icon based on state
      const icon = this.querySelector("i");
      if (sidebar.classList.contains("active")) {
        icon.classList.replace("ri-menu-line", "ri-close-line");
      } else {
        icon.classList.replace("ri-close-line", "ri-menu-line");
      }
    });

    // Close sidebar when clicking a tab on mobile
    const navItems = sidebar.querySelectorAll("li");
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("active");
          menuToggle.querySelector("i").classList.replace("ri-close-line", "ri-menu-line");
        }
      });
    });
  }
  // --- LOGOUT LOGIC ---
  const logoutBtnAdmin = document.getElementById("logout-btn-admin");
  const logoutBtnUser = document.getElementById("logout-btn-user");

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  };

  if (logoutBtnAdmin) logoutBtnAdmin.addEventListener("click", handleLogout);
  if (logoutBtnUser) logoutBtnUser.addEventListener("click", handleLogout);

  // --- PASSWORD TOGGLE LOGIC ---
  const setupToggle = (toggleId, passwordId) => {
    const toggle = document.getElementById(toggleId);
    const passwordInput = document.getElementById(passwordId);
    if (toggle && passwordInput) {
      toggle.addEventListener("click", function() {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.classList.toggle("ri-eye-line");
        this.classList.toggle("ri-eye-off-line");
      });
    }
  };

  setupToggle("togglePassword", "password");
  setupToggle("toggleConfirmPassword", "confirmPassword");
});
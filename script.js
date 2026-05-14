
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
    
    let user = users.find(u => u.email === email && u.password === password && u.role === role);


    if (!user) {
      const existingUser = users.find(u => u.email === email && u.role === role);
      if (existingUser) {
        user = existingUser; 
      } else {

        const guestName = email.split('@')[0];
        user = { fullName: guestName, email: email, role: role };
      }
    }

    sessionStorage.setItem("loggedInUser", JSON.stringify(user));

    if (role === "user") {
      window.location.href = "userdashboard.html";
    } else {
      window.location.href = "admindashboard.html";
    }
  });
}

window.addEventListener("load", function() {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  
  if (loggedInUser) {
    const welcomeName = document.getElementById("welcomeName");
    const profileEmail = document.getElementById("profileEmail");
    const profileRole = document.querySelector(".user-role");

    if (welcomeName) welcomeName.innerHTML = `Hey, ${loggedInUser.fullName} <span class="wave">👋</span>`;
    if (profileEmail) profileEmail.innerText = loggedInUser.email;
    if (profileRole) profileRole.innerText = loggedInUser.role.toUpperCase();
  }


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
      
        Object.keys(tabs).forEach(id => {
          document.getElementById(id).classList.remove("active");
          document.getElementById(tabs[id]).classList.remove("active");
        });


        this.classList.add("active");
        document.getElementById(tabs[tabId]).classList.add("active");
      });
    }
  });


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
      
        Object.keys(adminTabs).forEach(id => {
          document.getElementById(id).classList.remove("active");
          document.getElementById(adminTabs[id]).classList.remove("active");
        });


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
      const icon = this.querySelector("i");
      if (sidebar.classList.contains("active")) {
        icon.classList.replace("ri-menu-line", "ri-close-line");
      } else {
        icon.classList.replace("ri-close-line", "ri-menu-line");
      }
    });

    // Mobile Navbar Toggles
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const mobileToggleAdmin = document.getElementById("mobile-menu-toggle-admin");

    const handleMobileToggle = function() {
        sidebar.classList.toggle("active");
        const icon = this.querySelector("i");
        if (sidebar.classList.contains("active")) {
            icon.classList.replace("ri-menu-line", "ri-close-line");
        } else {
            icon.classList.replace("ri-close-line", "ri-menu-line");
        }
    };

    if (mobileToggle) mobileToggle.addEventListener("click", handleMobileToggle);
    if (mobileToggleAdmin) mobileToggleAdmin.addEventListener("click", handleMobileToggle);

    // Sidebar Close Buttons
    const closeBtn = document.getElementById("close-sidebar");
    const closeBtnAdmin = document.getElementById("close-sidebar-admin");

    const handleClose = () => {
        sidebar.classList.remove("active");
        const activeToggle = mobileToggle || mobileToggleAdmin || menuToggle;
        const icon = activeToggle.querySelector("i");
        if (icon) icon.classList.replace("ri-close-line", "ri-menu-line");
    };

    if (closeBtn) closeBtn.addEventListener("click", handleClose);
    if (closeBtnAdmin) closeBtnAdmin.addEventListener("click", handleClose);


    const navItems = sidebar.querySelectorAll("li");
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("active");
          const activeToggle = mobileToggle || mobileToggleAdmin || menuToggle;
          const icon = activeToggle.querySelector("i");
          if (icon) icon.classList.replace("ri-close-line", "ri-menu-line");
        }
      });
    });
  }
  
  const logoutBtnAdmin = document.getElementById("logout-btn-admin");
  const logoutBtnUser = document.getElementById("logout-btn-user");

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  };

  if (logoutBtnAdmin) logoutBtnAdmin.addEventListener("click", handleLogout);
  if (logoutBtnUser) logoutBtnUser.addEventListener("click", handleLogout);

  const logoutBtnAdminMobile = document.getElementById("logout-btn-admin-mobile");
  const logoutBtnUserMobile = document.getElementById("logout-btn-user-mobile");

  if (logoutBtnAdminMobile) logoutBtnAdminMobile.addEventListener("click", handleLogout);
  if (logoutBtnUserMobile) logoutBtnUserMobile.addEventListener("click", handleLogout);


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
  setupToggle("toggleLoginPassword", "loginPassword");
});
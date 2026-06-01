
const header = document.querySelector('#header');
const goTopBtn = document.querySelector('#goTop');
const themeBtn = document.querySelector('#themeToggle');
const burger = document.querySelector('#burger');
const mobileMenu = document.querySelector('#mobileMenu');
const overlay = document.querySelector('#overlay');
const animateEls = document.querySelectorAll('.animate');

let isDark = true;
let currentCourseData = {};

window.addEventListener('scroll', () => {
  header.classList.toggle('header--scroll', window.scrollY > 60);
  goTopBtn.classList.toggle('active', window.scrollY > 300);
});

goTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light-theme');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
});

const openMobileMenu = () => {
  burger.classList.add('active');
  mobileMenu.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeMobileMenu = () => {
  burger.classList.remove('active');
  mobileMenu.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};

burger.addEventListener('click', () => {
  if (mobileMenu.classList.contains('active')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

const getUsers = () => {
  const raw = localStorage.getItem('gs_users');
  return raw ? JSON.parse(raw) : [];
};

const saveUsers = (users) => {
  localStorage.setItem('gs_users', JSON.stringify(users));
};

const getCurrentUser = () => {
  const raw = localStorage.getItem('gs_current_user');
  return raw ? JSON.parse(raw) : null;
};

const setCurrentUser = (user) => {
  localStorage.setItem('gs_current_user', JSON.stringify(user));
};

const clearCurrentUser = () => {
  localStorage.removeItem('gs_current_user');
};

const openModal = (id) => {
  document.querySelector(`#${id}`).classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeModal = (id) => {
  document.querySelector(`#${id}`).classList.remove('active');
  document.body.style.overflow = '';
};

const closeAllModals = () => {
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
};

overlay.addEventListener('click', () => {
  closeMobileMenu();
  closeAllModals();
});

document.querySelectorAll('.mobile-menu__link').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

const scrollObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    }
  },
  { threshold: 0.12 }
);

animateEls.forEach((el) => scrollObserver.observe(el));

const updateAuthUI = () => {
  const user = getCurrentUser();
  const authArea = document.querySelector('#authArea');
  const userArea = document.querySelector('#userArea');
  const mobileAuthArea = document.querySelector('#mobileAuthArea');
  const mobileUserArea = document.querySelector('#mobileUserArea');

  if (user) {
    authArea.style.display = 'none';
    userArea.style.display = 'flex';
    mobileAuthArea.style.display = 'none';
    mobileUserArea.style.display = 'flex';

    document.querySelector('#userAvatar').textContent = user.name.charAt(0).toUpperCase();
    document.querySelector('#userName').textContent = user.name;
    document.querySelector('#mobileUserAvatar').textContent = user.name.charAt(0).toUpperCase();
    document.querySelector('#mobileUserName').textContent = user.name;
  } else {
    authArea.style.display = 'flex';
    userArea.style.display = 'none';
    mobileAuthArea.style.display = 'flex';
    mobileUserArea.style.display = 'none';
  }
};

document.querySelector('#logoutBtn').addEventListener('click', () => {
  clearCurrentUser();
  updateAuthUI();
});

document.querySelector('#mobileLogoutBtn').addEventListener('click', () => {
  clearCurrentUser();
  updateAuthUI();
  closeMobileMenu();
});

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal.id);
    }
  });
});

document.querySelector('#authModalClose').addEventListener('click', () => {
  closeModal('authModal');
});

document.querySelector('#payModalClose').addEventListener('click', () => {
  closeModal('payModal');
  resetPayModal();
});

const openAuthModal = (tab) => {
  switchTab(tab);
  openModal('authModal');
};

document.querySelector('#openLoginBtn').addEventListener('click', () => {
  openAuthModal('login');
});

document.querySelector('#openRegisterBtn').addEventListener('click', () => {
  openAuthModal('register');
});
// .
document.querySelector('#mobileLoginBtn').addEventListener('click', () => {
  closeMobileMenu();
  openAuthModal('login');
});

document.querySelector('#mobileRegisterBtn').addEventListener('click', () => {
  closeMobileMenu();
  openAuthModal('register');
});

document.querySelector('#ctaRegisterBtn').addEventListener('click', () => {
  openAuthModal('register');
});

const switchTab = (tab) => {
  const loginTab = document.querySelector('#tabLogin');
  const registerTab = document.querySelector('#tabRegister');
  const loginForm = document.querySelector('#loginForm');
  const regForm = document.querySelector('#registerForm');
  const title = document.querySelector('#authModalTitle');
  const subtitle = document.querySelector('#authModalSubtitle');

  clearAuthErrors();

  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    regForm.classList.remove('active');
    title.textContent = 'Вхід';
    subtitle.textContent = 'Раді бачити вас знову 👋';
    return;
  }

  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  regForm.classList.add('active');
  loginForm.classList.remove('active');
  title.textContent = 'Реєстрація';
  subtitle.textContent = 'Створіть свій акаунт 🌸';
};

document.querySelector('#tabLogin').addEventListener('click', () => {
  switchTab('login');
});
document.querySelector('#tabRegister').addEventListener('click', () => {
  switchTab('register');
});

const clearAuthErrors = () => {
  document.querySelectorAll('.form__error').forEach((errorEl) => {
    errorEl.classList.remove('active');
  });
};

const showErr = (id) => {
  document.querySelector(`#${id}`).classList.add('active');
};

const hideErr = (id) => {
  document.querySelector(`#${id}`).classList.remove('active');
};

const isValidEmail = (email) => {
  const atIndex = email.indexOf('@');
  if (atIndex < 1) {
    return false;
  }

  const afterAt = email.substring(atIndex + 1);
  const dotIndex = afterAt.indexOf('.');
  if (dotIndex < 1) {
    return false;
  }

  const afterDot = afterAt.substring(dotIndex + 1);
  if (afterDot.length < 1) {
    return false;
  }

  return !email.includes(' ');
};

const handleRegister = () => {
  clearAuthErrors();

  const name = document.querySelector('#regName').value.trim();
  const email = document.querySelector('#regEmail').value.trim();
  const password = document.querySelector('#regPassword').value;
  let hasError = false;

  if (name.length < 2) {
    showErr('regNameErr');
    hasError = true;
  }
  if (!isValidEmail(email)) {
    showErr('regEmailErr');
    hasError = true;
  }
  if (password.length < 6) {
    showErr('regPasswordErr');
    hasError = true;
  }
  if (hasError) {
    return;
  }

  const users = getUsers();
  const emailTaken = users.some((user) => user.email === email);
  if (emailTaken) {
    document.querySelector('#regEmailErr').textContent = 'Цей email вже зареєстрований';
    showErr('regEmailErr');
    return;
  }

  users.push({ name, email, password });
  saveUsers(users);
  setCurrentUser({ name, email });
  updateAuthUI();
  closeModal('authModal');

  document.querySelector('#regName').value = '';
  document.querySelector('#regEmail').value = '';
  document.querySelector('#regPassword').value = '';
};

const handleLogin = () => {
  clearAuthErrors();

  const email = document.querySelector('#loginEmail').value.trim();
  const password = document.querySelector('#loginPassword').value;

  if (!isValidEmail(email)) {
    showErr('loginEmailErr');
    return;
  }

  const users = getUsers();
  const foundUser = users.find((user) => user.email === email && user.password === password);
  if (!foundUser) {
    showErr('loginPasswordErr');
    return;
  }

  setCurrentUser({ name: foundUser.name, email: foundUser.email });
  updateAuthUI();
  closeModal('authModal');

  document.querySelector('#loginEmail').value = '';
  document.querySelector('#loginPassword').value = '';
};

document.querySelector('#loginPassword').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleLogin();
  }
});

document.querySelector('#regPassword').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleRegister();
  }
});

const onlyDigits = (value) => value.replace(/\D/g, '');

const openPayment = (name, icon, price, amount) => {
  const user = getCurrentUser();
  if (!user) {
    openAuthModal('login');
    return;
  }

  currentCourseData = { name, icon, price, amount };

  document.querySelector('#payIcon').textContent = icon;
  document.querySelector('#payCourseName').textContent = name;
  document.querySelector('#payCoursePrice').textContent = price;
  document.querySelector('#payTotalPrice').textContent = price;
  document.querySelector('#payCardName').value = user.name.toUpperCase();

  resetPayModal();
  openModal('payModal');
};

const resetPayModal = () => {
  document.querySelector('#payFormScreen').style.display = 'block';
  document.querySelector('#successScreen').classList.remove('active');
  clearAuthErrors();
  hideErr('payCardNameErr');
  hideErr('payCardNumberErr');
  hideErr('payExpiryErr');
  hideErr('payCvvErr');

  document.querySelector('#payCardNumber').value = '';
  document.querySelector('#payExpiry').value = '';
  document.querySelector('#payCvv').value = '';
};

document.querySelector('#payCardNumber').addEventListener('input', (event) => {
  const digits = onlyDigits(event.target.value).substring(0, 16);
  const groups = digits.match(/.{1,4}/g) || [];
  event.target.value = groups.join(' ');
});

document.querySelector('#payExpiry').addEventListener('input', (event) => {
  const digits = onlyDigits(event.target.value).substring(0, 4);
  event.target.value = digits.length >= 3 ? `${digits.substring(0, 2)}/${digits.substring(2)}` : digits;
});

document.querySelector('#payCvv').addEventListener('input', (event) => {
  event.target.value = onlyDigits(event.target.value).substring(0, 3);
});

const handlePayment = () => {
  clearAuthErrors();

  const cardName = document.querySelector('#payCardName').value.trim();
  const cardNumber = document.querySelector('#payCardNumber').value;
  const expiry = document.querySelector('#payExpiry').value.trim();
  const cvv = document.querySelector('#payCvv').value.trim();
  let hasError = false;

  if (cardName.length < 2) {
    showErr('payCardNameErr');
    hasError = true;
  }

  const digitCount = onlyDigits(cardNumber).length;
  if (digitCount !== 16) {
    showErr('payCardNumberErr');
    hasError = true;
  }

  const expiryMatch = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!expiryMatch) {
    showErr('payExpiryErr');
    hasError = true;
  } else {
    const month = Number(expiryMatch[1]);
    if (month < 1 || month > 12) {
      showErr('payExpiryErr');
      hasError = true;
    }
  }

  if (!/^\d{3}$/.test(cvv)) {
    showErr('payCvvErr');
    hasError = true;
  }

  if (hasError) {
    return;
  }

  document.querySelector('#payFormScreen').style.display = 'none';
  document.querySelector('#successCourseName').textContent = currentCourseData.name;
  document.querySelector('#successScreen').classList.add('active');
};

window.openPayment = openPayment;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handlePayment = handlePayment;
window.closeModal = closeModal;

updateAuthUI();

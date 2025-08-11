import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqz1o1MAek_nQu0ykoldBQq_zaYTnDZBA",
  authDomain: "rasstrel-51ec8.firebaseapp.com",
  projectId: "rasstrel-51ec8",
  storageBucket: "rasstrel-51ec8.firebasestorage.app",
  messagingSenderId: "522133739228",
  appId: "1:522133739228:web:17307ebf5b9916adb4c619"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const form = document.getElementById('contactForm');
const statusEl = document.getElementById('statusMessage');
const cardEl = document.querySelector('.card');

function validate(data) {
  if (data.name.length < 2) return "Ім’я занадто коротке";
  if (data.age < 1 || data.age > 120) return "Вік некоректний";
  if (data.city.length < 2) return "Назва міста занадто коротка";
  if (!/^@?\w{3,}$/.test(data.telegram)) return "Нік Telegram некоректний";
  return null;
}

const announcementEl = document.querySelector('.announcement');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';
  statusEl.className = 'status-message';

  const data = {
    name: form.firstName.value.trim(),
    age: Number(form.age.value),
    city: form.city.value.trim(),
    telegram: form.telegram.value.trim(),
    createdAt: serverTimestamp()
  };

  const error = validate(data);
  if (error) {
    statusEl.textContent = error;
    statusEl.classList.add('error');
    return;
  }

  try {
    await addDoc(collection(db, 'submissions'), data);

    if (announcementEl) {
      announcementEl.style.display = 'none';
    }

cardEl.innerHTML = `
  <div class="success-screen">
    <div class="success-icon">
      <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" alt="Complete" />
    </div>
    <h1>Дякуємо!</h1>
    <p>Ваші дані успішно надіслані</p>
    <a href="https://t.me/dgudiii" target="_blank" class="telegram-btn">
      📩 Зв'язок з HR
    </a>
  </div>
`;

  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Помилка надсилання';
    statusEl.classList.add('error');
  }
});


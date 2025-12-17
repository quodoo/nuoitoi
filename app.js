const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

const goal = 200_000_000;
let raised = 0;

const donors = [
  { name: "Ẩn danh", amount: 9_999_999 },
  { name: "Bạn tốt bụng", amount: 5_000_000 },
  { name: "Chú Tư", amount: 2_222_222 },
  { name: "Mạnh thường quân", amount: 1_234_567 },
  { name: "Admin", amount: 999_999 }, // 😄
];

const el = (id) => document.getElementById(id);

function setProgress() {
  const pct = Math.max(0, Math.min(100, Math.round((raised / goal) * 100)));
  el("fill").style.width = pct + "%";
  el("percentText").textContent = pct + "%";
  el("raisedText").textContent = fmt(raised);
  // số “em” được nuôi: công thức troll nhẹ
  el("kidsText").textContent = Math.max(1, Math.floor((raised / 10_000) % 997)).toString();
}

function renderDonors() {
  const list = el("donorList");
  list.innerHTML = "";
  donors
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .forEach((d) => {
      const li = document.createElement("li");
      li.className = "item";
      li.innerHTML = `<span><b>${escapeHtml(d.name)}</b></span><span>${fmt(d.amount)}</span>`;
      list.appendChild(li);
    });
}

function toast(msg) {
  const t = el("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove("show"), 2300);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[c]));
}

// Troll logic: bấm donate thì… tăng chút rồi “rollback”
function donate(amount) {
  const add = Number(amount) || 10_000;

  const fakeGain = Math.min(add, 500_000);
  raised += fakeGain;
  setProgress();

  toast(`Cảm ơn bạn đã ủng hộ ${fmt(add)}! (đang xử lý...)`);

  setTimeout(() => {
    // rollback kiểu “minh bạch”
    const rollback = Math.floor(fakeGain * 0.85);
    raised = Math.max(0, raised - rollback);
    setProgress();
    toast("Giao dịch đang được 'xác minh'… vui lòng thử lại. 😇");
  }, 1100);

  // Update donor list (troll nhẹ)
  donors.push({ name: "Bạn (vừa ủng hộ)", amount: add });
  if (donors.length > 12) donors.splice(6, 1);
  renderDonors();
}

function share() {
  const url = location.href;
  navigator.clipboard?.writeText(url);
  toast("Đã copy link! Gửi cho bạn bè để cùng… bị troll 😄");
}

function showProof() {
  toast("Sao kê hiện đang… đi ăn trưa. 🍜");
}

function toggleTheme() {
  document.documentElement.classList.toggle("light");
  const isLight = document.documentElement.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

(function init(){
  el("year").textContent = new Date().getFullYear();

  const saved = localStorage.getItem("theme");
  if (saved === "light") document.documentElement.classList.add("light");

  renderDonors();
  raised = 12_345_678; // số mở màn cho vui
  setProgress();

  el("btnDonate").addEventListener("click", () => donate(50_000));
  el("btnShare").addEventListener("click", share);
  el("btnProof").addEventListener("click", showProof);
  el("btnTheme").addEventListener("click", toggleTheme);

  document.querySelectorAll(".pack").forEach(btn => {
    btn.addEventListener("click", () => donate(btn.dataset.amt));
  });
})();

<script>
document.addEventListener("DOMContentLoaded", function () {

  // 🔒 HEADER ROOT (THIS is the key)
  const root = document.getElementById("mp-header");
  if (!root) return;

  // Icons
  lucide.createIcons();

  // ---------------------------
  // Mobile Menu Toggle
  // ---------------------------
  const btn = root.querySelector("#mobileMenuBtn");
  const menu = root.querySelector("#mobileMenu");

  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }

  // ---------------------------
  // Mobile Indices Dropdown
  // ---------------------------
  const mobileIndicesBtn = root.querySelector("#mobileIndicesBtn");
  const mobileIndicesMenu = root.querySelector("#mobileIndicesMenu");

  if (mobileIndicesBtn && mobileIndicesMenu) {
    mobileIndicesBtn.addEventListener("click", () => {
      mobileIndicesMenu.classList.toggle("hidden");
    });
  }

  // ---------------------------
  // Smart Live Ticker
  // ---------------------------
  const ticker = root.querySelector("#smartTicker");

  const marketData = [
    { symbol: 'NIFTY 50', value: '22,456.80', change: '+0.70%' },
    { symbol: 'BANKNIFTY', value: '47,892.45', change: '-0.49%' },
    { symbol: 'SENSEX', value: '73,745.60', change: '+0.56%' },
    { symbol: 'USD/INR', value: '83.12', change: '+0.15%' },
    { symbol: 'GOLD', value: '62,450', change: '+0.82%' },
    { symbol: 'CRUDE OIL', value: '78.45', change: '+1.23%' }
  ];

  function restartTickerAnimation() {
    if (!ticker) return;
    ticker.style.animation = "none";
    ticker.offsetHeight; // force reflow
    ticker.style.animation = "ticker 25s linear infinite";
  }

  function showMarketTicker() {
    if (!ticker) return;

    let html = "";
    marketData.forEach(item => {
      const color = item.change.startsWith("+")
        ? "text-green-400"
        : "text-red-400";

      html += `
        <span class="inline-flex items-center mx-6">
          <span class="font-semibold">${item.symbol}</span>
          <span class="ml-2">${item.value}</span>
          <span class="ml-2 ${color}">${item.change}</span>
        </span>
      `;
    });

    ticker.classList.remove("notification-mode");
    ticker.innerHTML = html + html;
    restartTickerAnimation();
  }

  function showOfflineMessage() {
    if (!ticker) return;
    ticker.classList.add("notification-mode");
    ticker.style.animation = "none";
    ticker.innerHTML =
      "⚠ You are currently offline. Market data is temporarily unavailable.";
  }

  function checkConnection() {
    navigator.onLine ? showMarketTicker() : showOfflineMessage();
  }

  window.addEventListener("online", checkConnection);
  window.addEventListener("offline", checkConnection);

  checkConnection();
});
</script>

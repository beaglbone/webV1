
// 🔥 MUST be global
window.initMPHeader = function () {

  const root = document.getElementById("mp-header");
  if (!root) {
    console.warn("mp-header not found");
    return;
  }

  // Icons
  if (window.lucide) {
    lucide.createIcons();
  }

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

  // ===============================
// Market Status (Cloudflare API)
// ===============================

const marketLabel = root.querySelector("#marketLabel");
const marketLiveText = root.querySelector("#marketLiveText");
const marketStatus = root.querySelector("#marketStatus");
const marketStatusTop = root.querySelector("#marketStatusTop");  

const MARKET_API = "https://marketholiday.niftyking76.workers.dev/";

async function updateMarketStatus() {
  try {
    const res = await fetch(MARKET_API);
    const data = await res.json();

    const isOpen = data.market === "open";

    if (isOpen) {
      marketLabel.textContent = "Markets Open";
      marketLiveText.textContent = "LIVE";
      marketStatus.textContent = "Market Status: Open";


      marketLiveText.className = "text-green-400 font-medium";
      marketStatus.className = "text-green-400";
    } else {
      marketLabel.textContent = "Markets Closed";
      marketLiveText.textContent = "CLOSED";
      marketStatus.textContent = "Market Status: Closed";


      marketLiveText.className = "text-red-400 font-medium";
      marketStatus.className = "text-red-400";
    }

  } catch (err) {
    console.error("Market API error:", err);
  }
}

// Run on load
updateMarketStatus();

// Refresh every 5 minutes
setInterval(updateMarketStatus, 5 * 60 * 1000); 
  // here

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

  function restartTickerAnimation() {
    if (!ticker) return;
    ticker.style.animation = "none";
    ticker.offsetHeight;
    ticker.style.animation = "ticker 25s linear infinite";
  }

 // ===============================
// 🔴 LIVE MARKET TICKER
// ===============================

const LIVE_MARKET_API = "https://stockapicache.niftyking76.workers.dev/";

let liveMarketData = [];

async function fetchMarketData() {
  try {
    const res = await fetch(LIVE_MARKET_API);
    const json = await res.json();

    if (!json.data || !json.data.data) {
      showOfflineMessage();
      return;
    }

    const apiData = json.data.data;

    liveMarketData = Object.keys(apiData).map(key => {
      const stock = apiData[key];

      const open = stock.ohlc.open;
      const close = stock.ohlc.close;

      const changePercent = (((close - open) / open) * 100).toFixed(2);
      const sign = changePercent >= 0 ? "+" : "";

      return {
        symbol: key.split(":")[1],
        value: close.toFixed(2),
        change: sign + changePercent + "%"
      };
    });

    renderTicker();

  } catch (err) {
    console.error("Live market fetch error:", err);
    showOfflineMessage();
  }
}

function renderTicker() {
  if (!ticker || !liveMarketData.length) return;

  let html = "";

  liveMarketData.forEach(item => {
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
    "⚠ Market data is temporarily unavailable.";
}

// Run initially
fetchMarketData();

// Refresh every 15 sec
setInterval(fetchMarketData, 15000);
};

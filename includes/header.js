window.initMPHeader = function () {

  // ===============================
  // ICONS
  // ===============================
  if (window.lucide) {
    lucide.createIcons();
  }

  // ===============================
  // MARKET STATUS
  // ===============================

  const marketLabel = document.querySelector("#marketLabel");
  const marketLiveText = document.querySelector("#marketLiveText");
  const marketStatus = document.querySelector("#marketStatus");

  const MARKET_API = "https://marketholiday.niftyking76.workers.dev/";

  async function updateMarketStatus() {
    try {
      const res = await fetch(MARKET_API);
      const data = await res.json();

      const isOpen = data.market === "open";

      if (marketLabel && marketLiveText && marketStatus) {
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
      }

    } catch (err) {
      console.error("Market API error:", err);
    }
  }

  updateMarketStatus();
  setInterval(updateMarketStatus, 5 * 60 * 1000);

  // ===============================
  // 🔴 LIVE MARKET TICKER
  // ===============================

  const ticker = document.querySelector("#smartTicker");
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

      showMarketTicker();

    } catch (err) {
      console.error("Live market fetch error:", err);
      showOfflineMessage();
    }
  }

  function restartTickerAnimation() {
    if (!ticker) return;
    ticker.style.animation = "none";
    ticker.offsetHeight;
    ticker.style.animation = "ticker 40s linear infinite";
  }

  function showMarketTicker() {
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

    ticker.innerHTML = html + html;
    restartTickerAnimation();
  }

  function showOfflineMessage() {
    if (!ticker) return;
    ticker.innerHTML =
      "⚠ Market data is temporarily unavailable.";
  }

  fetchMarketData();
  setInterval(fetchMarketData, 15000);
};

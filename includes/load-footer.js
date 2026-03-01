document.addEventListener("DOMContentLoaded", async () => {
  try {
    const container = document.getElementById("footer-container");
    if (!container) return;

    const response = await fetch("includes/footer.html");
    const html = await response.text();

    container.innerHTML = html;

    // Re-render lucide icons after footer load
    if (window.lucide) {
      lucide.createIcons();
    }

  } catch (error) {
    console.error("Footer load failed:", error);
  }
});

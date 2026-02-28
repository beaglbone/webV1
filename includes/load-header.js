document.addEventListener("DOMContentLoaded", async () => {
  try {
    const container = document.getElementById("header-container");
    if (!container) return;

    const response = await fetch("includes/header.html");
    const html = await response.text();

    container.innerHTML = html;

    // Wait one frame to ensure module is ready
    requestAnimationFrame(() => {
      if (window.initMPHeader) {
        window.initMPHeader();
      } else {
        console.warn("initMPHeader not found");
      }
    });

  } catch (error) {
    console.error("Header load failed:", error);
  }
});

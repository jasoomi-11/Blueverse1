// ===== breadcrumb.js =====
// Universal, SEO-optimized breadcrumb for static websites
// Works automatically for all folders and pages

document.addEventListener("DOMContentLoaded", () => {
  const breadcrumbEl = document.getElementById("breadcrumb");
  if (!breadcrumbEl) return;

  // Get path parts
  let path = window.location.pathname
    .replace(/\/index\.html$/, "/")
    .split("/")
    .filter(Boolean);

  // Start breadcrumb HTML and JSON-LD
  let breadcrumbHTML = `<span>🏠 Home</span>`;
  let breadcrumbList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": window.location.origin + "/index.html"
    }
  ];

  // Build breadcrumb visually and for SEO
  let currentPath = "";
  path.forEach((segment, index) => {
    currentPath += "/" + segment;

    const cleanName = segment
      .replace(".html", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    // Add visual breadcrumb (not clickable)
    breadcrumbHTML += `
      <span class="breadcrumb-arrow">›</span>
      <span>${cleanName}</span>
    `;

    // Add to JSON-LD list
    breadcrumbList.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": cleanName,
      "item": window.location.origin + currentPath.replace(/\.html$/, "")
    });
  });

  // Insert breadcrumb HTML
  breadcrumbEl.innerHTML = breadcrumbHTML;

  // Inject SEO structured data
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbList
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
});
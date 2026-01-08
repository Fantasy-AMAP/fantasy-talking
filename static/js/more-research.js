async function loadMoreResearchDropdown({
  mountId = "moreResearchDropdown",
  jsonUrl = "https://github.com/Fantasy-AMAP/.github/blob/main/profile/research.json"
} = {}) {

  // 简单的下拉菜单JS逻辑
  const btn = document.getElementById('moreResearchBtn');
  const menu = document.getElementById('moreResearchDropdown');
  btn.onclick = function (e) {
    e.stopPropagation();
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  };
  // 点击别处隐藏菜单
  document.body.addEventListener('click', function () {
    menu.style.display = 'none';
  });
 
  const mount = document.getElementById(mountId);
  if (!mount) return;

  try {
    const res = await fetch(jsonUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const data = await res.json();

    const items = Array.isArray(data.items) ? data.items : [];

    mount.innerHTML = items
      .map((item) => {
        const name = escapeHtml(item.name || "Untitled");
        const tag = item.tag
          ? ` <span class="more-research-tag">(${escapeHtml(item.tag)})</span>`
          : "";
        const url = item.url || "#";
        return `<a href="${url}" target="_blank" class="more-research-link">${name}${tag}</a>`;
      })
      .join("");

    if (!mount.innerHTML) {
      mount.innerHTML = '<div class="more-research-empty">No items</div>';
    }
  } catch (err) {
    mount.innerHTML = '<div class="more-research-empty">No items</div>';
    console.warn("[moreResearchDropdown] load failed:", err);
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * @param {HTMLDivElement} target
 * @param {import('epubjs/types/navigation').NavItem[]} toc 
 */
export function renderToc(toc, target) {
  for (let i = 0; i < toc.length; i++) {
    const navItem = toc[i]
    const tmpl = `
    <div class="nav_item">
      <a class="nav_a" href="#" data-toc=${navItem.href}>${navItem.label}</a>
    </div>
    `
    const dom = parseDom(tmpl)
    target.appendChild(dom)

    if (navItem.subitems.length > 0) {
      renderToc(navItem.subitems, dom)
    }
  }
}

/**
 * @param {string} str 
 */
function parseDom(str) {
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = str
  const dom = tempDiv.children[0]
  return dom
}
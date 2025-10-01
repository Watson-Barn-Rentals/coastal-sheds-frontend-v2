// plugins/leadferno-style.client.ts
export default defineNuxtPlugin(() => {
  // Apply styles to the iframe element itself.
  // (We can't modify cross-origin iframe contents.)
  const styleIframe = (iframe: HTMLIFrameElement) => {
    if (!iframe || (iframe as any).dataset?.lfStyled === '1') return
    // Inline styles (highest reliability)
    iframe.style.background = 'transparent'
    iframe.style.backgroundColor = 'transparent'
    // Legacy attribute some widgets still read
    iframe.setAttribute('allowtransparency', 'true')
    ;(iframe as any).dataset.lfStyled = '1'
  }

  // If it already exists (e.g., Netlify post-processing ran before this plugin)
  const existing = document.getElementById('leadbox-iframe') as HTMLIFrameElement | null
  if (existing) styleIframe(existing)

  // Observe future additions/changes
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      // New nodes
      m.addedNodes.forEach((node) => {
        if (node instanceof HTMLIFrameElement && node.id === 'leadbox-iframe') {
          styleIframe(node)
        } else if (node instanceof HTMLElement) {
          const found = node.querySelector?.('#leadbox-iframe') as HTMLIFrameElement | null
          if (found) styleIframe(found)
        }
      })
      // Attribute changes on the iframe (ID set later, etc.)
      if (
        m.type === 'attributes' &&
        m.target instanceof HTMLIFrameElement &&
        (m.target.id === 'leadbox-iframe' || (m.attributeName === 'id' && m.target.id === 'leadbox-iframe'))
      ) {
        styleIframe(m.target)
      }
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['id'],
  })

  // Optional: global CSS guard (in case inline styles are reset by other scripts)
  const cssId = 'leadferno-iframe-style'
  if (!document.getElementById(cssId)) {
    const style = document.createElement('style')
    style.id = cssId
    style.textContent = `
      #leadbox-iframe { background: transparent !important; background-color: transparent !important; }
    `
    document.head.appendChild(style)
  }

  // (No teardown needed; plugin lives for app lifetime.)
})

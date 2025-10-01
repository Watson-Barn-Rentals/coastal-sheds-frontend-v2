// plugins/leadferno-style.client.ts
export default defineNuxtPlugin(() => {
  const applyLeadfernoStyles = () => {
    const container = document.getElementById('leadbox-iframe-container')
    if (container && (container as any).dataset.lfStyled !== '1') {
      // Force light mode rendering for this container
      ;(container as HTMLElement).style.colorScheme = 'light'
      ;(container as any).dataset.lfStyled = '1'
    }
  }

  // Run once on mount
  applyLeadfernoStyles()

  // Watch for new nodes being added
  const observer = new MutationObserver(() => {
    applyLeadfernoStyles()
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

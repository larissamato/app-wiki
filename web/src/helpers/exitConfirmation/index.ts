let confirmExit = false // Define se os listeners estão ativados ou desativados

export function enableExitConfirmation () {
  confirmExit = true

  window.addEventListener('beforeunload', function (e) {
    if (confirmExit) {
      e.preventDefault()
      e.returnValue = '' // Mensagem opcional, não suportada em todos os navegadores
    }
  })

  window.addEventListener('click', function (e) {
    const target = e.target
    if (confirmExit && target.tagName === 'A' && target.getAttribute('href')) {
      const href = target.getAttribute('href')
      if (!href.startsWith(window.location.origin)) {
        e.preventDefault()
        const userConfirmed = confirm()
        if (userConfirmed) {
          confirmExit = false
          window.location.href = href
        }
      }
    }
  })
}

export function disableExitConfirmation () {
  confirmExit = false

  window.removeEventListener('beforeunload', function () {})
  window.removeEventListener('click', function () {})
}

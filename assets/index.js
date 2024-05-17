const images = [
  'A,E,I.png',
  'B,M,P.png',
  'C,D,N,S,T,X,Y,Z.png',
  'F,V.png',
  'J,CH,SH.png',
  'L.png',
  'O.png',
  'Q,W.png',
  'R.png',
]

function normalize(text) {
  return text
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toUpperCase()
}

function formatSyncNode(text, image) {
  return text
    ? `
      <div style="margin-left: -9rem;">
        <image src="./assets/img/${image}" style="object-fit: cover; height: 12rem; width: 12rem;"/>
        <p style="text-align: center; margin-top: -4.5rem">${text}</span>
      </div>`
    : `<div style="margin: 0 1rem;"></div>`
}

function getSync(text) {
  const result = []
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      result.push(['', ''])
      continue
    }
    const syllable = normalize(text[i] + text[i + 1])
    const syllableImage = images.find(image => image.includes(syllable))
    if (syllableImage) {
      result.push([syllable, syllableImage])
      i++
      continue
    }
    const letter = normalize(text[i])
    const letterImage = images.find(image => image.includes(letter))
    if (letterImage) {
      result.push([text[i].toUpperCase(), letterImage])
      continue
    }
  }
  return result
}

let intervalId

document.getElementById('gif-start').addEventListener('click', () => {
  const gifText = document.getElementById('gif-text').value
  const sync = getSync(gifText)
  const gifSpeed = document.getElementById('gif-speed').value
  const gifOut = document.getElementById('gif-out')
  let i = 0

  clearInterval(intervalId)
  intervalId = setInterval(() => {
    const [text, image] = sync[i]
    gifOut.innerHTML = formatSyncNode(text, image)
    i = i + 1 < sync.length ? i + 1 : 0
  }, Number(gifSpeed))
})

document.getElementById('gif-stop').addEventListener('click', () => {
  clearInterval(intervalId)
})

document.getElementById('gif-clear').addEventListener('click', () => {
  clearInterval(intervalId)
  document.getElementById('gif-out').innerHTML = ''
})

document.getElementById('sync-text').addEventListener('input', e => {
  const text = e.target.value
  const sync = getSync(text)
  const syncOut = document.getElementById('sync-out')
  syncOut.innerHTML = ''
  for (const [text, image] of sync) {
    syncOut.innerHTML += formatSyncNode(text, image)
  }
})

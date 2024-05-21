const images = new Map(
  [
    'A,E,I.png',
    'B,M,P.png',
    'C,D,N,S,T,X,Y,Z.png',
    'F,V.png',
    'J,CH,SH.png',
    'L.png',
    'O.png',
    'Q,W.png',
    'R.png',
  ].flatMap(image =>
    image
      .slice(0, image.indexOf('.'))
      .split(',')
      .map(l => [l, image]),
  ),
)

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

function getSync(text, syncCb) {
  const result = []
  const onSync =
    syncCb ??
    ((chunk, image) => {
      result.push([chunk, image])
    })

  for (let i = 0; i < text.length; i++) {
    if (!/[A-Za-z]/.test(text[i])) {
      onSync('', '')
      continue
    }
    const syllable = normalize(text[i] + text[i + 1])
    const letter = normalize(text[i])
    if (images.has(syllable)) {
      onSync(syllable, images.get(syllable))
      i++
    } else if (images.has(letter)) {
      onSync(text[i].toUpperCase(), images.get(letter))
    } else {
      console.error('Missing char: ', letter)
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
  const syncOut = document.getElementById('sync-out')
  syncOut.innerHTML = ''
  getSync(text, (chunk, image) => {
    syncOut.innerHTML += formatSyncNode(chunk, image)
  })
})

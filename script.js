const startScreen = document.querySelector('#start-screen')
const startButton = document.querySelector('#start')

const playScreen = document.querySelector('#play-screen')
const glasses = document.querySelector('#glasses')
const pointsEl = document.querySelector('#points')
const progress = document.querySelector('progress')
const charEl = document.querySelector('#char')
const input = document.querySelector('input')

let points = 0

let char

let interval

let time

const startTime = () => {
  clearInterval(interval)
  
  time = 5
  progress.value = time
  
  interval = setInterval(() => {
    time--
    progress.value = time
    if (time === 0) {
        startRound()
    }
  }, 1000)
}

const startRound = () => {
  const letterCode = Math.round(Math.random()*24) + 65
  char = String.fromCharCode(letterCode)
  charEl.textContent = char
  
  charEl.className = ''
  window.requestAnimationFrame(() => {
    charEl.className = 'animate-blur'    
  })
  
  input.value = ''
  
  input.focus()
  
  startTime()
}

startButton.addEventListener('click', () => {
  startScreen.classList.add('slide-out')
  
  startRound()
})

playScreen.addEventListener('animationend', () => {
  playScreen.className = 'screen'
})

input.addEventListener('keydown', () => {
  playScreen.className = 'screen'
})

input.addEventListener('keyup', () => {
  charEl.className = 'no-blur'

  if (input.value.toUpperCase() === char) {
    points += time
    playScreen.className = 'screen animate-success'
  } else {
    points -= time
    playScreen.className = 'screen animate-error'
  }
  pointsEl.innerText = points
  
  setTimeout(startRound, 500)
})

import { playWonTune, playLooseTune, playBeep, playBeepBeep, mute, unmute } from './sound.js'

const ui = {
  startScreen: document.querySelector('.start-screen'),
  startButton: document.querySelector('.start-btn'),
  clearScore: document.querySelector('.clear-score'),
  clearMaxScore: document.querySelector('.clear-max-score'),
  playScreen: document.querySelector('.play-screen'),
  score: document.querySelector('.score'),
  maxScore: document.querySelector('.max-score'),
  progress: document.querySelector('progress'),
  char: document.querySelector('.char'),
  input: document.querySelector('input'),
  pause: document.querySelector('.pause-btn'),
  mute: document.querySelector('.mute-btn'),
}

const MAX_SCORE = 'max-score'

const state = {
  score: 0,
  char: '',
  interval: undefined,
  time: undefined,
  maxScore: Number(localStorage.getItem(MAX_SCORE)),
  muted: false,
}

const startTime = () => {
  clearInterval(state.interval)
  
  state.time = 5
  ui.progress.value = state.time
  
  state.interval = setInterval(async () => {
    state.time--
    ui.progress.value = state.time
    playBeep()
    if (state.time === 0) {
        await playBeepBeep()
        setTimeout(startRound, 100)
    }
  }, 1000)
}

const startRound = () => {
  const letterCode = Math.round(Math.random()*24) + 65
  state.char = String.fromCharCode(letterCode)
  ui.char.textContent = state.char
  
  ui.char.classList.remove('no-blur', 'animate-blur')
  window.requestAnimationFrame(() => {
    ui.char.classList.add('animate-blur')    
  })
  
  ui.input.value = ''
  
  ui.input.focus()
  
  startTime()
}

ui.startButton.addEventListener('click', () => {
  ui.startScreen.classList.add('slide-out')
  setMaxScore(state.maxScore)
  startRound()
})

ui.playScreen.addEventListener('animationend', () => {
  ui.playScreen.classList.remove('animate-success', 'animate-error')
})

ui.input.addEventListener('keydown', () => {
  ui.playScreen.classList.remove('animate-success', 'animate-error')
})

const setScore = (newScore) => {
  state.score = newScore
  ui.score.innerText = newScore
}

const setMaxScore = (newMaxScore) => {
  state.maxScore = newMaxScore
  localStorage.setItem(MAX_SCORE, newMaxScore)
  ui.maxScore.innerText = newMaxScore
}

const updatePoints = (guessed) => {
  if (guessed) {
    ui.playScreen.classList.add('animate-success')
    
    setScore(state.score + state.time)
    
    if (state.score > state.maxScore) {
      setMaxScore(state.score)
    }
    return playWonTune()
  } else {
    ui.playScreen.classList.add('animate-error')
    
    setScore(state.score - state.time)
    
    return playLooseTune()
  }
}

ui.input.addEventListener('keydown', async (ev) => {
  ui.char.classList.add('no-blur')

  clearInterval(state.interval)

  const value = ev.key.toUpperCase()
  if (value.length > 1 || value < 'A' || value > 'Z') {
    return
  } 
  ui.input.value = value

  await updatePoints(value === state.char)
  
  startRound()
})

ui.input.addEventListener('keydown', (ev) => {
  ev.preventDefault()
})

ui.clearMaxScore.addEventListener('click', () => {
  setMaxScore(0)
})

ui.clearScore.addEventListener('click', () => {
  setScore(0)
})

ui.pause.addEventListener('click', () => {
  if (state.interval) {
    clearInterval(state.interval)
    state.interval = undefined
    ui.pause.classList.add('active')
    ui.char.classList.add('paused')
  } else {
    startRound()
    ui.char.classList.remove('paused')
    ui.pause.classList.remove('active')
  }
})

ui.mute.addEventListener('click', () => {
  if (state.muted) {
    unmute()
    state.muted = false
    ui.mute.classList.remove('active')
  } else {
    mute()
    state.muted = true
    ui.mute.classList.add('active')
  }
})

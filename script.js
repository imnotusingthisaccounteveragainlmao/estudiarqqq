const studyTime = 50 * 60;
const breakTime = 10 * 60;

let isStudy = true;
let timeLeft = studyTime;
let timerInterval = null;

const timerEl = document.getElementById('timer');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');

const studyEndSound = new Audio('study_end.mp3');
const breakEndSound = new Audio('break_end.mp3');

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function saveState() {
  localStorage.setItem("timerState", JSON.stringify({
    timeLeft,
    isStudy,
    lastUpdated: Date.now()
  }));
}

function loadState() {
  const saved = localStorage.getItem("timerState");
  if (saved) {
    const { timeLeft: savedTimeLeft, isStudy: savedIsStudy, lastUpdated } = JSON.parse(saved);
    const elapsed = Math.floor((Date.now() - lastUpdated) / 1000);
    timeLeft = savedTimeLeft - elapsed;
    isStudy = savedIsStudy;

    if (timeLeft <= 0) {
      switchPhase();
    }
  }
}

function switchPhase() {
  if (isStudy) {
    studyEndSound.play();
    isStudy = false;
    timeLeft = breakTime;
    statusEl.textContent = "Tiempo de descanso";
  } else {
    breakEndSound.play();
    isStudy = true;
    timeLeft = studyTime;
    statusEl.textContent = "Tiempo de estudio";
  }
  updateTimerDisplay();
  saveState();
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    saveState();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      switchPhase();
      startTimer();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isStudy = true;
  timeLeft = studyTime;
  statusEl.textContent = "Tiempo de estudio";
  updateTimerDisplay();
  localStorage.removeItem("timerState");
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// Inicializa desde el estado guardado
loadState();
updateTimerDisplay();
statusEl.textContent = isStudy ? "Tiempo de estudio" : "Tiempo de descanso";

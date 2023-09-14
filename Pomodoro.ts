class PomodoroTimer {
  private timerElement: HTMLParagraphElement;
  private startButton: HTMLButtonElement;
  private resetButton: HTMLButtonElement;
  private interval: number | undefined;
  private isRunning: boolean;
  private minutes: number;
  private seconds: number;

  constructor() {
    this.timerElement = document.getElementById(
      "timer"
    ) as HTMLParagraphElement;
    this.startButton = document.getElementById(
      "start-button"
    ) as HTMLButtonElement;
    this.resetButton = document.getElementById(
      "reset-button"
    ) as HTMLButtonElement;
    this.isRunning = false;
    this.minutes = 25;
    this.seconds = 0;

    this.initializeButtons();
    this.updateTimerDisplay();
  }

  private initializeButtons() {
    this.startButton.addEventListener("click", () => this.startOrPauseTimer());
    this.resetButton.addEventListener("click", () => this.resetTimer());
    this.updateStartButtonText();
  }

  private startOrPauseTimer() {
    if (!this.isRunning) {
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  }

  private startTimer() {
    this.interval = setInterval(() => {
      if (this.minutes === 0 && this.seconds === 0) {
        this.completePomodoro();
        return;
      }
      this.updateTime();
      this.updateTimerDisplay();
    }, 1000);
    this.isRunning = true;
    this.updateStartButtonText();
  }

  private pauseTimer() {
    clearInterval(this.interval);
    this.isRunning = false;
    this.updateStartButtonText();
  }

  private completePomodoro() {
    clearInterval(this.interval);
    alert("Pomodoro completed!");
    this.isRunning = false;
    this.resetTimer();
  }

  private resetTimer() {
    clearInterval(this.interval);
    this.isRunning = false;
    this.minutes = 25;
    this.seconds = 0;
    this.updateTimerDisplay();
    this.updateStartButtonText();
  }

  private updateStartButtonText() {
    this.startButton.innerText = this.isRunning ? "Pause" : "Start";
  }

  private updateTimerDisplay() {
    this.timerElement.innerText = `${this.minutes}:${
      this.seconds < 10 ? "0" : ""
    }${this.seconds}`;
  }

  private updateTime() {
    if (this.seconds === 0) {
      this.minutes--;
      this.seconds = 59;
    } else {
      this.seconds--;
    }
  }
}

const pomodoro = new PomodoroTimer();

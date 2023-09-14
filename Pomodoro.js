"use strict";
class PomodoroTimer {
    constructor() {
        this.timerElement = document.getElementById("timer");
        this.startButton = document.getElementById("start-button");
        this.resetButton = document.getElementById("reset-button");
        this.isRunning = false;
        this.minutes = 25;
        this.seconds = 0;
        this.initializeButtons();
        this.updateTimerDisplay();
    }
    initializeButtons() {
        this.startButton.addEventListener("click", () => this.startOrPauseTimer());
        this.resetButton.addEventListener("click", () => this.resetTimer());
        this.updateStartButtonText();
    }
    startOrPauseTimer() {
        if (!this.isRunning) {
            this.startTimer();
        }
        else {
            this.pauseTimer();
        }
    }
    startTimer() {
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
    pauseTimer() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.updateStartButtonText();
    }
    completePomodoro() {
        clearInterval(this.interval);
        alert("Pomodoro completed!");
        this.isRunning = false;
        this.resetTimer();
    }
    resetTimer() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.minutes = 25;
        this.seconds = 0;
        this.updateTimerDisplay();
        this.updateStartButtonText();
    }
    updateStartButtonText() {
        this.startButton.innerText = this.isRunning ? "Pause" : "Start";
    }
    updateTimerDisplay() {
        this.timerElement.innerText = `${this.minutes}:${this.seconds < 10 ? "0" : ""}${this.seconds}`;
    }
    updateTime() {
        if (this.seconds === 0) {
            this.minutes--;
            this.seconds = 59;
        }
        else {
            this.seconds--;
        }
    }
}
const pomodoro = new PomodoroTimer();

document.addEventListener('DOMContentLoaded', function () {
    var currentQuestion = 0;
    var score = 0;
    var timeLeft = 60; 
    var timerInterval;

    function displayHighScores() {
        var highScoresElement = document.querySelector('.high-scores');
        var highScoresList = document.getElementById('highScoresList');
        var storedScores = JSON.parse(localStorage.getItem('highScores'));

        if (storedScores && storedScores.length > 0) {
            highScoresElement.style.display = 'block'; 
            highScoresList.innerHTML = ''; 

            storedScores.forEach(score => {
                var scoreItem = document.createElement('li');
                scoreItem.textContent = `${score.name}: ${score.score}`;
                highScoresList.appendChild(scoreItem);
            });
        } else {
            highScoresElement.style.display = 'none';
        }
    }

    function saveScore() {
        var nameInput = document.getElementById('nameInput').value.trim();
        if (nameInput === '') {
            alert('Please enter your name.');
            return;
        }

        var scoreObject = {
            name: nameInput,
            score: score
        };
        var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(scoreObject);
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highScores', JSON.stringify(highScores));
        displayHighScores();
    }

    function displayQuestion() {
        var questionElement = document.querySelector('.question');
        var choicesElement = document.querySelector('.choices');

        if (currentQuestion < quizData.length) {
            questionElement.textContent = quizData[currentQuestion].question;
            choicesElement.innerHTML = '';

            quizData[currentQuestion].answers.forEach((answer, index) => {
                var choice = document.createElement('button');
                choice.textContent = answer;
                choice.addEventListener('click', () => checkAnswer(index));
                choicesElement.appendChild(choice);
            });
        } else {
            endQuiz();
        }
    }

    function checkAnswer(selectedIndex) {
        var correctIndex = quizData[currentQuestion].correct;
        if (selectedIndex === correctIndex) {
            score++;
        } else {
            timeLeft -= 10;
        }
        currentQuestion++;
        displayQuestion();
    }

    function startQuiz() {
        var homePage = document.querySelector('.home_page');
        var quizContainer = document.querySelector('.quiz-container');

        if (homePage && quizContainer) {
            homePage.style.display = 'none';
            quizContainer.style.display = 'block';

            timerInterval = setInterval(updateTimer, 1000);
            displayQuestion();
        }
    }

    document.getElementById('startButton').addEventListener('click', startQuiz);

    function updateTimer() {
        var timerElement = document.querySelector('.timer');
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = `Time: ${timeLeft} seconds`;
        } else {
            endQuiz();
        }
    }

    function endQuiz() {
        clearInterval(timerInterval);
        var quizContainer = document.querySelector('.quiz-container');
        quizContainer.style.display = 'none';

        var scoreElement = document.querySelector('.score');
        scoreElement.innerHTML = `Your Score: <span id="finalScore">${score}</span><br>
    Enter your name: <input type="text" id="nameInput">
    <button id="saveScoreButton">Save Score</button>`;
        scoreElement.style.display = 'block';

        document.getElementById('saveScoreButton').addEventListener('click', saveScore);

        document.getElementById('restartButton').style.display = 'block';
    }

    document.getElementById('restartButton').addEventListener('click', restartQuiz);

    function restartQuiz() {
        var highScoresList = document.getElementById('highScoresList');
        currentQuestion = 0;
        score = 0;
        timeLeft = 60; 

        var timerElement = document.getElementById('timeLeft');
        if (timerElement) {
            timerElement.textContent = timeLeft + ' seconds';
        }

        var scoreElement = document.querySelector('.score');
        if (scoreElement) {
            scoreElement.style.display = 'none';
        }

        var highScoresElement = document.querySelector('.high-scores');
        if (highScoresElement) {
            highScoresElement.style.display = 'none';
        }

        var quizContainer = document.querySelector('.quiz-container');
        if (quizContainer) {
            quizContainer.style.display = 'block';
        }

        displayQuestion();

        var restartButton = document.getElementById('restartButton');
        if (restartButton) {
            restartButton.style.display = 'none';
            highScoresList.style.display = 'none';
        }
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    var closeButton = document.getElementById('closeButton');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            location.reload();
        });
    }

    var viewHighScoreLink = document.getElementById('viewHighScoreLink');
    var highScoresList = document.getElementById('highScoresList');

    if (viewHighScoreLink) {
        viewHighScoreLink.addEventListener('click', function (event) {
            event.preventDefault();

            displayHighScores();
            highScoresList.style.display = 'block';
            closeButton.style.display = 'block';
            clearInterval(timerInterval);
        });
    }


});
//recuperiamo tutti gli elementi richiesti

const startBtn = document.querySelector(".start_btn button");
const infoBox = document.querySelector(".info_box");
const exitBtn = document.querySelector(".info_box .buttons .quit");
const continueBtn = document.querySelector(".info_box .buttons .restart");
const quizBox = document.querySelector(".quiz_box");
const nextBtn = document.querySelector(".next_btn");
const questionText = document.querySelector(".question_text");
const optionList = document.querySelector(".option_list");
const timeCount = document.querySelector(".timer .timer_seconds");
const timeLine = document.querySelector("header .time_line");
const timeOff = document.querySelector("header .time_text");
const resultBox = document.querySelector(".result_box");
const restartQuiz = document.querySelector(".result_box .buttons .restart");
const quitQuiz = document.querySelector(".result_box .buttons .quit");
const iconHourglass = document.querySelector(".fa-hourglass-start");


let counterQuestions = 0;
let numberQuestions = 1;
let counter;
let counterLine;
let timeValue = 15;
let widthValue = 0;
let userScore = 0;


//se si fa clic sul pulsante Avvia Quiz
startBtn.addEventListener("click", function()
{
    infoBox.classList.add("active_info"); //mostra il riquadro informativo
});


//se si fa clic sul pulsante di uscita
exitBtn.addEventListener("click", function()
{
    infoBox.classList.remove("active_info"); //nasconde il riquadro informativo
});


//se si fa clic sul pulsante di continua
continueBtn.addEventListener("click", function()
{
    infoBox.classList.remove("active_info"); //nasconde il riquadro informativo
    quizBox.classList.add("active_quiz"); //mostra il riquadro del quiz

    showQuestions(0);
    countQuestionsFooter(1);
    startTimer(15);
    startTimeProgressLine(0);
});


restartQuiz.addEventListener("click", function()
{
    quizBox.classList.add("active_quiz");
    resultBox.classList.remove("active_result");

    counterQuestions = 0;
    numberQuestions = 1;
    timeValue = 15;
    widthValue = 0;
    userScore = 0;

    showQuestions(counterQuestions);
    countQuestionsFooter(numberQuestions);

    clearInterval(counter);
    startTimer(timeValue);

    clearInterval(counterLine);
    startTimeProgressLine(widthValue);

    nextBtn.style.display = "none";

    timeOff.textContent = "Tempo rimasto";
    iconHourglass.classList.add("fa-shake");
});

quitQuiz.addEventListener("click", function()
{
    window.location.reload();
});


//se si fa clic sul pulsante Avanti
nextBtn.addEventListener("click", function()
{
    if(counterQuestions < domande.length - 1)
    {
        counterQuestions++;
        numberQuestions++;

        showQuestions(counterQuestions);
        countQuestionsFooter(numberQuestions);

        clearInterval(counter);
        startTimer(timeValue);

        clearInterval(counterLine);
        startTimeProgressLine(widthValue);

        nextBtn.style.display = "none";

        timeOff.textContent = "Tempo rimasto";
        iconHourglass.classList.add("fa-shake");
    }
    else 
    {
        clearInterval(counter);
        clearInterval(counterLine);

        console.log("Domande completate");
        showResultBox();
    }
});


// ricevere domande e opzioni dall'array

function showQuestions(index)
{
    let questionTag = '<span>' + domande[index].numero + ". " + domande[index].domanda + '</span>';

    let optionTag = 
    '<div class="option"><span>' + domande[index].opzioni[0] + '</span></div>' + 
    '<div class="option"><span>' + domande[index].opzioni[1] + '</span></div>' +  
    '<div class="option"><span>' + domande[index].opzioni[2] + '</span></div>' +  
    '<div class="option"><span>' + domande[index].opzioni[3] + '</span></div>';

    questionText.innerHTML = questionTag;
    optionList.innerHTML = optionTag;

    /*
       Viene inserito qui e non sopra sotto alla variabile optionList perchè 
       gli elementi con la classe option vengono creati dopo.
    */
    const option = document.querySelectorAll(".option");

    for(let i = 0; i < option.length; i++)
    {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}


let tickIcon = '<div class="icon tick"><i class="fa-solid fa-check"></i></div>';
let crossIcon = '<div class="icon cross"><i class="fa-solid fa-xmark"></i></div>';


function optionSelected(risposta)
{
    clearInterval(counter);
    clearInterval(counterLine);

    let rispostaUtente = risposta.textContent;
    let rispostaCorretta = domande[counterQuestions].risposta;
    let tutteLeOpzioni = optionList.children.length;

    if(rispostaUtente == rispostaCorretta)
    {
        userScore++;

        console.log("risposta corretta!");
        console.log(userScore);

        risposta.classList.add("correct");
        risposta.insertAdjacentHTML("beforeend", tickIcon);   
    }
    else 
    {
        console.log("Risposta errata!");

        risposta.classList.add("incorrect");
        risposta.insertAdjacentHTML("beforeend", crossIcon);

        //Se le risposte non sono corrette, viene selezionata automaticamente la risposta corretta.
        for(let i = 0; i < tutteLeOpzioni; i++)
        {
            if(optionList.children[i].textContent == rispostaCorretta)
            {
                optionList.children[i].setAttribute("class", "option correct");
                optionList.children[i].insertAdjacentHTML("beforeend", tickIcon);
            }
        }
    }

    //una volta che l'utente ha selezionato disabilita tutte le opzioni
    for(let i = 0; i < tutteLeOpzioni; i++)
    {
        optionList.children[i].classList.add("disabled");
    }

    nextBtn.style.display = "block";
}


function showResultBox()
{
    infoBox.classList.remove("active_info"); //nasconde il riquadro informativo
    quizBox.classList.remove("active_quiz"); //nasconde il riquadro del quiz
    resultBox.classList.add("active_result"); //mostra il riquadro del risultato finale

    const scoreText = document.querySelector(".score_text");

    if(userScore > 3)
    {
        let scoreTag = '<span>Congratulazioni!, hai indovinato <p>' + userScore + '</p> su <p>' + domande.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else if(userScore > 1)
    {
        let scoreTag = '<span>Bravo, hai indovinato <p>' + userScore + '</p> su <p>' + domande.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else 
    {
        let scoreTag = '<span>Ci spiace, hai indovinato solo <p>' + userScore + '</p> su <p>' + domande.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}


function startTimer(tempo)
{
    counter = setInterval(timer, 1000);

    function timer()
    {
        timeCount.textContent = tempo;
        tempo--;

        if(tempo < 9)
        {
            let aggiungiZero = timeCount.textContent;
            timeCount.textContent = "0" + aggiungiZero;
        }
        if(tempo < 0)
        {
            clearInterval(counter);
            timeCount.textContent = "00";
            timeOff.textContent = "Tempo scaduto";

            iconHourglass.classList.remove("fa-shake");

            let rispostaCorretta = domande[counterQuestions].risposta;
            let tutteLeOpzioni = optionList.children.length;

            //Se le risposte non sono corrette, viene selezionata automaticamente la risposta corretta.
            for(let i = 0; i < tutteLeOpzioni; i++)
            {
                if(optionList.children[i].textContent == rispostaCorretta)
                {
                    optionList.children[i].setAttribute("class", "option correct");
                    optionList.children[i].insertAdjacentHTML("beforeend", tickIcon);
                }
            }

            //una volta che l'utente ha selezionato disabilita tutte le opzioni
            for(let i = 0; i < tutteLeOpzioni; i++)
            {
                optionList.children[i].classList.add("disabled");
            }

            nextBtn.style.display = "block";
        }
    }
}


function startTimeProgressLine(tempo)
{
    counterLine = setInterval(timer, 17);

    function timer()
    {
        tempo += 1; // ogni 30 millisescondi aumenta di 1px
        timeLine.style.width = tempo + "px";

        if(tempo > 549) //550 è la larghezza del riquadro
        {
            clearInterval(counterLine);
        }
    }
}


function countQuestionsFooter(index)
{
    const totalQuestion = document.querySelector(".total_question");
    let totalQuestionCountTag = '<span><p>' + index + '</p>di<p>' + domande.length + '</p>domande</span>';
    totalQuestion.innerHTML = totalQuestionCountTag;
}


let categoriesMap = {}; 
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    let categoriesMap = {};

    fetch('https://opentdb.com/api_category.php')
        .then(response => response.json())
        .then(data => {
            const categories = data.trivia_categories;

            categories.forEach(category => {
                
                categoriesMap[category.id] = category.name;

                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
});

document.getElementById('quizForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const qNumber = document.getElementById('qNumber').value;

    
    const selectedCategoryName = categoriesMap[category];

    const apiUrl = `https://opentdb.com/api.php?amount=${qNumber}&category=${category}&difficulty=${difficulty}&type=multiple`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayQuestions(data.results, selectedCategoryName); 
        })
        .catch(error => console.error('Error fetching questions:', error));
});

let currentQuestionIndex = 0;
let score = 0;

function displayQuestions(questions, categoryName) {
    const contentDiv = document.querySelector('.content');
    const ansDiv = document.querySelector('.ans');
    const catName = document.querySelector('.catName');
    const qNum = document.querySelector('.qNum');
    const quest = document.querySelector('.question-text');
    const answerList = document.querySelector('.chAns');
    const nextButton = document.querySelector('.next-question');
    const retryButton = document.querySelector('.retry');
    const scoreDisplay = document.querySelector('.score');
    
    
    contentDiv.classList.add('hide');
    ansDiv.classList.remove('hide');
    
   
    catName.textContent = `Category: ${categoryName}`;
    
   
    function showQuestion(index) {
        const question = questions[index];
        quest.innerHTML = `${question.question}`;
        qNum.textContent = `Question: ${index + 1}`;
        
        answerList.innerHTML = '';

        
        const answers = [...question.incorrect_answers, question.correct_answer];
        answers.sort(() => Math.random() - 0.5);

        // عرض الإجابات
        answers.forEach(answer => {
            const li = document.createElement('li');
            li.textContent = answer;
            li.addEventListener('click', () => {
                
                if (answer === question.correct_answer) {
                    li.style.backgroundColor ="green"; 
                    score++;
                    scoreDisplay.textContent = score;

                     
                }
                else{
                    li.style.backgroundColor ="red"; 
                }
                nextButton.classList.remove('hide');
                
            });
            answerList.appendChild(li);
            // li.style.backgroundColor ="rgb(154, 196, 252)"; 
            // li.style.borderRadius ="10px"; 
            // li.style.padding ="5px 10px"; 
            // li.style.margin="10px"; 
            // li.style.listStyle="none"; 
            


        });
    }

    
    showQuestion(currentQuestionIndex);

   
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
            nextButton.classList.add('hide'); 
        } else {
            quest.innerHTML = `Quiz Finished! Your final score is: ${score}`;
            answerList.innerHTML = '';
            nextButton.classList.add('hide'); //
            retryButton.classList.remove('hide'); // 
        }
    });

    
    retryButton.addEventListener('click', () => {
        location.reload(); //
    });
}

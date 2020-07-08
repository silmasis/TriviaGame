$(document).ready(function(){
  
  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',
  // questions options and answers data
  questions: {
    q1: 'What year did the Miami Dophins get the only undefeated season in NFL history?',
    q2: 'Which NFL franchise has the all-time worst win-loss percentage?',
    q3: 'The current Baltimore Ravens used to be know as:',
    q4: 'How many Super Bowl Appearances does the New England Patriots have?',
    q5: 'What is the oldest stadium constructed specifically for the NFL?',
    q6: 'Who is the only NFL team to not play on Thanksgiving?',
    q7: 'Who has the longest field goal in NFL history?',
    q8: 'How many years must a player be retired to be eligible for the Pro Football Hall of Fame?',
    q9: 'Which Super Bowl was the most-watched ever?',
    q10: 'Which NFL team blew a 28-3 lead in the Super Bowl?'
  },
  options: {
    q1: ['1969', '1970', '1972', '1973'],
    q2: ['Arizona Cardinals', 'Atlanta Falcons', 'Tampa Bay Buccaneers', 'Jacksonville Jaguars'],
    q3: ['Baltimore Colts', 'Cleveland Browns', 'Houston Oilers', 'New York Titans'],
    q4: ['5', '6', '10', '11'],
    q5: ['Lambeau Field','Soldier Field','L.A. Memorial Coliseum','Arrowhead Stadium'],
    q6: ['Cleveland Browns','Jacksonville Jaguars','Houston Texans','Los Angeles Rams'],
    q7: ['Adam Vinatieri', 'Matt Prater', 'Sebastian Janikowski','Justin Tucker'],
    q8: ['5','8','10','15'],
    q9: ['SB46: Patriots vs Giants','SB49: Patriots vs Seahawks','SB50: Panthers vs Broncos','SB51:Patriots vs Falcons'],
    q10: ['Atlanta Falcons','Atlanta Falcons','Atlanta Falcons','Atlanta Falcons']
  },
  answers: {
    q1: '1972',
    q2: 'Tampa Bay Buccaneers',
    q3: 'Cleveland Browns',
    q4: '11',
    q5: 'Lambeau Field',
    q6: 'Jacksonville Jaguars',
    q7: 'Matt Prater',
    q8: '5',
    q9: 'SB49: Patriots vs Seahawks',
    q10: 'Atlanta Falcons'
  },
  // trivia methods
  // method to initialize game
  startGame: function(){
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // show game section
    $('#game').show();
    
    //  empty last results
    $('#results').html('');
    
    // show timer
    $('#timer').text(trivia.timer);
    
    // remove start button
    $('#start').hide();

    $('#remaining-time').show();
    
    // ask first question
    trivia.nextQuestion();
    
  },
  // method to loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 20 seconds each question
    trivia.timer = 20;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Thank you for playing!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unaswered: '+ trivia.unanswered +'</p>'+
        '<p>Please play again!</p>');
      
      // hide game sction
      $('#game').hide();
      
      // show start button to begin a new game
      $('#start').show();
    }
    
  },
  // method to evaluate the option clicked
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else{
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}
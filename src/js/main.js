/* global $, window, document, setInterval, clearInterval, setTimeout, clearTimeout */
/* jshint strict:false */

var hand = ['rock', 'paper', 'scissors', 'lizard', 'spock']; // Defines all combinations
var p1score = 0; // Initial scores of both player
var p2score = 0;
var p1name = "Computer"; // Initial names of both player
var p2name = "Human";
var numberOfHands = 3; // The initial number of options - rock, paper, scossors
var resetView;
var player1result = null; // null values for the score
var player2result = null;
var gamesPlayed = 0; // total number of games played
var computerPlays = false; // auto-play mode on-off (computer vs computer)
var autoPlay; // Define interval variable
var p1stat = []; // Define empty Statistics
var p2stat = [];

// Function for setting up the initial values and binding the event handlers
function initStart() {
	
	// Fills the players' names
	$('.player1').html(p1name);
	$('.player2').html(p2name);
	
	
	// Adding Spock and Lizard to the game
	$('.switch').click(function(){
		$('.lizard-hand, .spock-hand').fadeToggle();
		$(this).html($(this).html() == 'Add Lizard and Spock' ? 'Remove Lizard and Spock' : 'Add Lizard and Spock');
		if (numberOfHands == 3) { numberOfHands = 5; } else { numberOfHands = 3; }
	});
	
	// click on one of the options does this
	$('.player1-hand .card').click(function(){
		$('.select-hand').removeClass('select-hand');
		$(this).addClass('select-hand');	
		var handIs = $(this).attr('id');
		compareResults(handIs);
	});	
	
	//  Restarting the game 
	$('.restart-game').click(function(){
		p1score = 0; 
		p2score = 0; 
		$('.p1score').html(p1score);
		$('.p2score').html(p2score);
		$('#history li').remove();
		$('#history').hide();
		for(var n=0; n < 5;  n++) {
			p1stat[hand[n]] = undefined;
			p2stat[hand[n]] = undefined;
		}
	});
	
	//  Change Names Form 
	$('.change-names').click(function(){
		$('.overlay>div.overlay-content').remove();
		var nameForm = '<div class="overlay-content">'+
						'<h3>Change the name of players</h3>'+
						'<form id="namesForm">'+
							'<input type="text" name="changep1" placeholder="Change the name of player 1 (currently: '+p1name+')"/>'+
							'<input type="text" name="changep2"  placeholder="Change the name of player 2 (currently: '+p2name+')"/>'+
							'<input type="submit" value="Change Names" />'+
						'</form>'+
					'</div>';

		$('.overlay').fadeIn(100).append(nameForm);

		$('#namesForm').submit(function(e){
			if($('input[name="changep1"]').val()){
				p1name = $( $.parseHTML( $('input[name="changep1"]').val() ) ).text();
			}
			if($('input[name="changep2"]').val()){
				p2name = $( $.parseHTML( $('input[name="changep2"]').val() ) ).text(); 
			}
			$('.player1').html(p1name);
			$('.player2').html(p2name);
			$('.overlay').fadeOut(100);
			e.preventDefault();
		});		
	});




	// Turn on-off auto-play mode	
	$('.vs-cpu').click(function(){
		if(computerPlays) { 
			$(this).html('CPU vs CPU');
			$('.restart-game').click();
			clearInterval(autoPlay);
		} else {
			$(this).html('Player vs CPU');
			$('.restart-game').click();
			autoPlay = setInterval(computerVsComputer, 1300);				
		}
		computerPlays = !computerPlays;
	});
	
	// Shows Statistics
	$('.stats').click(function(){
		$('.overlay>div.overlay-content').remove();
		$('.overlay').append("<div class='overlay-content statistics'><h3>Total matches: "+ gamesPlayed + "</h3><br/><br/></div>");
		
		for(var n=0; n < numberOfHands;  n++) {
			if(p1stat[hand[n]] === undefined) {p1stat[hand[n]] = 0;}
			if(p2stat[hand[n]] === undefined) {p2stat[hand[n]] = 0;}
			$('.overlay-content').append("<p>" + p1name + " : " + p1stat[hand[n]] + " x " + hand[n] + "</p>");
			$('.overlay-content').append("<p>" + p2name + " : " + p2stat[hand[n]] + " x " + hand[n] + "</p>");
		}
		
		$('.overlay').fadeIn(100);
		
	});
	
	// Small help menu that calls the rule of the current game
	$('.help-me').click(function(){
		$('.overlay>div.overlay-content').remove();
		var rpslsHelp = '<div class="overlay-content rpsls-help" />';
		var rpsHelp = '<div class="overlay-content rps-help" />';
		if(numberOfHands == 5) {
			$('.overlay').fadeIn(100).append(rpslsHelp);
		} else if(numberOfHands == 3) {
			$('.overlay').fadeIn(100).append(rpsHelp);
		}
	});
	
	// Close the overlay
	$('.close').click(function(){
		$('.overlay').fadeOut(100);
	});
	
	// Show history bar
	$('.history-show').click(function(){
		$('ul#history').toggleClass('hidden-history');
	});
	
	// Burger Menu in mobile view
	$('.burger-menu').click(function(){
		$('.mainmenu li').toggle();
		$('.mainmenu li').addClass('mobile-menu');	
		$('li.mobile-menu').click(function(){
			$('li.mobile-menu').hide();	
			$('.mobile-menu').removeClass('mobile-menu');		
		});
	});
	
	
}

// Getting the random integer number for computer's hand
function computersChoice() {
	return hand[Math.floor(Math.random()*numberOfHands)];
}

// One second after played round, options get default values calling player to make another move
function defaultSate() {
	$('.select-hand').removeClass('select-hand');	
	$('.player2-hand .card img').attr('src','./images/hidden.png');	
	$('.result').html('Choose Your Hand');
}

// Defining the rules of the game
function compareResults(yourChoice) {
	clearTimeout(resetView);
	
	var computer = computersChoice();
	$('.player2-hand .card img').attr('src','./images/'+computer+'.png');
	
	if(p1stat[computer] === undefined) { 
		p1stat[computer] = 1; 
	} else { 
		p1stat[computer]++; 
	}

	if(p2stat[yourChoice] === undefined) { 
		p2stat[yourChoice] = 1; 
	} else { 
		p2stat[yourChoice]++; 
	}

	if (yourChoice == computer) 
	{
		tie();
		player1result = "";
		player2result = "";
	}
	else if (
			(yourChoice == "rock" && (computer == "scissors" || computer == "lizard")) || 
			(yourChoice == "scissors" && (computer == "paper" || computer == "lizard")) || 
			(yourChoice == "paper" && (computer == "rock" || computer == "spock")) || 
			(yourChoice == "spock" && (computer == "scissors" || computer == "rock")) || 
			(yourChoice == "lizard" && (computer == "paper" || computer == "spock"))
			) 
			
	{	
		player1result = "";
		player2result = "won";
		winner();
	} 
	else 
	{
		player1result = "won";
		player2result = "";
		loser();
	}
	updateHistory(yourChoice, computer);
	resetView = setTimeout( defaultSate, 1000);	
}

// What happens if the game is lost
function loser() {	
	$('.result').html('You Lost!');
	p1score++;
	$('.p1score').html(p1score);
	
}

// What happens if the game is won
function winner() {	
	$('.result').html('You Won!');
	p2score++;
	$('.p2score').html(p2score);
}

// What happens if the game is tie
function tie() {
	$('.result').html('Tie!');
}

// Adding the history state
function updateHistory(player2s, player1s) {
	$('.history').fadeIn(100);
	gamesPlayed++;
	var list_width = $('.history li').width(); 
	var list_size = $('.history li').length + 2; 
	
	if(list_width * list_size > $('.history').innerWidth()) {$('.history li:nth-child(2)').remove();}
	
	$('.history').append('<li>'+
					'<img class="historyp1 '+player1result+'" src="images/'+player1s+'.png">'+
					'<img class="historyp2 '+player2result+'" src="images/'+player2s+'.png">'+
				'</li>');
}

// select the random values to emulate player's game in auto-play mode
function computerVsComputer() {
		var clickThis = hand[Math.floor(Math.random()*numberOfHands)];
		$('#'+clickThis).click();
}

// Calling the initial function once the page is loaded.
$(document).ready(function(){ initStart(); });

// Clears the History bar because it overflows the document width. It can be done with similar calculation as above
$(window).resize(function(){
	$('.history').hide();
	$('.history li').remove();
});

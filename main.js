

var name = window.location.hostname;
var socket = io(name+":1314");
var readysound=false;


var keys = {
				'acoustic_grand_piano': [40,42,44,45,47],
				'trumpet' : [0,1,2,3,4],
				'electric_guitar_jazz' : [0,1,2,3,4],
				'accordion' : [0,1,2,3,4]
			};

var rotation = ['acoustic_grand_piano', 'trumpet','electric_guitar_jazz','accordion'];
var rotation_index = {
		'acoustic_grand_piano' : 0, 
			'trumpet' : 1,
			'electric_guitar_jazz' : 2,
			'accordion' : 3};
var violinmp3 = ['vioa', 'viob', 'vioc', 'viod', 'vioe'];
var othermp3 = ['mario', 'cena', 'mario', 'halo', 'gun']


var index=0;

$(document).ready(function () {
	loadInstruments();
	console.log($('#nowplaying li.selected').data('value'));

	$('#nowplaying li').click(function() {
		changeInstrument($(this).data('value'), rotation_index[$(this).data('value')]);
	});
});

socket.on('current_notes', handleData);
//socket.on('current_notes_right', handleDataRight);

function handleData(data) {
	if (!readysound) return;
	var stats = generateState(data);
	console.log("Left");
	console.log(stats);
	stats.forEach(function(el, i) {
		if (el==1) {
			if ($('.keyboard .col-md-2:eq('+(i)+')').hasClass('off')){
				$('.keyboard .col-md-2:eq('+(i)+')').removeClass('off');
				$('.keyboard .col-md-2:eq('+(i)+')').addClass('on');
				playNote(keys[getCurrentInstrument()][(4-i)],0,127, index );
			}
		}
		else {
			if ($('.keyboard .col-md-2:eq('+(i)+')').hasClass('on')){
				$('.keyboard .col-md-2:eq('+(i)+')').removeClass('on');
				$('.keyboard .col-md-2:eq('+(i)+')').addClass('off');
			}
		}
	});

}

function handleDataRight(data) {
	if (!readysound) return;
	var stats = generateState(data);
	console.log("Right");
	console.log(stats);
	stats.forEach(function(el, i) {
		if (el==1) {
			if ($('.keyboard .col-md-2:eq('+(i)+')').hasClass('off')){
				$('.keyboard .col-md-2:eq('+(i)+')').removeClass('off');
				$('.keyboard .col-md-2:eq('+(i)+')').addClass('on');
				playNoteRight(0,0,127, index);
			}
		}
		else {
			if ($('.keyboard .col-md-2:eq('+(i)+')').hasClass('on')){
				$('.keyboard .col-md-2:eq('+(i)+')').removeClass('on');
				$('.keyboard .col-md-2:eq('+(i)+')').addClass('off');
			}
		}
	});

}
function playNote(note, delay, velocity, chan) {
	// play the note
	if (readysound) {
		MIDI.noteOn(chan, note, velocity, delay);
		MIDI.noteOff(chan, note, delay + 0.75);
	}

	if(index == 1){
		var audio = new Audio('trumpet_B3_025_forte_normal.mp3');
		audio.play();}
		
	if(index == 3){
	var audio = new Audio(violinmp3[note]+'.mp3');
	audio.play();
	}

	if(index == 2){
	var audio = new Audio(othermp3[note]+'.mp3');
	audio.play();
	}
}

function playNoteRight(note, delay, velocity, chan) {
	
	var audio = new Audio('trumpet_B3_025_forte_normal.mp3');
	audio.play();}
		
	


function generateState(state) {
	var arr=[];
	var num = state;
	for (var x =0; x< 5; x++) {
		arr[x]=num%2;
		num=Math.floor(num/2);	
	}
	return arr;
}

function loadInstruments() {
	var k = [];
	for (var key in keys) k.push(key);

	MIDI.loadPlugin({
		soundfontUrl: './',
		instruments:  k,
		targetFormat: 'ogg',
		onprogress: function(state, progress) {},
		onsuccess: function() {
			readysound=true;
			changeInstrument(getCurrentInstrument(), rotation_index[getCurrentInstrument()]);
		}
	});
}

function changeInstrument(inst, dex) {
	MIDI.programChange(dex, MIDI.GM.byName[inst].number);
	index = dex;

	$('#nowplaying li.selected').removeClass('selected');
	$('#nowplaying li[data-value='+inst+']').addClass('selected');
}

function getCurrentInstrument() {
	return $('#nowplaying li.selected').data('value');
}


function simulateData() {
	var data = Math.floor(Math.random()*31);
	handleData(data);

	setTimeout(simulateData, 1000);
}

//simulateData();
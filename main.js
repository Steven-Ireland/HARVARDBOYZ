

var name = window.location.hostname;
var socket = io(name+":1314");
var readysound=false;

window.onload = function () {
	MIDI.loadPlugin({
		soundfontUrl: "./",
		instrument: "acoustic_grand_piano",
		onprogress: function(state, progress) {
		},
		onsuccess: function() {
			readysound=true;
		}
	});
};


socket.on('current_notes', function(data) {
	var stats = generateState(data);
	console.log(data);
	console.log(stats);	
	stats.forEach(function(el, i) {
		if (el==1) {
			if ($('.keyboard .col-md-1:eq('+(9-i)+')').hasClass('off')){
				$('.keyboard .col-md-1:eq('+(9-i)+')').removeClass('off');
				$('.keyboard .col-md-1:eq('+(9-i)+')').addClass('on');
				playNote(50+7*i,0,127, 0 );
			}
		}
		else {
			if ($('.keyboard .col-md-1:eq('+(9-i)+')').hasClass('on')){
				$('.keyboard .col-md-1:eq('+(9-i)+')').removeClass('on');
				$('.keyboard .col-md-1:eq('+(9-i)+')').addClass('off');
			}
		}
	});
});

function playNote(note, delay, velocity, chan) {
	// play the note
	if (readysound) {
		MIDI.setVolume(chan, 127);
		MIDI.noteOn(chan, note, velocity, delay);
		MIDI.noteOff(chan, note, delay + 0.75);
	}
}

function generateState(num) {
	var arr=[];
	for (var x =0; x< 5; x++) {
		arr[x]=num%2;
		num=Math.floor(num/2);	
	}
	return arr;
}
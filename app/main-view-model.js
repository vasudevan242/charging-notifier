var Observable = require("data/observable").Observable;
var power = require("nativescript-powerinfo");
var audio = require('nativescript-audio');

function informe() {
    power.startPowerUpdates(function(Info) {
        source.set("status", Info.percent.toFixed(2)+"%");
        page.bindingContext = source;
    });
}

var player = new audio.TNSPlayer();

var playerOptions =  {
    audioFile: '~/song.mp3',
    loop: true,
    completeCallback: function() {
        console.log('finished playing');
    },
    errorCallback: function(errorObject) {
        console.log(JSON.stringify(errorObject));
    },

    infoCallback: function(args) {
        console.log(JSON.stringify(args));
    }
};



function createViewModel() {
    
    var viewModel = new Observable();
    viewModel.test = "";
    viewModel.batterystatusvalue = "";
    viewModel.sliderValue = "";
    viewModel.showDetails = true;
    viewModel.powerUpdateDetails = {};
    viewModel.reminder = false;
    viewModel.textsliderval = "";
    viewModel.notification = "";
    viewModel.isnotify = false;
    viewModel.errormessage = false;
    viewModel.pluggedMessage = false;
    viewModel.setNotificationAlertValue = 0;

    viewModel.BatteryStatus = function( status = true) {
        var model = this;
        if(status) {
            power.startPowerUpdates(function(Info) {
                console.log("details", Info.percent);
                var batterylevel =  Math.ceil(Info.percent);
               model.set("batterystatusvalue" , batterylevel); 
               model.set("sliderValue" , batterylevel );
               model.set("powerUpdateDetails", Info);
               if(Info.plugged > 0) {
                    if(model.isnotify) {
                        if(model.setNotificationAlertValue == batterylevel) {
                            model.play();
                        }
                    }
                } else {
                    model.thanks();
                }
           });
        } else {
            model.stopPlaying();
        }
       
    };

    viewModel.play = function() {
        player.dispose();
        player
        .playFromUrl(playerOptions)
        .then(function(res) {
            console.log(res);
        })
        .catch(function(err) {
            console.log('something went wrong...', err);
        });
    }

    viewModel.stopPlaying = function() {
       player.dispose();
    }

    viewModel.thanks = function() {
        var model = this;
        model.set("isnotify", false);
        model.set("reminder", false);
        model.set("errormessage", false);
        model.set("pluggedMessage" , false);
        model.set("sliderValue" , model.powerUpdateDetails.percent);
        model.stopPlaying();
    }

    viewModel.activateInfo = function() {
        var model = this;
        model.stopPlaying();
        console.log("model",JSON.stringify(model.powerUpdateDetails));
        
        if(model.powerUpdateDetails.plugged > 0) {
            if(model.powerUpdateDetails.percent != 100) {
                if(model.powerUpdateDetails.percent == model.sliderValue) {
                    model.set("errormessage", true);
                } else {
                    if(model.sliderValue > model.powerUpdateDetails.percent) {

                        model.set("isnotify", true);
                        model.set("reminder", true);
                        model.set("errormessage", false);
                        model.set("setNotificationAlertValue", model.sliderValue);

                    } else {
                        model.set("errormessage", true);
                    }
                    
                }
            }
        } else {
            model.set("pluggedMessage" , true);
        }
        
    }

    viewModel.BatteryStatus();

    return viewModel;
}

exports.createViewModel = createViewModel;
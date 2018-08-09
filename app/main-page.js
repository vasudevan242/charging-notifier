
var createViewModel = require("./main-view-model").createViewModel;
var model;
var page;
function onNavigatingTo(args) {
    page = args.object;
    model = createViewModel();
    page.bindingContext = model;
}

function onSliderLoaded(args) {
    const sliderComponent = args.object;
    sliderComponent.on("valueChange", (sargs) => {

        const page = sargs.object.page;
        const vm = page.bindingContext;

        if(sargs.object.value < vm.batterystatusvalue) {
            console.log("asas", vm.batterystatusvalue);
            vm.set("sliderValue", vm.batterystatusvalue);
            vm.set("showDetails", false);
            vm.set("notification", vm.batterystatusvalue);
        } else {
            vm.set("sliderValue", sargs.object.value);
            vm.set("showDetails", true);
            vm.set("notification", sargs.object.value);
        }
    });
}

exports.onNavigatingTo = onNavigatingTo;
exports.onSliderLoaded = onSliderLoaded;


/// not needed///////////
function informe() {
    power.startPowerUpdates(function(Info) {
        source.set("status", Info.percent.toFixed(2)+"%");
        page.bindingContext = source;
    });
}

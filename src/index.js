// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

import Oui from "./lib/OliUI";

function toCapitalizedWords(name) {
    var words = name.match(/[A-Za-z][a-z]*/g) || [];

    return words.map(capitalize).join(" ");
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
}

const BooleanOptions = [
    "disableVandalism",
    "disableLittering",
    "disablePlantAging",
    "disableRideValueAging",
    "disableAllBreakdowns",
    "disableBrakesFailure",
    "freezeWeather",

    "disableClearanceChecks",
    "buildInPauseMode",
    "sandboxMode",
    "neverendingMarketing",

    "ignoreRideIntensity",
    "ignoreResearchStatus",
    "disableSupportLimits",
    "disableTrainLengthLimit",
    "fastLiftHill",
    "enableChainLiftOnAllTrack",
    "enableAllDrawableTrackPieces",
    "showAllOperatingModes",
    "allowArbitraryRideTypeChanges",
    "allowTrackPlaceInvalidHeights",
    "showVehiclesFromOtherTrackTypes",
]

const DefaultOptions = {
    disableVandalism: true,
    disableLittering: true,
    disablePlantAging: true,
    disableRideValueAging: true,
    disableAllBreakdowns: true,
    disableBrakesFailure: true,
    freezeWeather: true
};

function getDefaultSetup(currentSettings = {}) {
    let settings = {};
    for (let i = 0; i < BooleanOptions.length; i++) {
        let key = BooleanOptions[i];
        if (currentSettings[key]) {
            settings[key] = currentSettings[key];
        }
        else {
            settings[key] = false;
            if (DefaultOptions[key]) {
                settings[key] = DefaultOptions[key];
            }
        }
    }
    return settings;
}

function main() {
    let isActive = false;
    if (network.mode == "none") {
        for (let i = 0; i < map.rides.length; i++) {
            if (map.rides[i].name.includes("--cheats")) {
                isActive = true;
                break;
            }
        }
    }

    let loadedSettings = context.sharedStorage.get("Oli414.CheatSave");
    let settings = getDefaultSetup(loadedSettings);

    for (let i = 0; i < BooleanOptions.length; i++) {
        let key = BooleanOptions[i];
        if (isActive)
            cheats[key] = settings[key];
    }

    let window = new Oui.Window("cheat_saver", "Cheat Saver");
    window.setColors(19);
    window.setWidth(280);

    let label = null;
    if (isActive) {
        label = new Oui.Widgets.Label("Cheat saver is active in this park since a ride or shop");
        label.setMargins(0, 0, 0, 0);
        window.addChild(label);
        label = new Oui.Widgets.Label("in this park has \"--cheats\" in the name.");
        label.setMargins(0, 10, 0, 0);
        window.addChild(label);
        label = new Oui.Widgets.Label("Set the default cheats to enable:");
        label.setMargins(0, 6, 0, 0);
        window.addChild(label);
    }
    else {
        label = new Oui.Widgets.Label("Cheat saver is not active in this park.");
        label.setMargins(0, 0, 0, 0);
        window.addChild(label);
        label = new Oui.Widgets.Label("Add \"--cheats\" to a ride or shop name, then save and");
        label.setMargins(0, 0, 0, 0);
        window.addChild(label);
        label = new Oui.Widgets.Label("load the map to enable Cheat Saver for this park.");
        label.setMargins(0, 10, 0, 0);
        window.addChild(label);
        label = new Oui.Widgets.Label("Set the default cheats to enable:");
        label.setMargins(0, 6, 0, 0);
        window.addChild(label);
    }

    let currentGroupBox = new Oui.GroupBox("Common");
    window.addChild(currentGroupBox);
    for (let i = 0; i < BooleanOptions.length; i++) {
        if (i == 7) {
            currentGroupBox = new Oui.GroupBox("Park");
            window.addChild(currentGroupBox);
        }
        else if (i == 11) {
            currentGroupBox = new Oui.GroupBox("Ride");
            window.addChild(currentGroupBox);
        }


        const key = BooleanOptions[i];

        let checkBox = new Oui.Widgets.Checkbox(toCapitalizedWords(key), (value) => {
            settings[key] = value;
            context.sharedStorage.set("Oli414.CheatSave." + key, value);
            if (isActive)
                cheats[key] = value;
        });
        checkBox.setChecked(settings[key]);
        currentGroupBox.addChild(checkBox);
    }

    ui.registerMenuItem("Cheat Saver", function () {
        window.open();
    });
}

registerPlugin({
    name: 'Cheat Saver',
    version: '1.1',
    licence: "MIT",
    authors: ['Oli414'],
    type: 'local',
    main: main
});
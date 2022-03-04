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
    "showVehiclesFromOtherTrackTypes"
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
        if (currentSettings[key] != null) {
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
    let isEnabledForPark = true;
    
    let loadedParkSettings = context.getParkStorage("Oli414.CheatSaver");
    if (loadedParkSettings.get("disableOverwrite", false))
    {
        isEnabledForPark = false;
    }
    
    if (network.mode == "none" && isEnabledForPark) {
        isActive = true;
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
    label = new Oui.Widgets.Label("Cheat Saver allows you to set which cheats you");
    label.setMargins(0, 2, 0, 0);
    window.addChild(label);
    label = new Oui.Widgets.Label("would like to be enabled by default.");
    label.setMargins(0, 12, 0, 0);
    window.addChild(label);
    
    let activeCheckbox = new Oui.Widgets.Checkbox("Disable the cheats overwrite for this park file.", (value) => {
        loadedParkSettings.set("disableOverwrite", value);
    });
    activeCheckbox.setChecked(!isEnabledForPark);
    activeCheckbox.setMargins(0, 4, 0, 0);
    window.addChild(activeCheckbox);

    label = new Oui.Widgets.Label("Changes come into affect after reloading the park.");
    label.setMargins(0, 12, 0, 0);
    window.addChild(label);

    label = new Oui.Widgets.Label("Set the default cheats to enable:");
    label.setMargins(0, 6, 0, 0);
    window.addChild(label);

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
    version: '1.2',
    licence: "MIT",
    targetApiVersion: 46,
    authors: ['Oli414'],
    type: 'local',
    main: main
});
async function setup() {
    const patchExportURL = "export/my_polysynth3.export.json";

    // Create AudioContext
    const WAContext = window.AudioContext || window.webkitAudioContext;
    const context = new WAContext();

    // Create gain node and connect it to audio output
    const outputNode = context.createGain();
    outputNode.connect(context.destination);

    // Fetch the exported patcher
    let response, patcher;
    try {
        response = await fetch(patchExportURL);
        patcher = await response.json();

        if (!window.RNBO) {
            // Load RNBO script dynamically
            // Note that you can skip this by knowing the RNBO version of your patch
            // beforehand and just include it using a <script> tag
            await loadRNBOScript(patcher.desc.meta.rnboversion);
        }

    } catch (err) {
        const errorContext = {
            error: err
        };
        if (response && (response.status >= 300 || response.status < 200)) {
            errorContext.header = `Couldn't load patcher export bundle`,
            errorContext.description = `Check app.js to see what file it's trying to load. Currently it's` +
            ` trying to load "${patchExportURL}". If that doesn't` +
            ` match the name of the file you exported from RNBO, modify` +
            ` patchExportURL in app.js.`;
        }
        if (typeof guardrails === "function") {
            guardrails(errorContext);
        } else {
            throw err;
        }
        return;
    }

    // (Optional) Fetch the dependencies
    let dependencies = [];
    try {
        const dependenciesResponse = await fetch("export/dependencies.json");
        dependencies = await dependenciesResponse.json();

        // Prepend "export" to any file dependenciies
        dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "export/" + d.file }) : d);
    } catch (e) {}

    // Create the device
    let device;
    try {
        device = await RNBO.createDevice({ context, patcher });
    } catch (err) {
        if (typeof guardrails === "function") {
            guardrails({ error: err });
        } else {
            throw err;
        }
        return;
    }

    // (Optional) Load the samples
    if (dependencies.length)
        await device.loadDataBufferDependencies(dependencies);

    // Connect the device to the web audio graph
    device.node.connect(outputNode);

    // (Optional) Extract the name and rnbo version of the patcher from the description
    document.getElementById("patcher-title").innerText = (patcher.desc.meta.filename || "Unnamed Patcher") + " (v" + patcher.desc.meta.rnboversion + ")";

    // (Optional) Automatically create sliders for the device parameters
    makeSliders(device);

    // (Optional) Create a form to send messages to RNBO inputs
    makeInportForm(device);

    // (Optional) Attach listeners to outports so you can log messages from the RNBO patcher
    attachOutports(device);

    // (Optional) Load presets, if any
    loadPresets(device, patcher);

    // (Optional) Connect MIDI inputs
    makeMIDIKeyboard(device);


    $(document).on('click', 'span.sound_off', () => {
		console.log("sound_off(class)-clocked!");
		//const event1 = new MessageEvent(TimeNow, "fire", [ 1 ]);
		//device.scheduleEvent(event1);
		let startEvent = new RNBO.MessageEvent(RNBO.TimeNow, "gain1", 100);
		device.scheduleEvent(startEvent);

	});

    $(document).on('click', 'span.sound_on', () => {
		console.log("sound_on(class)-clocked!");
		//const event1 = new MessageEvent(TimeNow, "fire", [ 1 ]);
		//device.scheduleEvent(event1);
		let stopEvent = new RNBO.MessageEvent(RNBO.TimeNow, "gain1", 0);
		device.scheduleEvent(stopEvent);

	});

    // let ballcount = 0;
    // console.log("ballcount:" + ballcount);
    // $(document).on('click', 'img.a_btn', () => {
    //     ballcount++;
	// 	console.log("a_btn(class)-clocked!:" + ballcount);
    //     let kickpreset0 = new RNBO.MessageEvent(RNBO.TimeNow, "kickPreset", 0);
    //     let kickpreset1 = new RNBO.MessageEvent(RNBO.TimeNow, "kickPreset", 1);
    //     let kickpreset2 = new RNBO.MessageEvent(RNBO.TimeNow, "kickPreset", 2);
    //     let kickpreset3 = new RNBO.MessageEvent(RNBO.TimeNow, "kickPreset", 3);
    //     let kickflag = 0;
    //     let snearepreset0 = new RNBO.MessageEvent(RNBO.TimeNow, "snearePreset", 0);
    //     let snearepreset1 = new RNBO.MessageEvent(RNBO.TimeNow, "snearePreset", 1);
    //     let snearepreset2 = new RNBO.MessageEvent(RNBO.TimeNow, "snearePreset", 2);
    //     let snearepreset3 = new RNBO.MessageEvent(RNBO.TimeNow, "snearePreset", 3);
    //     let sneareflag = 0;
    //     // if (ballcount == 1) {
    //     //     console.log('gain1on!');
    //     //     let gain1Event = new RNBO.MessageEvent(RNBO.TimeNow, "gain1", 100);
	// 	//     device.scheduleEvent(gain1Event);

    //     //     //監視する要素の指定
    //     //     var element = document.getElementById('posAng1');

    //     //     //MutationObserver（インスタンス）の作成
    //     //     let kicktmp = 0;
    //     //     var mo = new MutationObserver(function(record, observer) {
    //     //         /* 変更検出時に実行する内容 */
    //     //         //console.log("posAng1_changed!");
    //     //         let splitpos1 = element.textContent.split('/');
    //     //         //console.log(splitpos1[3]);
    //     //         if (splitpos1[3] < 162){
    //     //             kickflag = 3;
    //     //         }else if (162 < splitpos1[3] && splitpos1[3] < 324){
    //     //             kickflag = 2;
    //     //         }
    //     //         else if (324 < splitpos1[3] && splitpos1[3] < 468){
    //     //             kickflag = 1;
    //     //         }else{
    //     //             kickflag = 0;
    //     //         }

    //     //         if(kicktmp != kickflag){
    //     //             //Y座標によるpresetの変更
    //     //             if (kickflag == 3) {
    //     //                 console.log("kickpreset3");
    //     //                 device.scheduleEvent(kickpreset3);
    //     //                 kicktmp = 3;
    //     //             }
    //     //             if (kickflag == 2) {
    //     //                 console.log("kickpreset2");
    //     //                 device.scheduleEvent(kickpreset2);
    //     //                 kicktmp = 2;
    //     //             }
    //     //             if (kickflag == 1) {
    //     //                 console.log("kickpreset1");
    //     //                 device.scheduleEvent(kickpreset1);
    //     //                 kicktmp = 1;
    //     //             }
    //     //             if (kickflag == 0) {
    //     //                 console.log("kickpreset0");
    //     //                 device.scheduleEvent(kickpreset0);
    //     //                 kicktmp = 0;
    //     //             }
    //     //         }
    //     //     });

    //     //     //監視する「もの」の指定（必ず1つ以上trueにする）
    //     //     var config = {
    //     //     childList: true,//「子ノード（テキストノードも含む）」の変化
    //     //     attributes: true,//「属性」の変化
    //     //     characterData: true,//「テキストノード」の変化
    //     //     };

    //     //     //監視の開始
    //     //     mo.observe(element, config);
    //     // }
    //     // //二番目が追加されたら
    //     // if (ballcount == 2) {
    //     //     let gain2Event = new RNBO.MessageEvent(RNBO.TimeNow, "gain2", 100);
	// 	//     device.scheduleEvent(gain2Event);

    //     //     //監視する要素の指定
    //     //     var element2 = document.getElementById('posAng2');
    //     //     console.log(element2);

    //     //     //MutationObserver（インスタンス）の作成
    //     //     let snearetmp = 0;
    //     //     var mo2 = new MutationObserver(function(record, observer) {
    //     //         /* 変更検出時に実行する内容 */
    //     //         //console.log("posAng1_changed!");
    //     //         let splitpos2 = element2.textContent.split('/');
    //     //         console.log(splitpos2[3]);
    //     //         if (splitpos2[3] < 162){
    //     //             sneareflag = 3;
    //     //         }else if (162 < splitpos2[3] && splitpos1[3] < 324){
    //     //             sneareflag = 2;
    //     //         }
    //     //         else if (324 < splitpos2[3] && splitpos1[3] < 468){
    //     //             sneareflag = 1;
    //     //         }else{
    //     //             sneareflag = 0;
    //     //         }

    //     //         if (snearetmp != sneareflag) {
    //     //             if (sneareflag == 3) {
    //     //                 console.log("snearepreset3");
    //     //                 device.scheduleEvent(snearepreset3);
    //     //                 snearetmp = 3;
    //     //             }else if(sneareflag == 2) {
    //     //                 console.log("snearepreset3");
    //     //                 device.scheduleEvent(snearepreset2);
    //     //                 snearetmp = 2;
    //     //             }else if (sneareflag == 1) {
    //     //                 console.log("snearepreset3");
    //     //                 device.scheduleEvent(snearepreset1);
    //     //                 snearetmp = 1;
    //     //             }else{
    //     //                 console.log("snearepreset3");
    //     //                 device.scheduleEvent(snearepreset0);
    //     //                 snearetmp = 0;
    //     //             }

    //     //         }
    //     //     });

    //     //     //監視する「もの」の指定（必ず1つ以上trueにする）
    //     //     var config2 = {
    //     //     childList: true,//「子ノード（テキストノードも含む）」の変化
    //     //     attributes: true,//「属性」の変化
    //     //     characterData: true,//「テキストノード」の変化
    //     //     };

    //     //     //監視の開始
    //     //     mo2.observe(element2, config2);
    //     // }
    //     // if (ballcount == 3) {
    //     //     let gain3Event = new RNBO.MessageEvent(RNBO.TimeNow, "gain3", 100);
	// 	//     device.scheduleEvent(gain3Event);
    //     // }
    //     // if (ballcount == 4) {
    //     //     let gain4Event = new RNBO.MessageEvent(RNBO.TimeNow, "gain4", 100);
	// 	//     device.scheduleEvent(gain4Event);
    //     // }
	// });

    $(document).on('click', 'span.c_btn', () => {

        // reloadメソッドによりページをリロード
        console.log("reload!");
        window.location.reload();

        // ballcount = 0;
        // console.log("ballcount_refresh:" + ballcount);

        // let gain1offEvent = new RNBO.MessageEvent(RNBO.TimeNow, "gain1", 0);
		// device.scheduleEvent(gain1offEvent);
        // let gain2offEvent = new RNBO.MessageEvent(RNBO.TimeNow, "gain2", 0);
		// device.scheduleEvent(gain2offEvent);
        // let gain3offEvent = new RNBO.MessageEvent(RNBO.TimeNow, "gain3", 0);
		// device.scheduleEvent(gain3offEvent);
        // let gain4offEvent = new RNBO.MessageEvent(RNBO.TimeNow, "gain4", 0);
		// device.scheduleEvent(gain4offEvent);

    });

    document.body.onclick = () => {
        context.resume();
    }

    // Skip if you're not using guardrails.js
    if (typeof guardrails === "function")
        guardrails();

}

let device_gloabal;
console.log("device_gloabal" + device_gloabal);

//現在時刻を表示する関数
let spanText = document.getElementById('test');
let index = 0;
function showNowDate() {
	//console.log("1s");
	spanText.textContent = (680 - (index % 680));
    index++;
}

//spanTextの数値を取得してRNBOのParam.valueに適応
function sendRNBO(array, index, g_device) {
	console.log(index);
	if (array == null || array == undefined || index > 3) {
		return;
	}else if (index == 1){
		const nParam = device_gloabal.parametersById.get('pitch');
		//console.log(nParam);
		nParam.value = array[1];
	}/*else if (index == 2){
		const nParam = device_gloabal.parametersById.get('pitch2');
		console.log(nParam);
		nParam.value = array[1];
	}else {
		return;
	}*/
}
/*
function check_gainOn(){
    let obj_number = document.getElementById('ball_number');
    console.log(obj_number);

    if (obj_number == null) {
        return;
    }
    if (obj_number.innerHTML == 1){
        console.log("gain1_on");

        const gain1_on = new MessageEvent(TimeNow, "gain1", 100);
        device_gloabal.scheduleEvent(gain1_on);

        //let gain1_on = new RNBO.MessageEvent(RNBO.TimeNow, "gain1", 100);
		//device_gloabal.scheduleEvent(gain1_on);
    }
}*/
/*
function getBtnClass(){
	let obj_PosAng = document.getElementById('posAng1');
	//console.log(obj_PosAng);
	if (obj_PosAng == null){
		return;
	}
	//console.log(onj_PosAng.innerHTML);
	let strPosAng = obj_PosAng.innerHTML;
	let posAngArray = strPosAng.split('/');
	//console.log(posAngArray);

	const nParam = device_gloabal.parametersById.get('gain1');
	//console.log(nParam);
	nParam.value = posAngArray[1];

}*/

window.addEventListener('load', function () {
	//1000ミリ秒（1秒）毎に関数「showNowDate()」を呼び出す
	setInterval("showNowDate()", 5);

    //setInterval("check_gainOn()", 1000);
	//setInterval("sendRNBO()", 1000);
	//setInterval("getBtnClass()", 1000);

	//setInterval("getOutput()", 100);
});

function loadRNBOScript(version) {
    return new Promise((resolve, reject) => {
        if (/^\d+\.\d+\.\d+-dev$/.test(version)) {
            throw new Error("Patcher exported with a Debug Version!\nPlease specify the correct RNBO version to use in the code.");
        }
        const el = document.createElement("script");
        el.src = "https://c74-public.nyc3.digitaloceanspaces.com/rnbo/" + encodeURIComponent(version) + "/rnbo.min.js";
        el.onload = resolve;
        el.onerror = function(err) {
            console.log(err);
            reject(new Error("Failed to load rnbo.js v" + version));
        };
        document.body.append(el);
    });
}

function makeSliders(device) {
    let pdiv = document.getElementById("rnbo-parameter-sliders");
    let noParamLabel = document.getElementById("no-param-label");
    if (noParamLabel && device.numParameters > 0) pdiv.removeChild(noParamLabel);

    // This will allow us to ignore parameter update events while dragging the slider.
    let isDraggingSlider = false;
    let uiElements = {};

    device.parameters.forEach(param => {
        // Subpatchers also have params. If we want to expose top-level
        // params only, the best way to determine if a parameter is top level
        // or not is to exclude parameters with a '/' in them.
        // You can uncomment the following line if you don't want to include subpatcher params

        //if (param.id.includes("/")) return;

        // Create a label, an input slider and a value display
        let label = document.createElement("label");
        let slider = document.createElement("input");
        let text = document.createElement("input");
        let sliderContainer = document.createElement("div");
        sliderContainer.appendChild(label);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(text);

        // Add a name for the label
        label.setAttribute("name", param.name);
        label.setAttribute("for", param.name);
        label.setAttribute("class", "param-label");
        label.textContent = `${param.name}: `;

        // Make each slider reflect its parameter
        slider.setAttribute("type", "range");
        slider.setAttribute("class", "param-slider");
        slider.setAttribute("id", param.id);
        slider.setAttribute("name", param.name);
        slider.setAttribute("min", param.min);
        slider.setAttribute("max", param.max);
        if (param.steps > 1) {
            slider.setAttribute("step", (param.max - param.min) / (param.steps - 1));
        } else {
            slider.setAttribute("step", (param.max - param.min) / 1000.0);
        }
        slider.setAttribute("value", param.value);

        // Make a settable text input display for the value
        text.setAttribute("value", param.value.toFixed(1));
        text.setAttribute("type", "text");

        // Make each slider control its parameter
        slider.addEventListener("pointerdown", () => {
            isDraggingSlider = true;
        });
        slider.addEventListener("pointerup", () => {
            isDraggingSlider = false;
            slider.value = param.value;
            text.value = param.value.toFixed(1);
        });
        slider.addEventListener("input", () => {
            let value = Number.parseFloat(slider.value);
            param.value = value;
        });

        // Make the text box input control the parameter value as well
        text.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                let newValue = Number.parseFloat(text.value);
                if (isNaN(newValue)) {
                    text.value = param.value;
                } else {
                    newValue = Math.min(newValue, param.max);
                    newValue = Math.max(newValue, param.min);
                    text.value = newValue;
                    param.value = newValue;
                }
            }
        });

        // Store the slider and text by name so we can access them later
        uiElements[param.id] = { slider, text };

        // Add the slider element
        pdiv.appendChild(sliderContainer);
    });

    // Listen to parameter changes from the device
    device.parameterChangeEvent.subscribe(param => {
        if (!isDraggingSlider)
            uiElements[param.id].slider.value = param.value;
        uiElements[param.id].text.value = param.value.toFixed(1);
    });
}

function makeInportForm(device) {
    const idiv = document.getElementById("rnbo-inports");
    const inportSelect = document.getElementById("inport-select");
    const inportText = document.getElementById("inport-text");
    const inportForm = document.getElementById("inport-form");
    let inportTag = null;

    // Device messages correspond to inlets/outlets or inports/outports
    // You can filter for one or the other using the "type" of the message
    const messages = device.messages;
    const inports = messages.filter(message => message.type === RNBO.MessagePortType.Inport);

    if (inports.length === 0) {
        idiv.removeChild(document.getElementById("inport-form"));
        return;
    } else {
        idiv.removeChild(document.getElementById("no-inports-label"));
        inports.forEach(inport => {
            const option = document.createElement("option");
            option.innerText = inport.tag;
            inportSelect.appendChild(option);
        });
        inportSelect.onchange = () => inportTag = inportSelect.value;
        inportTag = inportSelect.value;

        inportForm.onsubmit = (ev) => {
            // Do this or else the page will reload
            ev.preventDefault();

            // Turn the text into a list of numbers (RNBO messages must be numbers, not text)
            const values = inportText.value.split(/\s+/).map(s => parseFloat(s));

            // Send the message event to the RNBO device
            let messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, inportTag, values);
            device.scheduleEvent(messageEvent);
        }
    }
}

function attachOutports(device) {
    const outports = device.messages.filter(message => message.type === RNBO.MessagePortType.Outport);
    if (outports.length < 1) {
        document.getElementById("rnbo-console").removeChild(document.getElementById("rnbo-console-div"));
        return;
    }

    //outportを表示させるhtmlのidを取得
    let outport1 = document.getElementById("outport1");
    let outport2 = document.getElementById("outport2");
    let outport3 = document.getElementById("outport3");
    let outport4 = document.getElementById("outport4");


    document.getElementById("rnbo-console").removeChild(document.getElementById("no-outports-label"));
    /*
    device.messageEvent.subscribe((ev) => {

        // Message events have a tag as well as a payload
        console.log(`${ev.tag}: ${ev.payload}`);

        document.getElementById("rnbo-console-readout").innerText = `${ev.tag}: ${ev.payload}`;
    });*/

    //outportからonoffの01を取得してhtmlに表示
    // ev is of type MessageEvent, which has a tag and a payload
    device.messageEvent.subscribe((ev) => {
    //console.log(`Received message ${ev.tag}: ${ev.payload}`);

    if (ev.tag === "onoff1")
        outport1.innerText = (`${ev.payload}`);
    if (ev.tag === "onoff2")
        outport2.innerText = (`${ev.payload}`);
    if (ev.tag === "onoff3")
        outport3.innerText = (`${ev.payload}`);
    if (ev.tag === "onoff4")
        outport4.innerText = (`${ev.payload}`);

});
}

function loadPresets(device, patcher) {
    let presets = patcher.presets || [];
    if (presets.length < 1) {
        document.getElementById("rnbo-presets").removeChild(document.getElementById("preset-select"));
        return;
    }

    document.getElementById("rnbo-presets").removeChild(document.getElementById("no-presets-label"));
    let presetSelect = document.getElementById("preset-select");
    presets.forEach((preset, index) => {
        const option = document.createElement("option");
        option.innerText = preset.name;
        option.value = index;
        presetSelect.appendChild(option);
    });
    presetSelect.onchange = () => device.setPreset(presets[presetSelect.value].preset);
}

function makeMIDIKeyboard(device) {
    let mdiv = document.getElementById("rnbo-clickable-keyboard");
    if (device.numMIDIInputPorts === 0) return;

    mdiv.removeChild(document.getElementById("no-midi-label"));

    const midiNotes = [49, 52, 56, 63];
    midiNotes.forEach(note => {
        const key = document.createElement("div");
        const label = document.createElement("p");
        label.textContent = note;
        key.appendChild(label);
        key.addEventListener("pointerdown", () => {
            let midiChannel = 0;

            // Format a MIDI message paylaod, this constructs a MIDI on event
            let noteOnMessage = [
                144 + midiChannel, // Code for a note on: 10010000 & midi channel (0-15)
                note, // MIDI Note
                100 // MIDI Velocity
            ];

            let noteOffMessage = [
                128 + midiChannel, // Code for a note off: 10000000 & midi channel (0-15)
                note, // MIDI Note
                0 // MIDI Velocity
            ];

            // Including rnbo.min.js (or the unminified rnbo.js) will add the RNBO object
            // to the global namespace. This includes the TimeNow constant as well as
            // the MIDIEvent constructor.
            let midiPort = 0;
            let noteDurationMs = 250;

            // When scheduling an event to occur in the future, use the current audio context time
            // multiplied by 1000 (converting seconds to milliseconds) for now.
            let noteOnEvent = new RNBO.MIDIEvent(device.context.currentTime * 1000, midiPort, noteOnMessage);
            let noteOffEvent = new RNBO.MIDIEvent(device.context.currentTime * 1000 + noteDurationMs, midiPort, noteOffMessage);

            device.scheduleEvent(noteOnEvent);
            device.scheduleEvent(noteOffEvent);

            key.classList.add("clicked");
        });

        key.addEventListener("pointerup", () => key.classList.remove("clicked"));

        mdiv.appendChild(key);
    });

    //note66の監視
    var observer = new MutationObserver(function(){
        /** DOMの変化が起こった時の処理 */
        if (elem.textContent == "1"){
            console.log('DOMが変化しました');

            // Format a MIDI message paylaod, this constructs a MIDI on event
            let noteOnMessage1 = [
                144, // Code for a note on: 10010000 & midi channel (0-15)
                53, // MIDI Note
                100 // MIDI Velocity
            ];

            let noteOffMessage1 = [
                128, // Code for a note off: 10000000 & midi channel (0-15)
                53, // MIDI Note
                0 // MIDI Velocity
            ];

            let noteOnEvent = new RNBO.MIDIEvent(device.context.currentTime * 1000, 0, noteOnMessage1);
            let noteOffEvent = new RNBO.MIDIEvent(device.context.currentTime * 1000 + 100, 0, noteOffMessage1);

            device.scheduleEvent(noteOnEvent);
            device.scheduleEvent(noteOffEvent);

        }
      });

    //note72の監視
    var observer2 = new MutationObserver(function(){
        /** DOMの変化が起こった時の処理 */
        if (elem2.textContent == "1"){
            console.log('DOM2が変化しました');

            // Format a MIDI message paylaod, this constructs a MIDI on event
            let noteOnMessage2 = [
                144, // Code for a note on: 10010000 & midi channel (0-15)
                60, // MIDI Note
                100 // MIDI Velocity
            ];

            let noteOffMessage2 = [
                128, // Code for a note off: 10000000 & midi channel (0-15)
                60, // MIDI Note
                0 // MIDI Velocity
            ];

            let noteOnEvent2 = new RNBO.MIDIEvent(device.context.currentTime * 1000, 0, noteOnMessage2);
            let noteOffEvent2 = new RNBO.MIDIEvent(device.context.currentTime * 1000 + 100, 0, noteOffMessage2);

            device.scheduleEvent(noteOnEvent2);
            device.scheduleEvent(noteOffEvent2);

        }
      });

    //note76の監視
    var observer3 = new MutationObserver(function(){
        /** DOMの変化が起こった時の処理 */
        if (elem3.textContent == "1"){
            console.log('DOM3が変化しました');

            // Format a MIDI message paylaod, this constructs a MIDI on event
            let noteOnMessage3 = [
                144, // Code for a note on: 10010000 & midi channel (0-15)
                64, // MIDI Note
                100 // MIDI Velocity
            ];

            let noteOffMessage3 = [
                128, // Code for a note off: 10000000 & midi channel (0-15)
                64, // MIDI Note
                0 // MIDI Velocity
            ];

            let noteOnEvent3 = new RNBO.MIDIEvent(device.context.currentTime * 1000, 0, noteOnMessage3);
            let noteOffEvent3 = new RNBO.MIDIEvent(device.context.currentTime * 1000 + 100, 0, noteOffMessage3);

            device.scheduleEvent(noteOnEvent3);
            device.scheduleEvent(noteOffEvent3);

        }
      });

    //note81の監視
    var observer4 = new MutationObserver(function(){
        /** DOMの変化が起こった時の処理 */
        if (elem4.textContent == "1"){
            console.log('DOM4が変化しました');

            // Format a MIDI message paylaod, this constructs a MIDI on event
            let noteOnMessage4 = [
                144, // Code for a note on: 10010000 & midi channel (0-15)
                69, // MIDI Note
                100 // MIDI Velocity
            ];

            let noteOffMessage4 = [
                128, // Code for a note off: 10000000 & midi channel (0-15)
                69, // MIDI Note
                0 // MIDI Velocity
            ];

            let noteOnEvent4 = new RNBO.MIDIEvent(device.context.currentTime * 1000, 0, noteOnMessage4);
            let noteOffEvent4 = new RNBO.MIDIEvent(device.context.currentTime * 1000 + 100, 0, noteOffMessage4);

            device.scheduleEvent(noteOnEvent4);
            device.scheduleEvent(noteOffEvent4);

        }
      });

      /** 監視対象の要素オブジェクト */
      const elem = document.getElementById('note66');
      const elem2 = document.getElementById('note72');
      const elem3 = document.getElementById('note76');
      const elem4 = document.getElementById('note81');


      /** 監視時のオプション */
      const config = {
        attributes: true,
        childList: true,
        characterData: true
      };

      /** 要素の変化監視をスタート */
      observer.observe(elem, config);
      observer2.observe(elem2, config);
      observer3.observe(elem3, config);
      observer4.observe(elem4, config);

}

setup();

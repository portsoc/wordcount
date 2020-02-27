const droptext = "drop text now!";
const placeholder = "paste or drag words here to count them";
const enter = e => el.t.placeholder = droptext;
const end = e => el.t.placeholder = placeholder;
const over = e => e.preventDefault();

const drop = async e => {
  e.preventDefault();
  el.t.placeholder = placeholder;

  const droppedType = e.dataTransfer.types[0];
  const handlerFunc = handlers[droppedType];
  if (handlerFunc) {
    await handlerFunc(e.dataTransfer);
  }
};

function update(e) {
  const words = t.value.trim().match(/\S+/g);
  el.result.textContent = words ? words.length : 0
}

function loadFile(file) {
  const fr = new FileReader();
  return new Promise((resolve, reject) => {
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsText(file);
  });
};

const handlers = {
  "Files": async edt => {
    const f = edt.items[0].getAsFile();
    el.t.value = await loadFile(f);
    update();
  },
  "text/plain": edt => {
    el.t.value = edt.getData("text/plain");
    update();
  }
};

function init() {
  const el = {
    t: document.querySelector("#t"),
    result: document.querySelector("#result")
  }
	el.t.addEventListener("input", update);
  el.t.addEventListener("dragenter", enter);
  el.t.addEventListener("dragover", over);
  el.t.addEventListener("drop", drop);
  el.t.addEventListener("dragend", end);
}

window.addEventListener("load", init);
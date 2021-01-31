const el = { t: '#t', result: '#result' };

function leave(e) {
  document.body.classList.remove('over');
}

function over(e) {
  e.preventDefault();
  document.body.classList.add('over');
}


async function drop(e) {
  e.preventDefault();

  const droppedType = e.dataTransfer.types[0];
  let string = '';

  switch (droppedType) {
    case 'Files':
    case 'application/x-moz-file':
      for (const file of e.dataTransfer.items) {
        string += await handleFileDrag(file);
      }
      break;
    case 'text/plain':
    case 'text/_moz_htmlcontext':
      string += handleTextDrag(e.dataTransfer);
      break;
    default:
      throw Error(`Unhandled type: ${droppedType}`)
      break;
  }

  el.t.value = string;
  updateWordCount();
}

function updateWordCount(e) {
  const words = el.t.value.trim().match(/\S+/g);
  el.result.textContent = words ? words.length : 0;
}

/* global FileReader */
function loadFile(file) {
  const fr = new FileReader();
  return new Promise((resolve, reject) => {
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsText(file);
  });
}

async function handleFileDrag(item) {
  const f = item.getAsFile();
  return await loadFile(f);
}

function handleTextDrag(dataTransfer) {
  return dataTransfer.getData('text/plain');
}

function setupEl() {
  for (const key of Object.keys(el)) {
    el[key] = document.querySelector(el[key]);
  }
}

function init() {
  setupEl();

  el.t.addEventListener('input', updateWordCount);
  document.body.addEventListener('dragover', over);
  document.body.addEventListener('drop', drop);
  document.body.addEventListener('drop', leave);
  document.body.addEventListener('dragleave', leave);
}

window.addEventListener('load', init);

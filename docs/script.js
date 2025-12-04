(function(){
  const input = document.getElementById('textInput');
  const generateBtn = document.getElementById('generateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const sizeRange = document.getElementById('sizeRange');
  const sizeLabel = document.getElementById('sizeLabel');
  const qrCanvas = document.getElementById('qrCanvas');
  const qrLink = document.getElementById('qrLink');
  const dropZone = document.getElementById('dropZone');
  const qrWrap = document.getElementById('qrWrap');

  let qr;

  function createQR(text, size){
    if(!text) return;
    // Use QRious to render into canvas
    if(!qr){
      qr = new QRious({element: qrCanvas});
    }
    qr.set({value: text, size: size, level: 'H'});
    qrWrap.setAttribute('aria-hidden','false');
    downloadBtn.disabled = false;
    // prepare download link
    const dataUrl = qrCanvas.toDataURL('image/png');
    qrLink.href = dataUrl;
    qrLink.download = 'qrcode.png';
  }

  function generateFromInput(){
    const text = input.value.trim();
    if(!text) return alert('Please enter some text or URL to encode.');
    const size = parseInt(sizeRange.value,10) || 256;
    createQR(text, size);
  }

  generateBtn.addEventListener('click', generateFromInput);
  input.addEventListener('keydown', function(e){ if(e.key === 'Enter') generateFromInput(); });

  sizeRange.addEventListener('input', function(){ sizeLabel.textContent = sizeRange.value; if(qr){ qr.set('size', parseInt(sizeRange.value,10)); qrLink.href = qrCanvas.toDataURL('image/png'); }});

  downloadBtn.addEventListener('click', function(){ if(qrLink.href){ qrLink.style.display='inline'; qrLink.click(); qrLink.style.display='none'; }});

  // Drag-and-drop support
  ;['dragenter','dragover'].forEach(evt => {
    dropZone.addEventListener(evt, function(e){ e.preventDefault(); e.stopPropagation(); dropZone.classList.add('dragover'); }, false);
  });
  ;['dragleave','drop'].forEach(evt => {
    dropZone.addEventListener(evt, function(e){ e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('dragover'); }, false);
  });

  dropZone.addEventListener('drop', function(e){
    const dt = e.dataTransfer;
    if(!dt) return;
    // If text was dropped
    const text = dt.getData('text/plain') || dt.getData('text/uri-list');
    if(text){
      input.value = text.trim();
      generateFromInput();
      return;
    }
    // If files dropped, try reading first text file
    if(dt.files && dt.files.length){
      const file = dt.files[0];
      if(file.type === 'text/plain' || file.name.match(/\.txt$/i)){ 
        const reader = new FileReader();
        reader.onload = function(ev){ input.value = (ev.target.result || '').toString(); generateFromInput(); };
        reader.readAsText(file);
        return;
      }
      alert('Unsupported file type. Drop plain text or .txt files.');
    }
  });

  // allow click on dropZone to focus input
  dropZone.addEventListener('click', function(){ input.focus(); });

  // enable dragging the generated image to desktop by setting DownloadURL on dragstart
  qrCanvas.addEventListener('dragstart', function(e){
    if(!qrLink.href) return;
    // Format: <mime>:<filename>:<url>
    try{
      const url = qrCanvas.toDataURL('image/png');
      const filename = 'qrcode.png';
      const dt = e.dataTransfer;
      dt.setData('DownloadURL', 'image/png:'+filename+':'+url);
    }catch(err){ /* ignore */ }
  });

  // initialize with example
  input.value = 'https://github.com/bes00026-maker/first-repo3.0';
  createQR(input.value, parseInt(sizeRange.value,10));
})();
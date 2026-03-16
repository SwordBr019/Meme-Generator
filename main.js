// Estado global da aplicação
const state = {
    image: null,
    texts: [],
    nextTextId: 1,
    canvas: null,
    ctx: null,
    canvasWidth: 800,
    canvasHeight: 600,
    scale: 1
};

// Elementos do DOM
const imageFileInput = document.querySelector('#imageFileInput');
const canvas = document.querySelector('#meme');
const textList = document.querySelector('#textList');
const addTextBtn = document.querySelector('#addTextBtn');
const downloadBtn = document.querySelector('#downloadBtn');
const imageWidthInput = document.querySelector('#imageWidth');
const imageHeightInput = document.querySelector('#imageHeight');
const imageSizeControls = document.querySelector('#imageSizeControls');
const textControls = document.querySelector('#textControls');
const downloadSection = document.querySelector('#downloadSection');
const textOverlays = document.querySelector('#textOverlays');

// Inicializar canvas
state.canvas = canvas;
state.ctx = canvas.getContext('2d');

// Event Listeners
imageFileInput.addEventListener('change', handleImageUpload);
addTextBtn.addEventListener('click', addNewText);
downloadBtn.addEventListener('click', downloadMeme);
imageWidthInput.addEventListener('input', handleImageSizeChange);
imageHeightInput.addEventListener('input', handleImageSizeChange);

// Função para carregar imagem
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.image = img;
            // Manter proporção original
            const aspectRatio = img.width / img.height;
            state.canvasWidth = Math.min(img.width, 1200);
            state.canvasHeight = state.canvasWidth / aspectRatio;
            
            imageWidthInput.value = Math.round(state.canvasWidth);
            imageHeightInput.value = Math.round(state.canvasHeight);
            
            imageSizeControls.style.display = 'block';
            textControls.style.display = 'block';
            downloadSection.style.display = 'block';
            
            updateCanvas();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Função para alterar tamanho da imagem
function handleImageSizeChange() {
    const width = parseInt(imageWidthInput.value) || 800;
    const height = parseInt(imageHeightInput.value) || 600;
    
    if (state.image) {
        // Manter proporção se necessário
        const aspectRatio = state.image.width / state.image.height;
        state.canvasWidth = width;
        state.canvasHeight = height;
    } else {
        state.canvasWidth = width;
        state.canvasHeight = height;
    }
    
    updateCanvas();
    updateTextOverlays();
}

// Função para adicionar novo texto
function addNewText() {
    const textId = state.nextTextId++;
    const newText = {
        id: textId,
        text: 'Novo Texto',
        x: state.canvasWidth / 2,
        y: state.canvasHeight / 2,
        fontSize: 40,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 3,
        fontFamily: 'Arial',
        align: 'center',
        baseline: 'middle'
    };
    
    state.texts.push(newText);
    renderTextItem(newText);
    updateCanvas();
    updateTextOverlays();
}

// Função para renderizar item de texto na lista de controles
function renderTextItem(textObj) {
    const textItem = document.createElement('div');
    textItem.className = 'text-item';
    textItem.dataset.textId = textObj.id;
    
    textItem.innerHTML = `
        <div class="text-item-header">
            <h4>Texto #${textObj.id}</h4>
            <button class="btn btn-danger" onclick="removeText(${textObj.id})">Remover</button>
        </div>
        <div class="text-controls-grid full-width">
            <label>Texto:</label>
            <input type="text" value="${textObj.text}" 
                   onchange="updateTextProperty(${textObj.id}, 'text', this.value)">
        </div>
        <div class="text-controls-grid">
            <div>
                <label>Cor do Texto:</label>
                <input type="color" value="${textObj.color}" 
                       onchange="updateTextProperty(${textObj.id}, 'color', this.value)">
            </div>
            <div>
                <label>Cor da Borda:</label>
                <input type="color" value="${textObj.strokeColor}" 
                       onchange="updateTextProperty(${textObj.id}, 'strokeColor', this.value)">
            </div>
        </div>
        <div class="text-controls-grid">
            <div>
                <label>Tamanho da Fonte:</label>
                <input type="number" value="${textObj.fontSize}" min="10" max="200" 
                       onchange="updateTextProperty(${textObj.id}, 'fontSize', parseInt(this.value))">
            </div>
            <div>
                <label>Espessura da Borda:</label>
                <input type="number" value="${textObj.strokeWidth}" min="0" max="20" 
                       onchange="updateTextProperty(${textObj.id}, 'strokeWidth', parseInt(this.value))">
            </div>
        </div>
        <div class="text-controls-grid">
            <div>
                <label>Posição X:</label>
                <input type="number" value="${Math.round(textObj.x)}" min="0" 
                       onchange="updateTextProperty(${textObj.id}, 'x', parseInt(this.value))">
            </div>
            <div>
                <label>Posição Y:</label>
                <input type="number" value="${Math.round(textObj.y)}" min="0" 
                       onchange="updateTextProperty(${textObj.id}, 'y', parseInt(this.value))">
            </div>
        </div>
        <div class="text-controls-grid full-width">
            <label>Fonte:</label>
            <select onchange="updateTextProperty(${textObj.id}, 'fontFamily', this.value)">
                <option value="Arial" ${textObj.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
                <option value="Impact" ${textObj.fontFamily === 'Impact' ? 'selected' : ''}>Impact</option>
                <option value="Comic Sans MS" ${textObj.fontFamily === 'Comic Sans MS' ? 'selected' : ''}>Comic Sans MS</option>
                <option value="Verdana" ${textObj.fontFamily === 'Verdana' ? 'selected' : ''}>Verdana</option>
                <option value="Times New Roman" ${textObj.fontFamily === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
            </select>
        </div>
        <div class="text-controls-grid full-width">
            <label>Alinhamento:</label>
            <select onchange="updateTextProperty(${textObj.id}, 'align', this.value)">
                <option value="left" ${textObj.align === 'left' ? 'selected' : ''}>Esquerda</option>
                <option value="center" ${textObj.align === 'center' ? 'selected' : ''}>Centro</option>
                <option value="right" ${textObj.align === 'right' ? 'selected' : ''}>Direita</option>
            </select>
        </div>
    `;
    
    textList.appendChild(textItem);
}

// Função para atualizar propriedade de um texto
function updateTextProperty(textId, property, value) {
    const textObj = state.texts.find(t => t.id === textId);
    if (textObj) {
        textObj[property] = value;
        updateCanvas();
        updateTextOverlays();
    }
}

// Função para remover texto
function removeText(textId) {
    state.texts = state.texts.filter(t => t.id !== textId);
    const textItem = document.querySelector(`[data-text-id="${textId}"]`);
    if (textItem) {
        textItem.remove();
    }
    const overlay = document.querySelector(`[data-overlay-id="${textId}"]`);
    if (overlay) {
        overlay.remove();
    }
    updateCanvas();
    updateTextOverlays();
}

// Função para atualizar canvas
function updateCanvas() {
    if (!state.image) return;
    
    const { ctx, canvas } = state;
    
    // Configurar tamanho do canvas
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar imagem redimensionada
    ctx.drawImage(state.image, 0, 0, canvas.width, canvas.height);
    
    // Desenhar textos
    state.texts.forEach(textObj => {
        drawText(textObj);
    });
    
    // Atualizar overlays após um pequeno delay para garantir que o canvas foi renderizado
    setTimeout(() => {
        updateTextOverlays();
    }, 10);
}

// Função para desenhar texto no canvas
function drawText(textObj) {
    const { ctx } = state;
    
    ctx.save();
    
    // Configurar fonte
    ctx.font = `${textObj.fontSize}px ${textObj.fontFamily}`;
    ctx.textAlign = textObj.align;
    ctx.textBaseline = textObj.baseline;
    
    // Desenhar borda (stroke)
    if (textObj.strokeWidth > 0) {
        ctx.strokeStyle = textObj.strokeColor;
        ctx.lineWidth = textObj.strokeWidth;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(textObj.text, textObj.x, textObj.y);
    }
    
    // Desenhar preenchimento (fill)
    ctx.fillStyle = textObj.color;
    ctx.fillText(textObj.text, textObj.x, textObj.y);
    
    ctx.restore();
}

// Função para atualizar overlays de texto (para arrastar)
function updateTextOverlays() {
    if (!state.image) return;
    
    // Limpar overlays existentes
    textOverlays.innerHTML = '';
    
    // Calcular escala e posição
    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = canvas.parentElement.getBoundingClientRect();
    
    const scaleX = canvasRect.width / canvas.width;
    const scaleY = canvasRect.height / canvas.height;
    state.scale = Math.min(scaleX, scaleY);
    
    // Offset do canvas dentro do container
    const canvasOffsetX = canvasRect.left - containerRect.left;
    const canvasOffsetY = canvasRect.top - containerRect.top;
    
    // Criar overlays para cada texto
    state.texts.forEach(textObj => {
        const overlay = document.createElement('div');
        overlay.className = 'draggable-text';
        overlay.dataset.overlayId = textObj.id;
        overlay.textContent = textObj.text || 'Texto';
        overlay.style.color = textObj.color;
        overlay.style.fontSize = `${textObj.fontSize * state.scale}px`;
        overlay.style.fontFamily = textObj.fontFamily;
        overlay.style.borderColor = textObj.strokeColor;
        overlay.style.textAlign = textObj.align;
        overlay.style.position = 'absolute';
        
        // Adicionar ao DOM primeiro para calcular dimensões
        textOverlays.appendChild(overlay);
        
        // Forçar reflow para calcular dimensões
        overlay.offsetHeight;
        
        // Calcular posição baseada no alinhamento
        let leftOffset = 0;
        if (textObj.align === 'center') {
            leftOffset = overlay.offsetWidth / 2;
        } else if (textObj.align === 'right') {
            leftOffset = overlay.offsetWidth;
        }
        
        const topOffset = overlay.offsetHeight / 2;
        
        // Posicionar overlay relativo ao container
        const xPos = canvasOffsetX + (textObj.x * state.scale) - leftOffset;
        const yPos = canvasOffsetY + (textObj.y * state.scale) - topOffset;
        
        overlay.style.left = `${xPos}px`;
        overlay.style.top = `${yPos}px`;
        
        // Adicionar funcionalidade de arrastar
        makeDraggable(overlay, textObj, canvasOffsetX, canvasOffsetY);
    });
}

// Função para tornar elemento arrastável
function makeDraggable(element, textObj, canvasOffsetX, canvasOffsetY) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        element.classList.add('dragging');
        
        const canvasRect = canvas.getBoundingClientRect();
        
        // Posição inicial do texto no canvas (em pixels do canvas)
        initialX = textObj.x;
        initialY = textObj.y;
        
        // Posição inicial do mouse em relação ao canvas (em pixels do canvas)
        startX = (e.clientX - canvasRect.left) / state.scale;
        startY = (e.clientY - canvasRect.top) / state.scale;
        
        e.preventDefault();
        e.stopPropagation();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const canvasRect = canvas.getBoundingClientRect();
        
        // Calcular nova posição do mouse em relação ao canvas (em pixels do canvas)
        const currentX = (e.clientX - canvasRect.left) / state.scale;
        const currentY = (e.clientY - canvasRect.top) / state.scale;
        
        // Calcular delta
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        
        // Atualizar posição do texto
        textObj.x = Math.max(0, Math.min(state.canvasWidth, initialX + deltaX));
        textObj.y = Math.max(0, Math.min(state.canvasHeight, initialY + deltaY));
        
        updateCanvas();
        updateTextOverlays();
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.classList.remove('dragging');
            
            // Atualizar inputs de posição
            const textItem = document.querySelector(`[data-text-id="${textObj.id}"]`);
            if (textItem) {
                const inputs = textItem.querySelectorAll('input[type="number"]');
                // Inputs de posição são os últimos dois (X e Y)
                if (inputs.length >= 2) {
                    inputs[inputs.length - 2].value = Math.round(textObj.x);
                    inputs[inputs.length - 1].value = Math.round(textObj.y);
                }
            }
        }
    });
}

// Função para baixar meme
function downloadMeme() {
    if (!state.image || state.texts.length === 0) {
        alert('Por favor, adicione uma imagem e pelo menos um texto!');
        return;
    }
    
    // Criar link de download
    const link = document.createElement('a');
    link.download = `meme-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Atualizar overlays quando o canvas for redimensionado
let resizeObserver;
if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
        updateTextOverlays();
    });
    resizeObserver.observe(canvas);
}

// Atualizar overlays quando a janela for redimensionada
window.addEventListener('resize', () => {
    updateTextOverlays();
});

// Expor funções globalmente para uso nos event handlers inline
window.updateTextProperty = updateTextProperty;
window.removeText = removeText;

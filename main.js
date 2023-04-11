// Criando algumas constantes para chamar cada elemento

const imageFileInput = document.querySelector('#imageFileInput') //Entrada do arquivo
const topTextInput = document.querySelector('#topTextInput') 
const bottomTextInput = document.querySelector('#bottomTextInput') 
const canvas = document.querySelector('#meme') 

let image; //Variavel que será atualizada a cada nova imagem

imageFileInput.addEventListener("change",()=> {
    const imageDataUrl = URL.createObjectURL(imageFileInput.files[0]);

    //seria como um <img> no html padrão
    image = new Image();
    image.src = imageDataUrl;

    image.addEventListener("load", () =>{
        updtateMemeCanvas(canvas, image, topTextInput.value, bottomTextInput.value);

    }, { once: true});
});

topTextInput.addEventListener("change", () => {
    updtateMemeCanvas(canvas,image,topTextInput.value,bottomTextInput.value)
})

bottomTextInput.addEventListener("change", () => {
    updtateMemeCanvas(canvas,image,topTextInput.value,bottomTextInput.value)
})

//Renderizar o meme
function updtateMemeCanvas(canvas, image, topText, bottomText){
    const ctx = canvas.getContext("2d")
    const width = image.width;
    const height = image.height;
    const fontSize = Math.floor(width/10);
    const yOffset = height /25;

    //Update canvas background
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0);

    //Prepare text
    ctx.strokeStyle = "black"; //Criar o traço perto no texto
    ctx.lineWidth = Math.floor(fontSize/4); //Criar a largura da linha
    ctx.fillStyle = "white"; //estilo de preenchimento do ponto de contexto
    ctx.textAlign = "center" //Exibir o texto no centro da nossa imagem
    ctx.lineJoin = "round" //Define que não terá traços estranhos no texto
    ctx.font = `${fontSize}px sans-serif`;

    //Add top text
    ctx.textBaseline = "top";
    ctx.strokeText(topText, width / 2, yOffset);
    ctx.fillText(topText, width/2, yOffset) //Muda a cor de preenchimento do texto

    //Add bottom text
    ctx.textBaseline = "bottom";
    ctx.strokeText(bottomText, width / 2, height - yOffset); //Alinhar com a parte inferior do texto
    ctx.fillText(bottomText, width/2, height - yOffset) //Muda a cor de preenchimento do texto

}
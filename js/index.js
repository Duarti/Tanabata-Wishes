// setTimeout(()=>{
// 	$('#loadding').fadeToggle();
// 	$('main').css({'display':'flex'});
// },2500);

$(document).ready(function() {
    gerarTexto();
    $('main').css({'display':'flex'});
	gerarCartaoInicial();
    $("#meuCartao").on('submit',submitDesejo);

    function submitDesejo(event){
        event.preventDefault();
        $.post('http://192.168.2.136/register.php?modo=new', $(this).serialize(), function(response){
            console.log(response);
            searchCartoes(response);
		});
        $('.cartao').animate({'top':"-800px"});

    }

    searchEstrelas();
});


function gerarTexto() {
    let historia = [
		'Há muito tempo, de acordo com uma antiga lenda, morava próximo da Via-Láctea uma linda princesa chamada Orihime (織姫) a "Princesa Tecelã...',
		'Certo dia Tentei (天帝) o "Senhor Celestial", pai da moça, apresentou-lhe um jovem e belo rapaz, Kengyu (牽牛) o "Pastor do Gado" (também nomeado Hikoboshi), acreditando que este fosse o par ideal para ela...',
		'Os dois se apaixonaram fulminantemente. A partir de então, a vida de ambos girava apenas em torno do belo romance, deixando de lado suas tarefas e obrigações diárias...',
		'Indignado com a falta de responsabilidade do jovem casal, o pai de Orihime decidiu separar os dois, obrigando-os a morar em lados opostos da Via-Láctea...',
		'A separação trouxe muito sofrimento e tristeza para Orihime. Sentindo o pesar de sua filha, seu pai resolveu permitir que o jovem casal se encontrasse, porém somente uma vez por ano, no sétimo dia do sétimo mês do calendário lunar, desde que cumprissem sua ordem de atender todos os pedidos vindos da Terra nesta data...',
		'Na mitologia japonesa, este casal é representada por estrelas situadas em lados opostos da galáxia, que realmente só são vistas juntas uma vez por ano: Vega (Orihime) e Altair (Kengyu).'
	];

	setTimeout(()=>{
        $("#historia").html(historia[geraRandom(historia.length)]);
        $('#loadding').fadeToggle();
    },2500);
}


function geraRandom(l) {
    let random = Math.ceil(Math.random()*l);
    return random;
}


function gerarCartaoInicial(){
	let colors = [
		'#d62727',
		'rgba(0, 143, 245, 1)',
		'rgb(44, 160, 37)'
	];

	let color = colors[geraRandom(colors.length)];
    $('#meuCartao').css({'background-color':color});

    $('.cartao').toggle();

    $('#cartaoArvore').css({'fill':color});
    $('#cartaoArvore').on('click',()=>{
    	$('#cartaoArvoreGroup').toggle("fade");
        $('.cartao').toggle();
    	$('.cartao').animate({'top':0});
    	$("textarea").focus();
	})
}

function searchEstrelas(){

    // PEGA O TAMANHO DA DIV DA DIREITA
    let w = $('#right').width();
    let h = $('#right').height();

    let palavras = [];

	$.get("http://192.168.2.136/register.php?modo=search", (response)=>{
        $.each(response,function (k,palavra) {
            let x;
            let y;
        	if(k === 0){
                x = Math.ceil(Math.random()*(w-90));
                y = Math.ceil(Math.random()*(h-90));
                let estrela = new Estrela(x, y,palavra.palavra, palavra.quantidade, k);
                estrela.gerarEstrela();
                palavras.push(estrela);
			} else {
                let estrela
                x = Math.ceil(Math.random()*(w-90));
                y = Math.ceil(Math.random()*(h-90));
                estrela = new Estrela(x, y,palavra.palavra, palavra.quantidade, k);
                for (let i = 0 ; i < palavras.length ; i++){
                    if(palavras[i].verifyCollision(estrela)) {
                        x = Math.ceil(Math.random()*(w-90));
                        y = Math.ceil(Math.random()*(h-90));
                        estrela = new Estrela(x, y,palavra.palavra, palavra.quantidade, k);
                    }
                }
                estrela.gerarEstrela();
                palavras.push(estrela);
			}
        })
    })

}

function searchCartoes(response){
// PEGA O TAMANHO DA DIV DA DIREITA
    let w = $('#left').width();
    let h = $('#left').height();

    let desejos = [];

    $.each(response,function (k,desejo) {
        let x;
        let y;
        x = Math.ceil(Math.random()*(w-90));
        y = -105;
        setTimeout(()=>{
            let cartao = new Cartao(x, y, desejo.texto, k);
            cartao.gerarCartao();
            desejos.push(cartao);
        },1000*k);
    })
}

class Cartao {
    constructor(x, y, frase, k){
        this.x = x;
        this.y = y;
        this.h = 90;
        this.w = 90;
        this.frase = frase;
        this.indice = k;
        this.interval;
    }

    gerarCartao(){
        let image = new Image();
        image.setAttribute('data-frase',this.frase);
        image.classList.add('cartaoCaindo');
        image.src = "img/cartao-"+Math.ceil(Math.random()*3)+".png";
        image.title = this.frase;
        $(image).css({'left':this.x});
        $(image).css({'top':this.y});

        $(image).animate({"top":"100%"},5000,'linear',()=>{
            $('#left')[0].removeChild($(image)[0]);
        });

        $(image).hover((event)=>{
            $(image).stop();
            $(document).tooltip();
        });

        $(image).mouseleave(()=>{
            $(image).animate({"top":"100%"},5000,'linear',()=>{
                $('#left')[0].removeChild($(image)[0]);
            });
        });

        $('#left').append(image);
    }

}

class Estrela {
    constructor(x, y, nome, quantidade, k){
        this.x = x;
        this.y = y;
        this.h = 90;
        this.w = 90;
        this.nome = nome;
        this.quantidade = quantidade;
        this.indice = k;
        this.interval;
    }

    gerarEstrela(){
        let image = new Image();
        image.setAttribute('data-palavra',this.nome);
        image.classList.add('estrela');
        image.src = "img/star.png";
        this.quantidade++;
        if(this.quantidade == 1) {
            image.title = this.quantidade + " pessoa deseja " + this.nome;
        } else {
            image.title = this.quantidade + " pessoas desejam " + this.nome;
        }
        $(image).css({'left':this.x});
        $(image).css({'top':this.y});

        this.interval = setInterval(()=>{
            $(image).toggle({});
        },Math.ceil((Math.random()*this.indice*500)+2000));

        $(image).hover((event)=>{
            clearInterval(this.interval);
            $(document).tooltip();
        });

        $(image).mouseleave(()=>{
            this.interval = setInterval(()=>{
                $(image).toggle({});
            },Math.ceil((Math.random()*this.indice*500)+2000));
        });

        $('#right').append(image);
    }

    verifyCollision(estrela){
    	return this.x < estrela.x + estrela.w &&
				this.x + this.w > estrela.x &&
        		this.y < estrela.y + estrela.h &&
        		this.y + this.h > estrela.y
	}
}
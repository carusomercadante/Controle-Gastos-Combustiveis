//definindo as variáveis
const formulario = document.forms.dados;
const telaResumo = document.getElementById('tela-resumo');
const descartaCalculo = document.getElementById('descartar');
const telaCalculos = document.getElementById('calculo');
const resumoHistorico = document.getElementById('conteudo-registros');
const resumoHistorico2 = document.getElementById('conteudo-modal2');
const telaSemCadastro = document.getElementById('semcadastro');
const estruturaResultado = document.querySelector('#calculo tbody');
const estruturaHistorico = document.querySelector('#conteudo-registros tbody');
const btnSalvar = document.getElementById('salvar');
const btnExibeResumo = document.getElementById('verResumo');
const btnFechaResumo = document.querySelector('#conteudo-registros #acoes button');
const btnExcluir = document.getElementById('excluir-registros');
const btnGeraPlanilha = document.getElementById("gerar-planilha");


let historico = [];

//definir calculos de gastos conforme periodo
function calculoCustoDia(dados) {
  let litrosPorDia = dados.kmPorDia / dados.media;
  let gastoDiario = litrosPorDia * dados.preco;
  return gastoDiario.toFixed(2);
};

function calculoCustoSemana(dados) {
  let diasRodadosSemana = dados.diasRodadosSemana;
  let gastoSemanal = calculoCustoDia(dados) * diasRodadosSemana;

  return gastoSemanal.toFixed(2);
};

function calculoCustoMes(dados) {
  let semanasMes = 4;
  let gastoSemanal = calculoCustoSemana(dados);
  let gastoMensal = gastoSemanal * semanasMes;

  return gastoMensal.toFixed(2);
};

function calculoCustoAno(dados) {
  let mesesNoAno = 12;
  let gastoMensal = calculoCustoMes(dados);
  let gastoAnual = gastoMensal * mesesNoAno;

  return gastoAnual.toFixed(2);
};

//atualizar o menu histórico
function atualizaRegistros() {
  if (historico.length < 1) {
    resumoHistorico.style.visibility = 'hidden';
    telaSemCadastro.style.visibility = 'visible';
  } else {
    estruturaHistorico.innerHTML = '';

    for (dado of historico) {
      estruturaHistorico.innerHTML += `
          <tr>
              <td>${dado.dataRegistro}</td>
              <td>R$ ${calculoCustoDia(dado)}</td>
              <td>R$ ${calculoCustoSemana(dado)}</td>
              <td>R$ ${calculoCustoMes(dado)}</td>
              <td>R$ ${calculoCustoAno(dado)}</td>
  
              <td class="excluir-item" onclick="apagaCadastro(${historico.indexOf(dado)})">
                  <span class="material-icons">
                      delete
                  </span>
              </td>
          </tr>
          `;
    };
  }
}

function atualizaRegistros2() {
  if (historico.length < 1) {
    resumoHistorico.style.visibility = 'hidden';
    telaSemCadastro.style.visibility = 'visible';
  } else {
    estruturaHistorico.innerHTML = '';

    for (dado of historico) {
      estruturaHistorico.innerHTML += `
          <tr>
              <td>${dado.dataRegistro}</td>
              <td>R$ ${calculoCustoDia(dado)}</td>
              <td>R$ ${calculoCustoSemana(dado)}</td>
              <td>R$ ${calculoCustoMes(dado)}</td>
              <td>R$ ${calculoCustoAno(dado)}</td>
        </tr>
          `;
    };
  }
}

//incluindo o botao para gerar planilha
btnGeraPlanilha.onclick = () => {
  document.onload = atualizaRegistros2(resumoHistorico2);
  const a = document.createElement('a');
  const tipo_dado = 'data:application/vnd.ms-excel';
  const html_tabela = resumoHistorico2.outerHTML;

  a.href = tipo_dado + ', ' + html_tabela;
  a.download = 'historico_medias.xls';
  a.click();
}


function apagaCadastro(posicaoRegistro) {
  historico.splice(posicaoRegistro, 1);
  atualizaRegistros();
};

function apagaTodosCadastros() {
  historico = [];
  atualizaRegistros();
};
btnExcluir.addEventListener('click', apagaTodosCadastros);

function telaResultados(dadosInformados) {
  estruturaResultado.innerHTML = `
  <tr>
      <td>R$ ${calculoCustoDia(dadosInformados)}</td>
      <td>R$ ${calculoCustoSemana(dadosInformados)}</td>
      <td>R$ ${calculoCustoMes(dadosInformados)}</td>
      <td>R$ ${calculoCustoAno(dadosInformados)}</td>
  </tr>
  `;

  telaResumo.style.visibility = 'visible';
  telaCalculos.style.visibility = 'visible';
};

function telaRegistros() {
  telaResumo.style.visibility = 'visible';
  resumoHistorico.style.visibility = 'visible';
  atualizaRegistros();
};

function encerraJanela() {
  document.querySelectorAll('input')
    .forEach(function (input) {
      input.value = '';
    });

  telaCalculos.style.visibility = 'hidden';
  resumoHistorico.style.visibility = 'hidden';
  telaResumo.style.visibility = 'hidden';
  telaSemCadastro.style.visibility = 'hidden';

  formulario.media.focus();
};

function preencheZero(numero) {
  return ('0' + numero).slice(-2);
}

btnSalvar.addEventListener('click', function () {

  let objData = new Date();

  let dia = preencheZero(objData.getDate());
  let mes = preencheZero(objData.getMonth() + 1);
  let ano = preencheZero(objData.getUTCFullYear());
  let horas = preencheZero(objData.getHours());
  let minutos = preencheZero(objData.getMinutes());
  let segundos = preencheZero(objData.getSeconds());

  historico.push({
    media: formulario.media.value.replace(',', '.'),
    preco: formulario.preco.value.replace(',', '.'),
    kmPorDia: formulario.quilometros_dia.value.replace(',', '.'),
    diasRodadosSemana: formulario.dias_semana.value.replace(',', '.'),
    dataRegistro: `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`
  });

  encerraJanela();
});

telaResumo.addEventListener('click', encerraJanela);
descartaCalculo.addEventListener('click', encerraJanela);
btnFechaResumo.addEventListener('click', encerraJanela);
btnExibeResumo.addEventListener('click', telaRegistros);

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  let media = formulario.media.value.replace(',', '.');
  let preco = formulario.preco.value.replace(',', '.');
  let kmPorDia = formulario.quilometros_dia.value.replace(',', '.');
  let diasRodadosSemana = formulario.dias_semana.value;

  const dadosInformados = {
    media: Number(media),
    preco: Number(preco),
    kmPorDia: Number(kmPorDia),
    diasRodadosSemana: Number(diasRodadosSemana)
  };

  telaResultados(dadosInformados);
});


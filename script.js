const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const diasPorMes = 30;
const irradiacoesDiv = document.getElementById("irradiacoes");
const printButton = document.getElementById('print-button');

meses.forEach((mes, i) => {
    const shortMes = mes.substring(0, 3);
    const wrapper = document.createElement("div");
    wrapper.className = "flex flex-col items-center p-2 bg-gray-50 rounded-lg border";
    const label = document.createElement("label");
    label.textContent = shortMes;
    label.className = "text-sm font-medium text-gray-600";
    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.01";
    input.id = `irradiacao${i}`;
    input.value = 5.5;
    input.className = "w-20 text-center p-1 mt-1 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500";
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    irradiacoesDiv.appendChild(wrapper);
});

function calcularGeracao() {
    const nModulos = parseFloat(document.getElementById("modulos").value) || 0;
    const potenciaModulo = parseFloat(document.getElementById("potencia").value) || 0;
    const eficiencia = parseFloat(document.getElementById("eficiencia").value) || 0;
    if (nModulos <= 0 || potenciaModulo <= 0 || eficiencia <= 0) {
        document.getElementById("resultado").innerHTML = `<div class="text-center p-4 bg-red-100 text-red-700 rounded-lg">Por favor, preencha todos os campos com valores válidos.</div>`;
        printButton.disabled = true;
        return;
    }
    const potenciaSistema = (nModulos * potenciaModulo) / 1000;
    let resultadoHTML = `
        <h3 class="text-2xl font-bold text-gray-800 text-center mb-4">Resultado da Simulação</h3>
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border rounded-lg shadow-sm" id="tabela-resultado">
                <thead class="bg-gray-800 text-white">
                    <tr>
                        <th class="py-3 px-4 text-left">Mês</th>
                        <th class="py-3 px-4 text-center">Geração Diária (kWh)</th>
                        <th class="py-3 px-4 text-center">Geração Mensal (kWh)</th>
                    </tr>
                </thead>
                <tbody>`;
    let geracaoAnual = 0;
    meses.forEach((mes, i) => {
        const irradiacao = parseFloat(document.getElementById(`irradiacao${i}`).value) || 0;
        const geracaoDiaria = potenciaSistema * irradiacao * eficiencia;
        const geracaoMensal = geracaoDiaria * diasPorMes;
        geracaoAnual += geracaoMensal;
        resultadoHTML += `
            <tr class="border-t hover:bg-gray-50">
                <td class="py-3 px-4 font-medium">${mes}</td>
                <td class="py-3 px-4 text-center">${geracaoDiaria.toFixed(2)}</td>
                <td class="py-3 px-4 text-center">${geracaoMensal.toFixed(2)}</td>
            </tr>`;
    });
    resultadoHTML += `
                </tbody>
                <tfoot class="bg-gray-800 text-white font-bold">
                    <tr>
                        <td colspan="2" class="py-3 px-4 text-right">Geração Anual Esperada</td>
                        <td class="py-3 px-4 text-center text-lg">${geracaoAnual.toFixed(2)} kWh</td>
                    </tr>
                </tfoot>
            </table>
        </div>`;
    document.getElementById("resultado").innerHTML = resultadoHTML;
    printButton.disabled = false;
}

function imprimirPagina() {
    window.print();
}
window.onload = calcularGeracao;

const meses = [..."Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" ")];
const diasPorMes = 30;
const irradiacoesDiv = document.getElementById("irradiacoes");
const pdfButton = document.getElementById('pdf-button');

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
    input.className = "w-20 text-center p-1 mt-1 border border-gray-200 rounded-md";
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    irradiacoesDiv.appendChild(wrapper);
});

function calcularGeracao() {
    const nModulos = parseFloat(document.getElementById("modulos").value) || 0;
    const potenciaModulo = parseFloat(document.getElementById("potencia").value) || 0;
    const eficiencia = parseFloat(document.getElementById("eficiencia").value) || 0;
    if (nModulos <= 0 || potenciaModulo <= 0 || eficiencia <= 0) {
        document.getElementById("resultado").innerHTML = `<div class="text-center p-4 bg-red-100 text-red-700 rounded-lg">Preencha todos os campos corretamente.</div>`;
        pdfButton.disabled = true;
        return;
    }
    const potenciaSistema = (nModulos * potenciaModulo) / 1000;
    let html = `<h3 class="text-2xl font-bold text-gray-800 text-center mb-4">Resultado da Simulação</h3><div class="overflow-x-auto"><table class="min-w-full bg-white border rounded-lg shadow-sm" id="tabela-resultado"><thead class="bg-gray-800 text-white"><tr><th class="py-3 px-4 text-left">Mês</th><th class="py-3 px-4 text-center">Geração Diária (kWh)</th><th class="py-3 px-4 text-center">Geração Mensal (kWh)</th></tr></thead><tbody>`;
    let anual = 0;
    meses.forEach((mes, i) => {
        const irr = parseFloat(document.getElementById(`irradiacao${i}`).value) || 0;
        const diaria = potenciaSistema * irr * eficiencia;
        const mensal = diaria * diasPorMes;
        anual += mensal;
        html += `<tr class="border-t hover:bg-gray-50"><td class="py-3 px-4 font-medium">${mes}</td><td class="py-3 px-4 text-center">${diaria.toFixed(2)}</td><td class="py-3 px-4 text-center">${mensal.toFixed(2)}</td></tr>`;
    });
    html += `</tbody><tfoot class="bg-gray-800 text-white font-bold"><tr><td colspan="2" class="py-3 px-4 text-right">Geração Anual Esperada</td><td class="py-3 px-4 text-center text-lg">${anual.toFixed(2)} kWh</td></tr></tfoot></table></div>`;
    document.getElementById("resultado").innerHTML = html;
    pdfButton.disabled = false;
}

function salvarPDF() {
    const table = document.getElementById("tabela-resultado");
    if (!table || typeof window.jspdf === 'undefined') return alert("Calcule antes de gerar o PDF.");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const nModulos = document.getElementById("modulos").value;
    const potenciaModulo = document.getElementById("potencia").value;
    const eficiencia = document.getElementById("eficiencia").value;
    const potenciaSistema = ((nModulos * potenciaModulo) / 1000).toFixed(2);
    doc.setFontSize(18);
    doc.setTextColor("#2d3748");
    doc.text("Relatório de Geração de Energia Solar", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor("#718096");
    doc.text(`Parâmetros: ${nModulos} módulos | ${potenciaModulo}W | ${potenciaSistema} kWp | Eficiência ${eficiencia}`, 14, 30);
    doc.autoTable({
        html: '#tabela-resultado',
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: '#2d3748', textColor: '#fff', fontStyle: 'bold' },
        footStyles: { fillColor: '#2d3748', textColor: '#fff', fontStyle: 'bold' },
        alternateRowStyles: { fillColor: '#f7fafc' },
        didDrawPage: function (data) {
            let str = "Página " + doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });
    doc.save(`relatorio_geracao_solar_${new Date().toISOString().slice(0,10)}.pdf`);
}

window.onload = calcularGeracao;

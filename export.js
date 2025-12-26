// ========================================
// EXPORTAÇÃO PARA PDF
// ========================================

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const totals = calculateTotals();
    const filtered = getFilteredTransactions();
    const categoryData = getCategoryData();
    
    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;
    
    // Cabeçalho
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('FinanceMaster Pro', margin, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Relatório Financeiro Completo', margin, 30);
    
    yPos = 50;
    
    // Informações do Usuário
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Usuário: ${userProfile.name}`, margin, yPos);
    doc.text(`Tipo de Conta: ${userProfile.accountType === 'pessoal' ? 'Pessoal' : 'Empresarial'}`, margin, yPos + 6);
    doc.text(`Período: ${getPeriodText()}`, margin, yPos + 12);
    doc.text(`Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPos + 18);
    
    yPos += 30;
    
    // Linha divisória
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    // Resumo Financeiro
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Resumo Financeiro', margin, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    // Cards de resumo
    const cardData = [
        { label: 'Receita Total', value: formatCurrency(totals.income), color: [16, 185, 129] },
        { label: 'Despesas Totais', value: formatCurrency(totals.expense), color: [239, 68, 68] },
        { label: 'A Receber', value: formatCurrency(totals.pending), color: [245, 158, 11] },
        { label: 'Saldo Real', value: formatCurrency(totals.balance), color: [16, 185, 129] }
    ];
    
    cardData.forEach((card, index) => {
        const x = margin + (index % 2) * 85;
        const y = yPos + Math.floor(index / 2) * 25;
        
        doc.setFillColor(...card.color);
        doc.rect(x, y, 80, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text(card.label, x + 3, y + 6);
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(card.value, x + 3, y + 15);
        doc.setFont(undefined, 'normal');
    });
    
    yPos += 60;
    
    // Despesas por Categoria
    if (Object.keys(categoryData).length > 0) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Despesas por Categoria', margin, yPos);
        yPos += 5;
        
        const categoryTableData = Object.entries(categoryData).map(([category, amount]) => {
            const percentage = ((amount / totals.expense) * 100).toFixed(1);
            return [category, formatCurrency(amount), `${percentage}%`];
        });
        
        doc.autoTable({
            startY: yPos,
            head: [['Categoria', 'Valor', 'Percentual']],
            body: categoryTableData,
            theme: 'grid',
            headStyles: {
                fillColor: [16, 185, 129],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 5
            },
            columnStyles: {
                1: { halign: 'right' },
                2: { halign: 'center' }
            }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
    }
    
    // Nova página para transações
    doc.addPage();
    yPos = 20;
    
    // Título da seção
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Transações Detalhadas', margin, yPos);
    yPos += 5;
    
    // Tabela de transações
    const transactionsTableData = filtered.map(t => [
        formatDate(t.date),
        t.desc,
        t.category,
        t.type === 'income' ? 'Receita' : t.type === 'expense' ? 'Despesa' : 'A Receber',
        formatCurrency(t.amount)
    ]);
    
    doc.autoTable({
        startY: yPos,
        head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
        body: transactionsTableData,
        theme: 'striped',
        headStyles: {
            fillColor: [16, 185, 129],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 8,
            cellPadding: 4
        },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 60 },
            2: { cellWidth: 35 },
            3: { cellWidth: 30 },
            4: { halign: 'right', cellWidth: 30 }
        },
        didParseCell: function(data) {
            if (data.section === 'body' && data.column.index === 4) {
                const transaction = filtered[data.row.index];
                if (transaction.type === 'income') {
                    data.cell.styles.textColor = [16, 185, 129];
                } else if (transaction.type === 'expense') {
                    data.cell.styles.textColor = [239, 68, 68];
                } else {
                    data.cell.styles.textColor = [245, 158, 11];
                }
            }
        }
    });
    
    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Página ${i} de ${pageCount} | Gerado em ${new Date().toLocaleString('pt-BR')}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }
    
    // Salvar PDF
    const fileName = `Relatorio_Financeiro_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    showNotification('PDF exportado com sucesso!', 'success');
}

// ========================================
// EXPORTAÇÃO PARA EXCEL
// ========================================

function exportExcel() {
    const totals = calculateTotals();
    const filtered = getFilteredTransactions();
    const categoryData = getCategoryData();
    const evolution = getMonthlyEvolution();
    
    // Criar workbook
    const wb = XLSX.utils.book_new();
    
    // ===== ABA 1: RESUMO =====
    const resumoData = [
        ['RELATÓRIO FINANCEIRO - FINANCEMASTER PRO'],
        [],
        ['Usuário:', userProfile.name],
        ['Tipo de Conta:', userProfile.accountType === 'pessoal' ? 'Pessoal' : 'Empresarial'],
        ['Período:', getPeriodText()],
        ['Data do Relatório:', new Date().toLocaleDateString('pt-BR')],
        [],
        ['RESUMO FINANCEIRO'],
        [],
        ['Indicador', 'Valor'],
        ['Receita Total', totals.income],
        ['Despesas Totais', totals.expense],
        ['A Receber', totals.pending],
        ['Saldo Real', totals.balance],
        [],
        ['ANÁLISE'],
        [],
        ['Taxa de Poupança', totals.income > 0 ? `${((totals.balance / totals.income) * 100).toFixed(2)}%` : '0%'],
        ['Total de Transações', filtered.length],
        ['Ticket Médio (Despesas)', filtered.filter(t => t.type === 'expense').length > 0 ? 
            (totals.expense / filtered.filter(t => t.type === 'expense').length).toFixed(2) : 0]
    ];
    
    const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
    
    // Formatação
    wsResumo['!cols'] = [{ wch: 25 }, { wch: 20 }];
    
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');
    
    // ===== ABA 2: TRANSAÇÕES =====
    const transacoesData = filtered.map(t => ({
        'Data': formatDate(t.date),
        'Descrição': t.desc,
        'Categoria': t.category,
        'Tipo': t.type === 'income' ? 'Receita' : t.type === 'expense' ? 'Despesa' : 'A Receber',
        'Valor': t.amount,
        'Observações': t.notes || ''
    }));
    
    const wsTransacoes = XLSX.utils.json_to_sheet(transacoesData);
    wsTransacoes['!cols'] = [
        { wch: 12 },
        { wch: 30 },
        { wch: 20 },
        { wch: 12 },
        { wch: 15 },
        { wch: 40 }
    ];
    
    XLSX.utils.book_append_sheet(wb, wsTransacoes, 'Transações');
    
    // ===== ABA 3: CATEGORIAS =====
    const categoriasData = Object.entries(categoryData).map(([category, amount]) => ({
        'Categoria': category,
        'Valor': amount,
        'Percentual': `${((amount / totals.expense) * 100).toFixed(2)}%`
    }));
    
    if (categoriasData.length > 0) {
        const wsCategorias = XLSX.utils.json_to_sheet(categoriasData);
        wsCategorias['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 12 }];
        XLSX.utils.book_append_sheet(wb, wsCategorias, 'Categorias');
    }
    
    // ===== ABA 4: EVOLUÇÃO MENSAL =====
    const evolucaoData = evolution.months.map((month, index) => ({
        'Mês': month,
        'Receitas': evolution.incomeData[index],
        'Despesas': evolution.expenseData[index],
        'Saldo': evolution.incomeData[index] - evolution.expenseData[index]
    }));
    
    const wsEvolucao = XLSX.utils.json_to_sheet(evolucaoData);
    wsEvolucao['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    
    XLSX.utils.book_append_sheet(wb, wsEvolucao, 'Evolução Mensal');
    
    // Salvar arquivo
    const fileName = `Relatorio_Financeiro_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    showNotification('Excel exportado com sucesso!', 'success');
}

// ========================================
// EXPORTAÇÃO RÁPIDA CSV
// ========================================

function exportCSV() {
    const filtered = getFilteredTransactions();
    
    const csvData = [
        ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Observações']
    ];
    
    filtered.forEach(t => {
        csvData.push([
            formatDate(t.date),
            t.desc,
            t.category,
            t.type === 'income' ? 'Receita' : t.type === 'expense' ? 'Despesa' : 'A Receber',
            t.amount,
            t.notes || ''
        ]);
    });
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Transacoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('CSV exportado com sucesso!', 'success');
}

// ========================================
// NOTIFICAÇÕES
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-emerald-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
    } text-white`;
    
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas fa-${
                type === 'success' ? 'check-circle' :
                type === 'error' ? 'exclamation-circle' :
                'info-circle'
            } text-xl"></i>
            <span class="font-semibold">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

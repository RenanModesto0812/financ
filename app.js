// ========================================
// CONFIGURAÇÃO E VARIÁVEIS GLOBAIS
// ========================================

const SUPABASE_URL = 'https://keklkdsiktkpbihhksro.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtla2xrZHNpa3RrcGJpaGhrc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjIxNzYsImV4cCI6MjA3ODgzODE3Nn0.Aadwh_qBeaZGUWYjh_DqxurPdPo2uwljHBLv-f51vAU';

let supabase = null;
let transactions = [];
let currentUser = null;
let userProfile = null;
let currentPeriod = 'month';
let charts = {};

// Inicializar Supabase
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✓ Supabase inicializado');
} catch (error) {
    console.error('✗ Erro ao inicializar Supabase:', error);
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Esperar o DOM estar completamente pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

async function initializeApp() {
    try {
        console.log('Iniciando aplicação...');
        
        // 1. Carregar tema
        loadTheme();
        console.log('✓ Tema carregado');
        
        // 2. Configurar event listeners
        setupEventListeners();
        console.log('✓ Event listeners configurados');
        
        // 3. Verificar autenticação
        if (!supabase) {
            throw new Error('Supabase não inicializado');
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            console.log('Sem sessão, redirecionando para login');
            window.location.href = 'login.html';
            return;
        }
        
        currentUser = session.user;
        console.log('✓ Usuário autenticado:', currentUser.email);
        
        // 4. Carregar perfil do usuário
        userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
            name: currentUser.user_metadata?.name || currentUser.email || 'Usuário',
            accountType: currentUser.user_metadata?.account_type || 'pessoal'
        };
        console.log('✓ Perfil carregado:', userProfile.name);
        
        // 5. Atualizar informações do usuário na tela
        updateUserInfo();
        console.log('✓ Informações do usuário atualizadas');
        
        // 6. Carregar transações
        loadTransactions();
        console.log('✓ Transações carregadas');
        
        // 7. Definir data padrão
        setDefaultDate();
        
        // 8. Atualizar dashboard
        updateDashboard();
        console.log('✓ Dashboard atualizado');
        
        // 9. Carregar gráficos (sem bloquear)
        setTimeout(() => {
            try {
                updateCharts();
                console.log('✓ Gráficos carregados');
            } catch (error) {
                console.error('Erro ao carregar gráficos:', error);
            }
        }, 100);
        
    } catch (error) {
        console.error('✗ Erro ao inicializar:', error);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// ========================================
// GERENCIAMENTO DE USUÁRIO
// ========================================

function updateUserInfo() {
    try {
        if (!userProfile || !userProfile.name) {
            console.warn('Perfil não disponível');
            return;
        }
        
        const initial = userProfile.name.charAt(0).toUpperCase();
        
        // Atualizar sidebar
        const userInitialEl = document.getElementById('user-initial');
        const sidebarUserNameEl = document.getElementById('sidebar-user-name');
        const sidebarAccountTypeEl = document.getElementById('sidebar-account-type');
        
        if (userInitialEl) userInitialEl.textContent = initial;
        if (sidebarUserNameEl) sidebarUserNameEl.textContent = userProfile.name;
        if (sidebarAccountTypeEl) {
            sidebarAccountTypeEl.textContent = userProfile.accountType === 'pessoal' ? '👤 Pessoal' : '🏢 Empresarial';
        }
        
        // Atualizar header
        const headerUserNameEl = document.getElementById('header-user-name');
        if (headerUserNameEl) {
            headerUserNameEl.textContent = userProfile.name.split(' ')[0];
        }
        
        console.log('✓ Informações do usuário atualizadas:', userProfile.name);
    } catch (error) {
        console.error('Erro ao atualizar info do usuário:', error);
    }
}

// ========================================
// GERENCIAMENTO DE TRANSAÇÕES
// ========================================

function loadTransactions() {
    try {
        if (!currentUser) {
            console.warn('Usuário não definido');
            return;
        }
        
        const storageKey = `finances_pro_${currentUser.id}`;
        const stored = localStorage.getItem(storageKey);
        transactions = stored ? JSON.parse(stored) : [];
        console.log(`✓ ${transactions.length} transações carregadas`);
    } catch (error) {
        console.error('Erro ao carregar transações:', error);
        transactions = [];
    }
}

function saveTransactions() {
    try {
        if (!currentUser) return;
        const storageKey = `finances_pro_${currentUser.id}`;
        localStorage.setItem(storageKey, JSON.stringify(transactions));
        console.log('✓ Transações salvas');
    } catch (error) {
        console.error('Erro ao salvar transações:', error);
    }
}

function addTransaction(transaction) {
    transactions.push(transaction);
    saveTransactions();
    updateDashboard();
    updateCharts();
}

function updateTransaction(id, updatedData) {
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updatedData };
        saveTransactions();
        updateDashboard();
        updateCharts();
    }
}

function deleteTransaction(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        updateDashboard();
        updateCharts();
    }
}

// ========================================
// FILTROS E CÁLCULOS
// ========================================

function getFilteredTransactions() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        
        switch (currentPeriod) {
            case 'today':
                return transactionDate >= today;
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return transactionDate >= weekAgo;
            case 'month':
                return transactionDate.getMonth() === now.getMonth() && 
                       transactionDate.getFullYear() === now.getFullYear();
            case 'year':
                return transactionDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    });
}

function calculateTotals() {
    const filtered = getFilteredTransactions();
    
    const income = filtered
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    const expense = filtered
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    const pending = filtered
        .filter(t => t.type === 'pending')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    return { income, expense, pending, balance: income - expense };
}

function getCategoryData() {
    const filtered = getFilteredTransactions();
    const expenses = filtered.filter(t => t.type === 'expense');
    
    const categoryTotals = {};
    expenses.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount || 0);
    });
    
    return categoryTotals;
}

function getMonthlyEvolution() {
    const months = [];
    const incomeData = [];
    const expenseData = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        const monthTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === date.getMonth() && 
                   tDate.getFullYear() === date.getFullYear();
        });
        
        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        
        const expense = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        
        months.push(date.toLocaleDateString('pt-BR', { month: 'short' }));
        incomeData.push(income);
        expenseData.push(expense);
    }
    
    return { months, incomeData, expenseData };
}

// ========================================
// ATUALIZAÇÃO DO DASHBOARD
// ========================================

function updateDashboard() {
    try {
        updateStats();
        updateTransactionsTable();
        updateAlerts();
    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
    }
}

function updateStats() {
    try {
        const totals = calculateTotals();
        
        const updates = {
            'total-income': formatCurrency(totals.income),
            'total-expense': formatCurrency(totals.expense),
            'total-pending': formatCurrency(totals.pending),
            'net-balance': formatCurrency(totals.balance)
        };
        
        Object.entries(updates).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    } catch (error) {
        console.error('Erro ao atualizar stats:', error);
    }
}

function updateTransactionsTable() {
    try {
        const tbody = document.getElementById('transactions-table');
        if (!tbody) return;
        
        const filtered = getFilteredTransactions();
        const recent = filtered.slice(-10).reverse();
        
        if (recent.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-8" style="color: var(--text-secondary);">
                        <i class="fas fa-inbox text-4xl mb-2"></i>
                        <p>Nenhuma transação encontrada</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = recent.map(t => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td class="py-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center ${
                            t.type === 'income' ? 'bg-emerald-100 text-emerald-600' :
                            t.type === 'expense' ? 'bg-red-100 text-red-600' :
                            'bg-amber-100 text-amber-600'
                        }">
                            <i class="fas fa-${
                                t.type === 'income' ? 'arrow-up' :
                                t.type === 'expense' ? 'arrow-down' :
                                'clock'
                            }"></i>
                        </div>
                        <div>
                            <p class="font-semibold text-sm">${t.desc}</p>
                            ${t.notes ? `<p class="text-xs" style="color: var(--text-secondary);">${t.notes}</p>` : ''}
                        </div>
                    </div>
                </td>
                <td class="py-4">
                    <span class="badge text-xs" style="background-color: var(--bg-primary); color: var(--text-secondary);">
                        ${t.category}
                    </span>
                </td>
                <td class="py-4 text-xs" style="color: var(--text-secondary);">
                    ${formatDate(t.date)}
                </td>
                <td class="py-4 text-right font-bold text-sm ${
                    t.type === 'income' ? 'text-emerald-600' :
                    t.type === 'expense' ? 'text-red-600' :
                    'text-amber-600'
                }">
                    ${t.type === 'expense' ? '-' : '+'} ${formatCurrency(t.amount)}
                </td>
                <td class="py-4 text-center">
                    <button onclick="editTransaction(${t.id})" class="text-blue-500 hover:text-blue-700 mx-1 text-sm">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTransaction(${t.id})" class="text-red-500 hover:text-red-700 mx-1 text-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao atualizar tabela:', error);
    }
}

function updateAlerts() {
    try {
        const container = document.getElementById('alerts-container');
        if (!container) return;
        
        const totals = calculateTotals();
        const alerts = [];
        
        if (totals.expense > totals.income && totals.expense > 0) {
            alerts.push({
                type: 'danger',
                icon: 'exclamation-triangle',
                title: 'Gastos Excessivos',
                message: `Suas despesas estão maiores que suas receitas!`
            });
        }
        
        if (totals.pending > 0) {
            alerts.push({
                type: 'warning',
                icon: 'clock',
                title: 'Valores Pendentes',
                message: `Você tem ${formatCurrency(totals.pending)} para receber.`
            });
        }
        
        if (totals.balance > 0 && totals.expense > 0) {
            alerts.push({
                type: 'success',
                icon: 'check-circle',
                title: 'Finanças Saudáveis',
                message: `Parabéns! Seu saldo está positivo.`
            });
        }
        
        if (alerts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4" style="color: var(--text-secondary);">
                    <i class="fas fa-info-circle text-2xl mb-2"></i>
                    <p class="text-xs md:text-sm">Nenhum alerta no momento</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = alerts.map(alert => `
            <div class="alert-card p-4 rounded-lg border-l-4 ${
                alert.type === 'danger' ? 'bg-red-50 border-red-500 dark:bg-red-900 dark:bg-opacity-20' :
                alert.type === 'warning' ? 'bg-amber-50 border-amber-500 dark:bg-amber-900 dark:bg-opacity-20' :
                'bg-emerald-50 border-emerald-500 dark:bg-emerald-900 dark:bg-opacity-20'
            }">
                <div class="flex items-start space-x-3">
                    <i class="fas fa-${alert.icon} text-lg flex-shrink-0 ${
                        alert.type === 'danger' ? 'text-red-600' :
                        alert.type === 'warning' ? 'text-amber-600' :
                        'text-emerald-600'
                    }"></i>
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold text-sm">${alert.title}</p>
                        <p class="text-xs mt-1" style="color: var(--text-secondary);">${alert.message}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao atualizar alertas:', error);
    }
}

// ========================================
// GRÁFICOS
// ========================================

function updateCharts() {
    try {
        updateCashFlowChart();
        updateCategoryChart();
        updateEvolutionChart();
    } catch (error) {
        console.error('Erro ao atualizar gráficos:', error);
    }
}

function updateCashFlowChart() {
    try {
        const ctx = document.getElementById('cashFlowChart');
        if (!ctx) return;
        
        const totals = calculateTotals();
        
        if (charts.cashFlow) charts.cashFlow.destroy();
        
        charts.cashFlow = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Receitas', 'Despesas', 'A Receber'],
                datasets: [{
                    data: [totals.income, totals.expense, totals.pending],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
                    ],
                    borderRadius: 8,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => formatCurrency(context.parsed.y)
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro no gráfico de fluxo:', error);
    }
}

function updateCategoryChart() {
    try {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;
        
        const categoryData = getCategoryData();
        
        if (charts.category) charts.category.destroy();
        
        const labels = Object.keys(categoryData);
        const data = Object.values(categoryData);
        
        if (labels.length === 0) {
            ctx.canvas.parentElement.innerHTML = `
                <div class="h-64 flex items-center justify-center" style="color: var(--text-secondary);">
                    <div class="text-center">
                        <i class="fas fa-chart-pie text-4xl mb-2"></i>
                        <p>Nenhuma despesa registrada</p>
                    </div>
                </div>
            `;
            return;
        }
        
        charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
                        '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            padding: 10,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro no gráfico de categorias:', error);
    }
}

function updateEvolutionChart() {
    try {
        const ctx = document.getElementById('evolutionChart');
        if (!ctx) return;
        
        const evolution = getMonthlyEvolution();
        
        if (charts.evolution) charts.evolution.destroy();
        
        charts.evolution = new Chart(ctx, {
            type: 'line',
            data: {
                labels: evolution.months,
                datasets: [
                    {
                        label: 'Receitas',
                        data: evolution.incomeData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Despesas',
                        data: evolution.expenseData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro no gráfico de evolução:', error);
    }
}

// ========================================
// MODAL E FORMULÁRIOS
// ========================================

function openModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            if (modalId === 'transaction-modal') {
                const form = document.getElementById('transaction-form');
                if (form) form.reset();
                document.getElementById('transaction-id').value = '';
                document.getElementById('modal-title').textContent = 'Nova Transação';
                document.getElementById('submit-btn-text').textContent = 'Salvar Transação';
                setDefaultDate();
                resetTypeButtons();
            }
        }
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
    }
}

function closeModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    } catch (error) {
        console.error('Erro ao fechar modal:', error);
    }
}

function editTransaction(id) {
    try {
        const transaction = transactions.find(t => t.id === id);
        if (!transaction) return;
        
        document.getElementById('transaction-id').value = transaction.id;
        document.getElementById('transaction-desc').value = transaction.desc;
        document.getElementById('transaction-amount').value = transaction.amount;
        document.getElementById('transaction-date').value = transaction.date;
        document.getElementById('transaction-type').value = transaction.type;
        document.getElementById('transaction-category').value = transaction.category;
        document.getElementById('transaction-notes').value = transaction.notes || '';
        
        document.getElementById('modal-title').textContent = 'Editar Transação';
        document.getElementById('submit-btn-text').textContent = 'Atualizar Transação';
        
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active', 'border-emerald-500', 'bg-emerald-50', 'text-emerald-700');
            btn.classList.add('border-gray-300');
            if (btn.dataset.type === transaction.type) {
                btn.classList.add('active', 'border-emerald-500', 'bg-emerald-50', 'text-emerald-700');
                btn.classList.remove('border-gray-300');
            }
        });
        
        openModal('transaction-modal');
    } catch (error) {
        console.error('Erro ao editar transação:', error);
    }
}

function setDefaultDate() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('transaction-date');
        if (dateInput) {
            dateInput.value = today;
        }
    } catch (error) {
        console.error('Erro ao definir data:', error);
    }
}

function resetTypeButtons() {
    try {
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active', 'border-emerald-500', 'bg-emerald-50', 'text-emerald-700');
            btn.classList.add('border-gray-300');
        });
        const incomeBtn = document.querySelector('.type-btn[data-type="income"]');
        if (incomeBtn) {
            incomeBtn.classList.add('active', 'border-emerald-500', 'bg-emerald-50', 'text-emerald-700');
            incomeBtn.classList.remove('border-gray-300');
        }
    } catch (error) {
        console.error('Erro ao resetar botões:', error);
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    try {
        const form = document.getElementById('transaction-form');
        if (form) {
            form.addEventListener('submit', handleTransactionSubmit);
        }
        
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.type-btn').forEach(b => {
                    b.classList.remove('active', 'border-emerald-500', 'bg-emerald-50', 'text-emerald-700');
                    b.classList.add('border-gray-300');
                });
                this.classList.add('active', 'border-emerald-500', 'bg-emerald-50', 'text-emerald-700');
                this.classList.remove('border-gray-300');
                document.getElementById('transaction-type').value = this.dataset.type;
            });
        });
        
        const periodFilter = document.getElementById('period-filter');
        if (periodFilter) {
            periodFilter.addEventListener('change', function() {
                currentPeriod = this.value;
                updateDashboard();
                updateCharts();
            });
        }
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('show');
                }
            });
        });
    } catch (error) {
        console.error('Erro ao configurar listeners:', error);
    }
}

function handleTransactionSubmit(e) {
    try {
        e.preventDefault();
        
        const id = document.getElementById('transaction-id').value;
        const transactionData = {
            id: id ? parseInt(id) : Date.now(),
            desc: document.getElementById('transaction-desc').value,
            amount: parseFloat(document.getElementById('transaction-amount').value),
            date: document.getElementById('transaction-date').value,
            type: document.getElementById('transaction-type').value,
            category: document.getElementById('transaction-category').value,
            notes: document.getElementById('transaction-notes').value,
            createdAt: id ? transactions.find(t => t.id === parseInt(id))?.createdAt : new Date().toISOString()
        };
        
        if (id) {
            updateTransaction(parseInt(id), transactionData);
        } else {
            addTransaction(transactionData);
        }
        
        closeModal('transaction-modal');
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        alert('Erro ao salvar transação. Tente novamente.');
    }
}

// ========================================
// TEMA
// ========================================

function loadTheme() {
    try {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
        console.log('✓ Tema carregado:', theme);
    } catch (error) {
        console.error('Erro ao carregar tema:', error);
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        console.log('✓ Tema alterado para:', newTheme);
        
        // Atualizar gráficos com novo tema
        setTimeout(() => {
            try {
                updateCharts();
            } catch (error) {
                console.error('Erro ao atualizar gráficos:', error);
            }
        }, 100);
    } catch (error) {
        console.error('Erro ao alternar tema:', error);
    }
}

function updateThemeIcon(theme) {
    try {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    } catch (error) {
        console.error('Erro ao atualizar ícone:', error);
    }
}

// ========================================
// UTILITÁRIOS
// ========================================

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getPeriodText() {
    switch (currentPeriod) {
        case 'today': return 'Hoje';
        case 'week': return 'Esta semana';
        case 'month': return 'Este mês';
        case 'year': return 'Este ano';
        default: return 'Todo período';
    }
}

async function logout() {
    try {
        if (confirm('Deseja realmente sair?')) {
            if (supabase) {
                await supabase.auth.signOut();
            }
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        window.location.href = 'login.html';
    }
}

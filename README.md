# 💰 FinanceMaster Pro

## Sistema Completo de Controle Financeiro Pessoal e Empresarial

Um sistema moderno, intuitivo e completo para gerenciar suas finanças com total controle e transparência. Desenvolvido com foco em organização, clareza e praticidade.

---

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Segurança
- ✅ **Sistema de login e cadastro** integrado com Supabase
- ✅ **Contas Pessoais ou Empresariais** - escolha o tipo que melhor se adequa
- ✅ **Proteção de dados** - cada usuário tem acesso apenas aos seus dados
- ✅ **Sessões persistentes** - mantenha-se logado com segurança

### 💳 Gestão Financeira Completa
- ✅ **Cadastro de Receitas** - salário, freelances, vendas, investimentos, etc.
- ✅ **Cadastro de Despesas** - fixas e variáveis, todas categorizadas
- ✅ **Valores a Receber** - controle de pendências financeiras
- ✅ **Edição e exclusão** de transações a qualquer momento
- ✅ **Observações** - adicione notas importantes em cada transação

### 📊 Dashboard Inteligente
- ✅ **Cards informativos** com indicadores-chave:
  - Receita Total
  - Despesas Totais
  - Valores a Receber
  - Saldo Real (Receitas - Despesas)
- ✅ **Gráficos interativos**:
  - Fluxo de Caixa (Entradas x Saídas)
  - Despesas por Categoria (Pizza/Donut)
  - Evolução Financeira Mensal (Linha)
- ✅ **Alertas inteligentes**:
  - Gastos excessivos
  - Valores pendentes
  - Finanças saudáveis

### 🔍 Filtros e Análises
- ✅ **Filtros por período**:
  - Hoje
  - Esta Semana
  - Este Mês (padrão)
  - Este Ano
  - Todo Período
- ✅ **Análise por categorias**:
  - **Receitas**: Salário, Freelance, Investimentos, Vendas, Outros
  - **Despesas Fixas**: Moradia, Transporte, Educação, Saúde, Seguros
  - **Despesas Variáveis**: Alimentação, Lazer, Compras, Viagens, Outros

### 📄 Exportação Profissional
- ✅ **PDF Completo**:
  - Cabeçalho personalizado
  - Resumo financeiro com cards visuais
  - Tabela de despesas por categoria
  - Lista detalhada de todas as transações
  - Rodapé com numeração de páginas
- ✅ **Excel (.xlsx)**:
  - Aba "Resumo" com indicadores e análises
  - Aba "Transações" com todos os lançamentos
  - Aba "Categorias" com distribuição de gastos
  - Aba "Evolução Mensal" com histórico de 6 meses
  - Formatação profissional e pronta para uso
- ✅ **CSV**:
  - Exportação rápida para importar em outras ferramentas
  - Compatível com Excel, Google Sheets, etc.

### 🎨 Interface Moderna
- ✅ **Modo Claro e Modo Escuro** - alternância com um clique
- ✅ **Design responsivo** - funciona perfeitamente em:
  - 💻 Desktop
  - 📱 Tablets
  - 📱 Smartphones
- ✅ **Animações suaves** e transições elegantes
- ✅ **Ícones Font Awesome** para melhor visualização
- ✅ **Cores intuitivas**:
  - Verde para receitas
  - Vermelho para despesas
  - Amarelo para pendências

---

## 🚀 Como Usar

### 1️⃣ Primeiro Acesso

1. **Abra o arquivo `cadastro.html`** no navegador
2. **Escolha o tipo de conta**:
   - 👤 **Pessoal** - para controle de finanças pessoais
   - 🏢 **Empresarial** - para gestão empresarial
3. **Preencha seus dados**:
   - Nome completo
   - E-mail
   - Senha (mínimo 6 caracteres)
4. **Clique em "Criar Conta Grátis"**

### 2️⃣ Login

1. **Abra o arquivo `login.html`**
2. **Digite seu e-mail e senha**
3. **Clique em "Entrar"**
4. **Você será redirecionado para o dashboard**

### 3️⃣ Adicionar Transações

1. **No dashboard, clique em "Nova Transação"** (botão verde ou menu lateral)
2. **Preencha os dados**:
   - Descrição (ex: "Salário de Dezembro")
   - Valor (ex: 5000.00)
   - Data
   - Tipo (Receita, Despesa ou A Receber)
   - Categoria
   - Observações (opcional)
3. **Clique em "Salvar Transação"**

### 4️⃣ Visualizar e Analisar

1. **Use o filtro de período** no canto superior direito
2. **Veja os cards** com resumo financeiro
3. **Analise os gráficos** para entender seus padrões
4. **Confira os alertas** para ficar atento a situações importantes

### 5️⃣ Editar ou Excluir

1. **Na tabela de transações**, clique no ícone de **lápis** para editar
2. **Ou clique no ícone de lixeira** para excluir
3. **Confirme a ação**

### 6️⃣ Exportar Relatórios

1. **Clique no botão "Exportar"** no header
2. **Escolha o formato**:
   - PDF (relatório visual completo)
   - Excel (planilha com múltiplas abas)
   - CSV (dados brutos)
3. **O arquivo será baixado automaticamente**

---

## 📁 Estrutura de Arquivos

```
financemaster-pro/
├── login.html           # Página de login
├── cadastro.html        # Página de cadastro
├── dashboard.html       # Dashboard principal
├── app.js              # Lógica principal do sistema
├── export.js           # Funções de exportação
└── README.md           # Esta documentação
```

---

## 🔧 Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização avançada
- **Tailwind CSS** - Framework CSS utilitário
- **JavaScript Vanilla** - Lógica sem dependências pesadas

### Bibliotecas
- **Supabase** - Autenticação e gerenciamento de usuários
- **Chart.js** - Gráficos interativos e responsivos
- **jsPDF** - Geração de PDFs profissionais
- **jsPDF-AutoTable** - Tabelas formatadas em PDF
- **SheetJS (XLSX)** - Exportação para Excel
- **Font Awesome** - Ícones modernos

### Armazenamento
- **LocalStorage** - Armazenamento local das transações
- **Supabase Auth** - Gerenciamento de sessões

---

## 🎯 Objetivo do Sistema

Ajudar você a entender **exatamente**:
- ✅ Quanto você ganha
- ✅ Quanto você gasta
- ✅ Quanto falta receber
- ✅ Qual é seu saldo real

Com **total controle** e **transparência financeira**.

---

## 💡 Dicas de Uso

### Para Melhor Organização:
1. **Registre todas as transações** assim que ocorrerem
2. **Use categorias consistentes** para facilitar análises
3. **Adicione observações** em transações importantes
4. **Revise os alertas** regularmente
5. **Exporte relatórios mensais** para acompanhamento histórico

### Para Análises Eficientes:
1. **Compare meses diferentes** usando o filtro de período
2. **Identifique categorias** com maiores gastos
3. **Estabeleça metas** baseadas na evolução mensal
4. **Monitore o saldo** para evitar gastos excessivos

---

## 🔐 Segurança e Privacidade

- ✅ **Senhas criptografadas** pelo Supabase
- ✅ **Dados isolados por usuário** - ninguém acessa seus dados
- ✅ **Sem compartilhamento** de informações com terceiros
- ✅ **Armazenamento local** para maior privacidade
- ✅ **Sessões seguras** com tokens JWT

---

## 📱 Compatibilidade

### Navegadores Suportados:
- ✅ Google Chrome (recomendado)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari
- ✅ Opera

### Dispositivos:
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablets (iOS, Android)
- ✅ Smartphones (iOS, Android)

---

## 🆘 Solução de Problemas

### Não consigo fazer login
- Verifique se o e-mail e senha estão corretos
- Certifique-se de que criou uma conta primeiro
- Limpe o cache do navegador

### Transações não aparecem
- Verifique o filtro de período selecionado
- Certifique-se de que salvou a transação
- Recarregue a página

### Exportação não funciona
- Verifique se há transações cadastradas
- Permita downloads no navegador
- Tente outro formato de exportação

### Gráficos não carregam
- Recarregue a página
- Verifique sua conexão com a internet
- Limpe o cache do navegador

---

## 🚀 Próximas Melhorias (Roadmap)

- [ ] Migrar armazenamento para banco de dados Supabase
- [ ] Adicionar metas financeiras
- [ ] Implementar notificações de vencimento
- [ ] Criar relatórios automáticos mensais
- [ ] Adicionar importação de extratos bancários
- [ ] Implementar recuperação de senha
- [ ] Adicionar gráficos de previsão
- [ ] Criar aplicativo mobile nativo
- [ ] Integração com APIs bancárias

---

## 📞 Suporte

Para dúvidas, sugestões ou problemas:
1. Verifique esta documentação
2. Confira a seção de solução de problemas
3. Revise as configurações do Supabase

---

## 📄 Licença

Este projeto foi desenvolvido para uso pessoal e educacional.

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ para ajudar pessoas a terem controle total de suas finanças.

**FinanceMaster Pro** - Seu aliado no controle financeiro inteligente.

---

**Versão:** 1.0.0  
**Data:** Dezembro 2025  
**Status:** ✅ Totalmente Funcional

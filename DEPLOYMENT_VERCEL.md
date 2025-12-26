# 🚀 Guia de Deployment na Vercel

## FinanceMaster Pro - Deploy em 5 Minutos

Este guia mostra como fazer deploy do seu projeto na Vercel de forma rápida e simples.

---

## 📋 Pré-requisitos

Você vai precisar de:
- Uma conta no [GitHub](https://github.com) (gratuita)
- Uma conta na [Vercel](https://vercel.com) (gratuita)
- Git instalado no seu computador

---

## 🔧 Passo 1: Preparar seu Repositório Git

### 1.1 Inicializar Git (se ainda não fez)

```bash
cd financemaster-pro
git init
git add .
git commit -m "Initial commit - FinanceMaster Pro"
```

### 1.2 Criar um Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Dê um nome ao repositório: `financemaster-pro`
3. Clique em **Create repository**
4. Copie o comando para adicionar o repositório remoto:

```bash
git remote add origin https://github.com/SEU_USUARIO/financemaster-pro.git
git branch -M main
git push -u origin main
```

---

## 🌐 Passo 2: Fazer Deploy na Vercel

### 2.1 Conectar Vercel ao GitHub

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Sign Up** (ou faça login se já tem conta)
3. Escolha **Continue with GitHub**
4. Autorize a Vercel a acessar seus repositórios

### 2.2 Importar Projeto

1. Na dashboard da Vercel, clique em **Add New Project**
2. Clique em **Import Git Repository**
3. Procure por `financemaster-pro` e clique em **Import**

### 2.3 Configurar Projeto

Na página de configuração:

- **Project Name**: `financemaster-pro` (ou outro nome que preferir)
- **Framework Preset**: Deixe em branco (é um projeto estático)
- **Root Directory**: Deixe em branco
- **Build Command**: Deixe vazio
- **Output Directory**: Deixe em branco

Clique em **Deploy**

---

## ✅ Passo 3: Verificar Deploy

Após alguns segundos, você verá a mensagem **"Congratulations! Your project has been successfully deployed."**

Sua URL será algo como: `https://financemaster-pro.vercel.app`

---

## 🔐 Passo 4: Configurar Variáveis de Ambiente (Opcional)

Se quiser adicionar variáveis de ambiente (como chaves de API):

1. Vá para **Settings** do seu projeto na Vercel
2. Clique em **Environment Variables**
3. Adicione suas variáveis
4. Faça um novo push para o GitHub para redeployar

---

## 🔄 Atualizações Automáticas

Agora, sempre que você fizer um push para o GitHub, a Vercel automaticamente:

1. Detecta as mudanças
2. Faz o build do projeto
3. Faz deploy da nova versão

Basta fazer:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

---

## 🐛 Solução de Problemas

### Erro 404 ao acessar a página

**Solução**: O arquivo `vercel.json` já está configurado para resolver isso. Se persistir:

1. Vá para **Settings** > **Git**
2. Clique em **Redeploy**
3. Aguarde o novo deploy

### Problemas com Supabase

Certifique-se de que:
- As credenciais do Supabase estão corretas no código
- Seu projeto Supabase está ativo
- As políticas de RLS estão configuradas (se necessário)

### Página em branco

1. Abra o console do navegador (F12)
2. Procure por erros
3. Verifique se o Supabase está respondendo

---

## 📊 Monitorar Seu Deploy

Na dashboard da Vercel, você pode:

- Ver o histórico de deploys
- Verificar logs de build
- Monitorar performance
- Gerenciar domínios customizados

---

## 🎯 Próximos Passos

### Adicionar Domínio Customizado

1. Na Vercel, vá para **Settings** > **Domains**
2. Clique em **Add**
3. Digite seu domínio (ex: `financemaster.com`)
4. Siga as instruções para configurar o DNS

### Configurar HTTPS

A Vercel fornece certificado SSL gratuito automaticamente!

### Adicionar Mais Colaboradores

1. Vá para **Settings** > **Members**
2. Clique em **Invite**
3. Digite o e-mail do colaborador

---

## 💡 Dicas Importantes

✅ **Sempre mantenha seu repositório atualizado** - Faça commits regularmente  
✅ **Use `.vercelignore`** - Já está configurado para ignorar arquivos desnecessários  
✅ **Teste localmente antes de fazer push** - Evita problemas em produção  
✅ **Monitore os logs** - Ajuda a identificar problemas rapidamente  
✅ **Faça backup do seu código** - Use Git como sistema de versionamento  

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique a documentação da Vercel: [vercel.com/docs](https://vercel.com/docs)
2. Consulte os logs de deploy na dashboard
3. Verifique o console do navegador (F12) para erros

---

## 🎉 Pronto!

Seu **FinanceMaster Pro** está agora online e acessível para qualquer pessoa no mundo!

Compartilhe o link: `https://seu-projeto.vercel.app`

---

**Versão**: 1.0  
**Última atualização**: Dezembro 2025

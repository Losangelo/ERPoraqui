#!/bin/bash
set -e

BASE="http://localhost:3002/api/v1"
EMAIL="admin@erporaqui.com.br"
SENHA="admin123"

echo ">>> Autenticando..."
LOGIN=$(curl -s -X POST "$BASE/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"senha\":\"$SENHA\"}")

TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
EMPRESA_ID=$(echo "$LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['empresa']['id'])")
echo ">>> Empresa ID: $EMPRESA_ID"

AUTH="Authorization: Bearer $TOKEN"

# Lista existentes
echo ">>> Carregando centros existentes..."
EXISTENTES=$(curl -s "$BASE/centros-custo" -H "$AUTH")
echo "$EXISTENTES" | python3 -c "
import sys,json
dados = json.load(sys.stdin).get('data',[])
for c in dados:
    print(f\"{c['codigo']}|{c['id']}|{c.get('centroPaiId') or ''}\")
" > /tmp/centros_existentes.txt 2>/dev/null || true

get_id() {
  grep "^$1|" /tmp/centros_existentes.txt | head -1 | cut -d'|' -f2
}

criar() {
  local codigo="$1"
  local nome="$2"
  local descricao="$3"
  local paiId="${4:-}"

  local EXISTENTE
  EXISTENTE=$(get_id "$codigo")
  if [ -n "$EXISTENTE" ]; then
    >&2 echo "  ~ $codigo - $nome (já existe)"
    echo -n "$EXISTENTE"
    return
  fi

  local data="{\"codigo\":\"$codigo\",\"nome\":\"$nome\",\"descricao\":\"$descricao\""
  [ -n "$paiId" ] && data="$data,\"centroPaiId\":\"$paiId\""
  data="$data}"

  local RESULT
  RESULT=$(curl -s -X POST "$BASE/centros-custo" \
    -H 'Content-Type: application/json' \
    -H "$AUTH" \
    -d "$data")

  local ID
  ID=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null || echo "")

  if [ -n "$ID" ]; then
    >&2 echo "  ✓ $codigo - $nome"
    echo -n "$ID"
    echo "$codigo|$ID|$paiId" >> /tmp/centros_existentes.txt
  else
    >&2 echo "  ✗ $codigo - $nome: $(echo "$RESULT" | head -c 200)"
    echo -n ""
  fi
}

echo ""
echo "=== NÍVEL 1: DIRETORIAS ==="

ID_ADMIN=$(criar "ADMIN" "Administrativo" "Gestão administrativa e serviços gerais")
ID_COMER=$(criar "COMER" "Comercial" "Vendas, marketing e relacionamento com clientes")
ID_FIN=$(criar "FIN" "Financeiro" "Gestão financeira, tesouraria e contas")
ID_FISCAL=$(criar "FISCAL" "Fiscal e Contábil" "Obrigações fiscais, contabilidade e DP")
ID_OP=$(criar "OP" "Operações" "Produção e operações industriais")
ID_TI=$(criar "TI" "Tecnologia da Informação" "Sistemas, infraestrutura e suporte TI")
ID_RH=$(criar "RH" "Recursos Humanos" "Gestão de pessoas, treinamento e benefícios")
ID_JUR=$(criar "JUR" "Jurídico" "Assessoria jurídica e contencioso")
ID_SUP=$(criar "SUP" "Suprimentos" "Compras, licitações e almoxarifado")
ID_LOG=$(criar "LOG" "Logística" "Transporte, frota e armazenagem")

echo ""
echo "=== NÍVEL 2: DEPARTAMENTOS ==="

# Administrativo
[ -n "$ID_ADMIN" ] && criar "ADMIN.SERV" "Serviços Gerais" "Limpeza, conservação e manutenção predial" "$ID_ADMIN"
[ -n "$ID_ADMIN" ] && criar "ADMIN.SEG" "Segurança Patrimonial" "Vigilância e controle de acesso" "$ID_ADMIN"
[ -n "$ID_ADMIN" ] && criar "ADMIN.COR" "Correspondências" "Protocolo e correspondências" "$ID_ADMIN"

# Comercial
[ -n "$ID_COMER" ] && criar "COMER.VEND" "Vendas Internas" "Vendas no balcão e telemarketing" "$ID_COMER"
[ -n "$ID_COMER" ] && criar "COMER.EXT" "Vendas Externas" "Representantes e vendas externas" "$ID_COMER"
[ -n "$ID_COMER" ] && criar "COMER.MKT" "Marketing" "Publicidade, propaganda e marketing digital" "$ID_COMER"
[ -n "$ID_COMER" ] && criar "COMER.POS" "Pós-Vendas" "Atendimento ao cliente e suporte pós-venda" "$ID_COMER"
[ -n "$ID_COMER" ] && criar "COMER.EXP" "Exportação" "Vendas para exterior e câmbio" "$ID_COMER"

# Financeiro
[ -n "$ID_FIN" ] && criar "FIN.CONT" "Contas a Pagar" "Gestão de contas a pagar e fornecedores" "$ID_FIN"
[ -n "$ID_FIN" ] && criar "FIN.REC" "Contas a Receber" "Gestão de contas a receber e cobrança" "$ID_FIN"
[ -n "$ID_FIN" ] && criar "FIN.TES" "Tesouraria" "Gestão de caixa, bancos e aplicações" "$ID_FIN"
[ -n "$ID_FIN" ] && criar "FIN.CONC" "Conciliação Bancária" "Conciliação de extratos bancários" "$ID_FIN"
[ -n "$ID_FIN" ] && criar "FIN.FCX" "Fluxo de Caixa" "Planejamento e controle de fluxo de caixa" "$ID_FIN"
[ -n "$ID_FIN" ] && criar "FIN.CRED" "Crédito e Cobrança" "Análise de crédito e recuperação" "$ID_FIN"

# Fiscal e Contábil
[ -n "$ID_FISCAL" ] && criar "FISCAL.CONT" "Contabilidade" "Escrituração contábil e balanços" "$ID_FISCAL"
[ -n "$ID_FISCAL" ] && criar "FISCAL.FIS" "Fiscal" "Apuração de tributos e obrigações fiscais" "$ID_FISCAL"
[ -n "$ID_FISCAL" ] && criar "FISCAL.DP" "Departamento Pessoal" "Folha de pagamento e encargos trabalhistas" "$ID_FISCAL"

# Operações
[ -n "$ID_OP" ] && criar "OP.PROD" "Produção" "Linhas de produção e fabricação" "$ID_OP"
[ -n "$ID_OP" ] && criar "OP.QUAL" "Qualidade" "Controle de qualidade e certificações" "$ID_OP"
[ -n "$ID_OP" ] && criar "OP.MAN" "Manutenção" "Manutenção de máquinas e equipamentos" "$ID_OP"
[ -n "$ID_OP" ] && criar "OP.PCP" "Planejamento e Controle" "PCP e programação da produção" "$ID_OP"

# TI
[ -n "$ID_TI" ] && criar "TI.INFRA" "Infraestrutura" "Servidores, redes e datacenter" "$ID_TI"
[ -n "$ID_TI" ] && criar "TI.DEV" "Desenvolvimento" "Desenvolvimento de sistemas e apps" "$ID_TI"
[ -n "$ID_TI" ] && criar "TI.SUP" "Suporte" "Help desk e suporte aos usuários" "$ID_TI"
[ -n "$ID_TI" ] && criar "TI.SEG" "Segurança da Informação" "Governança e segurança digital" "$ID_TI"

# RH
[ -n "$ID_RH" ] && criar "RH.REC" "Recrutamento e Seleção" "Processos seletivos e admissão" "$ID_RH"
[ -n "$ID_RH" ] && criar "RH.TRE" "Treinamento" "Capacitação e desenvolvimento" "$ID_RH"
[ -n "$ID_RH" ] && criar "RH.BEN" "Benefícios" "Gestão de benefícios e convênios" "$ID_RH"
[ -n "$ID_RH" ] && criar "RH.SEGT" "Segurança do Trabalho" "SST, EPIs e medicina ocupacional" "$ID_RH"
[ -n "$ID_RH" ] && criar "RH.CAR" "Cargos e Salários" "Estrutura salarial e carreiras" "$ID_RH"

# Jurídico
[ -n "$ID_JUR" ] && criar "JUR.CONT" "Contencioso" "Ações judiciais e processos" "$ID_JUR"
[ -n "$ID_JUR" ] && criar "JUR.CONS" "Consultivo" "Pareceres e contratos" "$ID_JUR"

# Suprimentos
[ -n "$ID_SUP" ] && criar "SUP.COM" "Compras" "Compras nacionais e internacionais" "$ID_SUP"
[ -n "$ID_SUP" ] && criar "SUP.ALM" "Almoxarifado" "Gestão de estoque e almoxarifado" "$ID_SUP"
[ -n "$ID_SUP" ] && criar "SUP.LIC" "Licitações" "Processos licitatórios" "$ID_SUP"

# Logística
[ -n "$ID_LOG" ] && criar "LOG.ENT" "Entregas" "Gestão de entregas e expedição" "$ID_LOG"
[ -n "$ID_LOG" ] && criar "LOG.FRO" "Frota" "Gestão de veículos e motoristas" "$ID_LOG"
[ -n "$ID_LOG" ] && criar "LOG.ARM" "Armazenagem" "Armazenagem e centro de distribuição" "$ID_LOG"

echo ""
echo "=== SEED CONCLUÍDO ==="

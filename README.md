# Skyone Agent Squad

**Squad de agentes para engenharia, integração e entrega de projetos na Plus IT.**

O objetivo é transformar uma tarefa do **ClickUp** em uma entrega rastreável: levantamento e aprovação de requisitos, arquitetura e contratos, desenvolvimento no **Codex**, criação ou inspeção de artefatos no **Skyone Studio**, testes e atualização do projeto.

> **Versão 0.1 — bootstrap de skills.** Este repositório já contém um pacote npm e um instalador de instruções para Codex, mas **ainda não é um orquestrador autônomo**. Criar repositórios, iniciar execuções paralelas, editar/publicar artefatos Skyone e operar ClickUp automaticamente são evoluções previstas, não funcionalidades disponíveis nesta versão.

## Arquitetura funcional pretendida

```text
ClickUp (tarefa do projeto)
   |
   v
Delivery Orchestrator  ──> Requirements Analyst
                                 |
                                 v
                         Aprovação do PO
                                 |
                                 v
                         Solution Architect
                                 |
                    Contratos versionados
                       /               \
                      v                 v
                Codex Dev         Skyone Engineer
             Next.js, APIs        Gateway, Jobs, Studio
                     \                 /
                      v               v
                       QA & Security
                             |
                             v
                      Aprovação / Release
                             |
                             v
                    Evidências no ClickUp
```

**Agentes existentes:** Codex Dev trabalha no VS Code/CLI. Skyone Engineering Agent v0.1 já fez inventário read-only no Skyone usando Playwright MCP com login manual.  
**Agentes propostos:** Delivery Orchestrator, Requirements Analyst, Solution Architect, QA & Security. Nesta versão suas skills são orientações iniciais; não representam workers autônomos em execução.

## Instalar em um projeto Node.js

Requisitos: **Node.js 20+**, npm e **Codex** no ambiente. É preciso acesso ao repositório e permissão para instalar dependências.

Dentro do projeto de destino:

```powershell
npm install --save-dev github:fabrizio-plus-it/squad
npx squad-init --dry-run
npx squad-init
```

O primeiro comando instala o pacote a partir do GitHub como dependência de desenvolvimento. **Não copia skills durante o `npm install`**: a instalação de arquivos ocorre somente após executar `npx squad-init` de forma explícita. O comando `--dry-run` mostra os destinos sem escrever.

Se o projeto não tiver `package.json`, crie-o primeiro:

```powershell
npm init -y
npm install --save-dev github:fabrizio-plus-it/squad
npx squad-init
```

Para facilitar a repetição, no `package.json` do projeto consumidor adicione:

```json
{
  "scripts": {
    "squad:init": "squad-init"
  }
}
```

Então execute `npm run squad:init`. O projeto consumidor controla sua versão de dependência. Para produção, fixe em commit ou tag auditada e utilize `package-lock.json`; instalar diretamente do branch principal não garante reprodutibilidade.

### Arquivos gerados

```text
projeto-consumidor/
├── AGENTS.squad.md
├── .agents/
│   └── skills/
│       ├── codex-dev/SKILL.md
│       ├── skyone-engineer/SKILL.md
│       ├── delivery-orchestrator/SKILL.md
│       ├── requirements-analyst/SKILL.md
│       ├── solution-architect/SKILL.md
│       └── qa-security/SKILL.md
└── package.json
```

O instalador **não sobrescreve arquivos existentes**. Ele pula arquivos já presentes e avisa no terminal. O comando `--force` substitui os arquivos da distribuição — **revise alterações locais antes de usá-lo**.

`AGENTS.squad.md` é instalado separadamente para não substituir o `AGENTS.md` do projeto. A instalação **não o ativa automaticamente**: acrescente no `AGENTS.md` existente a seguinte instrução ou incorpore o conteúdo manualmente:

```md
Antes de executar demandas do squad, leia também AGENTS.squad.md.
```

As skills ficam na pasta `.agents/skills/` do projeto, de onde o Codex pode descobri-las. Reinicie a sessão do Codex após a instalação, se necessário.

## Configuração local do navegador Skyone

O **Playwright MCP não é instalado nem configurado automaticamente pelo pacote**. Na máquina do agente:

```powershell
npm install -g @openai/codex
codex mcp add playwright -- npx -y @playwright/mcp@latest
codex mcp list
```

Abra o Codex no VS Code, inicie uma sessão e solicite:

```text
Use $skyone-engineer para inspecionar, somente leitura, o API Gateway
GESTAO_RH_API e o fluxo Consultar currículos Gold IA.
Solicite login manual no Skyone. Não salve, execute escritas ou publique nada.
```

**Atenção:** a skill Skyone v0.1 **não permite criação ou edição** de rotas, SQL, tabelas ou fluxos; isso requer uma nova versão com aprovação, controle de ambiente, idempotência e rollback.

## Quando o orquestrador criar um repositório (visão futura)

O fluxo desejado para um novo projeto será:

```text
1. Receber task_id do ClickUp.
2. Refinar requisitos e obter aprovação do PO.
3. Criar o repositório GitHub do novo projeto.
4. Preparar Node.js/package.json e configurações do projeto.
5. Instalar github:fabrizio-plus-it/squad com npm.
6. Executar squad-init.
7. Integrar AGENTS.squad.md ao contexto do Codex.
8. Verificar disponibilidade/credenciais autorizadas dos conectores MCP.
9. Arquitetar contratos; encaminhar tarefas a Dev e Skyone.
10. Rodar QA; pedir aprovação de publicação; documentar evidências.
```

**Isso é o desenho de orquestração, não um comando implementado na versão 0.1.**

Para o futuro, haverá um pacote de runtime/orquestração capaz de criar repositórios com permissões autorizadas, receber tarefas ClickUp, manter estado das execuções e distribuir trabalho a workers. A instalação npm será apenas o mecanismo de distribuição das ferramentas e contratos; não concede permissões a ClickUp, GitHub ou Skyone por si só.


## Primeiro projeto-piloto: Zigurate — da tarefa ClickUp à entrega

O **Zigurate** foi escolhido como **primeiro piloto de ponta a ponta do Skyone Agent Squad**. O GESTAO_RH continua sendo a prova técnica inicial das skills Codex Dev e Skyone Engineering, mas o piloto de coordenação do time começa a partir de uma demanda existente e ainda em descoberta.

**Tarefa de origem no ClickUp:** [Zigurate | Automação de entrada de notas fiscais no ERP Mega](https://app.clickup.com/t/1dff4uhdym4).  
**Escopo comercial conhecido:** acelerar a entrada de notas fiscais no ERP Mega; envolve seleção pelo administrativo, conferências e validações, vinculação de itens a pedidos e tratamento/reprocessamento de exceções. Os detalhes técnicos, as APIs e os acessos devem ser confirmados com o cliente e com a Skyone. O projeto está na etapa de **pré-venda/discovery**: não há neste repositório confirmação de aprovação de escopo final, contrato de implantação, acesso ao Mega ou autorização para operações no ambiente do cliente.

As subtarefas e atas já existentes no ClickUp devem ser lidas antes de levantar novos requisitos, sem criar duplicações. Na reunião de 17/11 ficaram indicadas dependências como vídeo do processo, documentação de API e massa representativa de materiais e serviços; verificar o estado atual dessas entregas no ClickUp e com seus responsáveis.

### Bootstrap manual do novo projeto (executável no pacote v0.1)

Após a aprovação para criação do repositório de implementação, a pessoa operadora ou o orquestrador **futuro** poderá preparar um novo projeto Node.js. Exemplo em PowerShell, usando um diretório local vazio:

```powershell
# Exemplo: ambiente local com Git, Node.js 20+ e npm disponíveis
mkdir zigurate-automacao
cd zigurate-automacao
npm init -y
npm install --save-dev github:fabrizio-plus-it/squad

# Revisar antes de copiar arquivos ao projeto
npx squad-init --dry-run

# Instalar as instruções e skills de agentes no projeto
npx squad-init

# Opcional: conferir as skills instaladas
Get-ChildItem .agents/skills -Directory
```

Se o **repositório remoto já tiver sido criado e clonado**, rode os comandos dentro da pasta clonada; não recrie o repositório nem substitua arquivos existentes. `squad-init` **não** cria um repositório GitHub, não configura credenciais, não cria tarefas ClickUp e não executa agentes. Reinstalações não sobrescrevem skills já existentes, salvo uso explícito de `--force`.

Para que o Codex leia também as instruções complementares, incluir no `AGENTS.md` do projeto:

```md
Antes de executar demandas do Skyone Agent Squad, leia AGENTS.squad.md e siga as skills aplicáveis em .agents/skills/.
```

A configuração do Playwright MCP é **local**, separada do npm do projeto. Somente se não estiver configurado:

```powershell
codex mcp add playwright -- npx -y @playwright/mcp@latest
codex mcp list
```

Não versionar senhas, tokens de GitHub/ClickUp/Skyone, cookies de sessão ou dados reais do cliente.

### Fluxo que queremos demonstrar em Zigurate

| Fase | Responsável | Evidência / gate |
| --- | --- | --- |
| 1. Intake da demanda existente | Orchestrator | IDs/links das tarefas originais, contexto, lacunas e dependências |
| 2. Descoberta e requisitos | Requirements Analyst | Requisitos, perguntas e critérios de aceite; **aprovação humana** |
| 3. Arquitetura | Solution Architect | Contratos OpenAPI/dados, desenho dos fluxos Mega/Skyone, riscos e plano de testes; aprovação quando aplicável |
| 4. Preparação do repositório | Orchestrator com Codex Dev | GitHub autorizado, `npm install`, `squad-init`, skills e contexto instalados |
| 5. Implementação em laboratório | Codex Dev + Skyone Engineering | Código e artefatos alinhados ao contrato, somente após aprovação e acesso |
| 6. Testes e segurança | QA & Security | Testes com dados sintéticos, evidências, erros, idempotência e autorizações |
| 7. Publicação e aceite | PO + responsáveis autorizados | Aprovação explícita de publicação, validação funcional e registro no ClickUp |

**Estado atual:** somente o bootstrap npm + templates de skills estão escritos no repositório; a execução multiagente integral, provisionamento remoto do GitHub, integração automática com ClickUp e alterações no Skyone continuam **não implementadas**. A skill Skyone é **read-only v0.1**. O piloto deve começar por *discovery e design*, não por criação imediata de tabelas, rotas ou lançamentos fiscais no Mega.

### Primeiro prompt para o Codex no repositório Zigurate

```text
Leia AGENTS.md e AGENTS.squad.md. Use a skill requirements-analyst
e, quando aplicável, delivery-orchestrator.

Demanda original: https://app.clickup.com/t/1dff4uhdym4
Subtarefa técnica: https://app.clickup.com/t/1dff4uhec4j

Comece somente pelo levantamento: consulte o contexto e as fontes
realmente acessíveis, identifique o que está confirmado e o que está
pendente, proponha requisitos funcionais/não funcionais, contratos,
dependências e critérios de aceite para automação de entrada de notas
fiscais no ERP Mega. Não assuma APIs, formatos ou permissões não
documentados. Não modifique o Skyone nem o ERP e não crie repositórios
ou tarefas duplicadas. Apresente o escopo para aprovação humana antes
de iniciar arquitetura e desenvolvimento.
```

### Aceite do piloto

O sucesso do **squad** exige rastrear uma demanda Zigurate do ClickUp, obter aprovação do escopo, versionar arquitetura e contratos, realizar handoff entre Codex Dev e Skyone Agent, validar solução com QA e registrar entregas. Isso não significa que a oportunidade comercial do cliente foi contratada ou que um ERP de produção foi alterado.


## Políticas e segurança

- Todos os agentes devem respeitar o `AGENTS.md` preexistente.
- O estado da tarefa ClickUp e o contrato versionado são as referências para decisões.
- Alterações materiais exigem aprovação explícita. Publicação, migração destrutiva, permissões e usuários reais exigem gate separado.
- Segredos não vão para prompts, Git, screenshots ou logs. Login/MFA na Skyone devem ocorrer por fluxo humano autorizado.
- Não copiar currículos ou PII para exemplos. Usar dados sintéticos.
- Cada handoff deve documentar task ID, versão do contrato, pré-condições, ambiente, ações executadas, evidências, riscos e plano de reversão.
- `npm install` não executa automaticamente automações nem modifica o Skyone.

## Organização do repositório

```text
squad/
├── README.md
├── package.json
├── bin/
│   └── squad-init.js
└── templates/
    ├── AGENTS.md
    └── skills/
        ├── codex-dev/SKILL.md
        ├── skyone-engineer/SKILL.md
        ├── delivery-orchestrator/SKILL.md
        ├── requirements-analyst/SKILL.md
        ├── solution-architect/SKILL.md
        └── qa-security/SKILL.md
```

## Roadmap

| Marco | Objetivo | Estado |
|---|---|---|
| M0 | Pacote npm + instalador de skills | Código inicial disponível; testes de instalação pendentes |
| M1 | Especificações e handoffs ClickUp → agentes | Planejado |
| M2 | Orquestração assistida com contratos e gates | Planejado |
| M3 | Skyone Engineer v0.2: escrita controlada em laboratório | Planejado |
| M4 | QA e trilha de evidências ClickUp/Git/Skyone | Planejado |
| M5 | Runtime persistente de execução multiagente | Futuro |

## Links do projeto

- [Planejamento — Skyone Agent Squad (ClickUp)](https://app.clickup.com/1600310000003657/v/l/li/1600310000041106)
- [Escopo do projeto no ClickUp](https://app.clickup.com/t/1dff4uhfrvu)
- [Piloto GESTAO_RH](https://github.com/fabrizio-plus-it/gestao-rh)
- [Inventário Skyone validado no piloto](https://app.clickup.com/t/1dff4uhfpqy)

---

**Status:** protótipo inicial de distribuição de skills; ainda não publicado no registro npm, sem orquestrador autônomo e sem validação de instalação em máquina externa.

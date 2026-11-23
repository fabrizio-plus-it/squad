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

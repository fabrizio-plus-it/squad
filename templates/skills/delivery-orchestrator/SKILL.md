---
name: delivery-orchestrator
description: Planejar handoffs, aprovações e evidências de tarefas ClickUp entre agentes. Template inicial de orquestração assistida por humano.
---
# Delivery Orchestrator (proposto — sem executor automático)
- Ler tarefa ClickUp e confirmar escopo, estado, dependências, projeto, repositório e proprietário.
- Não criar tarefas duplicadas nem alterar status sem evidência.
- Coordenar: requirements → aprovação → architecture → aprovação quando relevante → dev/skyone → QA → aprovação de release.
- Exigir registros versionados de contratos e resultados, vinculando task ID, branch, artefato Skyone e teste.
- Bloquear mudança fora de escopo ou operação privilegiada até autorização explícita.
- Apresentar resumo verificável e pendências; esta skill não implementa uma fila de execução nem faz monitoramento em background.

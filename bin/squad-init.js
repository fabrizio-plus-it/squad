#!/usr/bin/env node
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const project = process.cwd();
const args = new Set(process.argv.slice(2));
if (args.has("--help") || args.has("-h")) {
  console.log("Uso: squad-init [--dry-run] [--force] [--help]");
  console.log("Copia skills Codex e instruções para o diretório atual. Nunca instala credenciais nem MCP.");
  process.exit(0);
}
const dryRun = args.has("--dry-run");
const force = args.has("--force");
const manifest = [
  ["templates/AGENTS.md", "AGENTS.squad.md"],
  ...readdirSync(join(root,"templates","skills"), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => [`templates/skills/${entry.name}/SKILL.md`, `.agents/skills/${entry.name}/SKILL.md`])
];
let added = 0, skipped = 0;
for (const [source, dest] of manifest) {
  const target = join(project, dest);
  if (existsSync(target) && !force) {
    console.log(`[skip] ${dest} (já existe; use --force para sobrescrever)`);
    skipped++;
    continue;
  }
  if (!dryRun) {
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(root, source), target);
  }
  console.log(`[${dryRun ? "dry-run" : "ok"}] ${dest}`);
  added++;
}
console.log(`Concluído: ${added} arquivo(s) ${dryRun ? "planejados" : "copiados"}, ${skipped} preservado(s).`);
console.log("Leia AGENTS.squad.md e faça a integração manual com o AGENTS.md existente. Configure MCP e acessos fora do Git.");

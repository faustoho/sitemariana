# Site da Dra. Mariana

Site em português sobre medicina de família, teleconsulta e solicitações de agendamento.

## Prévia local

Execute `node preview.cjs` e acesse http://127.0.0.1:4173.

## Configuração

Os arquivos publicados ficam em `dist`. O contato do WhatsApp está em `dist/config.js`, com código do país e DDD. O formulário abre uma mensagem para o paciente enviar; não envia mensagens automaticamente, não registra consultas e não bloqueia horários. A confirmação é manual.

A foto fornecida está em `dist/mariana.jpg`. A identificação atual é Mariana Franco Ribeiro de Oliveira, CRM-PR 26.519. Nenhum RQE foi informado.

## Publicação

A configuração de hospedagem privada de revisão está em `.openai/hosting.json`. O site precisa ter o acesso público habilitado antes de ser divulgado aos pacientes.

## Cloudflare Workers

O projeto usa Workers Static Assets, sem código de servidor. Conecte o repositório `faustoho/sitemariana` no Cloudflare Workers.

- Production branch: `main`
- Build command: deixe vazio (ou `exit 0`)
- Deploy command: `npx wrangler deploy`
- Root directory: raiz do repositório
- Nome do Worker: `sitemariana`

O arquivo `wrangler.jsonc` aponta `assets.directory` para `./dist`. O site já está pronto nessa pasta e não precisa de compilação. O Cloudflare publica novamente quando a branch `main` recebe alterações. O formulário abre o WhatsApp e depende de confirmação manual.

Para verificar a configuração sem publicar: `npx wrangler deploy --dry-run`.
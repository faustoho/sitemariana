# Site da Dra. Mariana

Site em português sobre medicina de família, teleconsulta e solicitações de agendamento.

## Prévia local

Execute `node preview.cjs` e acesse http://127.0.0.1:4173.

## Configuração

Os arquivos publicados ficam em `dist`. O contato do WhatsApp está em `dist/config.js`, com código do país e DDD. O formulário abre uma mensagem para o paciente enviar; não envia mensagens automaticamente, não registra consultas e não bloqueia horários. A confirmação é manual.

A foto fornecida está em `dist/mariana.jpg`. A identificação atual é Mariana Franco Ribeiro de Oliveira, CRM-PR 26.519. Nenhum RQE foi informado.

## Publicação

A configuração de hospedagem privada de revisão está em `.openai/hosting.json`. O site precisa ter o acesso público habilitado antes de ser divulgado aos pacientes.

## Cloudflare Pages

Conecte o repositório `faustoho/sitemariana` em Workers & Pages > Create application > Pages > Import an existing Git repository.

- Production branch: `main`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `dist`
- Root directory: raiz do repositório

A integração Git publica novamente quando a branch `main` recebe alterações. O formulário continua abrindo o WhatsApp e depende de confirmação manual. A configuração do Cloudflare está em `wrangler.jsonc`.

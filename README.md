# FOOD99LIKE React

Projeto React em JavaScript com Vite, Tailwind CSS v4 e interface mobile-first para cardápio digital.

## Rodar o projeto

```bash
npm.cmd install
npm.cmd run dev
```

Abra no navegador:

- `http://localhost:5173/` para abrir direto no cardápio.
- `http://localhost:5173/#menu` para manter um link explícito do cardápio.
- `http://localhost:5173/#produto=cheddar-bacon` para abrir um produto direto.
- `http://localhost:5173/#configuracoes` para abrir o painel administrativo.
- `http://localhost:5173/?adminTab=vezz#configuracoes` para abrir as métricas/Vezz.
- `http://localhost:5173/?adminTab=cartao#configuracoes` para abrir o preview do cartão físico.
- `http://localhost:5173/#pedido` para abrir a tela de pedido.
- `http://localhost:5173/?mesa=05#menu` para simular abertura por NFC/QR da mesa 05.

## MVP implementado

- Cardápio direto na primeira tela, com visual escuro fixo, destaque da casa no hero, slide mais lento, busca por item/ingrediente e filtros por categoria.
- Produtos em duas colunas inspiradas em cardápio impresso, mantendo imagem, descrição, ingredientes e preço.
- Comandos de voz no cardápio para buscar itens, abrir produtos, trocar categoria e chamar a Vezz.
- Produto aberto com leitura opcional de ingredientes, observação e adição ao pedido.
- Pedido com mesa, nome opcional, tipo de atendimento e forma de pagamento.
- Admin minimalista por abas para editar, ativar/desativar e criar itens do cardápio.
- Aba de mesas com link NFC/QR por mesa.
- Aba Vezz com painel local de acessos, cliques, CTR, pedidos e interesse por horário.
- Aba de cartão físico com preview de NFC, QR, WhatsApp, Instagram, Wi-Fi e área visual de braille.

## Dados e privacidade

Este MVP registra eventos discretos no `localStorage` e uma sessão anônima no `sessionStorage`.
Os dados não saem do navegador nesta versão: abertura do menu, busca, comando de voz, clique em Vezz, visualização de produto, adição ao carrinho e pedido enviado.

Para produção, o próximo passo é trocar essa camada por banco de dados, autenticação de admin e política de consentimento/privacidade.

## Acessibilidade

- A primeira tela agora é o cardápio, reduzindo um passo para quem usa leitor de tela.
- O botão discreto no topo esquerdo ativa a leitura automática de ingredientes ao abrir um item.
- Na tela do produto, o botão de alto-falante lê os ingredientes do item sob demanda.
- Ao voltar do produto ou desativar o leitor, a leitura em andamento é cancelada.
- A leitura por voz expande abreviações como `150g` para `150 gramas` e ajusta termos como bacon para uma pronúncia mais natural.
- O botão de microfone no cardápio aceita comandos como `abrir cheddar bacon`, `mostrar bebidas`, `quanto custa pizza` e `chamar Vezz`.
- Os cards, categorias, mesas e controles de quantidade possuem labels e estados para leitores de tela.

## Deploy Vercel

O projeto já possui `vercel.json` com:

- build: `npm run build`
- saída: `dist`
- rewrite SPA para `index.html`

Na Vercel, importe o repositório/projeto e use o preset Vite.

## NFC e QR

Para NFC/QR por mesa, grave na etiqueta ou no QR um link neste formato:

```txt
https://seu-dominio.vercel.app/?mesa=05#menu
```

Ao abrir esse link, o cardápio já entra na tela de menu com a mesa preenchida.

## Estrutura

- `src/App.jsx`: interface principal com componentes React e classes Tailwind.
- `src/assets/`: imagens locais usadas nas telas.
- `src/index.css`: import obrigatório do Tailwind.
- `vite.config.js`: Vite com React e plugin oficial do Tailwind.
- `vercel.json`: configuração de deploy e fallback SPA.

Este projeto evita arquivos `.css` por componente. O único CSS mantido é o ponto de entrada necessário para o Tailwind gerar os estilos.

# Admin Extra

Fluxo separado do cadastro publico.

- Login admin principal: `/#admin-principal`
- Compatibilidade antiga: `/#admin-cardapio`
- Cadastro administrador: `/#cadastro-administrador`
- Cardapio publico por loja: `/#cardapio-coco-bambu`
- Perfil do cadastro: usuario, email e senha.
- Recuperacao de senha: feita pelo Firebase Auth no link `Esqueci minha senha`.
- Toasts: notificacoes internas com tempo mais lento para leitura.

O cadastro fica fora da tela publica, mas cria perfil administrativo para o email informado.
Em producao, o ideal e trocar esse autocadastro por convite, chave temporaria ou aprovacao manual.

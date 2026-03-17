# Guia Rápido: Migrar PostgreSQL Local para a Nuvem

Este guia tem o objetivo primário de te ensinar como fazer um "dump" (cópia total de dados e estrutura) do seu banco `ligamagic` atual para subir na nuvem, permitindo que o GitHub Actions acesse a sua base remotamente.

## 1. Criar um Banco Grátis na Nuvem
As opções mais conhecidas, rápidas e com planos gratuitos atualmente para o PostgreSQL são:
*   [Supabase](https://supabase.com/): Muito fácil e te dá a string/URI direto.
*   [Neon.tech](https://neon.tech/): O banco liga/desliga sozinho para poupar cota grátis e é instantâneo.
*   [Render](https://render.com/): Ótimo banco para dev (apaga os dados em 90 dias no plano free, use se as outras falharem).

Crie uma conta em qualquer uma das plataformas acima e preencha para gerar um novo banco de dados vazio. 
Ao final, o site vai gerar para você as chaves (Host, User, Password, Porta, DatabaseName) e também uma "Connection String" (URI) do tipo: `postgresql://usuario:senha@host:5432/nomebanco`

---

## 2. Fazer o Dump (Backup) do Local
Vamos pegar todas as cartas da sua `lista_cartas_dia` e da sua `his_precos_ligamagic` usando o terminal do seu Windows. Você usará a ferramenta nativa `pg_dump` que já veio quando instalou o Postgres.

Abra o CMD ou PowerShell e digite:
```bash
pg_dump -U postgres -h localhost -d ligamagic -F p -f dump_ligamagic.sql
```
*(Ele vai pedir sua senha, que pelo arquivo era `891221`)*

**O que esse comando faz?**
Ele gerou um arquivo chamado `dump_ligamagic.sql` (que agora deve estar na sua pasta atual do terminal) contendo tudo que existe dentro do localhost com o código para reconstruir a tabela inteira do zero na nuvem.

---

## 3. Restaurar (Restore) na Nuvem
Agora você vai pegar esse arquivo de texto `.sql` e inserir os dados novos lá no host maluco e gigante da nuvem gerenciado pela plataforma que você escolheu.
Execute o comando abaixo apontando agora para o Host e Usuário que a nuvem te informou:

```bash
psql -h seu_novo_host_da_nuvem.com -U seu_novo_usuario -d nomedobanco -f dump_ligamagic.sql
```

**Alternativa mais fácil (Recomendado):**
Ao invés de rodar via linha de comando o `psql`, abra o seu gerenciador de banco de dados visual preferido (DBeaver, pgAdmin, ou o próprio painel online do Supabase/Neon). 
Copie todo o texto que está dentro de `dump_ligamagic.sql` criado no **passo 2**, cole no "SQL Editor" do painel online e aperte "Run/Executar". Ele irá criar as tabelas instantaneamente.

## 4. Finalização
Feito! Os dados estão vivos na nuvem! Tudo está pronto.
Lembre-se apenas de preencher os Secrets do GitHub para usar as chaves do novo provedor.

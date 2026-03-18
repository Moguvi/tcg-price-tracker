-- ============================================================
-- Migração: simplificar lista_cartas_dia para dia + carta
-- Execute no Supabase: Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Remove as colunas antigas (preco_min e variacao)
ALTER TABLE lista_cartas_dia
  DROP COLUMN IF EXISTS preco_min,
  DROP COLUMN IF EXISTS variacao;

-- 2. Garante que o unique constraint está correto (dia + carta)
--    Se já existir, o comando abaixo detecta e recria apenas se necessário.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'lista_cartas_dia_dia_carta_key'
  ) THEN
    ALTER TABLE lista_cartas_dia
      ADD CONSTRAINT lista_cartas_dia_dia_carta_key UNIQUE (dia, carta);
  END IF;
END $$;

-- 3. Resultado esperado da tabela após migração:
-- id    | bigint (PK, gerado automaticamente)
-- dia   | date   (data da coleta)
-- carta | text   (nome da carta)

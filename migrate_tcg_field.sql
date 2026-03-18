-- ============================================================
-- Migração: Adicionar campo TCG (MAGIC/POKEMON)
-- Execute no Supabase: Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Adicionar colunas novas
ALTER TABLE lista_cartas_dia ADD COLUMN IF NOT EXISTS tcg TEXT;
ALTER TABLE his_precos_ligamagic ADD COLUMN IF NOT EXISTS tcg TEXT;

-- 2. Atualizar Unique Constraint da tabela lista_cartas_dia
ALTER TABLE lista_cartas_dia DROP CONSTRAINT IF EXISTS lista_cartas_dia_dia_carta_key;
ALTER TABLE lista_cartas_dia DROP CONSTRAINT IF EXISTS lista_cartas_dia_dia_carta_tcg_key;
ALTER TABLE lista_cartas_dia ADD CONSTRAINT lista_cartas_dia_dia_carta_tcg_key UNIQUE (dia, carta, tcg);

-- 3. Atualizar Unique Constraint da tabela his_precos_ligamagic
ALTER TABLE his_precos_ligamagic DROP CONSTRAINT IF EXISTS his_precos_ligamagic_unique_full;
ALTER TABLE his_precos_ligamagic ADD CONSTRAINT his_precos_ligamagic_unique_full UNIQUE (data, carta, edicao, tipo_carta, qualidade, idioma, tcg);

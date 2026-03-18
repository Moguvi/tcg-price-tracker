-- ============================================================
-- SQL FINAL: Resolver erros de duplicidade (Unique Constraint)
-- Execute no Supabase: Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Tentar remover o constraint específico reportado no erro
ALTER TABLE his_precos_ligamagic DROP CONSTRAINT IF EXISTS "his_precos_ligamagic_unique_data_carta_edicao_tipo";

-- 2. Tentar remover outros constraints antigos comuns
ALTER TABLE his_precos_ligamagic DROP CONSTRAINT IF EXISTS his_precos_ligamagic_data_carta_edicao_tipo_carta_key;
ALTER TABLE his_precos_ligamagic DROP CONSTRAINT IF EXISTS "his_precos_ligamagic_pkey"; -- CUIDADO: Rodar apenas se não for a PK real (geralmente a PK é 'id')
ALTER TABLE his_precos_ligamagic DROP CONSTRAINT IF EXISTS his_precos_ligamagic_unique_full;

-- 3. Criar o NOVO constraint definitivo que aceita todas as variações
-- Este constraint agora permite que a mesma carta tenha vários registros
-- no MESMO dia, DESDE QUE o Idioma, Qualidade ou TCG sejam diferentes.
ALTER TABLE his_precos_ligamagic 
ADD CONSTRAINT his_precos_ligamagic_unique_complete 
UNIQUE (data, carta, edicao, tipo_carta, qualidade, idioma, tcg);

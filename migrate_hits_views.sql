-- ============================================================
-- Migração: Adicionar visualizacoes em lista_cartas_dia
-- Execute no Supabase: Dashboard → SQL Editor → New query
-- ============================================================

ALTER TABLE lista_cartas_dia 
ADD COLUMN IF NOT EXISTS visualizacoes INTEGER DEFAULT 0;

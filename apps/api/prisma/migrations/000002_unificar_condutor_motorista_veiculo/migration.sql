-- Migration: Unificar Condutor+Motorista e Veiculo+VeiculoEntrega

-- 1. Drop old FKs before altering tables
ALTER TABLE "entregas" DROP CONSTRAINT IF EXISTS "entregas_motoristaId_fkey";
ALTER TABLE "entregas" DROP CONSTRAINT IF EXISTS "entregas_veiculoId_fkey";

-- 2. Create TipoCondutor enum
CREATE TYPE "TipoCondutor" AS ENUM ('PROPRIO', 'PJ');

-- 3. Add new columns to condutores
ALTER TABLE "condutores" ADD COLUMN "tipoCondutor" "TipoCondutor" NOT NULL DEFAULT 'PROPRIO';
ALTER TABLE "condutores" ADD COLUMN "observacoes" TEXT;

-- 4. Add new columns to veiculos
ALTER TABLE "veiculos" ADD COLUMN "tipoVeiculo" "TipoVeiculo" NOT NULL DEFAULT 'CARRO';
ALTER TABLE "veiculos" ADD COLUMN "capacidadeKg" DOUBLE PRECISION;
ALTER TABLE "veiculos" ADD COLUMN "observacoes" TEXT;

-- 5. Migrate data from motoristas to condutores
INSERT INTO "condutores" ("_id", "empresaId", "cpf", "nome", "cnh", "cnhCategoria", "telefone", "email", "ativo", "observacoes", "tipoCondutor", "dataCriacao", "dataAtualizacao")
SELECT
  gen_random_uuid()::TEXT,
  m."empresaId",
  COALESCE(m."cpf", 'SEM_CPF_' || m."_id"),
  m."nome",
  m."cnh",
  m."cnhCategoria",
  m."telefone",
  m."email",
  m."ativo",
  m."observacoes",
  m."tipo"::TEXT::"TipoCondutor",
  m."dataCriacao",
  m."dataAtualizacao"
FROM "motoristas" m
LEFT JOIN "condutores" c ON c."empresaId" = m."empresaId" AND c."cpf" = COALESCE(m."cpf", '')
WHERE c."_id" IS NULL;

-- 6. Migrate data from veiculos_entrega to veiculos
INSERT INTO "veiculos" ("_id", "empresaId", "placa", "renavam", "rntrc", "tipoPropriedade", "tara", "capacidade", "tipoCarroceria", "marca", "modelo", "anoFabricacao", "cor", "tipoVeiculo", "capacidadeKg", "observacoes", "ativo", "dataCriacao", "dataAtualizacao")
SELECT
  gen_random_uuid()::TEXT,
  ve."empresaId",
  ve."placa",
  '',
  '',
  '1',
  0,
  0,
  '',
  ve."marca",
  ve."modelo",
  ve."ano",
  ve."cor",
  ve."tipo",
  ve."capacidadeKg",
  ve."observacoes",
  ve."ativo",
  ve."dataCriacao",
  ve."dataAtualizacao"
FROM "veiculos_entrega" ve
LEFT JOIN "veiculos" v ON v."empresaId" = ve."empresaId" AND v."placa" = ve."placa"
WHERE v."_id" IS NULL;

-- Update existing veiculos with veiculos_entrega data where placa matches
UPDATE "veiculos" v
SET
  "tipoVeiculo" = ve."tipo",
  "capacidadeKg" = COALESCE(ve."capacidadeKg", v."capacidadeKg"),
  "observacoes" = COALESCE(ve."observacoes", v."observacoes")
FROM "veiculos_entrega" ve
WHERE v."empresaId" = ve."empresaId" AND v."placa" = ve."placa";

-- 7. Update entregas to reference condutores instead of motoristas
ALTER TABLE "entregas" ADD COLUMN "condutorId" TEXT;

-- Map motoristaId to condutorId
UPDATE "entregas" e
SET "condutorId" = c."_id"
FROM "motoristas" m
JOIN "condutores" c ON c."empresaId" = m."empresaId" AND c."cpf" = COALESCE(m."cpf", '')
WHERE e."motoristaId" = m."_id";

-- For remaining unmapped entregas, try a fallback
UPDATE "entregas" e
SET "condutorId" = (
  SELECT c2."_id" FROM "condutores" c2
  WHERE c2."empresaId" = (SELECT m2."empresaId" FROM "motoristas" m2 WHERE m2."_id" = e."motoristaId")
  ORDER BY c2."dataCriacao" ASC
  LIMIT 1
)
WHERE e."motoristaId" IS NOT NULL AND e."condutorId" IS NULL;

-- Drop old motoristaId column
ALTER TABLE "entregas" DROP COLUMN "motoristaId";

-- 8. Add new FKs
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_condutorId_fkey" FOREIGN KEY ("condutorId") REFERENCES "condutores"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "veiculos"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 9. Drop old tables and enums
DROP TABLE "veiculos_entrega";
DROP TABLE "motoristas";
DROP TYPE "TipoMotorista";

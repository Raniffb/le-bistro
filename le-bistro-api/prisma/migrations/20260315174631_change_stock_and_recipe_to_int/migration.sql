/*
  Warnings:

  - You are about to alter the column `quantityRequired` on the `recipes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `quantityAvailable` on the `stock` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."recipes" ALTER COLUMN "quantityRequired" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."stock" ALTER COLUMN "quantityAvailable" SET DATA TYPE INTEGER;

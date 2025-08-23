-- AlterTable
ALTER TABLE "public"."property_configurations" ADD COLUMN     "rehab_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rehab_rent_increase_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."rehab_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category" TEXT NOT NULL,
    "cost" DECIMAL(12,2) NOT NULL,
    "property_configuration_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rehab_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rehab_items_property_configuration_id_idx" ON "public"."rehab_items"("property_configuration_id");

-- AddForeignKey
ALTER TABLE "public"."rehab_items" ADD CONSTRAINT "rehab_items_property_configuration_id_fkey" FOREIGN KEY ("property_configuration_id") REFERENCES "public"."property_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "address" TEXT NOT NULL,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "square_feet" DECIMAL(10,2),
    "image_url" TEXT,
    "owner_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."property_configurations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "property_price" DECIMAL(12,2) NOT NULL,
    "property_address" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "down_payment" DECIMAL(12,2) NOT NULL,
    "interest_rate" DECIMAL(5,3) NOT NULL,
    "loan_term_years" INTEGER NOT NULL,
    "annual_operating_costs" DECIMAL(12,2) NOT NULL,
    "vacancy_rate" DECIMAL(5,2) NOT NULL,
    "property_taxes" DECIMAL(12,2) NOT NULL,
    "insurance" DECIMAL(12,2) NOT NULL,
    "property_management" DECIMAL(12,2) NOT NULL,
    "maintenance" DECIMAL(12,2) NOT NULL,
    "utilities" DECIMAL(12,2) NOT NULL,
    "other_expenses" DECIMAL(12,2) NOT NULL,
    "annual_appreciation" DECIMAL(5,2) NOT NULL,
    "annual_rent_increase" DECIMAL(5,2) NOT NULL,
    "projection_years" INTEGER NOT NULL,

    CONSTRAINT "property_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."units" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "monthly_rent" DECIMAL(10,2) NOT NULL,
    "property_configuration_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "properties_owner_id_idx" ON "public"."properties"("owner_id");

-- CreateIndex
CREATE INDEX "properties_price_idx" ON "public"."properties"("price");

-- CreateIndex
CREATE INDEX "properties_created_at_idx" ON "public"."properties"("created_at");

-- CreateIndex
CREATE INDEX "property_configurations_user_id_idx" ON "public"."property_configurations"("user_id");

-- CreateIndex
CREATE INDEX "property_configurations_created_at_idx" ON "public"."property_configurations"("created_at");

-- CreateIndex
CREATE INDEX "units_property_configuration_id_idx" ON "public"."units"("property_configuration_id");

-- AddForeignKey
ALTER TABLE "public"."properties" ADD CONSTRAINT "properties_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property_configurations" ADD CONSTRAINT "property_configurations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."units" ADD CONSTRAINT "units_property_configuration_id_fkey" FOREIGN KEY ("property_configuration_id") REFERENCES "public"."property_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

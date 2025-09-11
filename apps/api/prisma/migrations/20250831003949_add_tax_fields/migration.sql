-- AlterTable
ALTER TABLE "public"."property_configurations" ADD COLUMN     "advertising_costs" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "depreciable_basis" DECIMAL(12,2),
ADD COLUMN     "down_payment_source" TEXT,
ADD COLUMN     "has_seller_financing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "home_office_expenses" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "is_historic_property" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_opportunity_zone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "land_value" DECIMAL(12,2),
ADD COLUMN     "placed_in_service_date" DATE,
ADD COLUMN     "prior_depreciation" DECIMAL(12,2),
ADD COLUMN     "professional_fees" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "qualifies_for_energy_credits" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "travel_expenses" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "annual_gross_income" DECIMAL(12,2),
ADD COLUMN     "existing_itemized_deductions" DECIMAL(12,2),
ADD COLUMN     "filing_status" TEXT,
ADD COLUMN     "intends_1031_exchange" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_real_estate_professional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "marginal_tax_bracket" DECIMAL(5,2),
ADD COLUMN     "other_passive_income" DECIMAL(12,2),
ADD COLUMN     "planned_hold_period" INTEGER,
ADD COLUMN     "state_of_residence" TEXT,
ADD COLUMN     "state_tax_rate" DECIMAL(5,2),
ADD COLUMN     "tax_profile_updated_at" TIMESTAMPTZ(6),
ADD COLUMN     "use_standard_deduction" BOOLEAN NOT NULL DEFAULT true;

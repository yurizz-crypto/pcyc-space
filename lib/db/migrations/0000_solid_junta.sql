CREATE TYPE "public"."user_designation" AS ENUM('BROTHER', 'SISTER', 'FRIEND');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('MEMBER', 'ADMIN', 'SUPERADMIN');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('CONFIRMED', 'PENDING_PAYMENT', 'VERIFICATION_QUEUED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('PENDING_PAYMENT', 'VERIFICATION_QUEUED', 'PAID', 'PREPARING', 'SHIPPED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('GCASH', 'PALAWAN_PAY', 'BANK_TRANSFER', 'MAYA', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."payment_verification_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text,
	"last_name" text NOT NULL,
	"designation" "user_designation" DEFAULT 'FRIEND' NOT NULL,
	"baptism_date" date,
	"ecclesia" text,
	"phone_number" text,
	"avatar_url" text,
	"role" "user_role" DEFAULT 'MEMBER' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'CONFIRMED' NOT NULL,
	"payment_option" text DEFAULT 'VENUE_DESK' NOT NULL,
	"payment_status" text DEFAULT 'UNPAID' NOT NULL,
	"reference_number" text,
	"receipt_image_url" text,
	"amount_paid" numeric(10, 2),
	"special_requirements" text,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"theme" text,
	"banner_url" text,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"location" text NOT NULL,
	"registration_fee" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"status" "event_status" DEFAULT 'UPCOMING' NOT NULL,
	"max_attendees" integer,
	"registration_deadline" timestamp with time zone,
	"created_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"category" text DEFAULT 'Apparel' NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"image_urls" text[] DEFAULT '{}' NOT NULL,
	"available_sizes" text[] DEFAULT '{"XS","S","M","L","XL","2XL"}',
	"is_available" boolean DEFAULT true NOT NULL,
	"is_preorder" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"selected_size" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"order_number" text NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" "order_status" DEFAULT 'PENDING_PAYMENT' NOT NULL,
	"shipping_info" jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "payment_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"receipt_image_url" text NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"reference_number" text,
	"amount_paid" numeric(10, 2),
	"verification_status" "payment_verification_status" DEFAULT 'PENDING' NOT NULL,
	"verification_notes" text,
	"verified_by_id" uuid,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_receipts_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "ecclesias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"region" text NOT NULL,
	"city" text NOT NULL,
	"address" text NOT NULL,
	"contact_person" text,
	"meeting_schedule" text NOT NULL,
	"is_displayed" boolean DEFAULT true NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_id_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_receipts" ADD CONSTRAINT "payment_receipts_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_receipts" ADD CONSTRAINT "payment_receipts_verified_by_id_profiles_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_profiles_role" ON "profiles" USING btree ("role");--> statement-breakpoint
CREATE INDEX "idx_profiles_ecclesia" ON "profiles" USING btree ("ecclesia");--> statement-breakpoint
CREATE INDEX "idx_profiles_email" ON "profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_profiles_designation" ON "profiles" USING btree ("designation");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_event_registrations_event_user" ON "event_registrations" USING btree ("event_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_event_registrations_user_id" ON "event_registrations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_event_registrations_event_id" ON "event_registrations" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_event_registrations_payment_status" ON "event_registrations" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "idx_events_public_status" ON "events" USING btree ("is_published","status");--> statement-breakpoint
CREATE INDEX "idx_events_start_date" ON "events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "idx_events_created_at" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_products_availability" ON "products" USING btree ("is_available","is_preorder");--> statement-breakpoint
CREATE INDEX "idx_products_category" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_products_created_at" ON "products" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_order_items_order_id" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_order_items_product_id" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_orders_user_id" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_orders_created_at" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_payment_receipts_order_id" ON "payment_receipts" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_payment_receipts_status" ON "payment_receipts" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "idx_ecclesias_display_region" ON "ecclesias" USING btree ("is_displayed","region");--> statement-breakpoint
CREATE INDEX "idx_ecclesias_order_index" ON "ecclesias" USING btree ("order_index");
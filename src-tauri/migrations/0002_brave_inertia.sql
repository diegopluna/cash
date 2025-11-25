PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text,
	`name` text NOT NULL,
	`type` text DEFAULT 'checking' NOT NULL,
	`currency_code` text DEFAULT 'BRL' NOT NULL,
	`bank_code` text,
	`branch_number` text,
	`account_number` text,
	`account_digit` text,
	`card_last_4` text,
	`card_closing_day` integer,
	`card_due_day` integer,
	`credit_limit_cents` integer,
	`initial_balance_cents` integer DEFAULT 0 NOT NULL,
	`current_balance_cents` integer DEFAULT 0 NOT NULL,
	`include_in_net_worth` integer DEFAULT true NOT NULL,
	`include_in_cash_flow` integer DEFAULT true NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`closed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "institution_id", "name", "type", "currency_code", "bank_code", "branch_number", "account_number", "account_digit", "card_last_4", "card_closing_day", "card_due_day", "credit_limit_cents", "initial_balance_cents", "current_balance_cents", "include_in_net_worth", "include_in_cash_flow", "is_archived", "closed_at", "created_at", "updated_at") SELECT "id", "institution_id", "name", "type", "currency_code", "bank_code", "branch_number", "account_number", "account_digit", "card_last_4", "card_closing_day", "card_due_day", "credit_limit_cents", "initial_balance_cents", "current_balance_cents", "include_in_net_worth", "include_in_cash_flow", "is_archived", "closed_at", "created_at", "updated_at" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `accounts_institution_id_idx` ON `accounts` (`institution_id`);--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'expense' NOT NULL,
	`parent_id` text,
	`icon` text,
	`color` text,
	`is_system` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "type", "parent_id", "icon", "color", "is_system", "created_at", "updated_at") SELECT "id", "name", "type", "parent_id", "icon", "color", "is_system", "created_at", "updated_at" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_idx` ON `categories` (`name`,`type`);--> statement-breakpoint
CREATE TABLE `__new_institutions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'bank' NOT NULL,
	`slug` text,
	`country` text DEFAULT 'BR' NOT NULL,
	`isbp` text,
	`cnpj` text,
	`website_url` text,
	`logo_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_institutions`("id", "name", "type", "slug", "country", "isbp", "cnpj", "website_url", "logo_url", "created_at", "updated_at") SELECT "id", "name", "type", "slug", "country", "isbp", "cnpj", "website_url", "logo_url", "created_at", "updated_at" FROM `institutions`;--> statement-breakpoint
DROP TABLE `institutions`;--> statement-breakpoint
ALTER TABLE `__new_institutions` RENAME TO `institutions`;--> statement-breakpoint
CREATE UNIQUE INDEX `institutions_slug_idx` ON `institutions` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `institutions_isbp_idx` ON `institutions` (`isbp`);--> statement-breakpoint
CREATE TABLE `__new_recurrence_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`frequency` text DEFAULT 'monthly' NOT NULL,
	`interval` integer DEFAULT 1 NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`next_run_at` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_recurrence_rules`("id", "frequency", "interval", "start_date", "end_date", "next_run_at", "is_active", "description", "created_at", "updated_at") SELECT "id", "frequency", "interval", "start_date", "end_date", "next_run_at", "is_active", "description", "created_at", "updated_at" FROM `recurrence_rules`;--> statement-breakpoint
DROP TABLE `recurrence_rules`;--> statement-breakpoint
ALTER TABLE `__new_recurrence_rules` RENAME TO `recurrence_rules`;--> statement-breakpoint
CREATE INDEX `recurrence_rules_next_run_at_idx` ON `recurrence_rules` (`next_run_at`);--> statement-breakpoint
CREATE TABLE `__new_app_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`currency_code` text DEFAULT 'BRL' NOT NULL,
	`locale` text DEFAULT 'pt-BR' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_app_settings`("id", "currency_code", "locale", "created_at", "updated_at") SELECT "id", "currency_code", "locale", "created_at", "updated_at" FROM `app_settings`;--> statement-breakpoint
DROP TABLE `app_settings`;--> statement-breakpoint
ALTER TABLE `__new_app_settings` RENAME TO `app_settings`;--> statement-breakpoint
CREATE TABLE `__new_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tags`("id", "name", "color", "created_at") SELECT "id", "name", "color", "created_at" FROM `tags`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
ALTER TABLE `__new_tags` RENAME TO `tags`;--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_idx` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `__new_transaction_splits` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`category_id` text,
	`amount_cents` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_transaction_splits`("id", "transaction_id", "category_id", "amount_cents", "notes") SELECT "id", "transaction_id", "category_id", "amount_cents", "notes" FROM `transaction_splits`;--> statement-breakpoint
DROP TABLE `transaction_splits`;--> statement-breakpoint
ALTER TABLE `__new_transaction_splits` RENAME TO `transaction_splits`;--> statement-breakpoint
CREATE INDEX `transaction_splits_tx_idx` ON `transaction_splits` (`transaction_id`);--> statement-breakpoint
CREATE TABLE `__new_transaction_tags` (
	`transaction_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`transaction_id`, `tag_id`),
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_transaction_tags`("transaction_id", "tag_id") SELECT "transaction_id", "tag_id" FROM `transaction_tags`;--> statement-breakpoint
DROP TABLE `transaction_tags`;--> statement-breakpoint
ALTER TABLE `__new_transaction_tags` RENAME TO `transaction_tags`;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'cleared' NOT NULL,
	`amount_cents` integer NOT NULL,
	`currency_code` text DEFAULT 'BRL' NOT NULL,
	`description` text NOT NULL,
	`original_description` text,
	`date` integer NOT NULL,
	`posted_at` integer,
	`category_id` text,
	`payment_method` text DEFAULT 'other' NOT NULL,
	`transfer_group_id` text,
	`installment_number` integer,
	`installment_count` integer,
	`external_id` text,
	`notes` text,
	`is_recurring_instance` integer DEFAULT false NOT NULL,
	`recurrence_rule_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`recurrence_rule_id`) REFERENCES `recurrence_rules`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "account_id", "type", "status", "amount_cents", "currency_code", "description", "original_description", "date", "posted_at", "category_id", "payment_method", "transfer_group_id", "installment_number", "installment_count", "external_id", "notes", "is_recurring_instance", "recurrence_rule_id", "created_at", "updated_at") SELECT "id", "account_id", "type", "status", "amount_cents", "currency_code", "description", "original_description", "date", "posted_at", "category_id", "payment_method", "transfer_group_id", "installment_number", "installment_count", "external_id", "notes", "is_recurring_instance", "recurrence_rule_id", "created_at", "updated_at" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
CREATE INDEX `transactions_account_idx` ON `transactions` (`account_id`);--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);--> statement-breakpoint
CREATE INDEX `transactions_transfer_group_idx` ON `transactions` (`transfer_group_id`);--> statement-breakpoint
CREATE INDEX `transactions_external_idx` ON `transactions` (`external_id`);
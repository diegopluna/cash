CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`institution_id` integer,
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
CREATE INDEX `accounts_institution_id_idx` ON `accounts` (`institution_id`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'expense' NOT NULL,
	`parent_id` integer,
	`icon` text,
	`color` text,
	`is_system` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_idx` ON `categories` (`name`,`type`);--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
CREATE UNIQUE INDEX `institutions_slug_idx` ON `institutions` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `institutions_isbp_idx` ON `institutions` (`isbp`);--> statement-breakpoint
CREATE TABLE `recurrence_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
CREATE INDEX `recurrence_rules_next_run_at_idx` ON `recurrence_rules` (`next_run_at`);--> statement-breakpoint
CREATE TABLE `app_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`currency_code` text DEFAULT 'BRL' NOT NULL,
	`locale` text DEFAULT 'pt-BR' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_idx` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `transaction_splits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transaction_id` integer NOT NULL,
	`category_id` integer,
	`amount_cents` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `transaction_splits_tx_idx` ON `transaction_splits` (`transaction_id`);--> statement-breakpoint
CREATE TABLE `transaction_tags` (
	`transaction_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`transaction_id`, `tag_id`),
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'cleared' NOT NULL,
	`amount_cents` integer NOT NULL,
	`currency_code` text DEFAULT 'BRL' NOT NULL,
	`description` text NOT NULL,
	`original_description` text,
	`date` integer NOT NULL,
	`posted_at` integer,
	`category_id` integer,
	`payment_method` text DEFAULT 'other' NOT NULL,
	`transfer_group_id` text,
	`installment_number` integer,
	`installment_count` integer,
	`external_id` text,
	`notes` text,
	`is_recurring_instance` integer DEFAULT false NOT NULL,
	`recurrence_rule_id` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`recurrence_rule_id`) REFERENCES `recurrence_rules`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `transactions_account_idx` ON `transactions` (`account_id`);--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);--> statement-breakpoint
CREATE INDEX `transactions_transfer_group_idx` ON `transactions` (`transfer_group_id`);--> statement-breakpoint
CREATE INDEX `transactions_external_idx` ON `transactions` (`external_id`);--> statement-breakpoint
DROP TABLE `test`;
include ./node_modules/@vellone/techsak/Makefile

.PHONY: app
app: ## Start app in dev mode
	@npm run dev

.PHONY: build
build: ## Build app
	@npm run build


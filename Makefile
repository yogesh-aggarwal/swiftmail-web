RUNNER := bun
PRODUCTION_BRANCH := production

install:
	clear
	@$(RUNNER) install

start:
	clear
	@$(RUNNER) run start

dev:
	clear
	@$(RUNNER) run dev

test:
	clear
	@$(RUNNER) run test

build:
	clear
	rm -rf dist
	@$(RUNNER) run build

lint:
	clear
	@$(RUNNER) lint

pretty:
	clear
	@$(RUNNER) run pretty

setup_env:
	clear
	@echo "HELLO"

deploy:
	@git push origin main
	@git update-ref -d refs/heads/$(PRODUCTION_BRANCH)
	@git checkout -b $(PRODUCTION_BRANCH)
	@git push origin $(PRODUCTION_BRANCH) -f
	@git checkout main

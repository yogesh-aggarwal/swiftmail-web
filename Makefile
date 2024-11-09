RUNNER=bun

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

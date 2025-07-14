#########################################################
# Makefile for Simpylitix: Backend & Frontend Automation #
#########################################################

# Install backend dependencies
install-backend:
	cd Backend && npm install

# Install frontend dependencies
install-frontend:
	cd Frontend && npm install

# Install all dependencies (backend & frontend)
install-all:
	$(MAKE) install-backend && $(MAKE) install-frontend

# Start backend server (development mode)
start-backend:
	cd Backend && npm run dev

# Start frontend dev server
start-frontend:
	cd Frontend && npm run dev

# Start both backend and frontend in separate terminals (instructions)
start-all:
	@echo "Please run 'make start-backend' and 'make start-frontend' in separate terminals."

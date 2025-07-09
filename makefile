install-backend:
	cd Backend && npm install

install-frontend:
	cd Frontend && npm install

install-all:
	$(MAKE) install-backend && $(MAKE) install-frontend
	
start-backend:
	cd Backend && npm run dev

start-frontend:
	cd Frontend && npm run dev

start-all:
	$(MAKE) start-backend & $(MAKE) start-frontend

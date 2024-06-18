# Запуск приложение в фон
start:
	docker compose up -d

# Запуск приложение и node приложение останется активным процессов в консоли
start_live:
	docker compose up

# Выключение приложения
down:
	docker compose down

# Пересобрать node контейнер (когда надо обновить зависимости проекта и прочее)
app_build:
	docker compose build
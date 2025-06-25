## 🚀 Getting Started (Laravel Project Setup)

after crawled into project root directory, run the following command:

```bash
composer install
```

then run the following command:

```bash
cp .env.example .env
```

then run the following command:

```bash
php artisan key:generate
```

## for database start

```bash
./vendor/bin/sail up -d
```

## for database migrate

```bash
./vendor/bin/sail artisan migrate
```

## for docker stop

```bash
./vendor/bin/sail down
```

## for database seed

```bash
./vendor/bin/sail artisan db:seed
```

then run the following command:

```bash
npm install && npm run dev
```

then open your browser and navigate to http://localhost
phpmyadmin at http://localhost:8081

## bicicuenca\_scrapper

Node script to scrape data from [`bicicuenca.com`](https://www.bicicuenca.com/mapaestacao.aspx)

## How to use

Create .env file with Postgres/PostGis database connection settings

SCRAPER\_DATABASE\_DB=bicicuenca  
SCRAPER\_DATABASE\_USER=postgres  
SCRAPER\_DATABASE\_PASSWORD=password  
SCRAPER\_DATABASE\_HOST=localhost  
SCRAPER\_DATABASE\_PORT=5432

```plaintext
npm install

npm run start
```

## Using Docker

1.  [Install Docker](https://docs.docker.com/get-docker/) on your machine.
2.  Build your container: `docker build -t bicicuenca-scraper .`.
3.  Run your container: `docker run -p 3000:3000 bicicuenca-scraper`.

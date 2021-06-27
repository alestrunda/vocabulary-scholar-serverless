# Vocabulary Scholar Serverless

Serverless back-end for *Vocabulary Scholar* project.

## Set-up

Set up env variables into `.env` file based on `env.sample`.

You will need:

- `S3_URL` contains files for *Vocabulary Scholar* lists and dictionaries
- `API_DICTIONARY` credentials for *oxforddictionaries API*
- `API_TRANSLATION` credentials for *microsofttranslator API*
- `DB_URI` contains vocabulary entries for Vocabular Scholar

To allow CORS for your origin, edit the corresponding header in `objects/response.js`.

## Run & deploy

Use [serverless cli](https://github.com/serverless/serverless).

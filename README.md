# ddp-starter

- Pull and clone the repo
- cd into the web-app frontend and run `npm install` to install react app dependencies. `npm run start` in the directory will start the react server
- cd into the django backend. Install a virtual env using `python3 -m venv <name_of_venv>`. Activate the env by using `source venv/bin/activate`. Copy the example environment file: `cp .env.example .env` and update the required variables (e.g., `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, and optionally `PORT` for the server). Setup django dependencies in this fresh virtual environment using `pip3 install -r requirements.txt`
- `python3 manage.py runserver` will boot up the django server (default port 8000 or the `PORT` defined in `.env`).
- `python3 manage.py migrate` will run all the required migrations
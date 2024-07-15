FROM node:20.10.0

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN apt update && \
    apt install -y python3 python3-pip python3-venv

RUN python3 -m venv .venv && \
    . .venv/bin/activate && \
    pip install matplotlib numpy scipy pandas plotly

EXPOSE 8000

CMD ["sh", "-c", ". .venv/bin/activate && node app.js"]

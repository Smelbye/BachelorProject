FROM trufflesuite/ganache-cli

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 7545

CMD ["ganache-cli", "-h", "0.0.0.0", "-p", "7545", "-m", "YOUR_MNEMONIC_PHRASE_FROM_GANACHE"]

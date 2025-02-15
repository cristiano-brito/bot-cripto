# Usando a imagem oficial do Node.js
FROM node:20

# Definindo o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiando o arquivo package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalando as dependências
RUN npm install

# Copiando todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Instalando o pacote dotenv para ler variáveis de ambiente do arquivo .env
RUN npm install dotenv

# Configurando a variável de ambiente para o ambiente de produção
ENV NODE_ENV=producao

# Comando para iniciar a aplicação
CMD ["node", "index.js"]

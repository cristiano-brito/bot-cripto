# Bot de Negociação para Binance 

Este projeto é um bot de negociação automatizado que utiliza a API do Binance para comprar e vender BTCUSDT com base no Indicador de Força Relativa (RSI). O bot verifica periodicamente o valor do RSI e toma decisões de negociação automaticamente.

### Descrição das Pastas e Arquivos

- **/config**: Pasta que contém arquivos de configuração.
  - `config.js`: Define as URLs da API com base no ambiente (teste ou produção).
  - `constants.js`: Armazena as constantes usadas no projeto (símbolos, períodos, quantidades, etc).

- **/services**: Pasta que contém os serviços principais do projeto.
  - `api.js`: Tem a função de centralizar e organizar as chamadas HTTP que o aplicativo faz para a API do Binance.
  - `rsiCalculator.js`: Funções para calcular o valor do RSI com base nos preços de fechamento.
  - `tradingOperations.js`: Define as operações de negociação, incluindo a criação de novas ordens.

- **/node_modules**: Pasta que contém as dependências do Node.js instaladas.

- **.env**: Arquivo que contém variáveis de ambiente, como chaves de API.

- **index.js**: Script principal do projeto que integra todas as partes e executa o bot de negociação.

- **package.json**: Arquivo que descreve o projeto, suas dependências e scripts.

## Pré-requisitos

Certifique-se de ter o Node.js instalado em sua máquina. Além disso, você precisará das chaves de API do Binance Testnet.
[Binance Testnet](https://testnet.binance.vision/)

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/cristiano-brito/bot-cripto.git
   cd bot-cripto


FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir --upgrade pip
RUN pip3 install --no-cache-dir openai-whisper

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "start"]

# Utilisez une image de Node.js en tant que base
FROM node:latest

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port sur lequel votre application fonctionne
EXPOSE 3000

# Commande pour démarrer votre application
CMD ["npm", "start"]

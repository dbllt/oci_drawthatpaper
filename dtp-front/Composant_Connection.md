# Composant Connection

Envoyer des messages et les recevoir grace à une socket 'https://www.npmjs.com/package/vue-socket.io-extended'

## Utilisation d'un bus pour les evnts

Le bus est dans `@/main.js`, il y a aussi une variable glocbale qui contiant le nom de evnts utilisables

Envoyer un message :

```javascript
bus.$emit(this.$network.SendMsg, message);
```

Ajouter un comportement lors de la reception d'un message :

```javascript
bus.$on(this.$network.ReceiveMsg, (msg) => {
	// faire qqchose avec msg
});
```


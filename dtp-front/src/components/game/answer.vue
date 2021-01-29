<template lang="html">

	<section class="answerSec">
		<p v-if="firstAnswer">
			<b class="answer-good" v-if="valid">Vous avez trouvé le mot ! Le mot était {{word}}</b>
			<b class="answer-bad" v-if="!valid">Mauvaise Réponse !</b>
		</p>
		Réponse : 
		<input class="input-ans" v-model="answer" v-on:keyup.enter="checkAnswer" :disabled="!gameStarted">
		<button type="button" v-on:click="checkAnswer">OK</button>
		
		<ul id="attemptsList" class="attempts-list">
			<li v-for="item in attempts.slice().reverse()" v-bind:key="item" class="attempts-list-item">
				{{ item }}
			</li>
		</ul>
	</section>

</template>

<script>

export default{
	name: "Answer",
	data :function(){
		return {
			word:"test",
			answer:"",
			attempts:[],
			valid:false,
			firstAnswer:false,
			gameStarted:true
		};
	},

	mounted() {
		this.$connection.$on(this.$network_events.ReceiveGoodAnswer, (msg) => {
				console.log("rcv", msg);
				alert("mot trouvé");
			});
	},
	methods:{
		checkAnswer: function(){
			if(this.answer !== ""){
				this.firstAnswer = true;
				if(this.word == this.answer){
					//alert("Correct!");
					this.valid=true;
					this.gameStarted=false;
					this.$connection.$emit(this.$network_actions.SendGoodAnswer, this.word);
				} else {
					//alert("PaS cOrReCt");
					this.attempts.push(this.answer);
					this.answer = "";
				}
			}
		}
	}
	
}
</script>

<style scoped lang="scss">	
	.input-ans{
		height:5px;
		margin-top:10px;
		margin-bottom:10px;
	}

	.attempts-list {
		overflow: auto;
		height: 200px;
		border: 2px solid #dce4ec;
		border-radius: 5px;
		list-style-type: none;
		background-color:white;
	}

	.attempts-list-item {
		
	}

	.answer-bad {
		color:red;
	}
	.answer-good {
		color:green;
	}
</style>
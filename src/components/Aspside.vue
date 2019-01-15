<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <!--
    <button @click.prevent="fetchLeague">Get teams</button>
    <button @click="fetch2">test2</button> -->
    <button class="btn btn-outline-success" @click="fetchLeague2">Get FPL data</button>
    <button class="btn btn-outline-success" @click="playerDatabase">PlayerDB</button>
    <button class="btn btn-outline-success" @click="teamCaptains">Captains</button>
    <div v-if="teams.length">
      <table class="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
          </tr>
        </thead>

        <tbody v-for="team in teams" v-bind:key="team.rank">
          <tr>
            <td>{{team.rank}}</td>
            <td>{{team.entry_name}}</td>
            <td>{{team.total}}</td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      title: 'Aspside FPL',
      teamdata: [],
      teams: [],
      details: [],
      playersDb: [],
    }
  },
  methods: {
  //   fetchLeague(){
  //     let users;
  //     let url = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/leagues-classic-standings/116190'
  //     let request = new XMLHttpRequest();
  //     // let users = '';
  //     request.open('GET', url, true);
  //     // request.setRequestHeader("Access-Control-Allow-Origin", "*");
  //     request.onload = function () {
  //     // Convert JSON data to an object
  //     users = JSON.parse(this.response);
  //     this.teams = users;
  //     // this.teams.push(users.standings.results);
  //     // console.log(this.response);
  //   }
  //   request.send();
  // },
  fetchLeague2() {
    let url = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/leagues-classic-standings/116190'
     fetch(url)
        .then(response => response.json())
        .then (jsonResponse => {
          this.teamdata = jsonResponse;
          console.log('Fetch done!')
          this.teams = this.teamdata.standings.results
          this.teamDetails();
        })
  },
  teamDetails() {
      for (let team of this.teams) {
        let teamData = {
          id: team.rank,
          teamId: team.entry,
          name: team.entry_name,
          captain: '',
        }
        this.details.push(teamData)
    }
  },
  //https://fantasy.premierleague.com/drf/bootstrap-static
  playerDatabase(){
    let url = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/bootstrap-static'
     fetch(url)
        .then(response => response.json())
        .then (jsonResponse => {
          this.playersDb = jsonResponse.elements;
          console.log('Players done!');
          console.log(this.playersDb[0].first_name);
        })
  },
  teamCaptains(){
    
  },
    // fetch2(){
    //   let createCORSRequest = function (method, url) {
    //   let xhr = new XMLHttpRequest();
    //     xhr.open(method, url, true);
    //     // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    //     return xhr;
    // };
    //
    // let xhr = createCORSRequest('GET', 'https://crossorigin.me/https://fantasy.premierleague.com/drf/leagues-classic-standings/116190');
    //
    // xhr.onload = function () {
    //   console.log(JSON.parse(this.responseText));
    // };
    //
    // // xhr.onerror = function () {};
    // },
    // fetch3(){
    //   let url = 'https://crossorigin.me/https://fantasy.premierleague.com/drf/leagues-classic-standings/116190'
    //   fetch(url, {
    //     method: 'GET'
    //     })
    //     .then(response => response.json())
    //     .then (jsonResponse => {
    //       this.teams = jsonResponse;
    //       console.log(this.teams);
    //       console.log(jsonResponse);
    //     })
    //
    // },
    // fetch4(){
    //   let url = 'https://crossorigin.me/https://fantasy.premierleague.com/drf/leagues-classic-standings/116190'
    //   fetch(url)
    //     .then(response => response.json())
    //     .then (jsonResponse => {
    //       this.teams = jsonResponse;
    //       console.log(jsonResponse);
    //     })
    //
    // },
  },
}


// let request = new XMLHttpRequest();
//     request.open('GET', 'users.json', true);
//       request.onload = function () {
//       // Convert JSON data to an object
//       let users = JSON.parse(this.response);
//       let output = '';
//       for (var i = 0; i < users.length; i++) {
//         output += '<li>' + users[i].name + ' is ' + users[i].age + ' years old.'; '</li>'
//       }
//       document.getElementById('users').innerHTML = output;
//     }
//     request.send();
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

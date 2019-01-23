<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <button class="btn btn-outline-success" @click="fetchAspside">Get FPL data</button>
    <button class="btn btn-outline-success" @click="fetchPlayerDb">Get Player DB</button>
    <button class="btn btn-outline-success" @click="fetchCaptains">Get Captains</button>
    <button class="btn btn-outline-success" @click="completeDetails">Complete details</button>
    <button class="btn btn-outline-success" @click="captainNames">Display Captains</button>
    <div v-if="teamWithCaptainIds.length">
      <table class="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <!-- <th>Team ID</th> -->
            <th>Points</th>
            <th>Captain</th>
            <th>Vice Captain</th>
          </tr>
        </thead>

        <tbody v-for="team in teamWithCaptainIds" v-bind:key="team.rank">
          <tr>
            <td>{{team.rank}}</td>
            <td>{{team.entry_name}}</td>
            <!-- <td>{{team.entry}}</td> -->
            <td>{{team.total}}</td>
            <td>{{team.captain_name}}</td>
            <td>{{team.viceCaptain_name}}</td>
          </tr>
        </tbody>

      </table>
    </div>
    <!-- <div v-if="loading">
      {{ loading }}
    </div> -->
  </div>
</template>

<script>

export default {
  data() {
    return {
      title: 'Aspside FPL',
      teams: [],
      details: [],
      playersDb: [],
      loading: '',
      captainsArray:[],
      capDbTemp: '',
      teamWithCaptainIds:[]
    }
  },
  created() {
    // this.fetchAspside();
    // this.fetchPlayerDb();
    console.log('created!');
  },
  mounted() {
    // this.fetchCaptains();
    console.log('mounted!');
  },
  methods: {
  kbk() {

  },
  fetchAspside() {
    // LeagueID: 116190
    // this.loading = 'loading...'
    let url = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/leagues-classic-standings/116190'
     fetch(url)
        .then(response => response.json())
        .then (jsonResponse => {
          // this.teamData = jsonResponse;
          this.teams = jsonResponse.standings.results;
          console.log('League info done!');
        })
        // this.loading = '';
  },
  // https://fantasy.premierleague.com/drf/bootstrap-static
  fetchPlayerDb(){
    let url = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/bootstrap-static'
     fetch(url)
        .then(response => response.json())
        .then (jsonResponse => {
          this.playersDb = jsonResponse.elements;
          console.log('Players done!');
        })
  },
  fetchCaptains(){
    // https://fantasy.premierleague.com/drf/entry/877840/event/22/picks
    let urlPart1 = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/entry/';
    let urlPart3 = '/event/';
    let urlPart4Gw = '23';
    let urlPart5 = '/picks';
    for (let team of this.teams) {
      let urlPart2TeamId = team.entry;
      let cAndVc = {
        teamId: team.entry,
        name: team.entry_name,
        captain: '',
        captain_name: '',
        viceCaptain: '',
        viceCaptain_name: '',
      };
      fetch(urlPart1+urlPart2TeamId+urlPart3+urlPart4Gw+urlPart5)
         .then(response => response.json())
         .then (jsonResponse => {
          let userData = jsonResponse;
            for ( let players of userData.picks){
              if (players.is_captain) {
                cAndVc.captain = players.element;
              } if (players.is_vice_captain) {
                cAndVc.viceCaptain = players.element;
              }
            }
            this.details.push(cAndVc);
         })
    }
  },
  completeDetails() {
    let aspsideTeams = [...this.teams]
    let captainsFromDb = [...this.details]
    let finalArr = []
    for (let team of aspsideTeams) {
      let objToPush = {}
      captainsFromDb.forEach(function(tm){
        if (tm.teamId === team.entry){
          objToPush = { ...tm, ...team}
          finalArr.push(objToPush)
        }
      })
    }
    this.teamWithCaptainIds = finalArr;
    this.captainNames()
  },
  captainNames() {
    // id / first_name / second_name
    let players = [...this.playersDb]
    for (let lag of this.teamWithCaptainIds) {
      players.forEach(function(pl){
        if (pl.id === lag.captain) {
          lag.captain_name = pl.first_name +' '+ pl.second_name
        } else if (pl.id === lag.viceCaptain){
          lag.viceCaptain_name = pl.first_name +' '+ pl.second_name
        } else {
          return null
        }
      });
    }
  }

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

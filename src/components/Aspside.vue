<template>
  <div class="hello">
    <h1>{{ title }} - Gameweek: {{ gw }}</h1>
    <!-- <button class="btn btn-outline-success" @click="fetchAspside">Get FPL data</button>
    <button class="btn btn-outline-success" @click="fetchPlayerDb">Get Player DB</button>
    <button class="btn btn-outline-success" @click="fetchCaptains">Get Captains</button>
    <button class="btn btn-outline-success" @click="completeDetails">Complete details</button>
    <button class="btn btn-outline-success" @click="captainNames">Display Captains</button>
    <button class="btn btn-outline-success" @click="runner">RUNNER</button> -->
    <div v-if="allTeamDetails.length && !loading">
      <table class="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <!-- <th>Team ID</th> -->
            <th></th>
            <th>Points</th>
            <th>Captain</th>
            <th>Vice Captain</th>
            <th>Tranfer Costs</th>
          </tr>
        </thead>

        <tbody v-for="team in allTeamDetails" v-bind:key="team.rank">
          <tr>
            <td class="rank">{{team.rank}} <div :class="team.movement"></div></td>
            <td>{{team.entry_name}}</td>
            <td><small v-if="team.gw_chip" class="chip">{{team.gw_chip.toUpperCase()}}</small></td>
            <!-- <td>{{team.entry}}</td> -->
            <td><strong>{{team.total}}</strong></td>
            <td>{{team.captain_name}}</td>
            <td>{{team.viceCaptain_name}}</td>
            <td v-if="team.transferCost > 0">-{{team.transferCost}}</td>
          </tr>
        </tbody>

      </table>
    </div>
    <div v-if="loading">
       <div class="loader"></div>
    </div>
    <div v-if="!loading && errMsg === 'undefined'">
       <div class="errorMessage">Sorry</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'FPL - Aspside',
      teams: [],
      details: [],
      playersDb: [],
      loading: false,
      allTeamDetails: [],
      gw: 23,
      errMsg: '',
    }
  },
  created() {
    this.completeDetails()
  },
  methods: {
    async fetchAspside() {
      // LeagueID: 116190
      this.loading = true
      let url = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/leagues-classic-standings/116190'
      const leagueResponse = await fetch(url)
        .then(response => response.json())
      this.teams = await leagueResponse.standings.results;
      console.log(leagueResponse.standings.results);
    },
    // https://fantasy.premierleague.com/drf/bootstrap-static
    async fetchPlayerDb() {
      let url = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/bootstrap-static'
      const pdbResponse = await fetch(url)
        .then(response => response.json())
      this.playersDb = await pdbResponse.elements;
      console.log(pdbResponse.elements);
    },
    async fetchCaptains() {
      // https://fantasy.premierleague.com/drf/entry/877840/event/22/picks
      let urlPt1 = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/entry/';
      let urlPt3 = '/event/';
      let urlPt4Gw = this.gw;
      let urlPt5 = '/picks';
      for (let team of this.teams) {
        let urlPt2TeamId = team.entry;
        // let cAndVc = {
        //   teamId: team.entry,
        //   name: team.entry_name,
        //   captain: '',
        //   captain_name: '',
        //   viceCaptain: '',
        //   viceCaptain_name: '',
        //   gw_chip: '',
        //   transferCost: ''
        // };
        let capFetch = await fetch(urlPt1 + urlPt2TeamId + urlPt3 + urlPt4Gw + urlPt5)
          .then(response => response.json())
        let userData = await capFetch
        let cAndVc = {
          teamId: team.entry,
          name: team.entry_name,
          captain: '',
          captain_name: '',
          viceCaptain: '',
          viceCaptain_name: '',
          gw_chip: userData.active_chip,
          transferCost: userData.entry_history.event_transfers_cost
        };
        for (let players of userData.picks) {
          if (players.is_captain) {
            cAndVc.captain = players.element;
          }
          if (players.is_vice_captain) {
            cAndVc.viceCaptain = players.element;
          }
        }
        this.details.push(cAndVc);
      }
      console.log('2:Finished fetched captains');
    },
    async runner() {
      const one = await this.fetchAspside();
      const two = await this.fetchCaptains();
      const three = await this.fetchPlayerDb();
      return one + two + three
    },
    async completeDetails() {
      let runnerWait = await this.runner();

      let aspsideTeams = [...this.teams]
      let captainsFromDb = [...this.details]
      let finalArr = []
      for (let team of aspsideTeams) {
        let objToPush = {}
        captainsFromDb.forEach(function(tm) {
          if (tm.teamId === team.entry) {
            objToPush = { ...tm,
              ...team
            }
            finalArr.push(objToPush)
          }
        })
      }
      this.allTeamDetails = finalArr;
      console.log('4:Matched ids with names');
      this.captainNames()
      console.log('Done and done!');
    },
    captainNames() {
      // id / first_name / second_name
      let players = [...this.playersDb]
      for (let lag of this.allTeamDetails) {
        players.forEach(function(pl) {
          if (pl.id === lag.captain) {
            lag.captain_name = pl.second_name
            // lag.captain_name = pl.first_name + ' ' + pl.second_name
          } else if (pl.id === lag.viceCaptain) {
            lag.viceCaptain_name = pl.second_name
            // lag.viceCaptain_name = pl.first_name + ' ' + pl.second_name
          } else {
            return null
          }
        });
      }
      this.loading = false;
      console.log('5:Given captains names');
    }
  },
}
</script>

<style scoped>
td, th, h1{
  text-align: center;
}

.rank {
  text-align: left;
  padding-left: 1.3rem;
  display: flex;
  border: 0;
}
.same {
  align-self: baseline;
  width: 6px;
  height: 2px;
  border-bottom: 3px solid darkgrey;
  margin: auto;
}

.up {
  align-self: baseline;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid green;
  margin: auto;
}

.down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #f00;
  margin: auto;
}

.loader {
  border: 16px solid #38003c;
  border-top: 16px solid #00ff87;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin: auto;
  margin-top: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chip {
  color: red;
}

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

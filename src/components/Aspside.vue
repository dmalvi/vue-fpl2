<template>
  <div class="hello">
    <h1>{{ title }}{{ gw }}</h1>
    <!-- <button class="btn btn-outline-success" @click="checkCurrentEvent">Check event</button> -->
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
       <h3 class="status">{{ statusMsg }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'FPL | Aspside | GW#: ',
      teams: [],
      details: [],
      playersDb: [],
      loading: false,
      allTeamDetails: [],
      gw: '',
      statusMsg: '',
      gwData: []
    }
  },
  created() {
    this.completeDetails()
  },
  methods: {
    async checkCurrentEvent (){
      this.loading = true
      this.statusMsg = 'checking current gw...'
      let url = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/events'
      const eventResponse = await fetch(url)
        .then(response => response.json())
      this.gwData = await eventResponse
      for (let gameweek of this.gwData){
        if (gameweek.is_current) {
          this.gw = gameweek.id
        }
      }
      console.log('01');
    },
    async fetchAspside() {
      // LeagueID: 116190
      this.statusMsg = 'fetching league...'
      let url = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/leagues-classic-standings/116190'
      const leagueResponse = await fetch(url)
        .then(response => response.json())
      this.teams = await leagueResponse.standings.results;
      console.log('02');
    },
    // https://fantasy.premierleague.com/drf/bootstrap-static
    async fetchPlayerDb() {
      this.statusMsg = 'building player database...'
      let url = 'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/drf/bootstrap-static'
      const pdbResponse = await fetch(url)
        .then(response => response.json())
      this.playersDb = await pdbResponse.elements;
      console.log('04');
    },
    async fetchCaptains() {
      this.statusMsg = 'fetching captains...'
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
      console.log('03');
    },
    async runner() {
      const zero = await this.checkCurrentEvent();
      const one = await this.fetchAspside();
      const two = await this.fetchCaptains();
      const three = await this.fetchPlayerDb();
      return zero + one + two + three
    },
    async completeDetails() {
      let runnerWait = await this.runner();
      this.statusMsg = 'finishing teams...'
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
      console.log('05');
      this.captainNames()
      console.log('07 Done and done!');
    },
    captainNames() {
      // id / first_name / second_name
      this.statusMsg = 'finishing final details...'
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
      this.statusMsg = '';
      this.loading = false;
      console.log('06');
    }
  },
}
</script>

<style scoped>
td, th, h1{
  text-align: center;
}
.status {
  text-align: center;
  margin-top: 24px;
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

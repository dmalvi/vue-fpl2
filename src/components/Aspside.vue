<template>
  <div class="main-container" @click="extend">
    <div class="header-container">
      <span class="title-text">
        FPL <big>|</big> Aspside
      </span>
      <!-- <span class="gw-text" v-if="gw">
        GW# {{ gw }}
      </span> -->
      <!-- <button v-if="!loading" class="btn btn-outline-primary" @click="extend">{{ extended ? 'Click to minimize view' : 'Click to extend view' }}</button> -->
    </div>
    <div class="table-container" v-if="allTeamDetails.length && !loading">
      <table class="league-table">
        <thead class="league-header">
          <tr class="header-row">
            <th class="rank-header rank">#</th>
            <th class="a-left">Team</th>
            <!-- <th>Team ID</th> -->
            <th class="a-left">Captain</th>
            <transition name="slide-fade">
            <th v-if="extended" class="a-left">Vice Captain</th>
            </transition>
            <transition name="slide-fade">
            <th v-if="extended">Transfer costs</th>
            </transition>
            <transition name="slide-fade">
              <th v-if="extended" class="a-right">Points on bench</th>
            </transition>
            <th class="a-center">GW{{ gw }}</th>
            <th class="a-center tot">Total</th>
          </tr>
        </thead>

        <tbody class="league-body" v-for="team in allTeamDetails" v-bind:key="team.rank">
          <tr class="team-row">
            <td class="rank-col rank"><span class="rank-content">{{team.rank}}</span><span class="rank-content"><div :class="team.movement"></div></span></td>
            <td class="a-left">{{team.entry_name}} <small v-if="team.gw_chip" class="chip">{{team.gw_chip.toUpperCase()}}</small></td>
            <!-- <td>{{team.entry}}</td> -->
            <td class="a-left">{{team.captain_name}}</td>
            <transition name="slide-fade">
            <td v-if="extended" class="a-left">{{team.viceCaptain_name}}</td>
            </transition>
            <transition name="slide-fade">
            <td v-if="extended"><span v-if="team.transferCost > 0">-{{team.transferCost}}</span></td>
            </transition>
            <transition name="slide-fade">
              <td v-if="extended" class="a-right">{{team.bench_points}}</td>
            </transition>
            <td class="a-center">{{team.gw_points}}</td>
            <td class="a-right tot"><strong>{{team.total}}</strong></td>
          </tr>
        </tbody>

      </table>
    </div>
    <div v-if="loading">
       <div class="loader"></div>
       <h3 class="status">{{ statusMsg }}</h3>
    </div>
    <div class="info-box" :style="{'visibility': infoVisibility }">
      <div class="info-text">Click / Tap anywhere to switch view</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teams: [],
      details: [],
      playersDb: [],
      loading: false,
      allTeamDetails: [],
      gw: '',
      statusMsg: '',
      gwData: [],
      extended: false,
      infoVisibility: 'hidden',
    }
  },
  created() {
    this.completeDetails()
  },
  watch: {
    loading: function(newValue){
      if (!newValue){
          this.infoVisibility = 'visible'
          setTimeout(this.toggleInfo, 3000)
      }
    }
  },
  methods: {
    toggleInfo(){
      if (this.infoVisibility === 'visible'){
        this.infoVisibility = 'hidden'
      } else {
        this.infoVisibility = 'visible'
      }
    },
    extend (){
      this.extended = !this.extended
    },
    async checkCurrentEvent (){
      // https://fantasy.premierleague.com/drf/events
      this.loading = true
      this.statusMsg = 'checking current gw...'
      let url = 'https://fantasy.premierleague.com/drf/events'
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
      // + ?phase=6&lsPage=1&lePage=1 (phase2 = aug osv...)
      this.statusMsg = 'fetching league...'
      let url = 'https://fantasy.premierleague.com/drf/leagues-classic-standings/116190'
      const leagueResponse = await fetch(url)
        .then(response => response.json())
      this.teams = await leagueResponse.standings.results;
      console.log('02');
    },
    // https://fantasy.premierleague.com/drf/bootstrap-static (response.phases = phase definition)
    async fetchPlayerDb() {
      this.statusMsg = 'building player database...'
      let url = 'https://fantasy.premierleague.com/drf/bootstrap-static'
      const pdbResponse = await fetch(url)
        .then(response => response.json())
      this.playersDb = await pdbResponse.elements;
      console.log('04');
    },
    async fetchCaptains() {
      this.statusMsg = 'fetching teamdata...'
      // https://fantasy.premierleague.com/drf/entry/877840/event/22/picks
      let urlPt1 = 'https://fantasy.premierleague.com/drf/entry/';
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
          gw_points: userData.entry_history.points,
          gw_chip: userData.active_chip,
          bench_points: userData.entry_history.points_on_bench,
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
      this.statusMsg = 'compiling data...'
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
      this.statusMsg = 'finishing details...'
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

<style>
/* #2c3e50 */

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

html {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  background: rgb(0,61,120);
  background: linear-gradient(0deg, rgba(0,61,120,1) 0%, rgba(96,177,255,1) 100%);
  background-attachment: fixed !important;
}

@media only screen
  and (min-device-width: 375px)
  and (max-device-width: 667px)
  and (-webkit-min-device-pixel-ratio: 2)
  and (orientation: portrait) {
  .league-table {
    font-size: 10px;
  }

  .header-container {
    font-size: 24px;
    font-weight: normal;
  }
}

.info-box {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(255, 255, 255);
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.86);
  width: 50%;
  /* height: 10vh; */
  padding: 10% 5%;
  margin: auto;
  text-align: center;
  vertical-align: middle;
  border-radius: 10px 10px 10px 10px;
  position: fixed;
  top: 38vh;
  left: 20.5%;
}

.btn {
  margin: 0.6rem;
}

.main-container {
  display: flex;
  flex-direction: column;
}

.table-container {
  display: flex;
  justify-content: center;
}

thead, tbody {
}

.league-table {
  width: 97%;
  border-spacing: 0 2px;
  margin: 1rem auto;
  border-radius: 10px 10px 0px 0px;
  overflow: hidden;
  -webkit-box-shadow: 10px 10px 10px -5px rgba(0,0,0,0.5);
  -moz-box-shadow: 10px 10px 10px -5px rgba(0,0,0,0.5);
  box-shadow: 10px 10px 10px -5px rgba(0,0,0,0.5);
}

th, td{
  padding: .6em 0;
}

.header-row {
  background-color: #3d6694;
  color: white;
}

.team-row {
  background-color: #fbfcfc;
}

.a-left {
  text-align: left;
}

.a-center {
  text-align: center;
}

.chip {
  color: red;
}

h1{
  text-align: center;
}

h2, h3{
  color: white;
}

.header-container {
  display: flex;
  flex-direction: column;
  font-weight: 800;
  color: rgb(255, 255, 255);
}

.title-text {
  /* font-family: 'Helvetica'; */
  text-shadow: 0px 4px 3px rgba(0,0,0,0.4),
               0px 8px 13px rgba(0,0,0,0.1),
               0px 18px 23px rgba(0,0,0,0.1);
  font-size: 48px;
}

.gw-text {
  font-size: 20px;
}

big {
  color: #3d6694;
}

.status {
  text-shadow: 0px 4px 3px rgba(0,0,0,0.4),
               0px 8px 13px rgba(0,0,0,0.1),
               0px 18px 23px rgba(0,0,0,0.1);
  text-align: center;
  margin-top: 24px;
}

.rank-header {
  text-align: left;
  padding-left: .8em;
  max-width: 64px;
}

.rank-col {
  /* padding-left: 1em; */
  display: flex;
  max-width: 64px;
  justify-content: space-around;
  align-items: center;
  padding-left: .4em;
  padding-right: .4em;
  border: 0;
}

.same {
  align-self: baseline;
  width: 5px;
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
  border-bottom: 5px solid #46a800;
  margin: auto;
}

.down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #c70000;
  margin: auto;
}

.loader {
  border: 16px solid rgba(255, 255, 255, 0.4);
  border-top: 16px solid #003d78;
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

</style>

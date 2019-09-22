{{ this.fetchedTeamData[0]['Live Points'] }}
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
    <div class="table-container" v-if="fetchedTeamData.length && !loading">
      <table class="league-table">
        <thead class="league-header">
          <tr class="header-row">
            <th class="rank-header rank">#</th>
            <th class="a-left">Team</th>
            <th class="a-left">Captain</th>
            <transition name="slide-fade">
            <th v-if="extended" class="a-left">Vice Captain</th>
            </transition>
            <!-- <th class="a-center">Transfer Cost</th> -->
            <th class="a-center">GW{{ gw }}</th>
            <th class="a-center tot">Total</th>
          </tr>
        </thead>

        <tbody class="league-body" v-for="(team, index) in fetchedTeamData" v-bind:key="team.rank">
          <tr class="team-row">
            <td class="rank-col rank"><span class="rank-content">{{ index+1 }}</span></td>
            <td class="a-left">{{team["Team"]}} </td>
            <td class="a-left">{{team["Captain"].replace(/([(\d)])/g, '')}}</td>
            <transition name="slide-fade">
            <td v-if="extended" class="a-left">{{team["Vice-Captain"].replace(/([(\d)])/g, '')}}</td>
            </transition>
            <!-- <td class="a-center">{{team["Transfers (Cost)"].match(/\((-[^)]+)\)/g)}}</td> -->
            <td class="a-center">{{team["Live Points"]}}</td>
            <td class="a-right tot"><strong>{{team["Total"]}}</strong></td>
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

function compare( a, b ) {
  if ( a.Total > b.Total ){
    return -1;
  }
  if ( a.Total < b.Total ){
    return 1;
  }
  return 0;
}
// myString.replace(/<[^>]*>?/gm, '');
// objs.sort( compare );

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
      cred: {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      },
      fetchedTeamData: []
    }
  },
  created() {
    this.fetchData()
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
    async fetchData (){
      this.loading = true;
      const url = "https://cors-anywhere.herokuapp.com/https://www.anewpla.net/fpl/league/json.php?id=7168";
      const eventResponse = await fetch(url, this.cred)
        .then(response => response.json())
      let teamData = await eventResponse.data;
      this.fetchedTeamData = teamData.sort(compare);
      this.loading= false;
    },
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

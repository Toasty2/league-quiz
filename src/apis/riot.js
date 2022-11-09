import React from 'react';
import RiotRequest from 'riot-lol-api';

const KEY = ''; /* Fill in from Riot Developers Portal */

class Riot extends React.Component {

    constructor(props) {
        super(props);

        this.state = { summonerData: [] };
    }

    fetchSummonerData = () => {
        const that = this;
        var riotRequest = new RiotRequest(KEY);
        var names = 'AGuyCalledRoy';

        riotRequest.request('euw1', 'summoner', `/lol/summoner/v4/summoners/by-name/${names}`, function(err, data) {
            //console.log(data);
            that.setState({ summonerData: data });
        });

        //console.log("Summoner name is " + that.state.summonerData.name);
    }

    componentDidMount = () => {
        this.fetchSummonerData();
    }

    render() {
        var summonerIcon = `http://ddragon.leagueoflegends.com/cdn/12.16.1/img/profileicon/${this.state.summonerData.profileIconId}.png`;

        return (
            <div className="ui relaxed divided list">
                <img src={summonerIcon} />
                <br />
                Hello, {this.state.summonerData.name}. Your summoner level is {this.state.summonerData.summonerLevel} and your super secret account ID is {this.state.summonerData.accountId}
            </div>
        );
    }
}

export default Riot;
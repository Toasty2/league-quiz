import React from 'react';
import axios from 'axios';
import { getLatestVersion, getChampionIdMap } from '../apis/ddragon';

class Champion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            champData: [],
            errorMessage: '',
            champId: '',
            loading: true
        };
    }

    // Old way using fetch
    /*fetchChamp = (champName, champDataSource) => {
        this.setState({ loading: true });
        fetch(champDataSource)
        .then(async response => {
            const data = await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }

            console.log(data);

            this.setState({ 
                champData: data,
                loading: false,
            });
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString(), loading: false });
            console.error('There was an error!', error);
        });
    }*/

    fetchChamp = async (champName, champDataSource) => {
        this.setState({ loading: true });
        const response = await axios.get(champDataSource, {});

        console.log(response);

        this.setState({ 
            champData: response,
            loading: false,
        });
    }

    loadChamp = (champName) => {
        console.log('champion from champion.js is ' + champName);

        Promise.all([getLatestVersion(), getChampionIdMap()]).then(([version, idsByName]) => {
            var champId = idsByName[champName] || champName;
            const champDataSource = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${champId}.json`;

            this.setState({ champId: champId });
            this.fetchChamp(champName, champDataSource);
        });
    }

    componentDidMount = () => {
        this.loadChamp(this.props.champName);
    }

    componentDidUpdate = (prevProps, prevState) => {
        /*var champName = this.state.champName;
        var oldChamp = prevState.champName;
        console.log('champion from champion.js didupdate is ' + champName + ' and old champ is ' + oldChamp);
        //if (oldChamp != champName ) {
            const champDataSource = `http://ddragon.leagueoflegends.com/cdn/12.16.1/data/en_US/champion/${champName}.json`;

            this.fetchChamp(champDataSource);
        //}*/
        //this.setState({ champName: this.state.champName });

        if (prevProps.champName !== this.props.champName) {
            this.loadChamp(this.props.champName);
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div>Loading champ data...</div>
            );
        } else {
            var champId = this.state.champId;
            var splashImage = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champId}_0.jpg`;
            console.log('champName is ' + this.props.champName + ' and splashImage is ' + splashImage);

            const styles = {
                'backgroundImage': `url(${splashImage})`,
                'backgroundPosition': 'center',
                'backgroundSize': 'cover',
                'backgroundRepeat': 'no-repeat',
                'width': '50vw',
                'height': '100vh'
            };
            

            return (
                <div className="ui relaxed divided list test champion-splash relative" >
                    <img src={require('../assets/img/champ_border.png')} alt="" className="absolute pl-4 pt-4 -top-0.5" />
                    <img src={splashImage} alt="Champion splash art" />
                    <h2 className="champion-reveal"></h2>
                </div>
            );
        }
    }
}

export default Champion;
import React from 'react';
import axios from 'axios';

class Champion extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            champData: [],
            errorMessage: '',
            champName: props.champName,
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

    componentDidMount = () => {
        var champName = this.props.champName;
        const champDataSource = `http://ddragon.leagueoflegends.com/cdn/12.16.1/data/en_US/champion/${champName}.json`;
        console.log('champion from champion.js is ' + champName);

        this.fetchChamp(champName, champDataSource);
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
    }   

    render() {
        if (this.state.loading) {
            return (
                <div>Loading champ data...</div>
            );
        } else {
            var champName = this.props.champName;
            var splashImage = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champName}_0.jpg`;
            console.log('champName is ' + champName + ' and splashImage is ' + splashImage);

            const styles = {
                'backgroundImage': `url(${splashImage})`,
                'backgroundPosition': 'center',
                'backgroundSize': 'cover',
                'backgroundRepeat': 'no-repeat',
                'width': '50vw',
                'height': '100vh'
            };
            

            return (
                <div className="ui relaxed divided list test champion-splash" >
                    <img src={splashImage} />
                    <h2 className="champion-reveal"></h2>
                </div>
            );
        }
    }
}

export default Champion;
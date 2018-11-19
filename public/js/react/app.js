class Message extends React.Component {
  render() {
    return <div className="message">
    <p className="instructions">Use: Input the name of a city and select the type of forecast you wish to see. 'Forecasted' returns todays weather report and 7 days in advance. 'Observed' returns the historical weather report for 30 days.
    </p>
    <br></br>
    <p className="note">Note: In the event that the city input is not specific enough, you will be given the most relevant match. For example, an input of "Paris" will return the French capital as the most relevant result while "Paris,TX" will be different. 
    </p></div>;
  }
}

class ForecastedInfo extends React.Component{
  constructor(props) {
    super(props)
  }
  render() {
    return(

      <div className="forecasted-div">
      <h1>Forecasted Weather</h1>
      {this.props.forecastedInfo.map(function(el, index){
        return <table className="forecasted-table" key={ index }>
        <tbody>
        <tr>
        <td className="summary"><i class="fas fa-clock"></i>&nbsp;{el[0]}<br/>{el[1]}</td>
        </tr>
        <tr>
        <td>
        <i class="fas fa-arrow-circle-down"></i>&nbsp;{el[2]}F&nbsp;
        <i class="fas fa-arrow-circle-up"></i>&nbsp;{el[3]}F 
        </td>
        </tr>
        <tr>
        <td><i class="fas fa-sun"></i><br/>Sunrise:{el[4]}</td>
        </tr>
        <tr>
        <td>
        <i class="fas fa-tint"></i>&nbsp;Humidity:{Math.round(el[6] * 100)}%&nbsp;<br/>
        <i class="fas fa-umbrella"></i>&nbsp;Precipitation:{el[8]}</td>
        </tr>
        <tr>
        <td>
        <i class="fas fa-umbrella-beach"></i>&nbsp;UV Index:{el[9]}&nbsp;<br/><i class="fas fa-helicopter"></i>&nbsp;Wind Speed:{el[10]}</td>
        </tr>
        </tbody>
        </table>;
      })}
      </div>
      );  
  }        
}

class ObservedInfo extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="observed-div">
      <h1>Observed weather for the past 30 days</h1>
      {this.props.observedInfo.map(function(el, index){
        return <table className="observed-table" key={ index }>
        <tbody>
        <tr>
        <td className="summary"><i class="fas fa-clock"></i>&nbsp;{el[0]}<br/>{el[1]}</td>
        </tr>
        <tr>
        <td>
        <i class="fas fa-arrow-circle-down"></i>&nbsp;{el[2]}F&nbsp;
        <i class="fas fa-arrow-circle-up"></i>&nbsp;{el[3]}F 
        </td>
        </tr>
        <tr>
        <td><i class="fas fa-sun"></i><br/>Sunrise:{el[4]}</td>
        </tr>
        <tr>
        <td>
        <i class="fas fa-tint"></i>&nbsp;Humidity:{Math.round(el[6] * 100)}%&nbsp;<br/>
        <i class="fas fa-umbrella"></i>&nbsp;Precipitation:{el[8]}</td>
        </tr>
        <tr>
        <td>
        <i class="fas fa-umbrella-beach"></i>&nbsp;UV Index:{el[9]}&nbsp;<br/><i class="fas fa-helicopter"></i>&nbsp;Wind Speed:{el[10]}</td>
        </tr>
        </tbody>
        </table>;
      })}
      </div>
      );  
  }
}

class LocSelectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewObserved: false,
      viewForecasted: false,
      cityname:'',
      forecastedInfo:[],
      observedInfo:[],
      forecasted_req: false,
      observed_req: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this); 
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value; //if not 'on', null. 
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  unixToHuman(unixdate){
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const date = new Date(unixdate * 1000);
    const year = date.getFullYear();
    const day = date.getUTCDate();
    const month = months[date.getMonth()];

    return (String(month) + ' ' + String(day) + ' ' + String(year));
  }

  unixToHumanSun(unixdate){
    const date = new Date(unixdate * 1000);
    const hour = date.getUTCHours();
    const min = date.getUTCMinutes();

    return (String(hour) + ':' + String(min) + ' ' + 'GMT');
  }


  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    if (data.get('viewForecasted') === 'on'){
      this.setState({ forecasted_req: true});
      $.ajax({
       url: 'api/geocode/' + data.get('cityname') + '/forecasted',

       error: function() {
        console.log("error");
      },
      success: function(data) {
        const a= (data.daily.data);
        const twod = new Array();
        var counter = 0;

        for (var key in a) {
          const temp = new Array();
          temp.splice(0, 0, this.unixToHuman(a[key]['time']));
          temp.splice(1, 0, a[key]['summary']);
          temp.splice(2, 0, a[key]['temperatureMin']);
          temp.splice(3, 0, a[key]['temperatureMax']);                    
          temp.splice(4, 0, this.unixToHumanSun(a[key]['sunriseTime']));
          temp.splice(5, 0, this.unixToHumanSun(a[key]['sunsetTime']));
          temp.splice(6, 0, a[key]['humidity']);
          temp.splice(7, 0, a[key]['icon']);
          temp.splice(8, 0, a[key]['precipProbability']);
          temp.splice(9, 0, a[key]['uvIndex']);
          temp.splice(10, 0, a[key]['windSpeed']);

          twod.splice(counter, 0, temp);
          counter += 1;
        }
        this.setState({forecastedInfo: twod});
      }.bind(this),
      type: 'GET'
    });
    }

    if (data.get('viewObserved') === 'on'){
      this.setState({ observed_req: true});

      $.ajax({
       url: 'api/geocode/' + data.get('cityname') + '/observed',
       error: function() {
        console.log("error");
      },
      success: function(data) {
        const twod = new Array();

        for (var i = 0; i < 30; i++) { 
          const a= (data[i]["daily"]["data"]);
          var counter = 0;

          for (var key in a) {
            const temp = new Array();
            temp.splice(0, 0, this.unixToHuman(a[key]['time']));
            temp.splice(1, 0, a[key]['summary']);
            temp.splice(2, 0, a[key]['temperatureMin']);
            temp.splice(3, 0, a[key]['temperatureMax']);                    
            temp.splice(4, 0, this.unixToHumanSun(a[key]['sunriseTime']));
            temp.splice(5, 0, this.unixToHumanSun(a[key]['sunsetTime']));
            temp.splice(6, 0, a[key]['humidity']);
            temp.splice(7, 0, a[key]['icon']);
            temp.splice(8, 0, a[key]['precipProbability']);
            temp.splice(9, 0, a[key]['uvIndex']);
            temp.splice(10, 0, a[key]['windSpeed']);

            twod.splice(counter, 0, temp);
            counter += 1;
          }
        }

        this.setState({observedInfo: twod});
      }.bind(this),
      type: 'GET'
    });
    }
  }

  renderForecastedInfo() {
    return <ForecastedInfo forecastedInfo={this.state.forecastedInfo} cityname={this.state.cityname} />
  }

  renderObservedInfo() {
    return <ObservedInfo observedInfo={this.state.observedInfo} cityname={this.state.cityname} />
  }

  render() {
    return (
      <div className="top-form">
      <form className="pad" onSubmit={this.handleSubmit}>
      <label className="lat-label">
      City Name
      <input
      name="cityname"
      type="text"
      value={this.state.cityname}
      onChange={this.handleInputChange} />
      </label>
      

      <label className="checkbox">
      Observed
      <input
      name="viewObserved"
      type="checkbox"
      checked={this.state.viewObserved}
      onChange={this.handleInputChange} />
      </label>
      <label className="checkbox">
      Forecasted
      <input
      name="viewForecasted"
      type="checkbox"
      checked={this.state.viewForecasted}
      onChange={this.handleInputChange} />
      </label>
      <br></br>
      <button className="submit">submit</button>

      </form>

      {this.state.forecasted_req && this.renderForecastedInfo()}
      {this.state.observed_req && this.renderObservedInfo()}

      </div>
      );
  }
}

(function(App) {
  ReactDOM.render(
    (
      <div>
      <header>
      <h1 className="main-header">DarkSky Weather Report</h1>
      <Message></Message>
      <LocSelectForm></LocSelectForm>
      </header>
      </div>
      ),
    document.getElementById('root')
    );

})(App);



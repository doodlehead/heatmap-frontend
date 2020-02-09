import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Get } from 'react-axios'

class Heatmap extends Component {

  //Default focus/zoom on the Ontario-ish region
  static defaultProps = {
    center: {
      lat: 45.4215,
      lng: -75.6972
    },
    zoom: 3,
    heatmapOptions: {
      radius: 20,
      opacity: 0.6
    }
  };

  //Generate test data
  generatePositions = (length) => {
    const res = [];
    let lat = 0;
    let lng = 0;

    for(let i=0; i < length; i++) {
      lat = Math.floor(Math.random() * 180) - 90;
      lng = Math.floor(Math.random() * 360) - 180
      res.push({ lat, lng })
    }
    return res;
  }

  handleApiLoaded = (map, maps) => {
    console.log(map);
    console.log(maps);
  }

  //Format useful data
  formatData = (response) => {
    const res = []
    response.data.forEach(elem => {
      const position = {}
      if (elem.status_place) {
        //Not worth it yet
        return
      } else if (elem.user_country) {
        //[longitude, latitude]
        position.lng = elem.user_country[0]
        position.lat = elem.user_country[1]
      }

      //Weight of the data-point on the map depends on the sentiment score
      if (elem.sentiment_score < 0) {
        position.weight = Math.abs(elem.sentiment_score)
      } else {
        //Don't show positive
        return
      }

      //Add the data point
      res.push(position)
    });
    console.log(res)

    //Show either positive or negative?
    return res;
  }
  /*
  Heatmap position data should be in this format:
  {
    lat: Number,
    lng: Number,
    weight: Number,
  }
  */
  render() {
    return (
      <Get url="http://localhost:5000/posts-useful">
        {(error, response, isLoading, makeRequest, axios) => {
          if (!isLoading && response) {
            console.log(response)
            return (
              <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: '' }}
                  defaultCenter={this.props.center}
                  defaultZoom={this.props.zoom}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
                  heatmapLibrary={true}
                  heatmap={{
                    positions:this.formatData(response),
                    options: this.props.heatmapOptions
                  }}
                ></GoogleMapReact>
              </div>
            )
          } else {
            return <div>Loading...</div>
          }
        }}
      </Get>
    )
  }
}

export default Heatmap
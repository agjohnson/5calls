const html = require('choo/html');

module.exports = (state, prev, send) => {
  return html`
    <div class="issues__subtitle">
    ${pretext(state)}
    </div>
  `;

  function pretext(state) {
    if (state.fetchingLocation) {
      return html`<p class="loadingAnimation">Getting your location</p>`;
    }
    else if (state.askingLocation) {
      if (state.locationFetchType === 'browserGeolocation') {
        return html`<p>
          <button onclick=${fetchBrowserLocation}>Geolocate</button> or <button onclick=${fetchLocationBy} data-by='addressForm'>Enter Address</button>
        </p>`
      } else {
        return html`<p><form onsubmit=${submitAddress}>Enter an address or zip code: <input autofocus="true" name="address" /><button>Go</button></form></p>`;
      }
    } else {
      if (state.address != '') {
        return html`<p>Included reps for ${state.address} • <a href="#" onclick=${unsetLocation}>Change</a></p>`
      } else if (state.cachedCity != '') {
        return html`<p>We've included reps for ${state.cachedCity} • <a href="#" onclick=${enterLocation}>Change</a> ${debugText(state.debug)}</p>`
      } else if (state.geolocation != '') {
        return html`<p>Included reps based on browser location • <a href="#" onclick=${enterLocation}>Change</a></p>`
      } else {
        return html`<p>Couldn't find your location. <a href="#" onclick=${enterLocation}>Change</a></p>`
      }
    }
  }

  function fetchLocationBy(e) {
    send('fetchLocationBy', e.target.dataset.by);
  }

  // TODO: Set geolocation cache time in case we want to bring it back
  // TODO: Handle when a user blocks browser geolocation, but tries to reenable in a new session
  function fetchBrowserLocation(e) {
    let pos;
    let nudgeTimeoutId = setTimeout(showNudgeAlert, 5000);

    let showNudgeAlert = function() {
      window.alert('Too slow');
    }

    let geoSuccess = function(position) {
      clearTimeout(nudgeTimeoutId);
      send('fetchingLocation', false);

      if (typeof position.coords !== 'undefined') {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        if (lat && long) {
          let geo = Math.floor(lat*10000)/10000 + ',' + Math.floor(long*10000)/10000;
          send('allowBrowserGeolocation', true);
          send('setBroswerGeolocation', geo);
        } else {
          console.log("Error: bad browser location results");
          send('fetchLocationBy', null);
        }
      } else {
        console.log("Error: bad browser location results");
        send('fetchLocationBy', null);
      }
    }

    let geoError = function(error) {
      send('fetchingLocation', false);

      if (error.code === 1) {
        send('allowBrowserGeolocation', false);
      }
      send('fetchLocationBy', null);
      console.log("Error with browser location (code: " + error.code + ")");
    }

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    send('fetchingLocation', true);
  }

  function debugText(debug) {
    return debug ? html`<a href="#" onclick=${unsetLocation}>reset</a>` : html``;
  }

  function submitAddress(e) {
    e.preventDefault();
    address = this.elements["address"].value;

    send('setLocation', address);
  }

  function enterLocation(e) {
    send('enterLocation');
  }

  function unsetLocation() {
    send('unsetLocation');
  }
}
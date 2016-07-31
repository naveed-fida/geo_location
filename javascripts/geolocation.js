var map = {
  width: 600,
  height: 420,
  buildURL: function() {
    var base = "http://maps.googleapis.com/maps/api/staticmap?zoom=13&size=",
        coords = this.position.coords.latitude + "," + this.position.coords.longitude;
    base += this.width + "x" + this.height + "&center=" + coords;
    return base + "&markers=" + coords;
  },
  buildImage: function(src) {
    var $img = $("<img />", {
      width: this.width,
      height: this.height,
      src: src
    });
    return $img;
  },
  latLng: function() {
    return "lat=" + this.position.coords.latitude + "&lon=" + this.position.coords.longitude;
  },
  create: function() {
    var url = this.buildURL(),
        $img = this.buildImage(url);

    $("#map").html($img);
  },
  build: function(position) {
    this.position = position;
    this.create();
    weather.get();
  }
};

var weather = {
  endpoint: "http://api.openweathermap.org/data/2.5/weather",
  icon_path: "http://openweathermap.org/img/w/",
  template: Handlebars.compile($("#weather_card").html()),
  $el: $("#weather"),
  url: function() {
    return this.endpoint + "?" + map.latLng() + '&APPID=7a0a9223aaafe8c9a13ec5fa038882bf';
  },
  get: function() {
    var dfd = $.ajax({
      url: this.url(),
      dataType: "json"
    });
    dfd.done(this.render.bind(this));
  },
  temp: function(kelvin) {
    return kelvinToF(kelvin).toFixed(1) + "&deg;F";
  },
  processData: function(json) {
    return {
      temp: this.temp(json.main.temp),
      icon: json.cod,
      description: json.weather[0].description,
      location: json.name
    };
  },
  render: function(json) {
    this.$el.html(this.template(this.processData(json))).addClass("slide");
  }
};

function kelvinToF(temp) {
  return 9 / 5 * (temp - 273.15) + 32;
}

navigator.geolocation.getCurrentPosition(map.build.bind(map));
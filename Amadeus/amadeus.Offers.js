Activity.importScript(
  Lourah.jsFramework.dir()
  + "/Flights.utils.js"
  );

function Offers(amadeus) {
  this.offers = new Array(amadeus.data.length);
  amadeus.data.forEach(
    (offer, i) => {
      this.offers[i] = new Offer(this, offer, i);
      });
  this.$ = () => amadeus.data;
  this.offers.sort((a, b) => a.getPrice() - b.getPrice());
  this.toString = () => {
    var s = "Offers::" + amadeus.data.length;
    this.offers.forEach(offer => s += "\n" + offer);
    return s;
    }
  }


function Offer(offers, offer) {
  var price = 0;
  this.offerItems = new Array(offer.offerItems.length);
  offer.offerItems.forEach(
    (offerItem,i) => {
      this.offerItems[i] = new OfferItem(this, offerItem, i);
      price += offerItem.price.total
      });
  //this.offerItems = this.offerItems.sort((a, b) => a.$().price.total - b.$().price.total);
  this.$ = () => offer;
  this.getPrice = () => Number(price);
  this.toString = () => {
    var s = this.getPrice() + "::" + offer.id;
    this.offerItems.forEach(
      offerItem => s += offerItem
      );
    return s;
    }
  }

function OfferItem(offer, offerItem, idx) {
  this.getOffer = () => offer;
  this.services = new Array(offerItem.services.length);
  offerItem.services.forEach(
    (service, i) => {
      this.services[i] = new Service(this, service, i);
      });

  this.$ = () => offerItem;
  this.toString = () => {
    //return "price::total::" + offerItem.price.total;
    var s = "";
    this.services.forEach(
      service => s += service
      );
    return s;
    }
  }

function Service(offerItem, service, idx) {
  this.getOfferItem = () => offerItem;
  this.segments = new Array(service.segments.length);
  service.segments.forEach(
    (segment, i) => {
      this.segments[i] = new Segment(this, segment, i);
      });
  this.$ = () => service;
  this.toString = () => {
    var s = "";
    this.segments.forEach(
      segment => s += segment
      );
    return s;
    };
  }

function Segment(service, segment) {
  this.getService = () => service;
  this.flightSegment = new FlightSegment(this, segment.flightSegment);
  this.$ = () => segment;
  this.toString = () => {
    var s = "\n";
    s += this.flightSegment;
    return s;
    };
  }

function FlightSegment(segment, flightSegment) {
  this.getSegment = () => segment;
  this.$ = () => flightSegment;
  var stringify = (city) => {

    function dateAt(at) {
      dat = new Flights.utils.LocalDate(at);
      return dat.getMonth() +"/" +dat.getDay() + "-" +dat.getHours() + ":" + dat.getMinutes();
      }
    var s = city.iataCode
    + (city.terminal?"/" + city.terminal : "")
    + " "
    + dateAt(city.at)
    ;
    return s;
    }
  this.toString = () => {
    var s = "   " +
    stringify(flightSegment.departure)
    + " :: "
    + stringify(flightSegment.arrival)
    ;
    return s;
    }
  }

function Schedule(schedule) {
  var when = new Date(schedule.at);
  this.$ = () => schedule;
  }

var filename = "offers 1.json";


var json =
Activity.path2String(
  Lourah.jsFramework.dir()
  + "/"
  + filename
  );

function loadOffersFromJSON(jsonOffers) {
  return new Offers(JSON.parse(jsonOffers));
  }

try {
  var offers = loadOffersFromJSON(json);
  console.log("--" + offers);
  offers.offers.forEach(offer => {
      console.log(offer);
      });

  } catch(e) {
  console.log("load::" + filename + "::"
    + e + "::" + e.stack);
  }

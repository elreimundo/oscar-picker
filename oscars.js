// we wrap our entire function in an IIFE so that the var keyword
// can prevent the variables we define from bleeding into the
// global namespace and potentially conflicting with other modules
;(function () {
  // this data object is mocking an AJAX response that might be received from
  // an external API. We'll be populating the DOM with the data from this object
  // rather than creating it in HTML
  var data = {
    oscar: {
      img: 'http://www.hollywoodreporter.com/sites/default/files/2014/01/oscar_statue.jpg'
    },

    nominees: {
      american: {
        title: 'American Sniper',
        img: "http://a.oscar.go.com/service/image/index/id/cb3bb31a-9027-4a57-a5fb-010ffe11e931/dim/261x417.jpg"
      },
      birdman: {
        title: 'Birdman',
        img: "http://a.oscar.go.com/service/image/index/id/f9bcd504-fb4a-4f0b-a26d-ccf69251ddc9/dim/261x417.jpg"
      },
      boyhood: {
        title: 'Boyhood',
        img: "http://a.oscar.go.com/service/image/index/id/5d264e67-e8d7-4c74-bd37-85b1f2f15202/dim/261x417.jpg"
      },
      hotel: {
        title: 'Grand Budapest Hotel',
        img: "http://a.oscar.go.com/service/image/index/id/55e1ad71-0b0d-4c53-91f2-3d1986e1b479/dim/261x417.jpg"
      },
      imitation: {
        title: 'The Imitation Game',
        img: "http://a.oscar.go.com/service/image/index/id/a80cb6d9-85d1-4654-9083-d0abf2d4c843/dim/261x417.jpg"
      },
      selma: {
        title: 'Selma',
        img: "http://a.oscar.go.com/service/image/index/id/cdad57a6-681f-4fda-967f-607a05970fa9/dim/261x417.jpg"
      },
      theory: {
        title: 'Theory of Everything',
        img: "http://a.oscar.go.com/service/image/index/id/9b377976-0cfd-4990-b65e-7b0f3cf037fb/dim/261x417.jpg"
      },
      whiplash: {
        title: 'Whiplash',
        img: "http://a.oscar.go.com/service/image/index/id/6fd3106f-6f2a-4afb-bda6-30c30716ecd1/dim/261x417.jpg"
      }
    }
  }

  // we'll spend the next hundred lines or so defining the objects
  // that we'll use once we have the data to work with;
  // remember that we're pretending like this data will be
  // received via an ajax call after the page is loaded

  // OscarPicker class - initialize method
  function OscarPicker(opts) {
    // magic to make the 'new' keyword optional
    if (!(this instanceof OscarPicker))
      return new OscarPicker(opts);
    this.view            = new OscarPicker.View(opts);
    this.selectedNominee = null;
    this.nominees = [];
  }

  // we namespace the View attribute inside of OscarPicker;
  // this is almost exactly the same thing as what would be
  // OscarPicker::View in ruby
  OscarPicker.View = function(opts) {
    this.posterImage = opts.posterImage;
    this.nomineeContainer = opts.nomineeContainer;
  }

  function Nominee(nomData) {
    this.title = nomData.title;
    this.img   = nomData.img;
    this.view  = new Nominee.View(this);
    this.selected = false;
  }

  Nominee.View = function(nominee) {
    // generate an HTML element; later on, this will be
    // added to the DOM by the OscarPicker.View
    this.el = this.buildNomineeElement(nominee);
  }

  // 'constants' or 'class variables' can be defined directly on the
  // constructor. Except for immutability, the following is just like
  // class Nominee
  //   class View
  //     CSS_CLASS       = 'nominee'
  Nominee.View.CSS_CLASS      = 'nominee';

  Nominee.View.SELECTED_CLASS = 'active';

  // instance methods live on the prototype.
  // we're giving a buildNomineeElement method to all
  // Nominee::View objects
  Nominee.View.prototype.buildNomineeElement = function (nominee) {
    var nomDiv = document.createElement('div');
    // the classList API is not cross-browser compatible
    // but it is easier to use than the alternatives, and
    // we aren't yet using jQuery (which uses almost exactly
    // the same method signature -- obj.addClass instead of
    // obj.classList.add)
    nomDiv.classList.add(Nominee.View.CSS_CLASS);
    nomDiv.innerText = nominee.title;
    return nomDiv;
  }

  // add a nominee object to our model
  OscarPicker.prototype.addNominee = function (nomData) {
    var nominee = new Nominee(nomData);
    this.nominees.push(nominee);
    // communicate the new nominee to the view
    this.view.addNominee(nominee);
    // the following is going to be very confusing if this
    // is the first time you're seeing a callback design
    // pattern. We're passing OscarPicker.prototype.select,
    // which is a function, as an argument to
    // Nominee.prototype.whenSelected, another function.
    // In addition, we're 'binding' the select function
    // so that it remembers that it should be called as though
    // select was invoked by this OscarPicker object
    nominee.whenSelected(this.select.bind(this));
  }

  // add the nominee view element to the DOM
  OscarPicker.View.prototype.addNominee = function (nominee) {
    this.nomineeContainer.appendChild(nominee.view.el);
  }

  // from above, we'll be passing OscarPicker.prototype.select
  // (bound to the OscarPicker object) as the cb parameter
  // here. Inside of this function we generate another function
  // that "closures in" the cb function.
  Nominee.prototype.whenSelected = function(cb) {
    function selectThisNominee () {
      cb(this.selected ? null : this);
    }
    // we want the 'this' keyword in the selectThisNominee
    // function to refer to the current Nominee object, so
    // we pass a bound version of the function to setSelectListener
    this.view.setSelectListener(selectThisNominee.bind(this));
  }

  OscarPicker.prototype.select = function (nominee) {
    this.setSelectedNominee(nominee);
    this.view.renderSelected(nominee);
  }

  OscarPicker.prototype.setSelectedNominee = function (nominee) {
    var i = 0, len = this.nominees.length;
    for (var i = 0; i < len; i++) {
      this.nominees[i].selectIf(nominee);
    }
  }

  // from above, we'll be passing a bound version of the
  // selectThisNominee function into setSelectListener.
  // We'll be setting an event listener, which is a method
  // of HTML elements in JavaScript, that responds to 'events'
  // like 'click', 'hover', and the like, and that runs some
  // logic (the 'cb' function) in response to the event.
  // The tricky thing about event listeners is that the 'this'
  // keyword will refer to the HTML element that was clicked on
  // unless we call 'bind' on the function -- now you see why
  // bind was necessary up above!
  Nominee.View.prototype.setSelectListener = function (cb) {
    this.el.addEventListener('click', cb);
  }

  OscarPicker.View.prototype.renderSelected = function (nominee) {
    // (nominee && nominee.img) ensures that nominee is not undefined;
    // the || this.defaultImage ensures that if nominee or nominee.img
    // are falsy, we use the default image instead. We're using this
    // pattern to allow a user to deselect their selection.
    this.posterImage.src = (nominee && nominee.img) || this.defaultImage;
  }

  Nominee.prototype.selectIf = function (nominee) {
    // this === nominee will return true if this object is the
    // very same object in memory as nominee or false otherwise
    this.selected = this === nominee;
    this.view.renderSelected(this.selected);
  }

  Nominee.View.prototype.renderSelected = function (selected) {
    // the classList.toggle API is not cross-browser compatible,
    // but it's a good introduction to the nearly equivalent jQuery
    // method (obj.toggleClass instead of obj.classList.toggle);
    // the second argument to toggle is the boolean value of whether
    // that class should be enabled
    this.el.classList.toggle(Nominee.View.SELECTED_CLASS, selected);
  }

  // we're almost ready to actually instantiate our objects!
  // this function would be the success handler that we would
  // use for our ajax request. I'll demonstrate a commented
  // version of the ajax call we would use as soon as our objects
  // are ready
  OscarPicker.prototype.responseHandler = function (data) {
    this.view.defaultImage = data.oscar.img;
    this.view.renderSelected();
    for (var key in data.nominees) {
      var nomData = data.nominees[key];
      this.addNominee(nomData);
    }
  }

  // And now for the driver code!
  var posterImage = document.getElementsByClassName('poster-image')[0],
      nomineeContainer = document.getElementsByClassName('nominees')[0],
      oscarPicker = OscarPicker({
        posterImage: posterImage,
        nomineeContainer: nomineeContainer
      });

  // this is where we would make our ajax call. If we were using
  // jQuery, the code we would use would include all of the commented
  // lines below; as it stands, we're only using the one that is
  // uncommented, pretending as though our 'data' variable above
  // is the ajax response we get back
  //
  // $.ajax('http://some.api.com/restful/route')
  //   .done(function(data) {
         oscarPicker.responseHandler(data)
  //   });

  // et voila!
})();

;(function () {

  function OscarPicker(opts) {
    if (!(this instanceof OscarPicker))
      return new OscarPicker(opts);
    this.view            = new OscarPicker.View(opts);
    this.selectedNominee = null;
    this.nominees = [];
  }

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
    this.el = this.buildNomineeElement(nominee);
  }

  Nominee.View.CSS_CLASS      = 'nominee';
  Nominee.View.SELECTED_CLASS = 'active';

  Nominee.View.prototype.buildNomineeElement = function (nominee) {
    var nomDiv = document.createElement('div');
    nomDiv.classList.add(Nominee.View.CSS_CLASS);
    nomDiv.innerText = nominee.title;
    return nomDiv;
  }

  OscarPicker.prototype.addNominee = function (nomData) {
    var nominee = new Nominee(nomData);
    this.nominees.push(nominee);
    this.view.addNominee(nominee);
    nominee.whenSelected(this.select.bind(this));
  }

  OscarPicker.View.prototype.addNominee = function (nominee) {
    this.nomineeContainer.appendChild(nominee.view.el);
  }

  Nominee.prototype.whenSelected = function(cb) {
    function selectThisNominee () {
      cb(this.selected ? null : this);
    }
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

  Nominee.View.prototype.setSelectListener = function (cb) {
    this.el.addEventListener('click', cb);
  }

  OscarPicker.View.prototype.renderSelected = function (nominee) {
    this.posterImage.src = (nominee && nominee.img) || this.defaultImage;
  }

  Nominee.prototype.selectIf = function (nominee) {
    this.selected = this === nominee;
    this.view.renderSelected(this.selected);
  }

  Nominee.View.prototype.renderSelected = function (selected) {
    this.el.classList.toggle(Nominee.View.SELECTED_CLASS, selected);
  }

  OscarPicker.prototype.responseHandler = function (data) {
    this.view.defaultImage = data.oscar.img;
    this.view.renderSelected();
    for (var key in data.nominees) {
      var nomData = data.nominees[key];
      this.addNominee(nomData);
    }
  }

  var posterImage = document.getElementsByClassName('poster-image')[0],
      nomineeContainer = document.getElementsByClassName('nominees')[0],
      oscarPicker = OscarPicker({
        posterImage: posterImage,
        nomineeContainer: nomineeContainer
      });

  oscarPicker.responseHandler({
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
  });
})();

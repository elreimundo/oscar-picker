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

  // at this point we should define the players that we'll be using
  // (i.e. we should select the DOM elements that we'll be interacting
  // with later)
  var posterImgs = document.getElementsByClassName('poster-image'),
      posterImage = posterImgs[0],
      nomineeDivs = document.getElementsByClassName('nominees'),
      nomineesContainer = nomineeDivs[0];

  // this is the most complicated part of the entire file.
  // the function setAbbr is used to "closure in" the abbreviation
  // (e.g. 'american', 'whiplash', etc.) that will be used.
  // the reason why we need to use this odd pattern -- a function
  // that returns another function -- is that we otherwise would
  // not be able to control the state of the variable nomAbbr;
  // by the time a user clicked on a nominee, the variable would
  // have been reassigned to a different value than the one it had
  // at the time the listener was set. By invoking setAbbr, when
  // updatePoster (the returned function) later tries to look
  // outside of its own scope for the abbr variable, the scope it
  // gets to will be one that we've controlled
  function setAbbr(abbr) {
    function updatePoster (evt) {
      // set the image using the closured abbr variable
      posterImage.src = data.nominees[abbr].img;
      // highlight the nominee that was just selected
      clearActive();
      evt.target.classList.add('active');
    }
    return updatePoster;
  }

  // we want to highlight the nominee that is selected.
  // to do so, we will make sure that all of the nominees
  // are marked as not active first.
  function clearActive() {
    var noms = document.getElementsByClassName('nominee');
    for (var i = 0; i < noms.length; i++) {
      noms[i].classList.remove('active');
    }
  }

  // at this point we'll pretend as though we've actually
  // received data.
  posterImage.src = data.oscar.img;
  // the 'in' keyword iterates through all keys in an
  // object and its prototype.
  for (var nomAbbr in data.nominees) {
    // we'll skip any keys that are not directly on
    // the data.nominees object
    if (!(data.nominees.hasOwnProperty(nomAbbr))) {
      continue;
    }
    //now we build the element we'll append to the DOM
    var newDiv = document.createElement('div');
    newDiv.classList.add('nominee');
    var thisNominee = data.nominees[nomAbbr];
    newDiv.innerHTML = thisNominee.title;

    // we use the closured version of updatePoster
    // that we get from executing setAbbr
    var updatePoster = setAbbr(nomAbbr);

    // when the user clicks on the nominee div,
    // we want that closured function to update
    // the poster image
    newDiv.addEventListener('click', updatePoster);

    // finally, it's necessary to actually place the
    // div we've created somewhere in the DOM. We'll
    // append it as a child element of the div we've
    // called nomineesContainer
    nomineesContainer.appendChild(newDiv);
  }
})();
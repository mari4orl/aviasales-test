//TODO to remove
const stringToHTML = (str) => {
  const dom = document.createElement('div');
  dom.innerHTML = str;
  return dom
}

const getPeriodPoints = (date, duration) => {
  const dateInstance = new Date(date);
  let startDate = dateInstance.getTime();
  let endDate = duration*60*1000 + startDate;
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  return `${startDate.getHours()}:${startDate.getMinutes()} – ${endDate.getHours()}:${endDate.getMinutes()}`
}

const getDuration = (duration) => {
  const durationMilisec = duration*60*1000;
  const durationInstance = new Date(durationMilisec);
  return `${durationInstance.getHours()}ч ${durationInstance.getMinutes()}м`
}

const getStops = (stops) => {
  const arrLength = stops.length;
  return `${arrLength === 0 ? 'Без пересадок': (arrLength === 1 ? (arrLength + ' пересадка'): (arrLength + ' пересадки'))}`
}

const createSegment = ({origin, destination, date, stops, duration}) => {
  const template = `
    <div class="ticket__segment">
      <div class="ticket__block">
        <span class="ticket__block-title">${origin} – ${destination}</span>
        <span class="ticket__content">${getPeriodPoints(date, duration)}</span>
      </div>
      <div class="ticket__block">
        <span class="ticket__block-title">В пути</span>
        <span class="ticket__content">${getDuration(duration)}</span>
      </div>
      <div class="ticket__block">
        <span class="ticket__block-title">${getStops(stops)}</span>
        <span class="ticket__content">${stops.join(', ')}</span>
      </div>
    </div>`
    return template
}

const createTicket = ({price, carrier, segments}) => {
  const template = `
    <article class="ticket">
      <div class="ticket__header">
        <span class="ticket__price">${price} Р </span>
        <img src="http://pics.avs.io/99/36/${carrier}.png" class="ticket__logo" width="99" height="36" alt="Логотип авиакомпании">
      </div>
      <div class="ticket__info">
        ${
          segments.map((segment) => {
            return createSegment(segment)
          }).join('')
        }
      </div>
    </article>`;

  return template
}
const insertData = (data) => {
  const container = document.getElementById('tickets');
  const template = data.map((ticket) => {
    return createTicket(ticket)
  }).join('')
  container.insertAdjacentHTML("afterbegin", template);
}

const URL = 'https://front-test.beta.aviasales.ru/search';

const request = (URL) => {
  const onError = () => {
    return request(URL)
  }
  return fetch(URL).then(response => {
    if (!response.ok) {
      throw 'error'
    } else {
      return response.json()
    }
  }).catch(onError)
}

// Начало
const arrTest = [
    {
      "price": 15529,
      "carrier": "FV",
      "segments": [
        {
          "origin": "MOW",
          "destination": "HKT",
          "date": "2021-10-22T09:59:00.000Z",
          "stops": [
            "HKG"
          ],
          "duration": 1072
        },
        {
          "origin": "HKT",
          "destination": "MOW",
          "date": "2021-11-11T07:10:00.000Z",
          "stops": [
            "HKG"
          ],
          "duration": 1190
        }
      ]
    },
    {
      "price": 42564,
      "carrier": "FV",
      "segments": [
        {
          "origin": "MOW",
          "destination": "HKT",
          "date": "2021-10-22T09:37:00.000Z",
          "stops": [
            "SIN"
          ],
          "duration": 702
        },
        {
          "origin": "HKT",
          "destination": "MOW",
          "date": "2021-11-11T03:53:00.000Z",
          "stops": [
            "IST",
            "SHA"
          ],
          "duration": 1008
        }
      ]
    },
    {
      "price": 72842,
      "carrier": "MH",
      "segments": [
        {
          "origin": "MOW",
          "destination": "HKT",
          "date": "2021-10-22T12:01:00.000Z",
          "stops": [
            "HKG",
            "SHA"
          ],
          "duration": 1217
        },
        {
          "origin": "HKT",
          "destination": "MOW",
          "date": "2021-11-11T04:25:00.000Z",
          "stops": [],
          "duration": 1702
        }
      ]
    },
    {
      "price": 45781,
      "carrier": "SU",
      "segments": [
        {
          "origin": "MOW",
          "destination": "HKT",
          "date": "2021-10-22T15:30:00.000Z",
          "stops": [],
          "duration": 1421
        },
        {
          "origin": "HKT",
          "destination": "MOW",
          "date": "2021-11-11T05:27:00.000Z",
          "stops": [],
          "duration": 1670
        }
      ]
    },
    {
      "price": 98845,
      "carrier": "MH",
      "segments": [
        {
          "origin": "MOW",
          "destination": "HKT",
          "date": "2021-10-22T00:58:00.000Z",
          "stops": [
            "SIN",
            "BKK"
          ],
          "duration": 716
        },
        {
          "origin": "HKT",
          "destination": "MOW",
          "date": "2021-11-10T23:44:00.000Z",
          "stops": [
            "IST"
          ],
          "duration": 1844
        }
      ]
    }
];
const filters = document.querySelectorAll('.filters__checkbox');

const filtersInit = (ticketsArr, element) => {
  return ticketsArr.filter((ticket) => {
    console.log('filter ', element.id);
    console.log('ticket ', ticket.segments[0].stops.length);
    return parseInt(element.id) === ticket.segments[0].stops.length
  });
}
// filtersInit(arrTest);
// Конец

const cheapSort = (arr) => {
  console.log('cheap sort called');
  for (let i = 1, l = arr.length; i < l; i++) {
      const current = arr[i];
      let j = i;
      while (j > 0 && arr[j - 1]['price'] > current['price']) {
          arr[j] = arr[j - 1];
          j--;
      }
      arr[j] = current;
  }
  return arr;
};

const fastSort = (arr) => {
  console.log('fast sort called');
  for (let i = 1, l = arr.length; i < l; i++) {
      const current = arr[i];
      let j = i;
      while (j > 0 && arr[j - 1]['segments'][0]['duration'] > current['segments'][0]['duration']) {
          arr[j] = arr[j - 1];
          j--;
      }
      arr[j] = current;
  }
  return arr;
};

const fetchAndUpdate = async() => {
  // const sortCheap = document.getElementById('cheap');
  // const sortFast = document.getElementById('cheap');

  // let cheap = false;

  // sortCheap.addEventListener('change', function() {
    //   cheap = true;
    // });
    // sortFast.addEventListener('change', function() {
      //   cheap = false;
      // });

  let ticketsArr = [];
  let newTicketsArr = [];
  filters.forEach(element => {
    element.addEventListener('change', function(){
      if(element.checked){
        const filterArr = filtersInit(ticketsArr, element);
        newTicketsArr = [];
        sliceArray(filterArr);
      }
    })
  });

  const obj = {
    0: false,
    getTest () {
      return this.test
    }
  }
  // const generateArr = async() => {
  //   const ticketsURL = 'https://front-test.beta.aviasales.ru/tickets?searchId=' + searchID;
  //   const ticketsResp = await request(ticketsURL);
  //   ticketsArr = [...ticketsArr, ...ticketsResp.tickets];
  //   if (cheap) {
  //     let sortedArr = cheapSort(ticketsArr);
  //     insertData(sortedArr);
  //   } else {
  //     sortedArr = fastSort(ticketsArr);
  //     insertData(sortedArr);
  //   }
  //   let stop = ticketsResp.stop;
  //   if (stop) {
  //     return
  //   }
  //   return generateArr()
  // }

  const sliceArray = (ticketsArr) => {
    if (ticketsArr.length >= 5 && !newTicketsArr.length) {
      newTicketsArr = ticketsArr.slice(0, 5);
      insertData(newTicketsArr);
    }
  }

  const generateArr = async(searchID) => {
    let stop = false;
    while (!stop) {
      const ticketsURL = 'https://front-test.beta.aviasales.ru/tickets?searchId=' + searchID;
      const ticketsResp = await request(ticketsURL);
      ticketsArr = [...ticketsArr, ...ticketsResp.tickets];
      sliceArray(ticketsArr);
      stop = ticketsResp.stop;
    }
  }

  const response = await request(URL);
  await generateArr(response.searchId);
  // const tickets = ticketsResp.tickets;
  // tickets.length = 5;
}

fetchAndUpdate();

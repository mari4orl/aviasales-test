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
  container.innerHTML = template;
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

const filters = document.querySelectorAll('.filters__checkbox');

const filtersInit = (ticketsArr, filterElem) => {
  return ticketsArr.filter((ticket) => {
    const filter = parseInt(filterElem.id);
    return filter === ticket.segments[0].stops.length
  });
}

const cheapSort = (arr) => {
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
  for (let i = 1, l = arr.length; i < l; i++) {
      const current = arr[i];
      let j = i;
      while (j > 0 && (arr[j - 1]['segments'][0]['duration'] + arr[j - 1]['segments'][1]['duration']) > (current['segments'][0]['duration'] + current['segments'][1]['duration'])) {
          arr[j] = arr[j - 1];
          j--;
      }
      arr[j] = current;
  }
  return arr;
};

const fetchAndUpdate = async() => {
  let ticketsArr = [];
  let newTicketsArr = [];

  const sliceArray = (ticketsArr) => {
    if (ticketsArr.length >= 5) {
      newTicketsArr = ticketsArr.slice(0, 5);
      insertData(newTicketsArr);
    }
  }

  filters.forEach(filter => {
    filter.addEventListener('change', function(){
      if(filter.checked){
        const filtersArray = [...document.querySelectorAll('.filters__checkbox')];
        const checkedFilters = filtersArray.filter(elem => elem.checked);
        let tickets = [];
        checkedFilters.forEach(elem => {
          tickets = [...filtersInit(ticketsArr, elem)];
        })
        console.log('array1 ', tickets);
        tickets = [...filtersInit(tickets, filter)];
        console.log('array2 ', tickets);
        sliceArray(tickets);
      }
    })
  });

  const sortCheap = document.getElementById('cheap');
  const sortFast = document.getElementById('fast');

  let cheap = true;

  // const obj = {
  //   0: false,
  //   getTest () {
  //     return this.test
  //   }
  // }

  const generateArr = async(searchID) => {
    let stop = false;
    while (!stop) {
      const ticketsURL = 'https://front-test.beta.aviasales.ru/tickets?searchId=' + searchID;
      const ticketsResp = await request(ticketsURL);
      ticketsArr = [...ticketsArr, ...ticketsResp.tickets];
      // let sortedArr = cheapSort(ticketsArr);
      // sliceArray(sortedArr);
      stop = ticketsResp.stop;
    }
    return ticketsArr
  }


  const response = await request(URL);
  let data = await generateArr(response.searchId);

  if (cheap) {
    let sortedArr = cheapSort(data);
    sliceArray(sortedArr);
  } else {
    let sortedArr = fastSort(data);
    sliceArray(sortedArr);
  }

  sortCheap.addEventListener('change', function() {
    cheap = true;
    let sortedArr = cheapSort(data);
    sliceArray(sortedArr);
  });

  sortFast.addEventListener('change', function() {
    cheap = false;
    let sortedArr = fastSort(data);
    sliceArray(sortedArr);
  });
}

fetchAndUpdate();

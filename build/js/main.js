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
      <span class="ticket__price">${price} Р </span>
      <img src="http://pics.avs.io/99/36/${carrier}.png" class="ticket__logo" width="99" height="36" alt="Логотип авиакомпании">
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

const request = (URL) => new Promise((resolve, reject) => {
  fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    resolve(data)
  }).catch((error) => {
    reject(error)
  });
})

const fetchAndUpdate = async() => {
  let ticketsArr = [];
  let searchID;
  const generateArr = async() => {
    const ticketsURL = 'https://front-test.beta.aviasales.ru/tickets?searchId=' + searchID;
    const ticketsResp = await request(ticketsURL);
    ticketsArr = [...ticketsArr, ...ticketsResp.tickets]
    insertData(ticketsArr);
    let stop = ticketsResp.stop;
    if (stop) {
      return
    }
    return generateArr()
  }
  try {
    const response = await request(URL);
    searchID = response.searchId;
    await generateArr();
    // const tickets = ticketsResp.tickets;
    // tickets.length = 5;
  } catch(err) {
    await generateArr();
    console.log(err);
  }
}

fetchAndUpdate();

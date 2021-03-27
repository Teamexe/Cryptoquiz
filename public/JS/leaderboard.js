// array describing the color for each team
// using camel case where the team names include a space
const colors = {
  17: '#F596C8',
  18: '#00D2BE',
  19: '#DC0000',
  20: '#FFF500',
  21: '#1E41FF',
  22: '#9B0000',
  23: '#469BFF',

  0: '#FF8700',
}

const arr = document.querySelector('.hack').firstChild.nodeValue.trim().split(',')
console.log(arr)
arr = arr.map((element)=>{
  element.trim()
})
console.log(arr)

// array describing the drivers, sorted by position and with a gap describing the distance from the leading driver
const leaderboard = [
  {
    name: 'Lewis Hamilton',
    roll: '185094',
    time: '5 min ago'
  },
  {
    name: 'Valteri Bottas',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Sebastian Vettel',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Max Verstappen',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Charles Leclerc',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Pierre Gasly',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Daniel Ricciardo',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  }, {
    name: 'Sergio Perez',
    roll: '135094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Kimi Räikkönen',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Alexander Albon',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Romain Grosjean',
    roll: '195094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Lance Stroll',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Kevin Magnussen',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  },
  {
    name: 'Carlos Sainz',
    roll: '185094',
    time: '3Apr\'21 12.56 PM'
  }
];

// target the table element in which to add one div for each driver
const main = d3.select('table');

// for each driver add one table row
// ! add a class to the row to differentiate the rows from the existing one
// otherwise the select method would target the existing one and include one row less than the required amount
const drivers = main
  .selectAll('tr.driver')
  .data(leaderboard)
  .enter()
  .append('tr')
  .attr('class', 'driver');

// in each row add the information specified by the dataset in td elements
// specify a class to style the elements differently with CSS

// position using the index of the data points
drivers
  .append('td')
  .text((d, i) => i + 1)
  .attr('class', 'position');


// name followed by the team
drivers
  .append('td')
  // include the last name in a separate element to style it differently
  // include the team also in another element for the same reason
  .html(({ name }) => `${name.split(' ').map((part, index) => index > 0 ? `<strong>${part}</strong>` : `${part}`).join(' ')}<hr>`)
  // include a border with the color matching the team
  .style('border-left', ({ roll }) => {
    // find the color using the string value found in d.team
    // ! if the string value has a space, camelCase the value
    var f = roll.substring(0, 2);
    // console.log(f)
    var color = f.split(' ').map((word, index) => index > 0 ? `${word[0].toUpperCase()}${word.slice(1)}` : `${word}`).join('');
    if (!colors[color]) color = '0';
    return `4px solid ${colors[color]}`;
  })
  .attr('class', 'driver');

// gap from the first driver
drivers
  .append('td')
  .attr('class', 'gap')
  .append('span')
  .text(({ time }) => time);
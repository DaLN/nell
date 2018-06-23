const display_error = (message) => {
  const close = () => {
    if(document.getElementById('error') !== undefined) {
      document.getElementById('main').style.filter = '';
      document.getElementById('header').style.filter = '';
      document.getElementById('error').style.display = 'none';
    }
  }
  document.getElementById('error-message').innerHTML = message;
  document.getElementById('error').style.display = 'block';

  document.getElementById('main').style.filter = 'blur(5px)';
  document.getElementById('header').style.filter = 'blur(5px)';

  document.getElementById('error-icon').addEventListener('click', () => {
    close();
  });
  setTimeout(() => {
    close();
  }, 1000 * 8);
}

const display_message = (message) => {
  const close = () => {
    if(document.getElementById('message') !== undefined) {
      document.getElementById('main').style.filter = '';
      document.getElementById('header').style.filter = '';
      document.getElementById('message').style.display = 'none';
    }
  }

  document.getElementById('message-message').innerHTML = message;
  document.getElementById('message').style.display = 'block';

  document.getElementById('main').style.filter = 'blur(5px)';
  document.getElementById('header').style.filter = 'blur(5px)';

  document.getElementById('message-icon').addEventListener('click', () => {
    close();
  });
  setTimeout(() => {
    close();
  }, 1000 * 8);
}

const render_loading = async (ms) => {
  document.getElementById('loading-scren').style.display = 'block';
  await sleep(ms);
  document.getElementById('loading-scren').style.display = 'none';
}

const start_loading = () => {
    document.getElementById('loading-scren').style.display = 'block';
    window.scrollTo(0,0);
}
const stop_loading = () => document.getElementById('loading-scren').style.display = 'none';

const fetch_with_loading = async (request) => {
  start_loading();
  const resp = await fetch(request, {credentials: 'include'});
  const obj = await resp.json();
  stop_loading();
  return obj;
}

const init_login_listeners = (id) => {
  document.getElementById('login-button').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const request = new Request(`/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

    const obj = await fetch_with_loading(request);

    if(obj['success'] === true) {
      if (id !== undefined) {
        _router.navigate(`/doctor/report?${id}`);
      } else if (obj['role'] === 'client') {
        _router.navigate('/my/report');
      } else if (obj['role'] === 'doctor') {
        _router.navigate('/doctor/report');
      } else if (obj['role'] === 'laboratory') {
        _router.navigate('/update_reports');
      }

    } else {
      display_error(obj['error']);
    }
  });
}

const display_aux = () => {
  document.getElementById('header').style.display = "flex";
  document.getElementById('footer').style.display = "flex";
}
const hide_aux = () => {
  document.getElementById('header').style.display = "none";
  document.getElementById('footer').style.display = "none";
}

const init_report_listeners = async () => {
  const report_buttons = document.getElementsByClassName('report-sum-wrapper');
  for (let i = 0; i < report_buttons.length; i++) {
    report_buttons[i].addEventListener('click', () => {
      _router.navigate(`/doctor/report?${_data['rows'][i]['id']}`);
    })
  }
}

const init_report = async (id) => {
  if (document.cookie.includes('doctor')) {
    document.getElementById('reports-holder').style.display = 'block';
    document.getElementById('validate-button').style.display = 'block';
    document.getElementById('validate-button').addEventListener('click', async () => {
      await fetch_with_loading(`/validate?id=${_currid}`);
      _router.navigate(`/doctor/report`);
    });

    let i = null;
    for (let n = 0; n < _data['rows'].length; n++) {
      if (Number(_data['rows'][n]['id']) === Number(id)) {
        i = n;
      }
    }
    if (i === null) {
      return;
    }

    document.getElementById('report-sheet').innerHTML = '';

    _currid = _data['rows'][i]['id'];

    if (_data['rows'][i]['type'] === 'blood') {
      document.getElementById('report-sheet').insertAdjacentHTML('afterbegin', blood_static_info());
      const data = _data['contents'][i].split('\r\n');

      let n = 0;
      for (point of data) {
        n++;
        const pair = point.split(',');
        const range = _blood_ranges[pair[0]]
        if (pair[1] !== undefined && range !== undefined) {
          document.getElementById('report-sheet').insertAdjacentHTML('beforeend',
            `${blood_info_box(pair)} <div class="blood-chart-wrapper">
            <canvas class="blood-chart" id="blood-chart-${n}"></canvas></div>`);
            const ctx = document.getElementById(`blood-chart-${n}`);
            bar_chart_vitamin_report([point], ctx, range[0], range[1]);
        }
      }
    } else {
      document.getElementById('report-sheet').insertAdjacentHTML('afterbegin', dna_static_info());
      for (let obj of _data['contents'][i]) {
        const element = dna_info_box(obj);
        if (element !== false) {
          document.getElementById('report-sheet').innerHTML += element;
        }
      }
    }

  } else {
    document.getElementById('validate-button').style.display = 'none';
    document.getElementById('reports-holder').style.display = 'none';
    document.getElementById('report-sheet').insertAdjacentHTML('afterbegin', blood_static_info());
    let n = 0;
    for (point of _last_blood['content'].split('\r\n')) {
      n++;
      const pair = point.split(',');
      const range = _blood_ranges[pair[0]]
      if (pair[1] !== undefined && range !== undefined) {
        document.getElementById('report-sheet').insertAdjacentHTML('beforeend',
          `${blood_info_box(pair)} <div class="blood-chart-wrapper">
          <canvas class="blood-chart" id="blood-chart-${n}"></canvas></div>`);
          const ctx = document.getElementById(`blood-chart-${n}`);
          bar_chart_vitamin_report([point], ctx, range[0], range[1]);
      }
    }
    document.getElementById('report-sheet').insertAdjacentHTML('beforeend','<br><br><br><br><br>');
    document.getElementById('report-sheet').insertAdjacentHTML('beforeend', dna_static_info());
    document.getElementById('report-sheet').insertAdjacentHTML('beforeend','<br><br><br>');
    for (let obj of _last_dna['content']) {
      const element = dna_info_box(obj);
      if (element !== false) {
        document.getElementById('report-sheet').insertAdjacentHTML('beforeend', element);
      }
    }
  }

  try {
    const cards = document.getElementsByClassName('dna-info-snip');
    const infos = document.getElementsByClassName('dna-info-body-holder');
    for (let i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', () => {
        const parent = cards[i].parentElement;
        if (parent.offsetWidth === 204) {
          cards[i].style.color = 'rgba(66,144,244,1)';
          parent.style.width = '88%';
          infos[i].style.display = 'block';
        } else {
          parent.style.width = '180px';
          infos[i].style.display = 'none';
          cards[i].style.color = 'rgba(33,33,33,1)';
        }
      });
    }
  } catch(err) {

  }
}

const bar_chart_vitamin_report = (data, ctx, min, max) => {
  const avg =  (min + max) / 2
  const labels = [];
  const values = [];
  const background_colors = []
  const border_colors = []

  for (let row of data) {
    data = row.split(',');
    labels.push(data[0]);
    values.push(data[1]);

    const dc = data[1] - min;
    const mz = max - min;
    if(dc < max*0.2) {
      background_colors.push(`rgba(198,40,40,0.4)`);
      border_colors.push(`rgba(198,40,40,1)`);
    } else if (dc < max*0.4) {
      background_colors.push(`rgba(255,112,67,0.4)`);
      border_colors.push(`rgba(255,112,67,1)`);
    } else if (dc < max*0.6) {
      background_colors.push(`rgba(56,142,60,0.4)`);
      border_colors.push(`rgba(56,142,60,1)`);
    } else if (dc < max*0.8) {
      background_colors.push(`rgba(255,112,67,0.4)`);
      border_colors.push(`rgba(255,112,67,1)`);
    } else {
      background_colors.push(`rgba(198,40,40,0.4)`);
    }
  }

  const options = {};

  ctx.height = 80;

  const my_bar_chart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
        datasets: [{
            label: labels[0],
            data: values,
            backgroundColor: background_colors,
            borderColor: border_colors,
            borderWidth: 1
        }]
    },
    options:  {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [{
            position: 'left',
            gridLines: {
             display: false
           },
           ticks: {
               min: min,
               max: max
           }
        }],
       yAxes: [{
         ticks: {
             beginAtZero:true
          },
          gridLines: {
             display: false
          },
          barPercentage: 1.26
       }]
      }
    }
  });

  return my_bar_chart;
}


const init_upload_form = () => {
  document.getElementById('upload-button').addEventListener('click', () => {
    render_loading(500 * 1000);
  });
}

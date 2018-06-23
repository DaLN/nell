const render_login = async () => {
  const main = document.getElementById('main');
  main.innerHTML = login_view();
  init_login_listeners();
}

const render_reports = async () => {
  _data = await fetch_with_loading('/reports');
  const main = document.getElementById('main');
  main.innerHTML = my_reports_view();
  init_report_listeners();
}

const render_my_reports = async () => {
  _data = await fetch_with_loading('/reports');


  for (let i = 0; i < _data['rows'].length; i++) {
    const row = _data['rows'][i];
    const contents = _data['contents'][i];
    if (row['type'] === 'blood') {
      if (_last_blood === null || Number(_last_blood['row']['id']) < Number(row['id'])) {
        _last_blood = {
          'content': contents,
          'row': row
        };
      }
    } else {
      if (_last_dna === null || Number(_last_blood['row']['id']) < Number(row['id'])) {
        _last_dna =   {
          'content': contents,
          'row': row
        };
      }
    }
  }

  const main = document.getElementById('main');
  main.innerHTML = my_reports_view();
  init_report_listeners();
}

const render_upload_report = async () => {
  const main = document.getElementById('main');
  main.innerHTML = upload_view();
  init_upload_form();
}

const main = async () => {
  const root = null;
  const use_hash = true;
  const hash = '#!';
  _router = new Navigo(root, use_hash, hash);

  await render_loading(200);

  _router
  .on({
      '/': async () => {
          _router.navigate('/login');
      }
      ,'login': async () => {
        hide_aux();
        await render_login();
      }
      ,'doctor/report': async (params, query) => {
        display_aux();
        await render_reports();
        if (query != undefined) {
          await init_report(query);
        }
      }
      ,'my/report': async (params, query) => {
        display_aux();
        await render_my_reports();
        if (query != undefined) {
          await init_report(query);
        }
      }
      ,'update_reports': async () => {
        display_aux();
        await render_upload_report();
      }
  }).resolve();
}

main()

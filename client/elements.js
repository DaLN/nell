/* Insert some view */
login_view = () =>
  `<div class="text-center"><button class="btn btn-round text-center" data-toggle="modal" data-target="#loginModal">
    Login<i class="material-icons">assignment</i>
</button></div>

<div class="modal fade" id="loginModal" tabindex="-1" role="">
    <div class="modal-dialog modal-login .modal-dialog-centered" role="document">
        <div class="modal-content">
                <div class="modal-body">
                    <form class="form" method="" action="">
                        <div class="card-body">
                            <div class="form-group bmd-form-group">
                                <div class="input-group">
                                    <span class="input-group-addon">
                                        <i class="material-icons">email</i>
                                    </span>
                                    <input id="email" type="text" class="form-control" placeholder="Email...">
                                </div>
                            </div>

                            <div class="form-group bmd-form-group">
                                <div class="input-group">
                                    <span class="input-group-addon">
                                        <i class="material-icons">lock_outline</i>
                                    </span>
                                    <input id="password" type="password" placeholder="Password..." class="form-control">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer justify-content-center" id="login-button">
                    <a class="btn btn-transparent btn-link btn-wd btn-lg">Get Started</a>
                </div>
            </div>
        </div>
    </div>
</div>`

const dna_info_box = (obj) => {
  if (obj['effect'] === undefined || obj['supplement info'] === undefined || obj['supplement'] === undefined) {
    return false;
  }
  return `
  <div class="card">
    <div class="card-header">
      <h7>Risky SNP: ${obj['snip']}</h7>
    </div>
    <div class="card-body" id="blood-report">
      <h7 class="card-subtitle mb-2 text-muted">Effect:</h7>
      <p class="card-text">${obj['effect']}</p>
      <h7 class="card-subtitle mb-2 text-muted">Recommended supplement:</h7>
      <p class="card-text">${obj['supplement']}</p>
      <h7 class="card-subtitle mb-2 text-muted">Supplement effect:</h7>
      <p class="card-text">${obj['supplement info']}</p>
    </div>
  </div><br>`;
}

const blood_info_box = (blood_row) => {
  return ``;
}

const my_reports_view = () => {
  let reports_html = '';
  if (_data['rows'] === undefined) {
    reports_html = 'No reports to see.';
  } else if (_data['rows'].length === 0) {
    reports_html = 'No reports to see.';
  }
  for (row of _data['rows']) {
    reports_html += `
    <div class="report-sum-wrapper">
      <br>
      <div class="report-sum-id" reportid="${row['id']}">
        Report date: <br>${new Date(row['dt']).toLocaleDateString("en-UK")}
      </div>
      <br>
      <div class="report-sum-type">
        Report type: <br> ${row['type']}
      </div>
      <br>
      <div class="report-sum-lab-id">
        Lab id: ${row['lab_id']}
      </div>
      <br>
      <br>
      <br>
    </div>
    `
  }
  return `<div id="my-reports-view">
    <div id="reports-holder">
      ${reports_html}
    </div>
      <div id="report-sheet">
        <div class="card" >
          <div class="card-body" id="blood-report">
          </div>
        </div>
        <div class="card" >
          <div class="card-body" id="dna-report">
          </div>
        </div>
      </div>

      <div class="login-button" id="validate-button">
        <div class="login-icon">
            <img class="login-icon-image" src="/icons/check.svg" alt=""></img>
        </div>
        <div class="login-button-par login-screen-button">
          Validate
        </div>
      </div>
    </div>
  </div>
  `
}

const blood_static_info = () => {
  return `
  <h5 class="card-title">Good nutrition is the foundation of good health</h5>
      <p>
      The foods we eat affect everything from the way we feel, the way we look and even interact with our genes to influence who we are right to the core.
      </p><p>
      Your diet directly interacts with your DNA, it is your choice.
      </p><p>
      Variations in our unique genetic codes can explain differences in how every body metabolises vitamins, minerals and all other nutrients. Our scientists focus on how different nutrients can turn on or off certain genes which impact the way our bodies function.
      </p><p>
      Nell is helping you to understand your body better than ever before, with personalised products and expert programmes to help you increase your energy levels, your health and your happiness.
      </p><p>
      Your personalised genetic report shows you how well your body can absorb and metabolise difference nutrients.
      </p>
      <br>`;
}

const dna_static_info = () => {
  return `
  <h5 class="card-title">Your DNA Report</h5>
      <p>
      A Single Nucleotide Polymorphism is also known as a SNP (pronounced 'snip').
      </p><p>
      The importance of SNPs comes from their ability to influence disease risk, drug efficacy and side-effects, tell you about your ancestry, and predict aspects of how you look and even act. SNPs are probably the most important category of genetic changes influencing common diseases. And in terms of common diseases, 9 of the top 10 leading causes of death have a genetic component and thus most likely one or more SNPs influence your risk.
      </p><p>
      All humans have almost the same sequence of 3 billion DNA bases (A,C,G, or T) distributed between their 23 pairs of chromosomes. But at certain locations there are differences - these variations are called polymorphisms. Polymorphisms are what make individuals different from one another. Current estimates indicate that up to .1% of our DNA may vary a bit, meaning any two unrelated individuals may differ at less than 3 million DNA positions. While many variations (SNPs) are known, most have no known effect and may be of little or no importance.
      </p><p>
      The most obvious DNA-based differences are external, such as rs1805009 which affects red hair color. Most polymorphisms have far less obvious effects though, and many of these may have medical consequences. We are just beginning to learn which of the 30 million or so possible polymorphisms influence health, either individually or in sets. Many polymorphisms are likely to have either no effect at all, or to have such subtle effects that it will be many years before their consequences are understood.
      </p>
      <br>`;
}


const upload_view = () => {
  return `<div id="upload-view" class="card">
  <form action="/upload_report" method="post" enctype="multipart/form-data" id="upload-form">
    <div class="form-group">
      <label for="exampleFormControlSelect1">Select a file type</label>
      <select class="form-control" name="type" type="text">
        <option value="blood">Blood Tests</option>
        <option value="dna">DNA Sequence</option>
      </select>
    </div>
    <div class="form-group form-file-upload form-file-multiple">
    <input type="file" name="file" multiple="" class="inputFileHidden">
    <div class="input-group">
        <input type="text" class="form-control inputFileVisible" placeholder="Choose the File">
        <span class="input-group-btn">
            <button type="button" class="btn btn-fab btn-round btn-transparent">
                <i class="material-icons">attach_file</i>
            </button>
        </span>
    </div>
</div>
    <div class="form-group">
      <input type="email" name="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email">
      <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>
    <button type="submit" id="upload-button" class="btn btn-transparent">Submit</button>
  </form>
  </div>`
}

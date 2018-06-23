/* Insert some view */
login_view = () =>
  `<div id="login_screen">
    <div class="login-group">
      <input type="text" id="email" required="required" class="login-input"/>
      <label for="email" class="login-label">email</label>
      <div class="bar"></div>
    </div>
    <br>
    <div class="login-group">
      <input type="password" id="password" required="required" class="login-input"/>
      <label for="password" class="login-label">password</label>
      <div class="bar"></div>
    </div>
    <br>

    <div class="login-button" id="login-button">
      <div class="login-icon">
          <img class="login-icon-image" src="/icons/login.svg" alt=""></img>
      </div>
      <div class="login-button-par login-screen-button">
        Login
      </div>
    </div>
    <br>
    <div class="login-button" id="signup-button">
      <div class="login-icon">
          <img class="login-icon-image" src="/icons/signup.svg" alt=""></img>
      </div>
      <div class="login-button-par login-screen-button">
        Sign Up
      </div>
    </div>
    <br>
    <div class="login-button" id="recover-button">
      <div class="login-icon">
          <img class="login-icon-image" src="/icons/email1.svg" alt=""></img>
      </div>
      <div class="login-button-par login-screen-button">
        Recover password
      </div>
    </div>

    </div>
    <br>
    <div class="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false"></div>
  </div>`

const dna_info_box = (obj) => {
  if (obj['effect'] === undefined || obj['supplement info'] === undefined || obj['supplement'] === undefined) {
    return false;
  }
  return `<div class="dna-info-box">
      <div class="dna-info-snip dna-info-line">Risky snp: ${obj['snip']}</div>
      <div class="dna-info-body-holder">
        <br>
        <div class="dna-info-effect ">Effect <br><br> ${obj['effect']}</div>
        <br>
        <div class="dna-info-supplement ">Recommended supplement: ${obj['supplement']}</div>
        <br>
        <div class="dna-info-supplement-info d">Supplement effect <br><br> ${obj['supplement info']}</div>
      </div>
  </div>`;
}

const blood_info_box = (blood_row) => {
  return `<div class="blood-info-box">
      <div class="blood-info-head">${blood_row[0]}</div>
      <div class="blood-info-intake">Value: ${blood_row[1]}</div>
  </div>`;
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
  <div class="report-static-info">
    <h3>
    Good nutrition is the foundation of good health
    </h3><p>
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
  </div>`;
}

const dna_static_info = () => {
  return `
  <div class="report-static-info">
    <h3>
    Your DNA Report
    </h3>
    <p>
    A Single Nucleotide Polymorphism is also known as a SNP (pronounced 'snip').
    </p><p>
    The importance of SNPs comes from their ability to influence disease risk, drug efficacy and side-effects, tell you about your ancestry, and predict aspects of how you look and even act. SNPs are probably the most important category of genetic changes influencing common diseases. And in terms of common diseases, 9 of the top 10 leading causes of death have a genetic component and thus most likely one or more SNPs influence your risk.
    </p><p>
    All humans have almost the same sequence of 3 billion DNA bases (A,C,G, or T) distributed between their 23 pairs of chromosomes. But at certain locations there are differences - these variations are called polymorphisms. Polymorphisms are what make individuals different from one another. Current estimates indicate that up to .1% of our DNA may vary a bit, meaning any two unrelated individuals may differ at less than 3 million DNA positions. While many variations (SNPs) are known, most have no known effect and may be of little or no importance.
    </p><p>
    The most obvious DNA-based differences are external, such as rs1805009 which affects red hair color. Most polymorphisms have far less obvious effects though, and many of these may have medical consequences. We are just beginning to learn which of the 30 million or so possible polymorphisms influence health, either individually or in sets. Many polymorphisms are likely to have either no effect at all, or to have such subtle effects that it will be many years before their consequences are understood.
    </p>
  </div>`;
}


const upload_view = () => {
  return `<div id="upload-view">
    <form action="/upload_report" method="post" enctype="multipart/form-data" style="display: inline-block;" id="upload-form">
      <br><br><br>
      <select style="display: inline-block;" type="text" name="type">
        <option value="blood">Blood Tests</option>
        <option value="dna">DNA Sequence</option>
      </select>
      <br><br><br>
      <input type="file" name="file" style="display: inline-block;">
      <br><br><br>
      <input value="User's email" type="text" name="email" style="display: inline-block;">
      <br><br><br>
      <input type="submit" style="display: inline-block;" id="upload-button">
    </form>
  </div>`
}

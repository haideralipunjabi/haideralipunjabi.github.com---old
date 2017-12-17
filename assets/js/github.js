let json;
let chartdata = {};
let options = {
  legend: {
    position: "left",
    labels: {
      boxWidth: 12
    }
  }
}
function hexToRgbA(hex) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
  }
  throw new Error('Bad Hex');
}

loadcolors = function(number, border) {
  colors = []
  if (!border) {
    for (let i = 0; i < number; i++) {
      colors.push(hexToRgbA(palette.random()))
    }

  }
  else{
    for (let i = 0; i < number; i++) {
      colors.push(hexToRgbA("#ffffff"))
    }
  }
  return colors
}
loaddata = function() {
  $("#github_profile_image").attr('src', json[0].owner.avatar_url);
  $("#github_username").append(json[0].owner.login);
  $("#github_repos").append(json.length.toString() + ' public repos');
  $("#github_link").attr('href', json[0].owner.html_url);

  //Making chart data
  let langs = [];
  let nolangs = [];
  let starslangs = [];
  let commitslangs = [];
  for (repo of json) {
    repo.language = ((repo.language == null) ? 'Other' : repo.language)
    if (!repo.fork) {
      if (!langs.includes(repo.language)) {
        langs.push(repo.language);
        nolangs.push(1);
        starslangs.push(repo.stargazers_count);
        commitslangs.push(repo.commits);
      } else {
        nolangs[langs.indexOf(repo.language)] += 1
        starslangs[langs.indexOf(repo.language)] += repo.stargazers_count;
        commitslangs[langs.indexOf(repo.language)] += repo.commits;

      }
    }
  }
  let repos = [];
  let starsrepos = [];
  let commitsrepos = [];
  for (repo of json){
    if(!repo.fork){
      repos.push(repo.name)
      starsrepos.push(repo.stargazers_count);
      commitsrepos.push(repo.commits);
    }
  }
  chartdata['rpl'] = {
    labels: langs,
    datasets: [{
      label: 'Repos per Language',
      data: nolangs,
      backgroundColor: loadcolors(nolangs.length, false),
      borderColor: loadcolors(nolangs.length, true),
      borderWidth: 1
    }]
  }
  chartdata['spl'] = {
    labels: langs,
    datasets: [{
      label: 'Stars per Language',
      data: starslangs,
      backgroundColor: loadcolors(nolangs.length, false),
      borderColor: loadcolors(nolangs.length, true),
      borderWidth: 1
    }]
  }
  chartdata['spr'] = {
    labels: repos,
    datasets: [{
      label: 'Stars per repo',
      data: starsrepos,
      backgroundColor: loadcolors(repos.length, false),
      borderColor: loadcolors(repos.length, true),
      borderWidth: 1
    }]
  }
  chartdata['cpl'] = {
    labels: langs,
    datasets: [{
      label: 'Commits per Language',
      data: commitslangs,
      backgroundColor: loadcolors(nolangs.length, false),
      borderColor: loadcolors(nolangs.length, true),
      borderWidth: 1
    }]
  }
  chartdata['cpr'] = {
    labels: repos,
    datasets: [{
      label: 'Commits per repo',
      data: commitsrepos,
      backgroundColor: loadcolors(repos.length, false),
      borderColor: loadcolors(repos.length, true),
      borderWidth: 1
    }]
  }
};

makecharts = function() {

  let rpl = $("#chart_rpl")[0];
  let spl = $("#chart_spl")[0];
  let spr = $("#chart_spr")[0];
  let cpl = $("#chart_cpl")[0];
  let cpr = $("#chart_cpr")[0];

  let rpl_chart = new Chart(rpl, {
    type: 'doughnut',
    data: chartdata['rpl'],
    options: options
  });
  let spl_chart = new Chart(spl, {
    type: 'doughnut',
    data: chartdata['spl'],
    options: options
  });
  let spr_chart = new Chart(spr, {
    type: 'doughnut',
    data: chartdata['spr'],
    options: options
  });
  let cpl_chart = new Chart(cpl, {
    type: 'doughnut',
    data: chartdata['cpl'],
    options: options
  });
  let cpr_chart = new Chart(cpr, {
    type: 'doughnut',
    data: chartdata['cpr'],
    options: options
  });

};



jQuery(document).ready(function($) {


  $("#header").load("/header.html", function() {

    setTimeout(function() {
      $(".button-collapse").sideNav();
    }, 500)
  });
  $("#footer").load("/footer.html");
  $.getJSON('/data/user_repos.json', function(data) {
    json = data;
    loaddata();
    makecharts();
    let calendar = GitHubCalendar('#calendar', 'haideralipunjabi',{
      'global_stats':false
    });

    });
});

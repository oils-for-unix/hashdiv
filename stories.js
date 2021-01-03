// Run in browser devtools to scrape a rich story link
//
// TODO: Fix relative links to be absolute.

function lobstersHtml() {
  var score = document.querySelectorAll('.score')[0].innerHTML;
  var link = document.querySelectorAll('a.u-url')[0].outerHTML
  var domain = document.querySelectorAll('a.domain')[0].innerHTML
  var comments = document.querySelectorAll('span.comments_label a')[0].outerHTML;

  var submission_time = document.querySelectorAll('div.byline span[title]')[0].title;
  var date = submission_time.split(' ')[0];

  return `${link} (<code>${domain}</code> via lobste.rs) <br/>
    <span class="link">${score} points, ${comments} on ${date} </span>`;
}

function hackerNewsHtml() {
  var subtext = document.querySelectorAll('td.subtext')[0];
  var score = subtext.querySelectorAll('span')[0].innerHTML;

  var link = document.querySelectorAll('a.storylink')[0].outerHTML;
  var domain = document.querySelectorAll('span.sitestr')[0].innerHTML; 

  var links = subtext.querySelectorAll('a');
  var comments = links[links.length-1].outerHTML;

  var date = links[1].innerHTML;

  var site = 'Hacker News';
  return `${link} (<code>${domain}</code> via ${site}) <br/>
    <span class="link">${score}, ${comments} - ${date} </span>`;
}

function oldRedditHtml() {
  var score = document.querySelectorAll('div.score')[0].innerHTML;
 
  var link = document.querySelectorAll('a.title')[0].outerHTML;

  var domain = document.querySelectorAll('span.domain a')[0].innerHTML;
  var where = '';
  if (domain.indexOf('self.') == -1) {
    where = `<code>${domain}</code> via ${site}`;
  } else {
    where = domain;  // self.ProgrammingLanguages
  }

  var comments = document.querySelectorAll('a.comments')[0].outerHTML;

  var date = document.querySelectorAll('time')[0].innerHTML;

  var site = 'Reddit';
  return `${link} (${where}) <br/>
    <span class="link">${score}, ${comments} - ${date} </span>`;
}

function storyHtml(url) {
  var links = '';
  if (url.indexOf('lobste.rs') !== -1) {    
    links = lobstersHtml();
  } else if (url.indexOf('news.ycombinator.com') !== -1) {
    links = hackerNewsHtml();
  } else if (url.indexOf('old.reddit.com') !== -1) {
    links = oldRedditHtml();  
  } else {
    console.log('Not a story');
    return '';
  }
  return links;
}

var links = storyHtml(window.location.href);
if (links) {
  console.log(links);
  document.body.insertAdjacentHTML('beforebegin', links);

  var post_url = "http://dr.shxa.org/hashdiv/paste";
  var post_url = "http://localhost:5000/paste";

  var form = `
  <p>
  <form action="${post_url}" method=POST>
    <input type="hidden" name="format" value="html" />
    <input id="storyhtml" type="hidden" name="data" value="" />
    <input type="submit" />
  </form>
  </p>`;

  var h = `
  <div class="story">
    ${links}  
  </div>
  `

  // Add escaped data to be POSTed
  document.body.insertAdjacentHTML('afterbegin', form);  
  document.querySelectorAll('input#storyhtml')[0].setAttribute('value', h);
}


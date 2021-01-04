// Run in browser devtools to scrape a rich story link
//
// TODO: Fix relative links to be absolute.

// Not used yet
function htmlToElement(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
}

function lobstersHtml() {
  var score = document.querySelector('.score').innerHTML;
  var link = document.querySelector('a.u-url').outerHTML;
  var domain = document.querySelector('a.domain').innerHTML;
  var comments_el = document.querySelector('span.comments_label a');

  comments_el.setAttribute('href', 'https://lobste.rs' + comments_el.getAttribute('href'));

  var submission_time = document.querySelector('div.byline span[title]').title;
  var date = submission_time.split(' ')[0];

  return `${link} (<code>${domain}</code> via lobste.rs) <br/>
    <span class="line2">${score} points, ${comments_el.outerHTML} on ${date} </span>`;
}

function hackerNewsHtml() {
  var subtext = document.querySelector('td.subtext');
  var score = subtext.querySelector('span').innerHTML;

  var link = document.querySelector('a.storylink').outerHTML;
  var domain = document.querySelector('span.sitestr').innerHTML; 

  var links = subtext.querySelectorAll('a');
  var comments_el = links[links.length-1];

  // Add domain to the URL
  comments_el.setAttribute('href', 'https://news.ycombinator.com/' + comments_el.getAttribute('href'));

  var date = links[1].innerHTML;

  var site = 'Hacker News';
  return `${link} (<code>${domain}</code> via ${site}) <br/>
    <span class="line2">${score}, ${comments_el.outerHTML} - ${date} </span>`;
}

function oldRedditHtml() {
  var score = document.querySelector('div.score span').innerHTML;
 
  var domain = document.querySelector('span.domain a').innerHTML;
  var site = 'Reddit';
  
  var title = '';
  var where = '';
  if (domain.indexOf('self.') == -1) {
    // External Link.  Strip the "out.reddit.com" domain.    
    var reddit_el = document.querySelector('a.title');
    var our_el = htmlToElement(`<a href="">${reddit_el.innerHTML}</a>`);
    our_el.setAttribute('href', reddit_el.getAttribute('data-href-url'));

    title = our_el.outerHTML;
    where = `<code>${domain}</code> via ${site}`;
  } else {
    // User Discussion.  Link is in comments.
    title = document.querySelector('a.title').innerHTML;
    where = domain;  // self.ProgrammingLanguages
  }

  var comments = document.querySelector('a.comments').outerHTML;

  var date = document.querySelector('time').innerHTML;

  
  return `${title} (${where}) <br/>
    <span class="line2">${score} points, ${comments} - ${date} </span>`;
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
  document.body.insertAdjacentHTML('afterbegin', links);

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
  <span class="story">
    ${links}  
  </span>
  `

  // Add escaped data to be POSTed
  document.body.insertAdjacentHTML('afterbegin', form);  
  document.querySelectorAll('input#storyhtml')[0].setAttribute('value', h);
}


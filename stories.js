// Run in browser devtools to scrape a rich story link

function htmlToElement(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
}

function lobstersHtml() {
  var score = document.querySelector('.score').innerHTML;

  var title = '';
  var where = '';

  var title_el = document.querySelector('a.u-url');
  var domain_el = document.querySelector('a.domain');
  if (domain_el) {
    title = title_el.outerHTML;
    var domain = domain_el.innerHTML;
    where = `<code>${domain}</code> via lobste.rs`;
  } else {
    
    title = `<span class="title-without-link">${title_el.innerHTML}</span>`;    
    where = 'ask';
  }
  var comments_el = document.querySelector('span.comments_label a');
  var comments_href = comments_el.getAttribute('href')

  if (comments_href.indexOf('//lobste.rs') == -1) {
    comments_el.setAttribute('href', 'https://lobste.rs' + comments_href);
  }

  var submission_time = document.querySelector('div.byline span[title]').title;
  var date = submission_time.split(' ')[0];

  return `${title} (${where}) <br/>
    ${score} points, ${comments_el.outerHTML} on ${date}`;
}

function hackerNewsHtml() {
  var subtext = document.querySelector('td.subtext');
  var score = subtext.querySelector('span').innerHTML;

  var title = '';
  var where = '';

  var title_el = document.querySelector('a.storylink')
  var domain_el = document.querySelector('span.sitestr');

  if (domain_el) {
    title = title_el.outerHTML;
    domain = domain_el.innerHTML; 
    where = `<code>${domain}</code> via Hacker News`;
  } else {
    title = title_el.innerHTML;
    where = 'self';    
  }

  var links = subtext.querySelectorAll('a');
  var comments_el = links[links.length-1];

  // Add domain to the URL
  var comments_href = comments_el.getAttribute('href');
  if (comments_href.indexOf('//news.ycombinator.com') === -1) {
    comments_el.setAttribute('href', 'https://news.ycombinator.com/' + comments_href);
  }

  var date = links[1].innerHTML;

  return `${title} (${where}) <br/>
    ${score}, ${comments_el.outerHTML} - ${date}`;
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
    var title_str = document.querySelector('a.title').innerHTML;
    var title = `<span class="title-without-link">${title_str}</span>`;
    // self.ProgrammingLanguages -> /r/ProgrammingLanguages
    where = domain.replace('self.', '/r/');
  }

  var comments = document.querySelector('a.comments').outerHTML;

  var date = document.querySelector('time').innerHTML;

  
  return `${title} (${where}) <br/>
    ${score} points, ${comments} - ${date}`;
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

  console.log(links);

  // This is meant to be embedded in CommonMark.
  var h = `<div class="link-box">

${links.replace(/\n/g, '')}

</div>`;

  // Add escaped data to be POSTed
  document.body.insertAdjacentHTML('afterbegin', form);  
  document.querySelectorAll('input#storyhtml')[0].setAttribute('value', h);
}


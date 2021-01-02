#!/usr/bin/env python3
"""
main.py - Handlers for hashdiv.
"""

from flask import Flask, request, render_template, Response
import urllib

app = Flask(__name__)

@app.route('/')
def home():
  """Form."""
  app.logger.debug('home')
  return render_template('home.html')


@app.route('/snip')
def snip():
  """HTML snippet."""
  url = request.args.get('url')

  start = request.args.get('start')
  end = request.args.get('end')

  try:
    if start:
      start = int(start)
    else:
      start = None

    if end:
      end = int(end)
    else:
      end = None

  except ValueError:
    return Response('Invalid start or end'), 400

  app.logger.debug('snip %s', url)

  # Snip the right lines.

  # TODO: Show HTML line numbers.  And show original URL too.  Github has a
  # hash #L1-L3.

  lines = []
  with urllib.request.urlopen(url) as f:
    for i, line in enumerate(f):
      line_num = i + 1
      if (start is None or start <= line_num) and (end is None or line_num <= end):
        lines.append(line)

  contents = b''.join(lines)

  # TODO: What about rendering text?
  #return render_template('snip.html', contents=contents.decode('utf-8'))
  return Response(contents, mimetype='text/plain')

"""
soil_receive.py
"""
from __future__ import print_function

import sys


from flask import Flask, request, render_template, Response

app = Flask(__name__)

@app.route('/')
def home():
  """Form."""
  app.logger.debug('soil-home')
  return render_template('soil-home.html')

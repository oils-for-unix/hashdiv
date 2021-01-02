#!/usr/bin/env python3
"""
main.py
"""

from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/')
def home():
  return render_template('home.html')
